import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  Check, 
  Copy, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  X,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  ExternalLink
} from 'lucide-react';
import { ChatMessage, ServiceAction } from '../types';
import { api } from '../services/api';

interface WidgetEmbedViewProps {
  onClose?: () => void;
}

export const WidgetEmbedView: React.FC<WidgetEmbedViewProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'w_init_welcome',
      role: 'assistant',
      content: 'Welcome to The Grand Lumière. I am your Digital Concierge. How may I assist you with private reservations, spa treatments, or bespoke hotel services today?',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() => `wp_embed_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmedActions, setConfirmedActions] = useState<Record<string, boolean>>({});
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!isVoiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    // Post message to parent window (WordPress host site)
    if (typeof window !== 'undefined' && window.parent) {
      window.parent.postMessage({ type: 'AGENT_CONCIERGE_CLOSE' }, '*');
    }
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `w_usr_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const response = await api.sendMessage({
        message: textToSend,
        sessionId,
        guestInfo: { name: 'Valued Guest', room: 'Private Suite' },
        history,
      });

      const assistantMsg: ChatMessage = {
        id: `w_ast_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        actions: response.actions,
        topic: response.topic,
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(response.reply);
    } catch {
      const errorMsg: ChatMessage = {
        id: `w_err_${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, there was a momentary connection hiccup. Please try asking again.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleConfirmAction = (actionId: string, action: ServiceAction) => {
    setConfirmedActions(prev => ({ ...prev, [actionId]: true }));
    const confirmNote: ChatMessage = {
      id: `w_cnf_${Date.now()}`,
      role: 'assistant',
      content: `Your request for "${action.title}" has been registered and confirmed!`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, confirmNote]);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `w_rst_${Date.now()}`,
        role: 'assistant',
        content: 'Conversation refreshed. How may I assist your stay today?',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-white text-zinc-900 font-sans antialiased overflow-hidden select-none">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-900 px-4 py-3 text-white shrink-0 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white shadow-inner">
            <Bot className="h-5 w-5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-zinc-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold tracking-tight text-white">Agent Concierge</h1>
              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-semibold text-zinc-300">VIP</span>
            </div>
            <p className="text-[10px] text-zinc-400">The Grand Lumière • Online</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {/* TTS Audio toggle */}
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
              isVoiceEnabled ? 'bg-white/20 text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isVoiceEnabled ? 'Voice output enabled' : 'Enable voice output'}
          >
            {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Reset chat */}
          <button
            onClick={handleResetChat}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            title="Start new conversation"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>

          {/* Close button (communicates with host website to minimize) */}
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            title="Minimize concierge"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-1.5 border-b border-zinc-100 bg-zinc-50 px-3 py-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
        <span className="text-zinc-400 text-[10px] font-medium whitespace-nowrap">Requests:</span>
        <button
          onClick={() => handleSendMessage('Reserve table at Le Miroir tonight')}
          className="whitespace-nowrap rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-zinc-700 hover:border-zinc-900 transition-colors cursor-pointer shadow-2xs"
        >
          🍽️ Le Miroir Table
        </button>
        <button
          onClick={() => handleSendMessage('Tell me about 24k Gold Spa rituals')}
          className="whitespace-nowrap rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-zinc-700 hover:border-zinc-900 transition-colors cursor-pointer shadow-2xs"
        >
          💆 24k Gold Spa
        </button>
        <button
          onClick={() => handleSendMessage('Arrange private Maybach chauffeur transfer')}
          className="whitespace-nowrap rounded-full bg-white border border-zinc-200 px-2.5 py-1 text-zinc-700 hover:border-zinc-900 transition-colors cursor-pointer shadow-2xs"
        >
          🚗 Maybach Transfer
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50/40 text-xs">
        {messages.map(msg => {
          const isAssistant = msg.role === 'assistant';
          const isCopied = copiedId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`group relative max-w-[88%] px-3.5 py-2.5 leading-relaxed ${
                  isAssistant
                    ? 'rounded-2xl rounded-tl-sm bg-zinc-900 text-white shadow-xs'
                    : 'rounded-2xl rounded-tr-sm bg-white text-zinc-900 border border-zinc-200 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Service Action Cards inside Widget */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-zinc-700/60 space-y-1.5">
                    {msg.actions.map(action => {
                      const isConfirmed = confirmedActions[action.id];
                      return (
                        <div
                          key={action.id}
                          className="rounded-lg bg-zinc-800 p-2.5 border border-zinc-700 space-y-1 text-left"
                        >
                          <span className="font-semibold text-white text-[11px] block">
                            {action.title}
                          </span>
                          <p className="text-[10px] text-zinc-300">{action.description}</p>
                          <button
                            onClick={() => handleConfirmAction(action.id, action)}
                            disabled={isConfirmed}
                            className={`w-full mt-1.5 flex items-center justify-center gap-1 rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                              isConfirmed
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                : 'bg-white text-zinc-900 hover:bg-zinc-100 cursor-pointer'
                            }`}
                          >
                            {isConfirmed ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                <span>Request Confirmed</span>
                              </>
                            ) : (
                              <>
                                <span>Confirm Request</span>
                                <ChevronRight className="h-3 w-3" />
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Copy helper */}
                {isAssistant && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-zinc-800 p-1 text-zinc-400 hover:text-white cursor-pointer"
                    title="Copy response"
                  >
                    {isCopied ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                  </button>
                )}
              </div>

              <span className="mt-1 px-1 text-[9px] text-zinc-400 font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center space-x-2 text-zinc-500 text-[11px] py-1">
            <Bot className="h-3.5 w-3.5 animate-pulse text-zinc-900" />
            <span>Concierge is curating your response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <footer className="border-t border-zinc-200 bg-white p-3 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask concierge anything..."
            className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 px-1">
          <span>The Grand Lumière • Luxury AI Concierge</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            Live
          </span>
        </div>
      </footer>

    </div>
  );
};
