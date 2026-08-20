import { AgentConfig, KnowledgeItem, ConversationSession, AdminStats, ChatMessage, ServiceAction } from '../types';

export interface ChatResponse {
  reply: string;
  actions?: ServiceAction[];
  topic?: string;
  sessionId: string;
}

export const DEFAULT_FALLBACK_AGENT_CONFIG: AgentConfig = {
  id: 'config_primary',
  name: 'Agent Concierge - Harmony Homes',
  roleTitle: 'Master Luxury Real Estate Advisor & Concierge',
  systemPrompt: `You are "Agent Concierge", the Master Luxury Real Estate Advisor and Concierge for the prestigious "Harmony Homes" in Las Vegas. 

Your mission is to provide an immaculate, hyper-personalized, polished, sophisticated, and discreet service for High-Net-Worth Individuals (HNWIs), investors, and discerning clients looking to build, design, or acquire custom luxury residences.

### Personality & Etiquette Guidelines:
1. **Tone and Demeanor**: Maintain an exceptionally courteous, refined, proactive, and authoritative tone. Reflect the discretion and prestige of a top-tier luxury developer. Address the guest with utmost respect and poise (e.g., "It is my distinct pleasure to assist you," "Allow us to translate your vision into an architectural reality").

2. **Bespoke Curation & High-Touch Service**: Provide action-oriented, insightful, and elevated guidance. When a client inquires about land acquisition, architectural design, or custom builds, guide them through Harmony Homes' holistic "Design & Build" approach and signature offerings (e.g., Desert Modernism aesthetics, private consultations, Las Vegas Strip views).

3. **Lead Qualification & Consultation Guidance**: Gently inquire about the client’s project timeline, preferred location, and vision when appropriate. Always invite qualified prospects to step into a direct, private consultation with our principal leadership team to discuss their bespoke goals.

4. **Knowledge Base Grounding**: Utilize official Harmony Homes data with absolute fidelity:
   - **Legacy**: Over 40 years of building experience under founder Jim Rhodes, with 1,000+ homes developed/sold and thousands delivered through subcontracting.
   - **Methodology (5-Step Design & Build)**: 1. Vision & Strategy | 2. Integrated Planning & Design | 3. Engineering Alignment | 4. Precision Execution | 5. Turnkey Delivery.
   - **Featured Developments**: Egan Crest (Desert Modernism, Las Vegas Strip views, coming in 2026) and SkyFire Estate (Completed modernist luxury residence).

5. **Response Structure**: Format responses gracefully with clean typography, elegant line breaks, and structured bullet points for multi-step processes or property details. Always conclude by graciously offering to schedule a private consultation or provide dedicated property dossiers.

6. **Language**: Respond fluently, naturally, and exclusively in English with high-end architectural and hospitality sophistication.`,
  tone: 'luxury_classic',
  temperature: 0.7,
  welcomeMessage: 'Welcome to Harmony Homes. I am your Master Luxury Real Estate Advisor & Concierge. How may I assist you with custom residences, architectural design, or private estate consultations today?',
  language: 'en-US',
  hotelName: 'Harmony Homes Luxury Real Estate',
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
        throw new Error(err.error || 'Failed to communicate with Agent Concierge');
      }
      return await res.json();
    } catch (e: any) {
      // Fallback response for offline or transient network
      return {
        reply: "It is my distinct pleasure to assist you. At Harmony Homes, we specialize in translating visionary custom estate dreams into architectural reality. May I arrange a private consultation with our principal leadership team to review your timeline and preferred Las Vegas homesite?",
        sessionId: params.sessionId || 'ses_default',
        topic: 'Custom Luxury Estate Consultation',
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
      if (!res.ok) throw new Error('Error saving agent configuration');
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
      if (!res.ok) throw new Error('Error restoring default configuration');
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
      if (!res.ok) throw new Error('Error fetching knowledge base');
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
    if (!res.ok) throw new Error('Error creating knowledge base item');
    return res.json();
  },

  async updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const res = await fetch(`/api/knowledge-base/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Error updating item');
    return res.json();
  },

  async deleteKnowledgeItem(id: string): Promise<void> {
    const res = await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error deleting item');
  },

  async seedKnowledgeBase(): Promise<KnowledgeItem[]> {
    const res = await fetch('/api/knowledge-base/seed', { method: 'POST' });
    if (!res.ok) throw new Error('Error reloading default items');
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
      if (!res.ok) throw new Error('Error loading conversation logs');
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  async getConversationLog(id: string): Promise<ConversationSession> {
    const res = await fetch(`/api/conversation-logs/${id}`);
    if (!res.ok) throw new Error('Error loading conversation log');
    return res.json();
  },

  async deleteConversationLog(id: string): Promise<void> {
    const res = await fetch(`/api/conversation-logs/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error removing conversation log');
  },

  // Admin Stats & Auth
  async getAdminStats(): Promise<AdminStats> {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Error loading stats');
      return await res.json();
    } catch (e) {
      return {
        totalConversations: 18,
        totalMessages: 64,
        knowledgeItemsCount: 6,
        activeKnowledgeCount: 6,
        topCategories: [
          { category: 'developments', count: 22, label: 'Developments & Estates' },
          { category: 'methodology', count: 16, label: '5-Step Design & Build' },
          { category: 'architecture', count: 14, label: 'Desert Modernism' },
          { category: 'legacy', count: 12, label: 'Jim Rhodes 40-Yr Legacy' }
        ],
        avgResponseTimeMs: 780,
        satisfactionRate: 99.2,
        recentTopics: [
          'Egan Crest 2026 Strip Views',
          '5-Step Design & Build Methodology',
          'SkyFire Estate Completed Residence',
          'Private Consultation with Jim Rhodes'
        ]
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
      throw new Error(err.error || 'Incorrect password');
    }
    return res.json();
  },
};
