import React from 'react';
import { Shield, MessageSquare, Hotel, User, LogOut, Code2, Globe, KeyRound } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Minimalist Logo */}
        <div 
          onClick={() => setActiveTab('chat')}
          className="flex items-center space-x-3 cursor-pointer select-none"
        >
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

        {/* Center View Switcher Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 border border-zinc-200/80">
          <button
            id="tab-concierge-chat"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
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
            className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'wordpress_preview'
                ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
            title="Ver o ícone flutuante sobre um site WordPress real"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Demo Site WordPress</span>
            <span className="sm:hidden">Site WP</span>
          </button>
        </div>

        {/* Right Section: Admin Access Link & WordPress Code */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* WordPress Embed Code Button */}
          <button
            id="btn-open-embed-modal"
            onClick={onOpenEmbedModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-xs cursor-pointer"
            title="Ver código para inserir no WordPress"
          >
            <Code2 className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden lg:inline">Código WordPress</span>
            <span className="lg:hidden">WP</span>
          </button>

          {/* Dedicated Admin Panel Link */}
          <button
            id="btn-nav-admin-panel"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer border ${
              activeTab === 'admin'
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-800'
            }`}
            title="Acessar Painel de Controle, Base de Conhecimento e Prompt"
          >
            {isAdminAuthenticated ? (
              <>
                <Shield className="h-3.5 w-3.5 text-emerald-400" />
                <span>Painel Admin</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </>
            ) : (
              <>
                <KeyRound className="h-3.5 w-3.5 text-zinc-300" />
                <span>Área Admin</span>
              </>
            )}
          </button>

          {/* Admin Logout button if logged in */}
          {isAdminAuthenticated && activeTab === 'admin' && (
            <button
              onClick={onAdminLogout}
              className="flex items-center space-x-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs text-zinc-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors cursor-pointer"
              title="Encerrar Sessão Admin"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>
          )}

          {/* Guest Profile button in Chat mode */}
          {activeTab === 'chat' && (
            <button
              onClick={onEditGuestInfo}
              className="hidden xl:flex items-center space-x-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Alterar perfil do hóspede"
            >
              <User className="h-3.5 w-3.5 text-zinc-400" />
              <span className="font-semibold text-zinc-800">{guestInfo.name}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
