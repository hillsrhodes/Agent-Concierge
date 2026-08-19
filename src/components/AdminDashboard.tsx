import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Database, 
  MessageSquare, 
  LogOut, 
  MessageCircle, 
  ChevronRight,
  Menu,
  X,
  Bot
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

type AdminTab = 'overview' | 'prompt' | 'knowledge' | 'logs';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onGoToChat }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

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

  const menuItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'overview', label: 'Visão Geral & Métricas', icon: BarChart3 },
    { id: 'prompt', label: 'Configuração do Agente', icon: Sparkles },
    { id: 'knowledge', label: 'Base de Conhecimento', icon: Database, badge: stats?.knowledgeItemsCount },
    { id: 'logs', label: 'Logs de Conversa', icon: MessageSquare, badge: stats?.totalConversations },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white text-zinc-900">
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsSidebarMobileOpen(!isSidebarMobileOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg"
        >
          {isSidebarMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation (Clean Minimalism layout) */}
      <aside
        className={`fixed inset-y-16 left-0 z-30 w-64 transform border-r border-zinc-100 bg-zinc-50/50 p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between">
          
          <div className="space-y-6">
            {/* Admin Badge */}
            <div className="flex items-center space-x-3 px-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">Painel de Gestão</p>
                <p className="text-[10px] text-zinc-400">Agent Concierge Control</p>
              </div>
            </div>

            {/* Menu List */}
            <nav className="space-y-1">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`admin-nav-${item.id}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarMobileOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-white border border-zinc-200 text-zinc-900 shadow-xs font-semibold'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                          isActive
                            ? 'bg-zinc-100 text-zinc-900 font-bold'
                            : 'bg-zinc-200/60 text-zinc-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-zinc-200 pt-5 space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700">
                AD
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900">Admin Master</div>
                <div className="text-[10px] text-zinc-400">Gerência de Hospitalidade</div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <button
                onClick={onGoToChat}
                className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white p-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Voltar ao Chat</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
              </button>

              <button
                onClick={onLogout}
                className="flex w-full items-center space-x-2 rounded-lg p-2 text-xs text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sair do Painel Admin</span>
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
        <div className="mx-auto max-w-6xl">
          {activeTab === 'overview' && (
            <AdminOverview
              stats={stats}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'prompt' && <AgentPromptConfig />}

          {activeTab === 'knowledge' && <KnowledgeBaseManager />}

          {activeTab === 'logs' && <ConversationLogsViewer />}
        </div>
      </main>

    </div>
  );
};
