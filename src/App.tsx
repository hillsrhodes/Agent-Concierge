import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ConciergeChat } from './components/ConciergeChat';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWidget } from './components/FloatingWidget';
import { WordPressEmbedModal } from './components/WordPressEmbedModal';
import { WordPressSimulator } from './components/WordPressSimulator';
import { User, X, Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'admin' | 'wordpress_preview'>('chat');
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('agent_concierge_admin_token') : null;
  });

  const [guestInfo, setGuestInfo] = useState<{ name: string; room: string }>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('agent_concierge_guest') : null;
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { name: 'Sr. Henrique Albuquerque', room: 'Suíte Real 702' };
  });

  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestInfo.name);
  const [tempGuestRoom, setTempGuestRoom] = useState(guestInfo.room);

  // Sync hash routing if user enters via /#admin or /#chat
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setActiveTab('admin');
      } else if (hash === 'chat') {
        setActiveTab('chat');
      } else if (hash === 'wordpress_preview') {
        setActiveTab('wordpress_preview');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: 'chat' | 'admin' | 'wordpress_preview') => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('agent_concierge_admin_token', token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('agent_concierge_admin_token');
    setActiveTab('chat');
    window.location.hash = 'chat';
  };

  const handleSaveGuestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: tempGuestName.trim() || 'Hóspede Estimado',
      room: tempGuestRoom.trim() || 'Suíte Privativa',
    };
    setGuestInfo(updated);
    localStorage.setItem('agent_concierge_guest', JSON.stringify(updated));
    setIsGuestModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* Top Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isAdminAuthenticated={Boolean(adminToken)}
        onAdminLogout={handleAdminLogout}
        guestInfo={guestInfo}
        onEditGuestInfo={() => {
          setTempGuestName(guestInfo.name);
          setTempGuestRoom(guestInfo.room);
          setIsGuestModalOpen(true);
        }}
        onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="w-full">
        {activeTab === 'chat' && (
          <ConciergeChat
            guestInfo={guestInfo}
            onOpenAdmin={() => handleTabChange('admin')}
          />
        )}

        {activeTab === 'wordpress_preview' && (
          <WordPressSimulator
            onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
            onExitPreview={() => handleTabChange('chat')}
          />
        )}

        {activeTab === 'admin' && (
          adminToken ? (
            <AdminDashboard
              onLogout={handleAdminLogout}
              onGoToChat={() => handleTabChange('chat')}
            />
          ) : (
            <AdminLogin
              onSuccess={handleAdminLoginSuccess}
              onBackToChat={() => handleTabChange('chat')}
            />
          )
        )}
      </main>

      {/* Floating Action Button (Widget Launcher no canto da tela para WordPress) */}
      {activeTab === 'wordpress_preview' && (
        <FloatingWidget
          guestInfo={guestInfo}
          onOpenEmbedModal={() => setIsEmbedModalOpen(true)}
          onOpenFullApp={() => handleTabChange('chat')}
        />
      )}

      {/* WordPress Embed Modal */}
      <WordPressEmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
      />

      {/* Guest Profile Edit Modal */}
      {isGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-zinc-700" />
                <h3 className="text-sm font-bold text-zinc-900">
                  Perfil do Hóspede
                </h3>
              </div>
              <button
                onClick={() => setIsGuestModalOpen(false)}
                className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGuestInfo} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={tempGuestName}
                  onChange={e => setTempGuestName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700">
                  Acomodação / Suíte
                </label>
                <input
                  type="text"
                  required
                  value={tempGuestRoom}
                  onChange={e => setTempGuestRoom(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-zinc-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsGuestModalOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Salvar</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
