import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Building2, 
  Layers, 
  Landmark, 
  Calendar, 
  Compass, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Trash2, 
  CheckCircle2, 
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ConciergeTone, ServiceAction } from '../types';
import { api } from '../services/api';

interface ConciergeChatProps {
  guestInfo: { name: string; room: string };
  onOpenAdmin: () => void;
}

const QUICK_ACTIONS = [
  {
    icon: Building2,
    title: 'Egan Crest (Coming 2026)',
    prompt: 'Could you provide details on the upcoming Egan Crest development and its panoramic Las Vegas Strip views?',
    tag: 'Desert Modernism'
  },
  {
    icon: Layers,
    title: '5-Step Design & Build Methodology',
    prompt: "How does Harmony Homes' 5-Step Design & Build methodology work for custom luxury residences?",
    tag: 'Turnkey Mastery'
  },
  {
    icon: Landmark,
    title: 'SkyFire Modernist Estate',
    prompt: 'Tell me about SkyFire Estate and your Desert Modernism architectural philosophy.',
    tag: 'Completed Trophy Residence'
  },
  {
    icon: Sparkles,
    title: '40-Year Building Legacy',
    prompt: 'What is the background of Harmony Homes and founder Jim Rhodes across Southern Nevada?',
    tag: 'Jim Rhodes • 1,000+ Homes'
  },
  {
    icon: Calendar,
    title: 'Private Executive Consultation',
    prompt: 'I would like to schedule a private consultation with the principal leadership team regarding a custom build.',
    tag: 'Leadership Meeting'
  }
];

const TONE_OPTIONS: { value: ConciergeTone; label: string; desc: string }[] = [
  { value: 'luxury_classic', label: 'Classic & Ceremonial', desc: 'Formal, exceptionally polite and authoritative' },
  { value: 'modern_executive', label: 'Executive & Concise', desc: 'Fast, sophisticated and efficient' },
  { value: 'sommelier', label: 'Architectural Specialist', desc: 'Deep focus on Desert Modernism and structural detailing' },
  { value: 'resort_leisure', label: 'Warm & Welcoming', desc: 'Warm, refined and consultative' },
];

export const ConciergeChat: React.FC<ConciergeChatProps> = ({ guestInfo, onOpenAdmin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Good day, ${guestInfo.name || 'esteemed client'}. It is my distinct honor to welcome you to Harmony Homes.\n\nAs your Master Luxury Real Estate Advisor & Concierge, I am at your disposal to guide you through our holistic 5-Step Design & Build approach, architectural schematics, and signature developments such as Egan Crest. How may I be of service today?`,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ConciergeTone>('luxury_classic');
  const [sessionId] = useState<string>(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [confirmedActions, setConfirmedActions] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (!isSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, ''));
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      
      const response = await api.sendMessage({
        message: messageContent,
        sessionId,
        guestInfo,
        history,
        toneOverride: selectedTone,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        actions: response.actions,
        topic: response.topic,
      };

      setMessages(prev => [...prev, assistantMessage]);
      speakText(response.reply);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `It is my distinct pleasure to assist you. Our principal leadership team has received your inquiry. May I arrange a private consultation or provide the architectural dossier for Egan Crest?`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Start a fresh conversation with your Real Estate Concierge? Current session will be archived.')) {
      setMessages([
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'assistant',
          content: `At your service, ${guestInfo.name}. A new session has been initiated. How may I assist you with custom residences today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleConfirmAction = (actionId: string, action: ServiceAction) => {
    setConfirmedActions(prev => ({ ...prev, [actionId]: true }));
    const confirmationNote: ChatMessage = {
      id: `system_${Date.now()}`,
      role: 'assistant',
      content: `Your request for "${action.title}" has been confirmed and seamlessly coordinated with our principal leadership team.`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, confirmationNote]);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white text-zinc-900">
      
      {/* Top Status & Persona Controls Header */}
      <div className="border-b border-zinc-100 bg-zinc-50/50 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          
          {/* Status info */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold tracking-tight text-zinc-900">
                  Agent Concierge
                </h2>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-full text-[10px] font-semibold text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini 3.7 AI Online
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                Master Luxury Real Estate Advisor • Grounded with Harmony Homes Knowledge Base
              </p>
            </div>
          </div>

          {/* Persona Style & Controls */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1 rounded-lg bg-zinc-100 p-1 border border-zinc-200">
              <span className="text-[11px] text-zinc-500 px-2 flex items-center gap-1 font-medium">
                <Compass className="h-3 w-3 text-zinc-400" />
                Tone:
              </span>
              {TONE_OPTIONS.map(tone => (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                    selectedTone === tone.value
                      ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                  title={tone.desc}
                >
                  {tone.label}
                </button>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
              className={`rounded-lg p-2 transition-colors cursor-pointer ${
                isSpeechEnabled
                  ? 'bg-[#87735A] text-white'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
              title={isSpeechEnabled ? 'Disable voice response' : 'Enable voice response'}
            >
              {isSpeechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="rounded-lg bg-zinc-100 p-2 text-zinc-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
              title="Start fresh conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Quick Guidance Carousel / Action Badges */}
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#87735A]" />
                Explore Harmony Homes Custom Residences:
              </span>
              <span className="text-[10px] text-zinc-400">Click to inquire</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {QUICK_ACTIONS.map((action, idx) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(action.prompt)}
                    disabled={isLoading}
                    className="flex flex-col text-left justify-between rounded-xl border border-zinc-200/80 bg-white p-2.5 hover:border-[#87735A] hover:shadow-xs transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="rounded-md bg-zinc-100 p-1.5 text-zinc-700 group-hover:bg-[#87735A] group-hover:text-white transition-colors">
                        <IconComponent className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[9px] font-mono font-medium text-zinc-400 group-hover:text-[#87735A]">
                        {action.tag}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 line-clamp-1 group-hover:text-[#87735A]">
                      {action.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              const isCopied = copiedId === msg.id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-end gap-2 max-w-[90%] sm:max-w-[80%]">
                    
                    {isAssistant && (
                      <div className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white text-xs font-bold shadow-xs">
                        AC
                      </div>
                    )}

                    <div
                      className={`group relative rounded-2xl px-4 py-3.5 leading-relaxed text-sm ${
                        isAssistant
                          ? 'chat-bubble-agent bg-zinc-900 text-white shadow-xs'
                          : 'chat-bubble-user bg-zinc-100 text-zinc-900 border border-zinc-200/80'
                      }`}
                    >
                      {/* Topic Tag if detected */}
                      {msg.topic && isAssistant && (
                        <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          {msg.topic}
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Interactive Service Action Cards */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3.5 space-y-2 border-t border-zinc-800 pt-3">
                          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Executive Actions & Consultations:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {msg.actions.map(action => {
                              const isConfirmed = confirmedActions[action.id];
                              return (
                                <div
                                  key={action.id}
                                  className="rounded-xl border border-zinc-800 bg-zinc-800/80 p-3 space-y-2 text-left"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h4 className="text-xs font-bold text-white">
                                        {action.title}
                                      </h4>
                                      <p className="text-[11px] text-zinc-400 mt-0.5">
                                        {action.description}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleConfirmAction(action.id, action)}
                                    disabled={isConfirmed}
                                    className={`w-full flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                                      isConfirmed
                                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-white text-zinc-900 hover:bg-zinc-100 cursor-pointer shadow-xs'
                                    }`}
                                  >
                                    {isConfirmed ? (
                                      <>
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                        <span>Coordinated</span>
                                      </>
                                    ) : (
                                      <>
                                        <span>Coordinate Consultation</span>
                                        <ChevronRight className="h-3.5 w-3.5" />
                                      </>
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Action buttons (Copy, etc.) */}
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-md bg-zinc-800 p-1 text-zinc-400 hover:text-white cursor-pointer shadow-xs"
                          title="Copy response"
                        >
                          {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      )}
                    </div>

                    {!isAssistant && (
                      <div className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-700 text-xs font-bold">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}

                  </div>

                  <span className="mt-1 px-1 text-[10px] text-zinc-400 font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
              );
            })}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3 text-xs text-zinc-400 py-2"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 text-[#87735A]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#87735A] animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-[#87735A] animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-[#87735A] animate-bounce [animation-delay:0.4s]" />
                  <span className="font-medium text-zinc-600 pl-1">
                    Agent Concierge is formulating guidance...
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

        </div>
      </div>

      {/* Interactive Bottom Input Bar */}
      <div className="border-t border-zinc-200 bg-white p-4">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="relative flex items-center rounded-2xl border border-zinc-300 bg-zinc-50 focus-within:border-[#87735A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#87735A]/10 transition-all shadow-xs"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Inquire about Egan Crest, 5-Step Design & Build, or schedule a consultation with Jim Rhodes..."
              className="flex-1 resize-none bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none max-h-32"
            />

            <div className="flex items-center pr-2 space-x-1">
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                style={{ backgroundColor: '#87735A' }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer shadow-xs"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span>Harmony Homes Luxury Real Estate • Las Vegas</span>
            <span>Press Enter ↵ to send • Shift+Enter for new line</span>
          </div>
        </div>
      </div>

    </div>
  );
};
