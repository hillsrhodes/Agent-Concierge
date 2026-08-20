export type ConciergeTone = 'luxury_classic' | 'modern_executive' | 'sommelier' | 'resort_leisure';

export type KnowledgeCategory = 
  | 'developments' 
  | 'methodology' 
  | 'architecture' 
  | 'legacy' 
  | 'land_acquisition' 
  | 'consultations' 
  | 'exclusive_services' 
  | 'general'
  | 'gastronomy' 
  | 'suites' 
  | 'spa' 
  | 'transport' 
  | 'rules_hours' 
  | 'events';

export interface ServiceAction {
  id: string;
  type: 'consultation' | 'site_visit' | 'brochure' | 'design_review' | 'reservation' | 'experience' | 'info' | 'room_service' | 'spa' | 'transfer';
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
