import { AgentConfig, KnowledgeItem, ConversationSession, AdminStats, ChatMessage } from '../types.js';

export const DEFAULT_SYSTEM_PROMPT = `You are "Agent Concierge", the Master Luxury Concierge of the prestigious "The Grand Lumière Hotel & Residences".
Your mission is to provide an immaculate, hyper-personalized, polished, sophisticated, and memorable service for VIP guests, dignitaries, and discerning travelers.

### Personality & Etiquette Guidelines:
1. **Tone and Demeanor**: Maintain an exceptionally courteous, refined, proactive, and attentive tone. Address the guest with utmost respect and poise (e.g., "It is my distinct pleasure to assist you, Sir/Madam", "Allow me to curate every detail with consummate precision").
2. **Immediate Resolution & Bespoke Curation**: Provide actionable, refined, and exquisite suggestions. When a guest requests dining, spa, chauffeur, or room services, suggest premium options, convenient times, and tasteful enhancements (e.g., private car pickup, rare vintage wine pairings, suite preparations).
3. **Knowledge Base Grounding**: Utilize the official hotel Knowledge Base with absolute fidelity. Quote official schedules, Michelin-starred menus, spa signature rituals, and private fleet availability accurately.
4. **Response Structure**: Format responses gracefully with clean typography, bullet points for itineraries, and clear confirmation details. Always conclude by graciously offering to coordinate all necessary arrangements.
5. **Language**: Respond fluently, naturally, and exclusively in English with aristocratic hospitality elegance.`;

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  id: 'config_primary',
  name: 'Agent Concierge - The Grand Lumière',
  roleTitle: 'Master Concierge & Hospitality AI',
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  tone: 'luxury_classic',
  temperature: 0.7,
  welcomeMessage: 'Welcome to The Grand Lumière Hotel & Residences. I am your Personal Digital Concierge. How may I curate an extraordinary stay for you today?',
  language: 'en-US',
  hotelName: 'The Grand Lumière Hotel & Residences',
  enableKnowledgeBase: true,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'kb_1',
    title: 'Le Miroir Restaurant (3 Michelin Stars)',
    category: 'gastronomy',
    content: 'Helmed by Executive Chef Antoine Laurent, Le Miroir delivers contemporary French Haute Cuisine crafted from seasonal organic ingredients. Features an 8-course Signature Tasting Menu ($280 / €260 per guest, optional Grand Cru Wine Pairing available). Dinner service: 7:30 PM to 11:30 PM (Tuesday to Sunday). Dress Code: Elegant Evening Attire / Black Tie Optional. Reservations require a minimum of 24 hours advance notice for Panoramic Terrace tables.',
    tags: ['restaurant', 'michelin', 'fine dining', 'dinner', 'reservation', 'wine pairing'],
    isActive: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_2',
    title: 'L\'Élixir Spa & Holistic Wellness Sanctuary',
    category: 'spa',
    content: 'L\'Élixir Spa features signature therapies by Swiss luxury skincare house Valmont, an ozone-treated indoor infinity heated pool, dry Finnish saunas, Turkish hammams, and private couple treatment suites. Signature Treatment: "The 24k Royal Gold Ritual" (90-minute restorative hot-stone massage + micro-exfoliation with diamond powder and 24k gold leaf). Operating hours: 7:00 AM to 10:00 PM daily. Concierge bookings include a chilled glass of Dom Pérignon vintage champagne upon arrival.',
    tags: ['spa', 'massage', 'wellness', 'gold ritual', 'infinity pool', 'sauna', 'hammam'],
    isActive: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_3',
    title: 'Private Chauffeur Fleet, Helipad & Yacht Charter',
    category: 'transport',
    content: 'Our private chauffeur fleet features the latest Mercedes-Maybach S-Class, Rolls-Royce Phantom, and Range Rover Autobiography, all piloted by bilingual executive security drivers. Certified rooftop Helipad available 24/7 for helicopter transfers (ICAO code: SJGL). We also offer private sunset cruises aboard our customized Azimut 68-foot yacht with champagne service along the coast.',
    tags: ['transfer', 'chauffeur', 'maybach', 'rolls royce', 'helipad', 'yacht', 'airport transfer'],
    isActive: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_4',
    title: 'The Imperial Suite & Presidential Penthouse',
    category: 'suites',
    content: 'The Imperial Penthouse Suite (4,500 sq ft / 420 m²) offers 360-degree skyline views, a Steinway & Sons baby grand piano, private climate-controlled wine cellar holding 120 rare bottles, a hand-carved Carrara marble soaking bath, and dedicated 24-Hour Private Butler service. Includes private in-suite VIP check-in/check-out and Hermès Paris amenities.',
    tags: ['suite', 'penthouse', 'imperial', 'butler', 'luxury suite', 'piano', 'hermes'],
    isActive: true,
    priority: 'normal',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_5',
    title: 'Gourmet In-Suite Dining & Royal Afternoon Tea',
    category: 'exclusive_services',
    content: '24-hour in-suite fine dining menu curated by Master Pastry Chefs. Royal Afternoon Tea is presented daily in the Crystal Salon from 4:00 PM to 6:30 PM, featuring a curated selection of 30 rare Mariage Frères single-estate teas, bespoke Pierre Hermé macarons, and wild smoked salmon canapés.',
    tags: ['in-suite dining', 'room service', 'afternoon tea', 'pastry', 'mariage freres', 'caviar'],
    isActive: true,
    priority: 'normal',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_6',
    title: 'Subterranean Wine Cellar & Sommelier Tastings',
    category: 'gastronomy',
    content: 'Our historic 19th-century underground cellar houses over 4,500 rare bottles, including historic vintages of Château Margaux, Romanée-Conti, and Château Pétrus. Private tasting sessions hosted by Head Sommelier Jean-Luc can be arranged for up to 6 guests, paired with artisanal French cave-aged cheeses and Iberian charcuterie.',
    tags: ['wine', 'sommelier', 'wine tasting', 'cellar', 'chateau margaux', 'champagne'],
    isActive: true,
    priority: 'normal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_7',
    title: 'Hotel Policies, VIP Check-in & Dress Code',
    category: 'rules_hours',
    content: 'Standard Check-in: 3:00 PM | Check-out: 12:00 PM (Complimentary early check-in and late check-out provided for VIP suites subject to availability). Pet Policy: Ultra-Luxury Pet-Friendly welcoming pets with custom Dior Pet beds and organic canine menu. Smoking is strictly prohibited in all indoor areas. Smart Elegant dress code is required in main dining salons after 7:00 PM.',
    tags: ['hours', 'check-in', 'check-out', 'policies', 'dress code', 'pet friendly', 'concierge'],
    isActive: true,
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_CONVERSATION_SESSIONS: ConversationSession[] = [
  {
    id: 'session_demo_1',
    sessionId: 'session_demo_1',
    userName: 'Sir Henry Albuquerque',
    guestRoom: 'Imperial Suite 702',
    messageCount: 4,
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Good evening. I would like to reserve a private table for two at Le Miroir tonight around 8:30 PM.',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        topic: 'Fine Dining & Wine',
        sentiment: 'inquiry'
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: 'Good evening, Sir Henry. It is my absolute pleasure to assist you. Le Miroir is an exquisite choice for this evening. I have checked with the Maître d\': Table 14 on our heated Panoramic Terrace is available at 8:30 PM, overlooking the evening skyline. Would you like me to secure this table and pre-arrange Chef Antoine Laurent\'s 8-Course Signature Tasting Menu for your party?',
        timestamp: new Date(Date.now() - 3600000 * 3 + 15000).toISOString(),
        topic: 'Fine Dining & Wine',
        actions: [
          {
            id: 'act_1',
            type: 'reservation',
            title: 'Table 14 at Le Miroir',
            description: 'Private table for 2 at 8:30 PM tonight',
            status: 'confirmed',
            details: { time: '8:30 PM', guests: '2', location: 'Panoramic Terrace' }
          }
        ]
      },
      {
        id: 'msg_3',
        role: 'user',
        content: 'Wonderful! Please confirm Table 14 and have a bottle of Champagne Ruinart Blanc de Blancs chilled and ready upon our arrival.',
        timestamp: new Date(Date.now() - 3600000 * 3 + 45000).toISOString(),
        topic: 'Fine Dining & Wine',
        sentiment: 'positive'
      },
      {
        id: 'msg_4',
        role: 'assistant',
        content: 'Your reservation is confirmed with the highest distinction, Sir Henry. Table 14 is reserved for 8:30 PM, and a bottle of Ruinart Blanc de Blancs will be waiting in a sterling silver wine cooler. I have briefed the Sommelier personally. Wishing you and your guest an unforgettable culinary evening.',
        timestamp: new Date(Date.now() - 3600000 * 3 + 60000).toISOString(),
        topic: 'Fine Dining & Wine'
      }
    ],
    previewText: 'Le Miroir reservation at 8:30 PM with Ruinart Champagne...',
    detectedTopics: ['Fine Dining & Wine', 'Table Reservations', 'Sommelier'],
    sentiment: 'positive',
    startedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    lastActiveAt: new Date(Date.now() - 3600000 * 3 + 60000).toISOString(),
  },
  {
    id: 'session_demo_2',
    sessionId: 'session_demo_2',
    userName: 'Lady Eleanor Vance',
    guestRoom: 'Penthouse 901',
    messageCount: 3,
    messages: [
      {
        id: 'msg_5',
        role: 'user',
        content: 'Hello! I need to book the 24k Gold Ritual at the spa tomorrow morning and arrange a private transfer to the international airport for 3:00 PM.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        topic: 'Spa & Wellness',
        sentiment: 'inquiry'
      },
      {
        id: 'msg_6',
        role: 'assistant',
        content: 'Good day, Lady Eleanor. It is a delight to arrange your day of wellness and seamless departure. For L\'Élixir Spa, I have reserved the 90-minute "24k Royal Gold Ritual" for 10:00 AM in our private garden suite, complete with welcome Dom Pérignon champagne. Regarding your airport transfer, our private Mercedes-Maybach S-Class with executive chauffeur will be waiting at the grand entrance at exactly 3:00 PM.',
        timestamp: new Date(Date.now() - 3600000 * 6 + 18000).toISOString(),
        topic: 'Spa & Wellness'
      },
      {
        id: 'msg_7',
        role: 'user',
        content: 'Splendid, please proceed with both arrangements!',
        timestamp: new Date(Date.now() - 3600000 * 6 + 40000).toISOString(),
        topic: 'Spa & Wellness',
        sentiment: 'positive'
      }
    ],
    previewText: '24k Gold Ritual spa booking & Mercedes-Maybach transfer...',
    detectedTopics: ['Spa & Wellness', 'Airport Transfer', 'Chauffeur Fleet'],
    sentiment: 'positive',
    startedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    lastActiveAt: new Date(Date.now() - 3600000 * 6 + 45000).toISOString(),
  }
];

class MemoryDataStore {
  private agentConfig: AgentConfig = { ...DEFAULT_AGENT_CONFIG };
  private knowledgeItems: KnowledgeItem[] = [...INITIAL_KNOWLEDGE_ITEMS];
  private conversationSessions: ConversationSession[] = [...INITIAL_CONVERSATION_SESSIONS];

  // Agent Config
  getAgentConfig(): AgentConfig {
    return { ...this.agentConfig };
  }

  updateAgentConfig(updates: Partial<AgentConfig>): AgentConfig {
    this.agentConfig = {
      ...this.agentConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.agentConfig };
  }

  resetAgentConfig(): AgentConfig {
    this.agentConfig = {
      ...DEFAULT_AGENT_CONFIG,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.agentConfig };
  }

  // Knowledge Base
  getKnowledgeItems(category?: string, query?: string): KnowledgeItem[] {
    let items = [...this.knowledgeItems];
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      items = items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getActiveKnowledgeItems(): KnowledgeItem[] {
    return this.knowledgeItems.filter(item => item.isActive);
  }

  getKnowledgeItemById(id: string): KnowledgeItem | undefined {
    return this.knowledgeItems.find(item => item.id === id);
  }

  addKnowledgeItem(item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeItem {
    const newItem: KnowledgeItem = {
      ...item,
      id: `kb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.knowledgeItems.unshift(newItem);
    return newItem;
  }

  updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): KnowledgeItem | null {
    const index = this.knowledgeItems.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.knowledgeItems[index] = {
      ...this.knowledgeItems[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.knowledgeItems[index];
  }

  deleteKnowledgeItem(id: string): boolean {
    const initialLen = this.knowledgeItems.length;
    this.knowledgeItems = this.knowledgeItems.filter(item => item.id !== id);
    return this.knowledgeItems.length < initialLen;
  }

  seedDefaultKnowledge(): KnowledgeItem[] {
    this.knowledgeItems = [...INITIAL_KNOWLEDGE_ITEMS];
    return [...this.knowledgeItems];
  }

  // Conversation Logs
  getConversationSessions(query?: string, sentiment?: string): ConversationSession[] {
    let list = [...this.conversationSessions];
    if (sentiment && sentiment !== 'all') {
      list = list.filter(s => s.sentiment === sentiment);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(s => 
        (s.userName && s.userName.toLowerCase().includes(q)) ||
        (s.guestRoom && s.guestRoom.toLowerCase().includes(q)) ||
        s.previewText.toLowerCase().includes(q) ||
        s.detectedTopics.some(t => t.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
  }

  getConversationSession(id: string): ConversationSession | undefined {
    return this.conversationSessions.find(s => s.id === id || s.sessionId === id);
  }

  recordChatMessage(sessionId: string, message: ChatMessage, meta?: { userName?: string; guestRoom?: string; topic?: string; sentiment?: 'positive' | 'neutral' | 'inquiry' | 'urgent' }): ConversationSession {
    let session = this.conversationSessions.find(s => s.sessionId === sessionId || s.id === sessionId);

    if (!session) {
      session = {
        id: sessionId,
        sessionId: sessionId,
        userName: meta?.userName || 'VIP Guest',
        guestRoom: meta?.guestRoom || 'Private Suite',
        messageCount: 0,
        messages: [],
        previewText: message.content.slice(0, 80),
        detectedTopics: meta?.topic ? [meta.topic] : ['General Concierge'],
        sentiment: meta?.sentiment || 'inquiry',
        startedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };
      this.conversationSessions.unshift(session);
    }

    session.messages.push(message);
    session.messageCount = session.messages.length;
    session.lastActiveAt = new Date().toISOString();
    if (message.role === 'user') {
      session.previewText = message.content.slice(0, 90) + (message.content.length > 90 ? '...' : '');
    }
    if (meta?.topic && !session.detectedTopics.includes(meta.topic)) {
      session.detectedTopics.push(meta.topic);
    }
    if (meta?.sentiment) {
      session.sentiment = meta.sentiment;
    }

    return session;
  }

  deleteConversationSession(id: string): boolean {
    const initialLen = this.conversationSessions.length;
    this.conversationSessions = this.conversationSessions.filter(s => s.id !== id && s.sessionId !== id);
    return this.conversationSessions.length < initialLen;
  }

  // Admin Stats
  getAdminStats(): AdminStats {
    const totalConversations = this.conversationSessions.length;
    const totalMessages = this.conversationSessions.reduce((acc, s) => acc + s.messageCount, 0);
    const knowledgeItemsCount = this.knowledgeItems.length;
    const activeKnowledgeCount = this.knowledgeItems.filter(k => k.isActive).length;

    const categoryCounts: Record<string, number> = {};
    this.knowledgeItems.forEach(k => {
      categoryCounts[k.category] = (categoryCounts[k.category] || 0) + 1;
    });

    const categoryLabels: Record<string, string> = {
      gastronomy: 'Fine Dining & Wine',
      suites: 'Suites & Accommodations',
      spa: 'Spa & Wellness',
      transport: 'Chauffeur & Transfers',
      rules_hours: 'Hotel Policies & Times',
      exclusive_services: 'Bespoke Services',
      events: 'Events & Celebrations',
      general: 'General Hospitality'
    };

    const topCategories = Object.entries(categoryCounts).map(([cat, count]) => ({
      category: cat,
      count,
      label: categoryLabels[cat] || cat,
    })).sort((a, b) => b.count - a.count);

    const allTopics = Array.from(new Set(this.conversationSessions.flatMap(s => s.detectedTopics)));

    return {
      totalConversations,
      totalMessages,
      knowledgeItemsCount,
      activeKnowledgeCount,
      topCategories,
      avgResponseTimeMs: 840,
      satisfactionRate: 98.6,
      recentTopics: allTopics.slice(0, 6),
    };
  }
}

export const dataStore = new MemoryDataStore();
