import { AgentConfig, KnowledgeItem, ConversationSession, AdminStats, ChatMessage, ServiceAction } from '../types';

export interface ChatResponse {
  reply: string;
  actions?: ServiceAction[];
  topic?: string;
  sessionId: string;
}

export const api = {
  // Chat
  async sendMessage(params: {
    message: string;
    sessionId?: string;
    guestInfo?: { name: string; room: string };
    history?: { role: string; content: string }[];
    toneOverride?: string;
  }): Promise<ChatResponse> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Falha na comunicação com o Agent Concierge');
    }
    return res.json();
  },

  // Agent Config
  async getAgentConfig(): Promise<AgentConfig> {
    const res = await fetch('/api/agent-config');
    if (!res.ok) throw new Error('Erro ao carregar configurações do agente');
    return res.json();
  },

  async updateAgentConfig(config: Partial<AgentConfig>): Promise<AgentConfig> {
    const res = await fetch('/api/agent-config', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Erro ao salvar configurações do agente');
    return res.json();
  },

  async resetAgentConfig(): Promise<AgentConfig> {
    const res = await fetch('/api/agent-config/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Erro ao restaurar configurações padrão');
    return res.json();
  },

  // Knowledge Base
  async getKnowledgeBase(category?: string, query?: string): Promise<KnowledgeItem[]> {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (query) params.append('q', query);
    const res = await fetch(`/api/knowledge-base?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao buscar base de conhecimento');
    return res.json();
  },

  async createKnowledgeItem(item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeItem> {
    const res = await fetch('/api/knowledge-base', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Erro ao adicionar item na base');
    return res.json();
  },

  async updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const res = await fetch(`/api/knowledge-base/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Erro ao atualizar item');
    return res.json();
  },

  async deleteKnowledgeItem(id: string): Promise<void> {
    const res = await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir item');
  },

  async seedKnowledgeBase(): Promise<KnowledgeItem[]> {
    const res = await fetch('/api/knowledge-base/seed', { method: 'POST' });
    if (!res.ok) throw new Error('Erro ao recarregar itens padrão');
    const data = await res.json();
    return data.items;
  },

  // Conversation Logs
  async getConversationLogs(query?: string, sentiment?: string): Promise<ConversationSession[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (sentiment && sentiment !== 'all') params.append('sentiment', sentiment);
    const res = await fetch(`/api/conversation-logs?${params.toString()}`);
    if (!res.ok) throw new Error('Erro ao carregar logs de conversa');
    return res.json();
  },

  async getConversationLog(id: string): Promise<ConversationSession> {
    const res = await fetch(`/api/conversation-logs/${id}`);
    if (!res.ok) throw new Error('Erro ao carregar detalhes da conversa');
    return res.json();
  },

  async deleteConversationLog(id: string): Promise<void> {
    const res = await fetch(`/api/conversation-logs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao remover log de conversa');
  },

  // Admin Stats & Auth
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch('/api/admin/stats');
    if (!res.ok) throw new Error('Erro ao carregar métricas');
    return res.json();
  },

  async adminLogin(password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Senha incorreta');
    }
    return res.json();
  },
};
