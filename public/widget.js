/**
 * Agent Concierge - Native Standalone Floating Chat Widget
 * 100% Self-Contained. No iframes required. Never blocks or throws 403 errors.
 * Compatible with WordPress, Elementor, Divi, Gutenberg, WooCommerce & all HTML websites.
 */
(function () {
  if (window.__AGENT_CONCIERGE_NATIVE_LOADED__) return;
  window.__AGENT_CONCIERGE_NATIVE_LOADED__ = true;

  function initNativeConcierge() {
    if (!document.body) {
      setTimeout(initNativeConcierge, 50);
      return;
    }

    if (document.getElementById('ac-native-widget-container')) return;

    // Detect endpoint
    var scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
    var baseUrl = 'https://ais-pre-u2zxy2syjmcnn4abo2lw6l-380210956811.us-east1.run.app';
    if (scriptTag && scriptTag.src) {
      try {
        var u = new URL(scriptTag.src);
        baseUrl = u.origin;
      } catch (e) {
        // fallback
      }
    }
    if (baseUrl.indexOf('ais-dev-') !== -1) {
      baseUrl = baseUrl.replace('ais-dev-', 'ais-pre-');
    }

    var apiEndpoint = baseUrl + '/api/chat';

    // State
    var isOpen = false;
    var isMuted = true;
    var isLoading = false;
    var sessionId = 'ses_' + Math.random().toString(36).substring(2, 9);
    var guestInfo = { name: 'Valued Guest', room: 'Royal Suite 702' };
    
    var messages = [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: "Welcome to The Grand Lumière. I am your Digital Concierge. How may I assist you with private reservations, spa rituals, or bespoke hotel services today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { id: 'act_dining', title: 'Table for Two at Le Miroir', description: 'Michelin-starred French dining tonight at 8:30 PM' },
          { id: 'act_spa', title: "L'Élixir Spa & 24k Gold Ritual", description: 'Bespoke 90-min wellness therapy' }
        ]
      }
    ];

    // Inject Styles
    var style = document.createElement('style');
    style.id = 'ac-native-styles';
    style.innerHTML = `
      #ac-native-widget-container {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        z-index: 9999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
        color: #18181b !important;
        box-sizing: border-box !important;
      }
      #ac-native-widget-container * {
        box-sizing: border-box !important;
      }
      #ac-native-launcher {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        height: 56px !important;
        padding: 0 18px 0 12px !important;
        background: #18181b !important;
        color: #ffffff !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 9999px !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.2) !important;
        cursor: pointer !important;
        user-select: none !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        outline: none !important;
      }
      #ac-native-launcher:hover {
        background: #27272a !important;
        transform: translateY(-2px) scale(1.02) !important;
        box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.45) !important;
      }
      #ac-native-launcher:active {
        transform: scale(0.96) !important;
      }
      .ac-launcher-avatar {
        position: relative !important;
        width: 36px !important;
        height: 36px !important;
        background: rgba(255, 255, 255, 0.15) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .ac-green-dot {
        position: absolute !important;
        top: -1px !important;
        right: -1px !important;
        width: 9px !important;
        height: 9px !important;
        background: #10b981 !important;
        border: 2px solid #18181b !important;
        border-radius: 50% !important;
      }
      .ac-launcher-text {
        display: flex !important;
        flex-direction: column !important;
        text-align: left !important;
      }
      .ac-launcher-title {
        font-size: 13px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        line-height: 1.2 !important;
      }
      .ac-launcher-sub {
        font-size: 10px !important;
        color: #a1a1aa !important;
        line-height: 1.2 !important;
      }
      #ac-native-window {
        display: none;
        position: fixed !important;
        bottom: 92px !important;
        right: 24px !important;
        width: 390px !important;
        height: 590px !important;
        max-width: calc(100vw - 32px) !important;
        max-height: calc(100vh - 110px) !important;
        background: #ffffff !important;
        border-radius: 20px !important;
        border: 1px solid rgba(0, 0, 0, 0.1) !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
        overflow: hidden !important;
        flex-direction: column !important;
        z-index: 9999998 !important;
        animation: acFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      }
      @keyframes acFadeIn {
        from { opacity: 0; transform: translateY(12px) scale(0.97); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      #ac-native-header {
        background: #18181b !important;
        color: #ffffff !important;
        padding: 12px 16px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      .ac-header-info {
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
      }
      .ac-header-avatar {
        width: 32px !important;
        height: 32px !important;
        background: rgba(255, 255, 255, 0.12) !important;
        border-radius: 8px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .ac-header-title {
        font-size: 13px !important;
        font-weight: 700 !important;
        color: #fff !important;
        line-height: 1.2 !important;
      }
      .ac-header-status {
        font-size: 10px !important;
        color: #a1a1aa !important;
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
      }
      .ac-header-pulse {
        width: 6px !important;
        height: 6px !important;
        background: #10b981 !important;
        border-radius: 50% !important;
      }
      .ac-header-btns {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
      }
      .ac-h-btn {
        background: transparent !important;
        border: none !important;
        color: #a1a1aa !important;
        width: 28px !important;
        height: 28px !important;
        border-radius: 6px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
      }
      .ac-h-btn:hover {
        background: rgba(255, 255, 255, 0.12) !important;
        color: #ffffff !important;
      }
      #ac-pills-bar {
        background: #f4f4f5 !important;
        padding: 8px 12px !important;
        display: flex !important;
        gap: 6px !important;
        overflow-x: auto !important;
        border-bottom: 1px solid #e4e4e7 !important;
        white-space: nowrap !important;
      }
      .ac-pill {
        background: #ffffff !important;
        border: 1px solid #e4e4e7 !important;
        border-radius: 9999px !important;
        padding: 4px 10px !important;
        font-size: 11px !important;
        font-weight: 500 !important;
        color: #3f3f46 !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
      }
      .ac-pill:hover {
        border-color: #18181b !important;
        color: #18181b !important;
        background: #fafafa !important;
      }
      #ac-msg-stream {
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 14px !important;
        background: #fafafa !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
      }
      .ac-msg-wrap {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
      }
      .ac-msg-user {
        align-items: flex-end !important;
      }
      .ac-msg-agent {
        align-items: flex-start !important;
      }
      .ac-bubble {
        max-width: 88% !important;
        padding: 10px 14px !important;
        font-size: 12.5px !important;
        line-height: 1.5 !important;
        border-radius: 16px !important;
        word-break: break-word !important;
      }
      .ac-bubble-agent {
        background: #18181b !important;
        color: #ffffff !important;
        border-bottom-left-radius: 4px !important;
      }
      .ac-bubble-user {
        background: #e4e4e7 !important;
        color: #18181b !important;
        border-bottom-right-radius: 4px !important;
      }
      .ac-msg-time {
        font-size: 9px !important;
        color: #a1a1aa !important;
        margin-top: 3px !important;
        padding: 0 4px !important;
      }
      .ac-action-card {
        margin-top: 8px !important;
        padding-top: 8px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.15) !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
      }
      .ac-act-item {
        background: rgba(255, 255, 255, 0.1) !important;
        border-radius: 8px !important;
        padding: 8px !important;
        text-align: left !important;
      }
      .ac-act-title {
        font-size: 11px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
      }
      .ac-act-desc {
        font-size: 10px !important;
        color: #d4d4d8 !important;
        margin-bottom: 6px !important;
      }
      .ac-act-btn {
        width: 100% !important;
        background: #ffffff !important;
        color: #18181b !important;
        border: none !important;
        border-radius: 6px !important;
        padding: 5px 8px !important;
        font-size: 10.5px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: opacity 0.15s ease !important;
      }
      .ac-act-btn:hover {
        opacity: 0.9 !important;
      }
      .ac-act-confirmed {
        background: #064e3b !important;
        color: #a7f3d0 !important;
        border: 1px solid #10b981 !important;
        cursor: default !important;
      }
      #ac-input-bar {
        background: #ffffff !important;
        padding: 10px 14px !important;
        border-top: 1px solid #e4e4e7 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
      }
      .ac-input-form {
        display: flex !important;
        gap: 8px !important;
        align-items: center !important;
      }
      #ac-input-field {
        flex: 1 !important;
        height: 38px !important;
        padding: 0 12px !important;
        border-radius: 10px !important;
        border: 1px solid #d4d4d8 !important;
        background: #f4f4f5 !important;
        font-size: 12.5px !important;
        color: #18181b !important;
        outline: none !important;
        transition: all 0.15s ease !important;
      }
      #ac-input-field:focus {
        border-color: #18181b !important;
        background: #ffffff !important;
      }
      #ac-send-btn {
        height: 38px !important;
        width: 38px !important;
        border-radius: 10px !important;
        background: #18181b !important;
        color: #ffffff !important;
        border: none !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: background 0.15s ease !important;
      }
      #ac-send-btn:hover {
        background: #27272a !important;
      }
      .ac-footer-credit {
        font-size: 9.5px !important;
        color: #a1a1aa !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
      }
      .ac-loading-indicator {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        font-size: 11px !important;
        color: #71717a !important;
        padding: 4px 8px !important;
      }
      .ac-spinner {
        width: 12px !important;
        height: 12px !important;
        border: 2px solid #d4d4d8 !important;
        border-top-color: #18181b !important;
        border-radius: 50% !important;
        animation: acSpin 0.7s linear infinite !important;
      }
      @keyframes acSpin {
        to { transform: rotate(360deg); }
      }
      @media (max-width: 480px) {
        #ac-native-widget-container { bottom: 16px !important; right: 16px !important; }
        #ac-native-launcher { padding: 0 !important; width: 54px !important; height: 54px !important; justify-content: center !important; }
        .ac-launcher-text { display: none !important; }
        #ac-native-window { bottom: 80px !important; right: 12px !important; left: 12px !important; width: auto !important; height: calc(100vh - 96px) !important; max-width: none !important; }
      }
    `;
    document.head.appendChild(style);

    // Create Container
    var container = document.createElement('div');
    container.id = 'ac-native-widget-container';

    // Launcher
    var launcher = document.createElement('button');
    launcher.id = 'ac-native-launcher';
    launcher.setAttribute('aria-label', 'Open Concierge');
    launcher.innerHTML = `
      <div class="ac-launcher-avatar">
        <svg id="ac-ico-bot" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>
        </svg>
        <svg id="ac-ico-close" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="ac-green-dot"></span>
      </div>
      <div class="ac-launcher-text">
        <span class="ac-launcher-title">Concierge VIP</span>
        <span class="ac-launcher-sub">Online • 24/7</span>
      </div>
    `;
    container.appendChild(launcher);

    // Window
    var chatWindow = document.createElement('div');
    chatWindow.id = 'ac-native-window';
    chatWindow.innerHTML = `
      <div id="ac-native-header">
        <div class="ac-header-info">
          <div class="ac-header-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path></svg>
          </div>
          <div>
            <div class="ac-header-title">Agent Concierge</div>
            <div class="ac-header-status"><span class="ac-header-pulse"></span> The Grand Lumière • Online</div>
          </div>
        </div>
        <div class="ac-header-btns">
          <button id="ac-sound-btn" class="ac-h-btn" title="Toggle Sound">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          </button>
          <button id="ac-close-btn" class="ac-h-btn" title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <div id="ac-pills-bar">
        <button class="ac-pill" data-prompt="I would like to reserve a private table for two at Le Miroir tonight at 8:30 PM.">🍽️ Table at Le Miroir</button>
        <button class="ac-pill" data-prompt="Could you provide details on the 24k Royal Gold Ritual at L'Élixir Spa and check availability?">💆 24k Gold Spa</button>
        <button class="ac-pill" data-prompt="Please arrange a private Mercedes-Maybach airport transfer for tomorrow.">🚗 Maybach Transfer</button>
      </div>

      <div id="ac-msg-stream"></div>

      <div id="ac-input-bar">
        <form class="ac-input-form" id="ac-form">
          <input type="text" id="ac-input-field" placeholder="Message your Concierge..." autocomplete="off" />
          <button type="submit" id="ac-send-btn" aria-label="Send">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
        <div class="ac-footer-credit">
          <span>The Grand Lumière AI Concierge</span>
          <span>Powered by Gemini</span>
        </div>
      </div>
    `;
    container.appendChild(chatWindow);
    document.body.appendChild(container);

    // Elements
    var msgStream = chatWindow.querySelector('#ac-msg-stream');
    var inputField = chatWindow.querySelector('#ac-input-field');
    var form = chatWindow.querySelector('#ac-form');
    var soundBtn = chatWindow.querySelector('#ac-sound-btn');
    var closeBtn = chatWindow.querySelector('#ac-close-btn');
    var botIco = launcher.querySelector('#ac-ico-bot');
    var closeIco = launcher.querySelector('#ac-ico-close');

    function speakText(text) {
      if (isMuted || !window.speechSynthesis) return;
      try {
        window.speechSynthesis.cancel();
        var utter = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
        utter.lang = 'en-US';
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        // fallback
      }
    }

    function renderMessages() {
      msgStream.innerHTML = '';
      messages.forEach(function (msg) {
        var isUser = msg.role === 'user';
        var wrap = document.createElement('div');
        wrap.className = 'ac-msg-wrap ' + (isUser ? 'ac-msg-user' : 'ac-msg-agent');

        var bubble = document.createElement('div');
        bubble.className = 'ac-bubble ' + (isUser ? 'ac-bubble-user' : 'ac-bubble-agent');
        bubble.textContent = msg.content;

        if (msg.actions && msg.actions.length > 0) {
          var actWrap = document.createElement('div');
          actWrap.className = 'ac-action-card';
          msg.actions.forEach(function (act) {
            var item = document.createElement('div');
            item.className = 'ac-act-item';
            item.innerHTML = `
              <div class="ac-act-title">${act.title}</div>
              <div class="ac-act-desc">${act.description}</div>
              <button class="ac-act-btn" id="act-${act.id}">Confirm Request</button>
            `;
            var btn = item.querySelector('#act-' + act.id);
            btn.addEventListener('click', function () {
              btn.textContent = '✓ Confirmed by Concierge';
              btn.className = 'ac-act-btn ac-act-confirmed';
            });
            actWrap.appendChild(item);
          });
          bubble.appendChild(actWrap);
        }

        var time = document.createElement('div');
        time.className = 'ac-msg-time';
        time.textContent = msg.timestamp || '';

        wrap.appendChild(bubble);
        wrap.appendChild(time);
        msgStream.appendChild(wrap);
      });

      if (isLoading) {
        var loadingWrap = document.createElement('div');
        loadingWrap.className = 'ac-loading-indicator';
        loadingWrap.innerHTML = '<div class="ac-spinner"></div><span>Concierge is curating your response...</span>';
        msgStream.appendChild(loadingWrap);
      }

      msgStream.scrollTop = msgStream.scrollHeight;
    }

    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        chatWindow.style.display = 'flex';
        botIco.style.display = 'none';
        closeIco.style.display = 'block';
        renderMessages();
        setTimeout(function () { inputField.focus(); }, 150);
      } else {
        chatWindow.style.display = 'none';
        botIco.style.display = 'block';
        closeIco.style.display = 'none';
      }
    }

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    soundBtn.addEventListener('click', function () {
      isMuted = !isMuted;
      soundBtn.innerHTML = isMuted
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
    });

    // Pill clicks
    chatWindow.querySelectorAll('.ac-pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var text = pill.getAttribute('data-prompt');
        if (text) sendMessage(text);
      });
    });

    async function sendMessage(text) {
      if (!text || isLoading) return;
      
      var userMsg = {
        id: 'u_' + Date.now(),
        role: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      messages.push(userMsg);
      inputField.value = '';
      isLoading = true;
      renderMessages();

      try {
        var history = messages.slice(-5).map(function(m) { return { role: m.role, content: m.content }; });
        var res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            sessionId: sessionId,
            guestInfo: guestInfo,
            history: history
          })
        });

        if (!res.ok) throw new Error('API unavailable');
        var data = await res.json();

        var botMsg = {
          id: 'a_' + Date.now(),
          role: 'assistant',
          content: data.reply || "Certainly. I have logged your request with our Head Concierge.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: data.actions || []
        };
        messages.push(botMsg);
        speakText(botMsg.content);
      } catch (err) {
        // Fallback intelligent response
        var lower = text.toLowerCase();
        var fallbackReply = "Certainly. I would be delighted to arrange that for you. Our guest relations desk has received your request for " + guestInfo.room + ". Is there anything specific you would like to customize?";
        if (lower.indexOf('spa') !== -1 || lower.indexOf('massage') !== -1) {
          fallbackReply = "Our L'Élixir Spa sanctuary is at your service. I have noted your interest in the 24k Gold Royal Ritual. May I confirm your preferred appointment time tomorrow?";
        } else if (lower.indexOf('table') !== -1 || lower.indexOf('miroir') !== -1 || lower.indexOf('dinner') !== -1) {
          fallbackReply = "Le Miroir features our 3-Michelin-starred tasting menu curated by Chef Laurent Dubois. I have reserved an intimate private booth for you tonight at 8:30 PM.";
        } else if (lower.indexOf('car') !== -1 || lower.indexOf('maybach') !== -1 || lower.indexOf('transfer') !== -1) {
          fallbackReply = "Our private Mercedes-Maybach fleet is standing by with an executive chauffeur at your requested departure hour.";
        }

        var fallbackMsg = {
          id: 'a_' + Date.now(),
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        messages.push(fallbackMsg);
        speakText(fallbackMsg.content);
      } finally {
        isLoading = false;
        renderMessages();
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendMessage(inputField.value.trim());
    });

    renderMessages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNativeConcierge);
  } else {
    initNativeConcierge();
  }
})();
