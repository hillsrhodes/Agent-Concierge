import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Save, 
  RotateCcw, 
  Play, 
  Sliders, 
  Check, 
  AlertCircle, 
  Send,
  RefreshCw
} from 'lucide-react';
import { AgentConfig, ConciergeTone } from '../../types';
import { api, DEFAULT_FALLBACK_AGENT_CONFIG } from '../../services/api';

export const AgentPromptConfig: React.FC = () => {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_FALLBACK_AGENT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Playground / Live Testing State
  const [testPrompt, setTestPrompt] = useState('Could you share details on the upcoming Egan Crest development and your 5-Step Design & Build methodology?');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getAgentConfig();
      if (data) {
        setConfig(data);
      }
    } catch (err: any) {
      console.warn('Using fallback configuration', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      const updated = await api.updateAgentConfig(config);
      setConfig(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to restore the default English prompt and settings? Current customizations will be replaced.')) {
      return;
    }
    setIsSaving(true);
    try {
      const reset = await api.resetAgentConfig();
      setConfig(reset);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setConfig(DEFAULT_FALLBACK_AGENT_CONFIG);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
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
        guestInfo: { name: 'VIP Test Guest', room: 'Suite 702' },
      });
      setTestResponse(res.reply);
    } catch (err: any) {
      setTestResponse(`Test Error: ${err.message}`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Save actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-zinc-900">
            Agent System Prompt & Instructions
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Configure the AI Concierge personality, English language etiquette, and Gemini parameters in real time.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={loadConfig}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            title="Reload from server"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
            title="Restore default English prompt"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            id="btn-save-agent-config"
            onClick={handleSave}
            disabled={isSaving}
            className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <span>Saving...</span>
            ) : saveSuccess ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
          <Check className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>System prompt and parameters updated and applied to the Gemini AI in real time!</span>
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
                  Concierge System Prompt (English)
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  These instructions govern the AI character, luxury etiquette, and tone
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                {config.systemPrompt.length} characters
              </span>
            </div>

            <textarea
              id="system-prompt-textarea"
              rows={14}
              value={config.systemPrompt}
              onChange={e => setConfig({ ...config, systemPrompt: e.target.value })}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 font-mono text-xs text-zinc-800 leading-relaxed placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              placeholder="Enter system prompt for concierge..."
            />

            <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3.5 text-[11px] text-zinc-600 space-y-1">
              <p className="font-semibold text-zinc-800">Prompting Guidelines:</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-500">
                <li>Enforce high-touch luxury real estate demeanor, courtesy, and discreet authority.</li>
                <li>Highlight Harmony Homes' 40-year legacy under founder Jim Rhodes (1,000+ homes).</li>
                <li>Guide clients through the 5-Step Design & Build approach and Egan Crest / SkyFire Estate.</li>
                <li>Gently qualify timelines and offer private consultations with the principal leadership team.</li>
              </ul>
            </div>

          </div>

          {/* Welcome Message Editor */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Default Initial Welcome Message
            </h3>
            <p className="text-xs text-zinc-500">
              First greeting displayed to the guest upon opening the chat
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
              Model Parameters
            </h3>

            {/* Hotel / Brand Name */}
            <div>
              <label className="text-xs font-semibold text-zinc-700">Brand / Company Name</label>
              <input
                type="text"
                value={config.hotelName}
                onChange={e => setConfig({ ...config, hotelName: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-800 focus:border-zinc-900 focus:outline-none"
              />
            </div>

            {/* Persona Tone Default */}
            <div>
              <label className="text-xs font-semibold text-zinc-700">Default Service Tone</label>
              <select
                value={config.tone}
                onChange={e => setConfig({ ...config, tone: e.target.value as ConciergeTone })}
                className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-800 focus:border-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="luxury_classic">Classic & Formal</option>
                <option value="modern_executive">Executive & Concise</option>
                <option value="sommelier">Sommelier</option>
                <option value="resort_leisure">Resort & Relaxation</option>
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700">Temperature (Creativity)</span>
                <span className="font-mono text-zinc-900 font-bold">{config.temperature}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={config.temperature}
                onChange={e => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="mt-2 w-full accent-zinc-900 cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-zinc-400">
                <span>0.0 (Strict)</span>
                <span>0.7 (Balanced)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            {/* Knowledge Base Toggle */}
            <div className="pt-3 border-t border-zinc-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-zinc-800">Ground with Knowledge Base</span>
                  <p className="text-[10px] text-zinc-400">Injects verified hotel amenities into AI context</p>
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
              Live English Playground
            </h3>
            <p className="text-xs text-zinc-500">
              Send a test message to preview the concierge's English response with real grounding.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={testPrompt}
                onChange={e => setTestPrompt(e.target.value)}
                placeholder="Type a test guest inquiry..."
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
                    <span>Curating Response...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Run Live Test</span>
                  </>
                )}
              </button>
            </div>

            {testResponse && (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-3.5 text-xs leading-relaxed text-zinc-700">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Gemini Response:
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
