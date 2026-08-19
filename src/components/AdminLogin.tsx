import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, KeyRound, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface AdminLoginProps {
  onSuccess: (token: string) => void;
  onBackToChat: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToChat }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Por favor, informe a senha de administrador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.adminLogin(password);
      if (res.success && res.token) {
        onSuccess(res.token);
      }
    } catch (err: any) {
      setError(err.message || 'Senha incorreta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setPassword('concierge2025');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50/50 p-4">
      
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-zinc-900">
            Painel Administrativo
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Gerenciamento de Prompt, Base de Conhecimento e Auditoria de Conversas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-zinc-700">
              Senha de Acesso
            </label>
            <div className="relative mt-1.5 rounded-xl border border-zinc-200 bg-white focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite a senha de administrador"
                className="w-full bg-transparent py-2.5 pl-9 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            id="btn-submit-admin-login"
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Demo Hint & Quick Fill */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-2.5 border border-zinc-200">
              <div className="flex items-center space-x-2">
                <KeyRound className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-[11px] text-zinc-600">
                  Senha Padrão: <strong className="font-mono text-zinc-900">concierge2025</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="rounded-lg bg-white border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-50 shadow-xs transition-colors cursor-pointer"
              >
                Preencher
              </button>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToChat}
              className="text-xs text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              ← Voltar ao Chat do Concierge
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
