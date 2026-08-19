import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Download, 
  Sparkles, 
  Clock, 
  User, 
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Tag,
  Hotel
} from 'lucide-react';
import { ConversationSession } from '../../types';
import { api } from '../../services/api';

export const ConversationLogsViewer: React.FC = () => {
  const [logs, setLogs] = useState<ConversationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  
  // Details Modal State
  const [selectedSession, setSelectedSession] = useState<ConversationSession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, [selectedSentiment]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await api.getConversationLogs(searchQuery, selectedSentiment);
      setLogs(data);
    } catch (err: any) {
      console.error('Error loading conversation logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  const handleOpenDetails = async (session: ConversationSession) => {
    try {
      const fullLog = await api.getConversationLog(session.id);
      setSelectedSession(fullLog);
      setIsModalOpen(true);
    } catch {
      setSelectedSession(session);
      setIsModalOpen(true);
    }
  };

  const handleDeleteLog = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Deseja excluir permanentemente este registro de conversa?')) {
      return;
    }
    try {
      await api.deleteConversationLog(id);
      setLogs(prev => prev.filter(l => l.id !== id && l.sessionId !== id));
      if (selectedSession?.id === id) {
        setIsModalOpen(false);
      }
      showNotification('Registro de conversa excluído.');
    } catch (err: any) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const handleExportJson = () => {
    if (!selectedSession) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(selectedSession, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `concierge_log_${selectedSession.sessionId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Positivo
          </span>
        );
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700">
            <AlertCircle className="h-3 w-3 text-rose-600" />
            Urgente
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
            <HelpCircle className="h-3 w-3 text-zinc-500" />
            Consulta
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            Logs de Conversa & Auditoria
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Visualize o histórico de interações com os hóspedes para controle de qualidade.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-zinc-500 font-mono">
            Sessões Registradas: <strong className="text-zinc-900">{logs.length}</strong>
          </span>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Sentiment Filter */}
        <div className="flex items-center gap-1.5">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'positive', label: 'Positivo' },
            { value: 'inquiry', label: 'Consultas' },
            { value: 'urgent', label: 'Urgentes' },
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setSelectedSentiment(filter.value)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedSentiment === filter.value
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 border border-zinc-200/80 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative min-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por hóspede ou texto..."
            className="w-full rounded-xl border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none"
          />
        </form>

      </div>

      {/* Session Logs List */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center text-zinc-400">
          <Sparkles className="h-5 w-5 text-zinc-900 animate-spin mr-2" />
          <span>Carregando registros...</span>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-12 text-center">
          <MessageSquare className="mx-auto h-8 w-8 text-zinc-300" />
          <h3 className="mt-3 text-sm font-bold text-zinc-800">Nenhum log encontrado</h3>
          <p className="mt-1 text-xs text-zinc-500">
            As conversas iniciadas no chat aparecerão aqui automaticamente.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(session => (
            <div
              key={session.id}
              onClick={() => handleOpenDetails(session)}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 hover:border-zinc-400 hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700">
                  <User className="h-4 w-4" />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-bold text-sm text-zinc-900">
                      {session.userName || 'Hóspede'}
                    </span>
                    <span className="text-zinc-300 text-xs">•</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Hotel className="h-3 w-3 text-zinc-400" />
                      {session.guestRoom || 'Suíte'}
                    </span>
                    <span>•</span>
                    {getSentimentBadge(session.sentiment)}
                  </div>

                  <p className="text-xs text-zinc-600 line-clamp-1 italic font-light">
                    "{session.previewText}"
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {session.detectedTopics.map((topic, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-zinc-100 px-2 py-0.2 text-[10px] text-zinc-600 flex items-center gap-1 font-medium"
                      >
                        <Tag className="h-2.5 w-2.5 text-zinc-400" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Message Count, Date & Actions */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 space-y-1">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  {new Date(session.lastActiveAt).toLocaleString([], {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                
                <div className="flex items-center space-x-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-700 font-medium">
                    {session.messageCount} msgs
                  </span>

                  <button
                    onClick={(e) => handleDeleteLog(session.id, e)}
                    className="rounded-lg p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Excluir log"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Conversation Details & Transcript Modal */}
      {isModalOpen && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex flex-col h-[85vh] w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-zinc-900">
                    Transcrição: {selectedSession.userName}
                  </h3>
                  <span className="text-xs text-zinc-500">({selectedSession.guestRoom})</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                  Sessão: {selectedSession.sessionId} • {selectedSession.messageCount} mensagens
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                  title="Baixar JSON"
                >
                  <Download className="h-3.5 w-3.5 text-zinc-600" />
                  <span className="hidden sm:inline">Exportar JSON</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Transcript Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/30">
              {selectedSession.messages && selectedSession.messages.length > 0 ? (
                selectedSession.messages.map((msg, idx) => {
                  const isAssistant = msg.role === 'assistant';
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-zinc-400 uppercase font-bold tracking-tight">
                        <span>
                          {isAssistant ? 'Concierge' : selectedSession.userName || 'Hóspede'}
                        </span>
                        <span>•</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-xl px-4 py-3 text-xs leading-relaxed ${
                          isAssistant
                            ? 'chat-bubble-agent bg-zinc-900 text-white shadow-xs'
                            : 'chat-bubble-user bg-zinc-100 text-zinc-800 border border-zinc-200/80'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {/* Actions in log */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-zinc-700/60 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                              Ação Coordenada:
                            </span>
                            {msg.actions.map(act => (
                              <div key={act.id} className="rounded-lg bg-zinc-800 p-2 border border-zinc-700 text-[11px]">
                                <span className="font-semibold text-white">{act.title}</span>
                                <p className="text-zinc-300">{act.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-xs text-zinc-400 py-10">Nenhuma mensagem registrada nesta sessão.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-zinc-100 px-6 py-3 bg-zinc-50/50">
              <div className="flex items-center gap-2">
                {getSentimentBadge(selectedSession.sentiment)}
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
