export type ConciergeTone = 'luxury_classic' | 'modern_executive' | 'sommelier' | 'resort_leisure';

export type KnowledgeCategory = 
  | 'gastronomy' 
  | 'suites' 
  | 'spa' 
  | 'transport' 
  | 'rules_hours' 
  | 'exclusive_services' 
  | 'events' 
  | 'general';

export interface ServiceAction {
  id: string;
  type: 'reservation' | 'room_service' | 'spa' | 'transfer' | 'experience' | 'info';
  title: string;
  description: string;
  status: 'pending' | 'confirmed' | 'requested';
  details?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actions?: ServiceAction[];
  topic?: string;
  sentiment?: 'positive' | 'neutral' | 'inquiry' | 'urgent';
  isStreaming?: boolean;
}

export interface AgentConfig {
  id: string;
  name: string;
  roleTitle: string;
  systemPrompt: string;
  tone: ConciergeTone;
  temperature: number;
  welcomeMessage: string;
  language: 'pt-BR' | 'en' | 'en-US' | 'fr' | 'es' | 'auto';
  hotelName: string;
  enableKnowledgeBase: boolean;
  updatedAt: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  tags: string[];
  isActive: boolean;
  priority?: 'high' | 'normal' | 'low';
  createdAt: string;
  updatedAt: string;
}

export interface ConversationSession {
  id: string;
  sessionId: string;
  userName?: string;
  guestRoom?: string;
  messageCount: number;
  messages: ChatMessage[];
  previewText: string;
  detectedTopics: string[];
  sentiment: 'positive' | 'neutral' | 'inquiry' | 'urgent';
  startedAt: string;
  lastActiveAt: string;
}

export interface AdminStats {
  totalConversations: number;
  totalMessages: number;
  knowledgeItemsCount: number;
  activeKnowledgeCount: number;
  topCategories: { category: string; count: number; label: string }[];
  avgResponseTimeMs: number;
  satisfactionRate: number;
  recentTopics: string[];
}
