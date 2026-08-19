import React from 'react';
import { Shield, MessageSquare, Hotel, User, LogOut, Code2, Globe } from 'lucide-react';

interface NavigationProps {
  activeTab: 'chat' | 'admin' | 'wordpress_preview';
  setActiveTab: (tab: 'chat' | 'admin' | 'wordpress_preview') => void;
  isAdminAuthenticated: boolean;
  onAdminLogout: () => void;
  guestInfo: { name: string; room: string };
  onEditGuestInfo: () => void;
  onOpenEmbedModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  isAdminAuthenticated,
  onAdminLogout,
  guestInfo,
  onEditGuestInfo,
  onOpenEmbedModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Minimalist Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 shadow-xs">
            <div className="h-3 w-3 rounded-full bg-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-zinc-900">
                Agent Concierge
              </span>
              <span className="inline-flex items-center rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 tracking-wide uppercase">
                Grand Lumière
              </span>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1 font-normal">
              <Hotel className="h-3 w-3 text-zinc-400" /> Digital Concierge & Hospitality AI
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 border border-zinc-200">
          <button
            id="tab-concierge-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-2.5 sm:px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Chat do Concierge</span>
            <span className="sm:hidden">Chat</span>
          </button>

          <button
            id="tab-wordpress-preview"
            onClick={() => setActiveTab('wordpress_preview')}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-2.5 sm:px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'wordpress_preview'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Ver como fica o ícone flutuante em um site WordPress"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Demo Site WordPress</span>
            <span className="sm:hidden">Site WP</span>
          </button>

          <button
            id="tab-admin-dashboard"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-2.5 sm:px-3.5 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-zinc-900 font-semibold shadow-xs border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Painel Admin</span>
            <span className="sm:hidden">Admin</span>
            {isAdminAuthenticated && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>

        {/* Right Section: WordPress Code Button & Guest Info */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* WordPress Code Button */}
          <button
            id="btn-open-embed-modal"
            onClick={onOpenEmbedModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-xs"
            title="Copiar código para o WordPress"
          >
            <Code2 className="h-3.5 w-3.5 text-zinc-600" />
            <span className="hidden md:inline">Embed no WordPress</span>
            <span className="md:hidden">WP</span>
          </button>

          {activeTab !== 'admin' ? (
            <button
              onClick={onEditGuestInfo}
              className="hidden lg:flex items-center space-x-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
              title="Alterar perfil do hóspede"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <User className="h-3.5 w-3.5 text-zinc-500" />
              <span className="font-semibold text-zinc-800">{guestInfo.name}</span>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500">{guestInfo.room}</span>
            </button>
          ) : (
            isAdminAuthenticated && (
              <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
                  Admin Ativo
                </span>
                <button
                  onClick={onAdminLogout}
                  className="flex items-center space-x-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 hover:text-rose-600 transition-colors"
                  title="Encerrar Sessão Admin"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Sair</span>
                </button>
              </div>
            )
          )}
        </div>

      </div>
    </header>
  );
};
