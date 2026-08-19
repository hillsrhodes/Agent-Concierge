import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  Play, 
  Sliders, 
  Check, 
  AlertCircle, 
  Send
} from 'lucide-react';
import { AgentConfig, ConciergeTone } from '../../types';
import { api } from '../../services/api';

export const AgentPromptConfig: React.FC = () => {
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Playground / Live Testing State
  const [testPrompt, setTestPrompt] = useState('Gostaria de uma recomendação de jantar romântico para hoje à noite.');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAgentConfig();
      setConfig(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const updated = await api.updateAgentConfig(config);
      setConfig(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao salvar alterações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Tem certeza que deseja restaurar as instruções padrão? Suas edições atuais serão substituídas.')) {
      return;
    }
    setIsSaving(true);
    try {
      const reset = await api.resetAgentConfig();
      setConfig(reset);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao redefinir');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunTest = async () => {
    if (!testPrompt.trim() || isTesting) return;
    setIsTesting(true);
    setTestResponse(null);

    try {
      const res = await api.sendMessage({
        message: testPrompt,
        guestInfo: { name: 'Hóspede Teste', room: 'Suíte 501' },
      });
      setTestResponse(res.reply);
    } catch (err: any) {
      setTestResponse(`Erro no teste: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-zinc-500">
        <Sparkles className="h-5 w-5 text-zinc-900 animate-spin mr-2" />
        <span>Carregando configurações do agente...</span>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        Não foi possível carregar as configurações do agente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header with Save actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            Configuração do Agente & System Prompt
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Defina a persona, etiqueta de atendimento e diretrizes para o modelo Gemini.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            title="Restaurar padrão"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restaurar</span>
          </button>

          <button
            id="btn-save-agent-config"
            onClick={handleSave}
            disabled={isSaving}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span>Salvando...</span>
            ) : saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Configurações atualizadas e injetadas no Gemini em tempo real!</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left 2 Columns: System Prompt Editor */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                  System Prompt do Concierge
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Estas instruções governam o comportamento e o tom da IA
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {config.systemPrompt.length} caracteres
              </span>
            </div>

            <textarea
              id="system-prompt-textarea"
              rows={14}
              value={config.systemPrompt}
              onChange={e => setConfig({ ...config, systemPrompt: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 font-mono text-xs text-zinc-800 leading-relaxed placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Digite o system prompt do concierge..."
            />

            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 text-[11px] text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-800">Diretrizes de Prompting:</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-500">
                <li>Estabeleça o nível de cortesia e regras de atendimento.</li>
                <li>Instrua como estruturar recomendações e reservas.</li>
                <li>A Base de Conhecimento ativa é indexada automaticamente em cada consulta.</li>
              </ul>
            </div>

          </div>

          {/* Welcome Message Editor */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Mensagem de Boas-Vindas Inicial
            </h3>
            <p className="text-xs text-zinc-500">
              Primeira mensagem apresentada ao abrir a conversa
            </p>
            <input
              type="text"
              value={config.welcomeMessage}
              onChange={e => setConfig({ ...config, welcomeMessage: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2.5 text-xs text-zinc-800 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

        </div>

        {/* Right Column: Parameters & Live Prompt Tester */}
        <div className="space-y-4">
          
          {/* Agent Parameters */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" />
              Parâmetros do Modelo
            </h3>

            {/* Hotel Name */}
            <div>
              <label className="text-xs font-semibold text-zinc-700">Nome do Estabelecimento</label>
              <input
                type="text"
                value={config.hotelName}
                onChange={e => setConfig({ ...config, hotelName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-800 focus:border-zinc-900 focus:outline-none"
              />
            </div>

            {/* Persona Tone Default */}
            <div>
              <label className="text-xs font-semibold text-zinc-700">Tom de Atendimento Padrão</label>
              <select
                value={config.tone}
                onChange={e => setConfig({ ...config, tone: e.target.value as ConciergeTone })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-800 focus:border-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="luxury_classic">Clássico & Formal</option>
                <option value="modern_executive">Executivo & Ágil</option>
                <option value="sommelier">Sommelier</option>
                <option value="resort_leisure">Resort & Relaxamento</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700">Temperatura (Criatividade)</span>
                <span className="font-mono text-zinc-900 font-bold">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.temperature}
                onChange={e => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="mt-2 w-full accent-zinc-900"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
                <span>0.0 (Fiel)</span>
                <span>0.7 (Recomendado)</span>
                <span>1.0 (Criativo)</span>
              </div>
            </div>

            {/* Knowledge Base Toggle */}
            <div className="pt-3 border-t border-zinc-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-zinc-800">Injetar Base de Conhecimento</span>
                  <p className="text-[10px] text-zinc-400">Anexa dados cadastrados ao contexto do chat</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableKnowledgeBase}
                  onChange={e => setConfig({ ...config, enableKnowledgeBase: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300 accent-zinc-900 cursor-pointer"
                />
              </label>
            </div>

          </div>

          {/* Live Prompt Tester / Playground */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Play className="h-3.5 w-3.5" />
              Testador ao Vivo
            </h3>
            <p className="text-xs text-zinc-500">
              Envie uma pergunta para testar a resposta do modelo com os parâmetros configurados.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
                placeholder="Digite uma pergunta de teste..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-800 focus:border-zinc-900 focus:outline-none"
              />

              <button
                onClick={handleRunTest}
                disabled={isTesting || !testPrompt.trim()}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 px-3 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Executar Teste</span>
                  </>
                )}
              </button>
            </div>

            {testResponse && (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3.5 text-xs leading-relaxed text-zinc-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Resposta do Gemini:
                </span>
                <div className="whitespace-pre-wrap">{testResponse}</div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
