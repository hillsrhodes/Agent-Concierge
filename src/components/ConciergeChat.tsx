import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Utensils, 
  Car, 
  Wine, 
  Coffee, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Trash2, 
  Compass, 
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
    icon: Utensils,
    title: 'Reserva no Le Miroir',
    prompt: 'Gostaria de reservar uma mesa para 2 pessoas no Restaurante Le Miroir às 20h30 hoje. O que você recomenda no menu degustação?',
    tag: '3★ Michelin'
  },
  {
    icon: Sparkles,
    title: 'Spa L\'Élixir & Ritual D\'Or',
    prompt: 'Poderia me detalhar o Ritual D\'Or 24k do Spa e verificar disponibilidade para amanhã às 10h?',
    tag: 'Bem-estar'
  },
  {
    icon: Car,
    title: 'Transfer Mercedes-Maybach',
    prompt: 'Preciso de um transfer privativo para o aeroporto internacional amanhã às 15h. Quais veículos estão disponíveis?',
    tag: 'Frota Privativa'
  },
  {
    icon: Wine,
    title: 'Degustação na Adega',
    prompt: 'Gostaria de agendar uma degustação na adega subterrânea com o Head Sommelier Jean-Luc.',
    tag: 'Vinhos Raros'
  },
  {
    icon: Coffee,
    title: 'Room Service & Chá da Tarde',
    prompt: 'Por favor, envie o Chá da Tarde Palaciano para minha suíte com seleção de chás Mariage Frères e macarons.',
    tag: 'In-Suite Dining'
  }
];

const TONE_OPTIONS: { value: ConciergeTone; label: string; desc: string }[] = [
  { value: 'luxury_classic', label: 'Clássico & Formal', desc: 'Formal, altamente cortês e cerimonioso' },
  { value: 'modern_executive', label: 'Executivo & Ágil', desc: 'Rápido, sofisticado e eficiente' },
  { value: 'sommelier', label: 'Sommelier', desc: 'Foco em harmonizações e safras raras' },
  { value: 'resort_leisure', label: 'Resort & Relaxamento', desc: 'Acolhedor, relaxante e convidativo' },
];

export const ConciergeChat: React.FC<ConciergeChatProps> = ({ guestInfo, onOpenAdmin }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: `Olá, ${guestInfo.name}. É um prazer atendê-lo em sua estada na ${guestInfo.room}.\n\nComo seu Concierge Digital, estou à disposição para organizar reservas gastronômicas, agendamentos de spa, transfers privativos ou qualquer necessidade especial. Como posso auxiliá-lo hoje?`,
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
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
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
        content: `Pedimos desculpas, ${guestInfo.name}. Ocorreu uma oscilação na conexão com a central de atendimento. Por favor, tente novamente em instantes.`,
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
    if (window.confirm('Deseja iniciar um novo diálogo com o Concierge? O histórico atual será arquivado.')) {
      setMessages([
        {
          id: `msg_welcome_${Date.now()}`,
          role: 'assistant',
          content: `Às suas ordens, ${guestInfo.name}. Um novo atendimento foi iniciado. Em que posso auxiliá-lo?`,
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
      content: `Perfeito! A solicitação para "${action.title}" foi confirmada e encaminhada ao departamento responsável.`,
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
                  Gemini AI Ativo
                </div>
              </div>
              <p className="text-[11px] text-zinc-400">
                Atendimento Contínuo • Base de Conhecimento Conectada
              </p>
            </div>
          </div>

          {/* Persona Style & Controls */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center space-x-1 rounded-lg bg-zinc-100 p-1 border border-zinc-200">
              <span className="text-[11px] text-zinc-500 px-2 flex items-center gap-1 font-medium">
                <Compass className="h-3 w-3 text-zinc-400" />
                Estilo:
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
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                isSpeechEnabled
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
              title={isSpeechEnabled ? 'Desativar voz sintetizada' : 'Ativar voz sintetizada'}
            >
              {isSpeechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={handleClearChat}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors"
              title="Iniciar nova conversa"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 bg-zinc-50/20">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* Quick Prompt Cards (Shown when minimal messages) */}
          {messages.length <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  Sugestões Rápidas de Atendimento
                </span>
                <span className="text-[11px] text-zinc-400">Clique para enviar</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {QUICK_ACTIONS.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(action.prompt)}
                      className="group flex flex-col justify-between text-left rounded-xl border border-zinc-200 bg-zinc-50/50 p-3.5 hover:border-zinc-400 hover:bg-white transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-[10px] font-medium text-zinc-700">
                          {action.tag}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-900 group-hover:text-black transition-colors line-clamp-1">
                        {action.title}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {action.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Messages List */}
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const isAssistant = message.role === 'assistant';
              const isCopied = copiedId === message.id;

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex w-full flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  {/* Bubble Text */}
                  <div className="group relative max-w-[85%]">
                    <div
                      className={`px-5 py-3.5 text-sm leading-relaxed ${
                        isAssistant
                          ? 'chat-bubble-agent bg-zinc-900 text-white shadow-sm'
                          : 'chat-bubble-user bg-zinc-100 text-zinc-900 border border-zinc-200/80'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans space-y-2">
                        {message.content}
                      </div>

                      {/* Interactive Service Action Cards (inside agent response) */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-4 space-y-2 pt-3 border-t border-zinc-700/60">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Ações Coordenadas:
                          </p>
                          {message.actions.map(action => {
                            const isConfirmed = confirmedActions[action.id];
                            return (
                              <div
                                key={action.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-800/90 p-3"
                              >
                                <div className="space-y-0.5 text-left">
                                  <span className="text-xs font-semibold text-white">
                                    {action.title}
                                  </span>
                                  <p className="text-xs text-zinc-300">{action.description}</p>
                                </div>

                                <button
                                  onClick={() => handleConfirmAction(action.id, action)}
                                  disabled={isConfirmed}
                                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                    isConfirmed
                                      ? 'border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 cursor-default'
                                      : 'bg-white text-zinc-900 hover:bg-zinc-100 shadow-xs cursor-pointer'
                                  }`}
                                >
                                  {isConfirmed ? (
                                    <>
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                      <span>Confirmado</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Confirmar</span>
                                      <ChevronRight className="h-3.5 w-3.5" />
                                    </>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Copy & Speech on hover */}
                    {isAssistant && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-zinc-800/90 rounded-md p-0.5 border border-zinc-700">
                        <button
                          onClick={() => handleCopy(message.id, message.content)}
                          className="rounded p-1 text-zinc-400 hover:text-white"
                          title="Copiar mensagem"
                        >
                          {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                        <button
                          onClick={() => speakText(message.content)}
                          className="rounded p-1 text-zinc-400 hover:text-white"
                          title="Ouvir leitura"
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Sender label under bubble */}
                  <div className="mt-1 flex items-center gap-1.5 px-1 text-[10px] text-zinc-400 uppercase font-bold tracking-tight">
                    <span>{isAssistant ? 'Concierge' : 'Hóspede'}</span>
                    <span>•</span>
                    <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {message.topic && isAssistant && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-zinc-600 lowercase tracking-normal">
                          {message.topic}
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 text-zinc-500"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
              </div>
              <div className="flex items-center space-x-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-600 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-900 animate-ping" />
                <span>Concierge formulando resposta...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Field Section */}
      <div className="border-t border-zinc-100 bg-white p-4">
        <div className="mx-auto max-w-4xl">
          
          <div className="relative rounded-2xl border border-zinc-200 bg-white shadow-xs focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all">
            
            <textarea
              id="concierge-message-input"
              ref={inputRef}
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escreva sua mensagem ao Concierge (ex: Reservar mesa no Le Miroir, agendar spa, transfer VIP)..."
              rows={2}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
            />

            <div className="flex items-center justify-between border-t border-zinc-100 px-3.5 py-2">
              
              <div className="flex items-center space-x-2 text-[11px] text-zinc-400">
                <span>Pressione <kbd className="rounded bg-zinc-100 px-1.5 py-0.5 text-zinc-600 border border-zinc-200 font-mono">Enter</kbd> para enviar</span>
                <span>•</span>
                <span className="hidden sm:inline">24/7 Concierge</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-send-message"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                    inputMessage.trim() && !isLoading
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-xs cursor-pointer'
                      : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  }`}
                >
                  <span>Enviar</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>

            </div>

          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 px-1">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>The Grand Lumière • Inteligência Artificial Conectada</span>
            </div>
            <button
              id="btn-footer-admin-link"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 font-medium transition-all shadow-xs cursor-pointer"
            >
              <Bot className="h-3 w-3 text-zinc-500" />
              <span>Painel do Administrador (Configurar Agente & Logs)</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
