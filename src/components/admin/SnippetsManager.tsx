import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  FileCode, 
  Terminal, 
  HelpCircle, 
  Laptop,
  CheckCircle2,
  MousePointerClick,
  Info,
  ShieldCheck
} from 'lucide-react';

export const SnippetsManager: React.FC = () => {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'script_tag' | 'html_embed' | 'wordpress_plugin' | 'functions_php'>('script_tag');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Use public shared URL to avoid 403 Forbidden
  const getPublicOrigin = () => {
    if (typeof window === 'undefined') return 'https://ais-pre-u2zxy2syjmcnn4abo2lw6l-380210956811.us-east1.run.app';
    const origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-');
    }
    return origin;
  };

  const currentOrigin = getPublicOrigin();

  // 1. Script Tag - 100% Native (No Iframe, No 403 error)
  const scriptSnippet = `<!-- ============================================================== -->
<!-- WIDGET NATIVO AGENT CONCIERGE (SEM IFRAME - NUNCA DÁ ERRO 403) -->
<!-- Cole no Elementor (bloco HTML), WPCode ou Rodapé do seu site   -->
<!-- ============================================================== -->
<script src="${currentOrigin}/widget.js" defer></script>`;

  // 2. Elementor / Gutenberg direct HTML embed (Native script + fallback trigger)
  const htmlEmbedSnippet = `<!-- ============================================================== -->
<!-- BOTÃO FLUTUANTE NATIVO (ELEMENTOR / DIVI / GUTENBERG)         -->
<!-- ============================================================== -->
<div id="ac-wordpress-native-root">
  <script src="${currentOrigin}/widget.js" defer></script>
</div>`;

  // 3. WPCode / Header & Footer Guide
  const wpCodeGuide = `1. No painel do seu WordPress, vá em Plugins > Adicionar Novo.
2. Busque por "WPCode - Insert Headers and Footers" e ative-o.
3. Acesse o menu lateral: Code Snippets > Header & Footer.
4. Na caixa "Footer", cole exatamente:
   <script src="${currentOrigin}/widget.js" defer></script>
5. Clique em "Save Changes". Pronto! O botão flutuante aparecerá no canto de todo o site.`;

  // 4. PHP functions.php
  const functionPhpSnippet = `/**
 * Adiciona o Agent Concierge nativo no rodapé do WordPress
 * Cole no final do arquivo functions.php do seu tema
 */
function enqueue_agent_concierge_widget() {
    wp_enqueue_script(
        'agent-concierge-native',
        '${currentOrigin}/widget.js',
        array(),
        '2.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_agent_concierge_widget');`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center text-white">
                <Code2 className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                Códigos de Integração (Widget 100% Nativo)
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-2xl">
              Código nativo em JavaScript puro (sem iframes). Carrega o botão flutuante e a janela de chat com zero bloqueios ou erros 403.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 mr-1.5" />
              100% Nativo (Sem Iframe / Sem Erro 403)
            </span>
          </div>
        </div>
      </div>

      {/* Snippet Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSnippetTab('script_tag')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'script_tag'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <MousePointerClick className="h-3.5 w-3.5" />
          <span>1. Script Nativo (Recomendado - 1 Linha)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSnippetTab('html_embed')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'html_embed'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <Laptop className="h-3.5 w-3.5" />
          <span>2. Bloco HTML para Elementor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSnippetTab('wordpress_plugin')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'wordpress_plugin'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>3. Guia Plugin WPCode</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSnippetTab('functions_php')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'functions_php'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>4. WordPress (functions.php)</span>
        </button>
      </div>

      {/* Snippet Content Views */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left 2 Cols: The Code Snippet */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* TAB 1: SCRIPT TAG */}
          {activeSnippetTab === 'script_tag' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    <span>Script Nativo de 1 Linha</span>
                    <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">Sem Iframes</span>
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Insere o botão flutuante e a janela de chat diretamente no DOM do seu site.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(scriptSnippet, 'script_tag')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'script_tag' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Tag &lt;script&gt;</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">{scriptSnippet}</pre>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  Por que este código elimina o erro 403:
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  O erro 403 ocorria porque navegadores bloqueavam o carregamento de quadros <code>&lt;iframe&gt;</code> externos. Este novo script renderiza a janela nativamente no próprio código da sua página, funcionando 100% livre de bloqueios.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: HTML EMBED */}
          {activeSnippetTab === 'html_embed' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Bloco HTML para Elementor / Divi / Gutenberg
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Cole em um elemento "HTML" ou "Custom HTML" em qualquer página ou no rodapé do Elementor.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(htmlEmbedSnippet, 'html_embed')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'html_embed' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">{htmlEmbedSnippet}</pre>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 space-y-2">
                <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Instruções para o Elementor:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 pl-1">
                  <li>No Elementor, edite a página ou o Modelo de Rodapé (Footer).</li>
                  <li>Apague o código antigo do bloco HTML.</li>
                  <li>Cole o código acima e clique em <strong>Atualizar</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: WPCODE GUIDE */}
          {activeSnippetTab === 'wordpress_plugin' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Instalação Global no WordPress (Plugin WPCode)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Método mais simples para carregar o botão em todas as páginas do site automaticamente.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(scriptSnippet, 'wpcode')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'wpcode' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Tag do Script</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 font-mono text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed">
                {wpCodeGuide}
              </div>
            </div>
          )}

          {/* TAB 4: WORDPRESS PHP */}
          {activeSnippetTab === 'functions_php' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Gancho PHP no functions.php
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Para desenvolvedores que utilizam Tema Filho (Child Theme).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(functionPhpSnippet, 'php')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'php' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar PHP</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">{functionPhpSnippet}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Quick Tips & Specs */}
        <div className="space-y-4">
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" />
              Características do Widget Nativo
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Arquitetura:</span>
                <span className="font-bold text-emerald-600">DOM Nativo (Zero Iframe)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Estado Inicial:</span>
                <span className="font-semibold text-zinc-800">Apenas Botão Flutuante</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Abertura:</span>
                <span className="font-semibold text-zinc-800">Somente ao Clicar</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Voz e Som:</span>
                <span className="font-semibold text-zinc-800">Síntese de Áudio Integrada</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Compatibilidade:</span>
                <span className="font-semibold text-emerald-600">100% WordPress / Elementor</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
