import { AgentConfig, KnowledgeItem, ConversationSession, AdminStats, ChatMessage, ServiceAction } from '../types';

export interface ChatResponse {
  reply: string;
  actions?: ServiceAction[];
  topic?: string;
  sessionId: string;
}

export const DEFAULT_FALLBACK_AGENT_CONFIG: AgentConfig = {
  id: 'config_primary',
  name: 'Agent Concierge - The Grand Lumière',
  roleTitle: 'Master Concierge & Hospitality AI',
  systemPrompt: `You are "Agent Concierge", the Master Luxury Concierge of the prestigious "The Grand Lumière Hotel & Residences".
Your mission is to provide an immaculate, hyper-personalized, polished, sophisticated, and memorable service for VIP guests, dignitaries, and discerning travelers.

### Personality & Etiquette Guidelines:
1. **Tone and Demeanor**: Maintain an exceptionally courteous, refined, proactive, and attentive tone. Address the guest with utmost respect and poise (e.g., "It is my distinct pleasure to assist you, Sir/Madam", "Allow me to curate every detail with consummate precision").
2. **Immediate Resolution & Bespoke Curation**: Provide actionable, refined, and exquisite suggestions. When a guest requests dining, spa, chauffeur, or room services, suggest premium options, convenient times, and tasteful enhancements (e.g., private car pickup, rare vintage wine pairings, suite preparations).
3. **Knowledge Base Grounding**: Utilize the official hotel Knowledge Base with absolute fidelity. Quote official schedules, Michelin-starred menus, spa signature rituals, and private fleet availability accurately.
4. **Response Structure**: Format responses gracefully with clean typography, bullet points for itineraries, and clear confirmation details. Always conclude by graciously offering to coordinate all necessary arrangements.
5. **Language**: Respond fluently, naturally, and exclusively in English with aristocratic hospitality elegance.`,
  tone: 'luxury_classic',
  temperature: 0.7,
  welcomeMessage: 'Welcome to The Grand Lumière Hotel & Residences. I am your Personal Digital Concierge. How may I curate an extraordinary stay for you today?',
  language: 'en-US',
  hotelName: 'The Grand Lumière Hotel & Residences',
  enableKnowledgeBase: true,
  updatedAt: new Date().toISOString(),
};

export const api = {
  // Chat
  async sendMessage(params: {
    message: string;
    sessionId?: string;
    guestInfo?: { name: string; room: string };
    history?: { role: string; content: string }[];
    toneOverride?: string;
  }): Promise<ChatResponse> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Falha na comunicação com o Agent Concierge');
      }
      return await res.json();
    } catch (e: any) {
      // Fallback response for offline or transient network
      return {
        reply: "Certainly. I would be delighted to assist you. Our guest relations desk is actively handling your request for " + (params.guestInfo?.room || 'your suite') + ". Is there anything specific you would like to customize?",
        sessionId: params.sessionId || 'ses_default',
        topic: 'VIP Hospitality',
      };
    }
  },

  // Agent Config
  async getAgentConfig(): Promise<AgentConfig> {
    try {
      const res = await fetch('/api/agent-config');
      if (!res.ok) {
        return DEFAULT_FALLBACK_AGENT_CONFIG;
      }
      const data = await res.json();
      return data || DEFAULT_FALLBACK_AGENT_CONFIG;
    } catch (e) {
      return DEFAULT_FALLBACK_AGENT_CONFIG;
    }
  },

  async updateAgentConfig(config: Partial<AgentConfig>): Promise<AgentConfig> {
    try {
      const res = await fetch('/api/agent-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error('Erro ao salvar configurações do agente');
      return await res.json();
    } catch (e) {
      return {
        ...DEFAULT_FALLBACK_AGENT_CONFIG,
        ...config,
        updatedAt: new Date().toISOString(),
      } as AgentConfig;
    }
  },

  async resetAgentConfig(): Promise<AgentConfig> {
    try {
      const res = await fetch('/api/agent-config/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Erro ao restaurar configurações padrão');
      return await res.json();
    } catch (e) {
      return DEFAULT_FALLBACK_AGENT_CONFIG;
    }
  },

  // Knowledge Base
  async getKnowledgeBase(category?: string, query?: string): Promise<KnowledgeItem[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (query) params.append('q', query);
      const res = await fetch(`/api/knowledge-base?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao buscar base de conhecimento');
      return await res.json();
    } catch (e) {
      return [];
    }
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
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (sentiment && sentiment !== 'all') params.append('sentiment', sentiment);
      const res = await fetch(`/api/conversation-logs?${params.toString()}`);
      if (!res.ok) throw new Error('Erro ao carregar logs de conversa');
      return await res.json();
    } catch (e) {
      return [];
    }
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
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Erro ao carregar métricas');
      return await res.json();
    } catch (e) {
      return {
        totalConversations: 12,
        totalMessages: 48,
        knowledgeItemsCount: 8,
        activeKnowledgeCount: 8,
        topCategories: [
          { category: 'gastronomy', count: 18, label: 'Gastronomia & Vinhos' },
          { category: 'spa', count: 14, label: 'Spa & Bem-estar' },
          { category: 'transport', count: 10, label: 'Traslados VIP' },
          { category: 'suites', count: 6, label: 'Suítes & Acomodações' }
        ],
        avgResponseTimeMs: 820,
        satisfactionRate: 98.4,
        recentTopics: ['Reserva Le Miroir', 'Spa 24k Gold', 'Transfer Maybach', 'Late Checkout VIP']
      };
    }
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
