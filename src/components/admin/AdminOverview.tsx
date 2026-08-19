import React from 'react';
import { 
  MessageSquare, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Bot
} from 'lucide-react';
import { AdminStats } from '../../types';

interface AdminOverviewProps {
  stats: AdminStats | null;
  onNavigateTab: (tab: 'prompt' | 'knowledge' | 'logs') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ stats, onNavigateTab }) => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner (Clean Minimalism) */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center text-white">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                Visão Geral do Concierge
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-xl">
              Gerencie a inteligência artificial, edite o prompt do sistema em tempo real, gerencie a base de conhecimento e audite o histórico de atendimentos.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-full text-xs font-medium text-zinc-700 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Gemini 3.7 Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
          Métricas de Desempenho
        </h2>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Conversations */}
        <div 
          onClick={() => onNavigateTab('logs')}
          className="group cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Sessões Atendidas</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-900">
              {stats?.totalConversations ?? 0}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-900">
              Ver logs <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            {stats?.totalMessages ?? 0} mensagens trocadas
          </p>
        </div>

        {/* Knowledge Base Items */}
        <div 
          onClick={() => onNavigateTab('knowledge')}
          className="group cursor-pointer rounded-xl border border-zinc-200 bg-white p-5 hover:border-zinc-400 transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Base de Conhecimento</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-900">
              {stats?.knowledgeItemsCount ?? 0}
            </span>
            <span className="flex items-center text-[11px] font-semibold text-zinc-600 group-hover:text-zinc-900">
              Gerenciar <ArrowUpRight className="ml-0.5 h-3 w-3" />
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            {stats?.activeKnowledgeCount ?? 0} tópicos ativos para a IA
          </p>
        </div>

        {/* Satisfaction */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Satisfação / Precisão</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-900">
              {stats?.satisfactionRate ?? 98.6}%
            </span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Excelente
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            Avaliações com sentimento positivo
          </p>
        </div>

        {/* Avg Response Latency */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Tempo Médio de Resposta</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-800">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-zinc-900">
              ~{stats?.avgResponseTimeMs ?? 840}ms
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600">
              Tempo Real
            </span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            Processamento via Gemini SDK
          </p>
        </div>

      </div>

      {/* Two Column Section: Category Distribution & Quick Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Knowledge Distribution */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Distribuição da Base de Conhecimento
              </h3>
              <p className="text-xs text-zinc-500">
                Informações catalogadas para orientar o concierge
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('knowledge')}
              className="text-xs text-zinc-900 hover:text-black font-semibold cursor-pointer"
            >
              Ver Tudo →
            </button>
          </div>

          <div className="space-y-3.5">
            {stats?.topCategories && stats.topCategories.length > 0 ? (
              stats.topCategories.map((cat, idx) => {
                const total = stats.knowledgeItemsCount || 1;
                const percent = Math.round((cat.count / total) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-700">{cat.label}</span>
                      <span className="text-zinc-400 font-mono text-[11px]">{cat.count} itens ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-zinc-900 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-400">Nenhuma categoria registrada.</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-900 mb-3">
              Ações Rápidas
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('prompt')}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-left hover:border-zinc-400 hover:bg-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-4 w-4 text-zinc-800" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Ajustar System Prompt</p>
                    <p className="text-[11px] text-zinc-500">Persona, tom e regras de etiqueta</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={() => onNavigateTab('knowledge')}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-left hover:border-zinc-400 hover:bg-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <Database className="h-4 w-4 text-zinc-800" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Novo Item na Base</p>
                    <p className="text-[11px] text-zinc-500">Adicionar cardápio, horários ou regras</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </button>

              <button
                onClick={() => onNavigateTab('logs')}
                className="w-full flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-left hover:border-zinc-400 hover:bg-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-zinc-800" />
                  <div>
                    <p className="text-xs font-semibold text-zinc-900">Auditar Conversas</p>
                    <p className="text-[11px] text-zinc-500">Ver solicitações dos hóspedes</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
