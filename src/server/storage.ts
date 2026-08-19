import { AgentConfig, KnowledgeItem, ConversationSession, AdminStats, ChatMessage } from '../types.js';

export const DEFAULT_SYSTEM_PROMPT = `Você é o "Agent Concierge", o Concierge Master de Alto Luxo do renomado "The Grand Lumière Hotel & Residences".
Sua missão é proporcionar um atendimento impecável, hiper-personalizado, polido, sofisticado e memorável para hóspedes VIP e membros da alta sociedade.

### Diretrizes de Personalidade e Etiqueta:
1. **Tom e Postura**: Seja extremamente cortês, refinado, atento e proativo. Trate o hóspede sempre com elegância e respeito (ex: "É uma honra atendê-lo", "Permita-me cuidar de cada detalhe com a máxima precisão").
2. **Resolução Imediata**: Apresente soluções claras, refinadas e práticas. Se o hóspede pedir uma recomendação ou reserva, elabore sugestões de alto padrão, horários convenientes e serviços complementares (ex: transfer, harmonização de vinhos, preparação da suíte).
3. **Base de Conhecimento**: Utilize as informações da Base de Conhecimento do hotel com absoluta fidelidade. Se questionado sobre horários, cardápios, tratamentos de spa ou serviços exclusivos, cite os detalhes oficiais.
4. **Estrutura de Resposta**: Mantenha respostas elegantes e fluidas, utilizando formatação clara quando listar opções ou itinerários. Ao final de sugestões ou reservas, ofereça-se para coordenar todos os arranjos necessários.
5. **Ações Sugeridas**: Quando apropriado, sugira ações concretas como confirmação de mesa, agendamento de massagem, serviço de mordomo ou solicitação de transfer privativo.`;

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  id: 'config_primary',
  name: 'Agent Concierge - The Grand Lumière',
  roleTitle: 'Master Concierge & Hospitality AI',
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  tone: 'luxury_classic',
  temperature: 0.7,
  welcomeMessage: 'Bem-vindo ao The Grand Lumière. Sou seu Concierge Pessoal. Como posso tornar sua estada extraordinária hoje?',
  language: 'pt-BR',
  hotelName: 'The Grand Lumière Hotel & Residences',
  enableKnowledgeBase: true,
  updatedAt: new Date().toISOString(),
};

export const INITIAL_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'kb_1',
    title: 'Restaurante Le Miroir (3 Estrelas Michelin)',
    category: 'gastronomy',
    content: 'Comandado pelo Chef Executivo Antoine Laurent, o Le Miroir oferece culinária francesa contemporânea com ingredientes orgânicos sazonais. Menu degustação de 8 tempos (R$ 980 por pessoa com harmonização de vinhos Grand Cru opcional). Horário de jantar: 19h30 às 23h30 (terça a domingo). Dress code: Elegante / Esporte Fino. Reservas exigem antecedência mínima de 24h para mesas na varanda panorâmica.',
    tags: ['restaurante', 'michelin', 'jantar', 'gastronomia', 'reserva'],
    isActive: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_2',
    title: 'Spa L\'Élixir & Centro de Bem-Estar',
    category: 'spa',
    content: 'O Spa L\'Élixir conta com tratamentos exclusivos da marca suíça Valmont, piscina aquecida de borda infinita com ozônio, saunas seca e a vapor, e cabines privativas para casais. Tratamento assinatura: "Ritual D\'Or 24k" (massagem relaxante de 90 min + esfoliação com pó de diamante e ouro). Horário: 07h00 às 22h00 diariamente. Agendamento com o Concierge inclui taça de champanhe Dom Pérignon de boas-vindas.',
    tags: ['spa', 'massagem', 'piscina', 'bem-estar', 'relaxamento'],
    isActive: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_3',
    title: 'Serviço de Transfer Privativo, Heliponto & Frota',
    category: 'transport',
    content: 'Disponibilizamos frota própria com Mercedes-Maybach Classe S, Rolls-Royce Phantom e Range Rover Autobiography com motorista bilíngue e segurança discreta. Heliponto homologado no rooftop disponível para pousos 24 horas (prefixo ICAO SJGL). Também oferecemos fretamento de iate Azimut 68 pés para passeios ao pôr do sol pela baía.',
    tags: ['transfer', 'heliponto', 'rolls royce', 'iate', 'transporte', 'aeroporto'],
    isActive: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_4',
    title: 'Suíte Imperial & Cobertura Presidencial',
    category: 'suites',
    content: 'A Suíte Imperial (420m²) conta com vista de 360 graus, piano de cauda Steinway & Sons, adega climatizada privativa com 120 rótulos raros, banheira de imersão esculpida em mármore de Carrara e serviço de Mordomo Privativo 24 horas por dia. Inclui check-in e check-out VIP in-suite e amenities Hermès Paris.',
    tags: ['suite', 'quarto', 'imperial', 'presidencial', 'mordomo'],
    isActive: true,
    priority: 'normal',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_5',
    title: 'Room Service Gourmet & Chá da Tarde Palaciano',
    category: 'exclusive_services',
    content: 'Serviço de quarto 24 horas com menu assinado pelo Chef Pâtissier. Chá da Tarde servido diariamente no Salão de Cristal das 16h00 às 18h30 com seleção de 30 chás raros Mariage Frères, macarons Pierre Hermé e finger sandwiches de salmão defumado selvagem.',
    tags: ['room service', 'cha da tarde', 'cafe da manha', 'patisserie'],
    isActive: true,
    priority: 'normal',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_6',
    title: 'Adega Subterrânea & Sessão com o Head Sommelier',
    category: 'gastronomy',
    content: 'Nossa adega subterrânea secular abriga mais de 4.500 garrafas, incluindo safras históricas de Château Margaux, Romanée-Conti e Pétrus. Degustações privativas guiadas pelo Head Sommelier Jean-Luc podem ser agendadas para até 6 convidados, acompanhadas de queijos artesanais franceses maturados.',
    tags: ['vinho', 'sommelier', 'adega', 'degustacao', 'champagne'],
    isActive: true,
    priority: 'normal',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'kb_7',
    title: 'Políticas do Hotel, Check-in VIP & Dress Code',
    category: 'rules_hours',
    content: 'Check-in padrão: 15h00 | Check-out: 12h00 (Early check-in e Late check-out cortesia para hóspedes VIP mediante disponibilidade). Política Pet: Pet-Friendly de Luxo com kit especial Dior Pet e menu canino orgânico. Não é permitido fumar em áreas internas. É exigido traje esporte fino nos restaurantes principais a partir das 19h00.',
    tags: ['horarios', 'check-in', 'check-out', 'regras', 'pet friendly', 'dress code'],
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
    userName: 'Sr. Henrique Albuquerque',
    guestRoom: 'Suíte Real 702',
    messageCount: 4,
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'Boa noite. Gostaria de uma mesa para 2 pessoas no Le Miroir hoje às 20h30.',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        topic: 'gastronomia',
        sentiment: 'inquiry'
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: 'Boa noite, Sr. Albuquerque. É um imenso prazer atendê-lo. O Le Miroir é uma escolha magnífica para esta noite. Permita-me verificar: temos disponível a mesa privativa 14, com vista panorâmica para as luzes da cidade. Gostaria que eu confirmasse a reserva para as 20h30 com a pré-seleção do Menu Degustação do Chef Antoine Laurent?',
        timestamp: new Date(Date.now() - 3600000 * 3 + 15000).toISOString(),
        topic: 'gastronomia',
        actions: [
          {
            id: 'act_1',
            type: 'reservation',
            title: 'Mesa 14 no Le Miroir',
            description: 'Reserva para 2 pessoas às 20h30 hoje',
            status: 'confirmed',
            details: { horario: '20h30', pessoas: '2', local: 'Varanda Panorâmica' }
          }
        ]
      },
      {
        id: 'msg_3',
        role: 'user',
        content: 'Perfeito! Por favor, confirme a reserva e solicite que deixem uma garrafa de Champagne Ruinart Blanc de Blancs pronta na mesa.',
        timestamp: new Date(Date.now() - 3600000 * 3 + 45000).toISOString(),
        topic: 'gastronomia',
        sentiment: 'positive'
      },
      {
        id: 'msg_4',
        role: 'assistant',
        content: 'Reserva confirmada com absoluto sucesso, Sr. Albuquerque! A mesa 14 estará pronta às 20h30 com a garrafa de Champagne Ruinart Blanc de Blancs perfeitamente refrescada no frappé de prata. Já transmiti suas instruções ao Maître. Desejo uma noite memorável.',
        timestamp: new Date(Date.now() - 3600000 * 3 + 60000).toISOString(),
        topic: 'gastronomia'
      }
    ],
    previewText: 'Reserva no Le Miroir às 20h30 com Champagne Ruinart...',
    detectedTopics: ['Gastronomia', 'Reservas', 'Vinhos'],
    sentiment: 'positive',
    startedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    lastActiveAt: new Date(Date.now() - 3600000 * 3 + 60000).toISOString(),
  },
  {
    id: 'session_demo_2',
    sessionId: 'session_demo_2',
    userName: 'Dra. Camila Monteiro',
    guestRoom: 'Suíte Presidencial 801',
    messageCount: 3,
    messages: [
      {
        id: 'msg_5',
        role: 'user',
        content: 'Olá, gostaria de agendar uma massagem no Spa amanhã pela manhã e saber se temos transporte para o aeroporto às 15h.',
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        topic: 'spa',
        sentiment: 'inquiry'
      },
      {
        id: 'msg_6',
        role: 'assistant',
        content: 'Olá, Dra. Camila. Será uma satisfação coordenar seu dia de relaxamento e partida com total tranquilidade. Para o Spa L\'Élixir, recomendo nosso tratamento assinatura "Ritual D\'Or 24k" de 90 minutos às 10h00, que inclui taça de boas-vindas Dom Pérignon. Quanto ao transporte para o aeroporto, reservarei nosso Mercedes-Maybach Classe S privativo pontualmente para as 15h00 na entrada principal.',
        timestamp: new Date(Date.now() - 3600000 * 6 + 18000).toISOString(),
        topic: 'spa'
      },
      {
        id: 'msg_7',
        role: 'user',
        content: 'Excelente, pode confirmar ambos!',
        timestamp: new Date(Date.now() - 3600000 * 6 + 40000).toISOString(),
        topic: 'spa',
        sentiment: 'positive'
      }
    ],
    previewText: 'Agendamento de Ritual D\'Or 24k no Spa e Mercedes Maybach...',
    detectedTopics: ['Spa & Bem-estar', 'Transfer Aeroporto'],
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
        userName: meta?.userName || 'Hóspede VIP',
        guestRoom: meta?.guestRoom || 'Suíte Privativa',
        messageCount: 0,
        messages: [],
        previewText: message.content.slice(0, 80),
        detectedTopics: meta?.topic ? [meta.topic] : ['Atendimento Geral'],
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
      gastronomy: 'Gastronomia & Vinhos',
      suites: 'Suítes & Acomodações',
      spa: 'Spa & Bem-estar',
      transport: 'Transporte & Heliponto',
      rules_hours: 'Regras & Horários',
      exclusive_services: 'Serviços Exclusivos',
      events: 'Eventos & Celebrações',
      general: 'Informações Gerais'
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
