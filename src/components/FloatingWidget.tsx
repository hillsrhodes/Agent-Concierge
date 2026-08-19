import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  Bot, 
  Check, 
  Copy, 
  Sparkles, 
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, ServiceAction } from '../types';
import { api } from '../services/api';

interface FloatingWidgetProps {
  guestInfo: { name: string; room: string };
  onOpenEmbedModal: () => void;
  onOpenFullApp: () => void;
}

export const FloatingWidget: React.FC<FloatingWidgetProps> = ({
  guestInfo,
  onOpenEmbedModal,
  onOpenFullApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState<string>(() => `widget_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [confirmedActions, setConfirmedActions] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'w_welcome',
      role: 'assistant',
      content: `Olá! Sou o Concierge Digital do The Grand Lumière. Como posso auxiliá-lo com reservas, informações ou serviços exclusivos agora?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `w_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map(m => ({ role: m.role, content: m.content }));
      const response = await api.sendMessage({
        message: textToSend,
        sessionId,
        guestInfo,
        history,
      });

      const assistantMsg: ChatMessage = {
        id: `w_assistant_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        actions: response.actions,
        topic: response.topic,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `w_err_${Date.now()}`,
        role: 'assistant',
        content: 'Desculpe, tive uma instabilidade momentânea. Por favor, tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmAction = (actionId: string, action: ServiceAction) => {
    setConfirmedActions(prev => ({ ...prev, [actionId]: true }));
    const confirmNote: ChatMessage = {
      id: `w_conf_${Date.now()}`,
      role: 'assistant',
      content: `Solicitação para "${action.title}" confirmada com sucesso!`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, confirmNote]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Expanded / Popup Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`mb-3 flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden transition-all duration-200 ${
              isExpanded
                ? 'h-[85vh] w-[90vw] max-w-2xl max-h-[700px]'
                : 'h-[520px] w-[360px] sm:w-[390px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-900 px-4 py-3 text-white">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold tracking-tight">Agent Concierge</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-zinc-400">The Grand Lumière • Online</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={onOpenEmbedModal}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Código para WordPress"
                >
                  <Code2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  title={isExpanded ? 'Reduzir' : 'Expandir'}
                >
                  {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Fechar widget"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Pills in Widget Header */}
            <div className="border-b border-zinc-100 bg-zinc-50 px-3 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="text-zinc-400 font-medium text-[10px] whitespace-nowrap">Sugestões:</span>
              <button
                onClick={() => handleSendMessage('Reservar mesa no Le Miroir para hoje')}
                className="whitespace-nowrap rounded-full bg-white border border-zinc-200 px-2 py-0.5 text-zinc-700 hover:border-zinc-900 transition-colors"
              >
                🍽️ Le Miroir
              </button>
              <button
                onClick={() => handleSendMessage('Quais os tratamentos do Spa L\'Élixir?')}
                className="whitespace-nowrap rounded-full bg-white border border-zinc-200 px-2 py-0.5 text-zinc-700 hover:border-zinc-900 transition-colors"
              >
                💆 Spa 24k
              </button>
              <button
                onClick={() => handleSendMessage('Transfer com motorista privativo')}
                className="whitespace-nowrap rounded-full bg-white border border-zinc-200 px-2 py-0.5 text-zinc-700 hover:border-zinc-900 transition-colors"
              >
                🚗 Transfer
              </button>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-zinc-50/30 text-xs">
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
                          ? 'chat-bubble-agent bg-zinc-900 text-white shadow-xs'
                          : 'chat-bubble-user bg-zinc-100 text-zinc-900 border border-zinc-200/80'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Action cards inside widget */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-zinc-700/60 space-y-1.5">
                          {msg.actions.map(action => {
                            const isConfirmed = confirmedActions[action.id];
                            return (
                              <div
                                key={action.id}
                                className="rounded-lg bg-zinc-800 p-2 border border-zinc-700 space-y-1 text-left"
                              >
                                <span className="font-semibold text-white text-[11px]">
                                  {action.title}
                                </span>
                                <p className="text-[10px] text-zinc-300">{action.description}</p>
                                <button
                                  onClick={() => handleConfirmAction(action.id, action)}
                                  disabled={isConfirmed}
                                  className={`w-full flex items-center justify-center gap-1 rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                                    isConfirmed
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-white text-zinc-900 hover:bg-zinc-100'
                                  }`}
                                >
                                  {isConfirmed ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                      <span>Confirmado</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Confirmar Solicitação</span>
                                      <ChevronRight className="h-3 w-3" />
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Copy hover button */}
                      {isAssistant && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-zinc-800 p-1 text-zinc-400 hover:text-white"
                        >
                          {isCopied ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                        </button>
                      )}
                    </div>

                    <span className="mt-0.5 px-1 text-[9px] text-zinc-400 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center space-x-2 text-zinc-500 text-[11px]">
                  <Bot className="h-3.5 w-3.5 animate-pulse text-zinc-900" />
                  <span>Concierge formulando resposta...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-zinc-100 bg-white p-3">
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
                  placeholder="Escreva sua solicitação..."
                  className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 px-1">
                <span>The Grand Lumière</span>
                <button
                  onClick={onOpenFullApp}
                  className="text-zinc-600 hover:text-zinc-900 font-semibold flex items-center gap-0.5"
                >
                  <span>Abrir em Tela Cheia</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (Widget Launcher) */}
      <motion.button
        id="btn-floating-concierge"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 items-center gap-3 rounded-full bg-zinc-900 px-4 text-white shadow-xl hover:bg-zinc-800 transition-all cursor-pointer border border-zinc-700/50"
      >
        <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
          <Bot className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
        </div>

        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-xs font-bold leading-tight tracking-tight">Concierge VIP</span>
          <span className="text-[10px] text-zinc-400 leading-none">Fale Conosco Online</span>
        </div>

        {/* Unread dot */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white shadow">
            1
          </span>
        )}
      </motion.button>

    </div>
  );
};
