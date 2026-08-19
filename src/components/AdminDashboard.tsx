import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Database, 
  MessageSquare, 
  LogOut, 
  MessageCircle, 
  ChevronRight,
  Bot,
  Sliders
} from 'lucide-react';
import { AdminOverview } from './admin/AdminOverview';
import { AgentPromptConfig } from './admin/AgentPromptConfig';
import { KnowledgeBaseManager } from './admin/KnowledgeBaseManager';
import { ConversationLogsViewer } from './admin/ConversationLogsViewer';
import { AdminStats } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  onLogout: () => void;
  onGoToChat: () => void;
}

export type AdminTab = 'overview' | 'prompt' | 'knowledge' | 'logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onGoToChat }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.includes('knowledge') || hash.includes('knowledge-base')) return 'knowledge';
      if (hash.includes('prompt') || hash.includes('config') || hash.includes('agent')) return 'prompt';
      if (hash.includes('logs') || hash.includes('conversations')) return 'logs';
    }
    return 'overview';
  });

  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadStats();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = `admin/${tab}`;
    }
  };

  const menuItems: { 
    id: AdminTab; 
    label: string; 
    subLabel: string;
    icon: React.ElementType; 
    badge?: string | number;
  }[] = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      subLabel: 'Visão Geral & Métricas', 
      icon: BarChart3 
    },
    { 
      id: 'knowledge', 
      label: 'Knowledge Base', 
      subLabel: 'Base de Conhecimento', 
      icon: Database, 
      badge: stats?.knowledgeItemsCount ?? 8
    },
    { 
      id: 'prompt', 
      label: 'Agent Config', 
      subLabel: 'Configuração do Agente & Prompt', 
      icon: Sparkles 
    },
    { 
      id: 'logs', 
      label: 'Conversation Logs', 
      subLabel: 'Histórico & Auditoria de Atendimentos', 
      icon: MessageSquare, 
      badge: stats?.totalConversations ?? 3
    },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-zinc-50/40 text-zinc-900">
      
      {/* Top Secondary Navigation Bar (Always Visible on all screen sizes) */}
      <div className="sticky top-16 z-30 w-full border-b border-zinc-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 overflow-x-auto">
          
          {/* Tabs Container */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`admin-tab-${item.id}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleTabSelect(item.id);
                  }}
                  className={`flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900'
                      : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 border border-zinc-200/60'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono leading-none ${
                          isActive
                            ? 'bg-white/20 text-white font-bold'
                            : 'bg-zinc-200 text-zinc-700 font-semibold'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Back to Chat button */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-zinc-200">
            <button
              type="button"
              onClick={onGoToChat}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <MessageCircle className="h-3.5 w-3.5 text-zinc-500" />
              <span>Abrir Chat</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Admin Content Container */}
      <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
        
        {/* Active Tab Subtitle Info Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Painel Administrativo
            </span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              {menuItems.find(m => m.id === activeTab)?.label}
              <span className="text-zinc-400 font-normal text-sm ml-2">
                — {menuItems.find(m => m.id === activeTab)?.subLabel}
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onGoToChat}
              className="sm:hidden flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-700"
            >
              <MessageCircle className="h-3 w-3" />
              <span>Chat</span>
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="h-3 w-3" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Tab Views */}
        <div className="transition-opacity duration-200">
          {activeTab === 'overview' && (
            <AdminOverview
              stats={stats}
              onNavigateTab={(tab) => handleTabSelect(tab)}
            />
          )}

          {activeTab === 'knowledge' && <KnowledgeBaseManager />}

          {activeTab === 'prompt' && <AgentPromptConfig />}

          {activeTab === 'logs' && <ConversationLogsViewer />}
        </div>

      </div>

    </div>
  );
};
