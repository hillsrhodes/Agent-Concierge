import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Code2, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  HelpCircle, 
  Laptop,
  MousePointerClick,
  CheckCircle2,
  Info,
  ShieldCheck
} from 'lucide-react';

interface WordPressEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordPressEmbedModal: React.FC<WordPressEmbedModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'script_tag' | 'elementor' | 'wpcode' | 'wordpress_guide'>('script_tag');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const getPublicOrigin = () => {
    if (typeof window === 'undefined') return 'https://ais-pre-u2zxy2syjmcnn4abo2lw6l-380210956811.us-east1.run.app';
    const origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-');
    }
    return origin;
  };

  const currentOrigin = getPublicOrigin();

  const scriptSnippet = `<!-- ============================================================== -->
<!-- WIDGET NATIVO AGENT CONCIERGE (SEM IFRAME - NUNCA DÁ ERRO 403) -->
<!-- Cole no Elementor (bloco HTML), WPCode ou Rodapé do seu site   -->
<!-- ============================================================== -->
<script src="${currentOrigin}/widget.js" defer></script>`;

  const elementorSnippet = `<!-- Bloco HTML para Elementor / Gutenberg -->
<div id="ac-wordpress-native-root">
  <script src="${currentOrigin}/widget.js" defer></script>
</div>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="flex flex-col h-[85vh] w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/70 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-xs">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                Instalar Botão Flutuante no Seu Site
              </h3>
              <p className="text-xs text-zinc-500">
                Código nativo sem iframes. Abre o chat exclusivamente ao clicar e nunca dá erro 403.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-zinc-100 px-6 py-2 bg-zinc-50/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('script_tag')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'script_tag'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            1. Script de 1 Linha (Recomendado)
          </button>

          <button
            onClick={() => setActiveTab('elementor')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'elementor'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            2. Para Elementor (Bloco HTML)
          </button>

          <button
            onClick={() => setActiveTab('wpcode')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wpcode'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            3. Plugin WPCode (Footer)
          </button>

          <button
            onClick={() => setActiveTab('wordpress_guide')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'wordpress_guide'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            4. Passo a Passo WordPress
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: SCRIPT 1 LINE */}
          {activeTab === 'script_tag' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Script Nativo (Sem Iframe)
                  </span>
                  <p className="text-xs text-zinc-600">
                    Insere o botão no canto da tela e gerencia a abertura e as conversas direto na página.
                  </p>
                </div>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copyToClipboard(scriptSnippet, 'script_tag')}
                  className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-sans font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {copiedType === 'script_tag' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar Tag &lt;script&gt;</span>
                    </>
                  )}
                </button>
                <pre className="overflow-x-auto whitespace-pre-wrap">{scriptSnippet}</pre>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-700" />
                  100% Livre de Erro 403:
                </p>
                <p className="text-emerald-800">
                  Substitua o código antigo com iframe por este script nativo. O botão flutuante aparecerá no canto e abrirá a conversa instantaneamente ao clicar.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ELEMENTOR */}
          {activeTab === 'elementor' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Código para Bloco HTML no Elementor
                </span>
                <p className="text-xs text-zinc-600">
                  Arraste um widget HTML no Elementor e cole este trecho:
                </p>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copyToClipboard(elementorSnippet, 'elementor')}
                  className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-sans font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  {copiedType === 'elementor' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
                <pre className="overflow-x-auto whitespace-pre-wrap">{elementorSnippet}</pre>
              </div>
            </div>
          )}

          {/* TAB 3: WPCODE */}
          {activeTab === 'wpcode' && (
            <div className="space-y-4 text-xs text-zinc-700">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                Instalação Global com WPCode
              </span>
              <div className="rounded-xl border border-zinc-200 p-4 space-y-2 bg-white">
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-600 leading-relaxed pl-2">
                  <li>No WordPress, acesse <strong>Code Snippets → Header & Footer</strong>.</li>
                  <li>Cole o script <code>&lt;script src="{currentOrigin}/widget.js" defer&gt;&lt;/script&gt;</code> no campo <strong>Footer</strong>.</li>
                  <li>Clique em <strong>Save Changes</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: WORDPRESS GUIDE */}
          {activeTab === 'wordpress_guide' && (
            <div className="space-y-4 text-xs text-zinc-700">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                Guia Rápido de Instalação
              </span>

              <div className="rounded-xl border border-zinc-200 p-4 space-y-2 bg-white">
                <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white text-[10px]">1</span>
                  <span>No Elementor</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 leading-relaxed pl-2">
                  <li>Abra a página ou o Footer no Elementor.</li>
                  <li>Apague o código anterior do iframe.</li>
                  <li>Cole <code>&lt;script src="{currentOrigin}/widget.js" defer&gt;&lt;/script&gt;</code> no bloco HTML.</li>
                  <li>Clique em <strong>Atualizar</strong>.</li>
                </ol>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/70 px-6 py-3">
          <span className="text-xs text-zinc-500">
            Compatível com WordPress, Elementor, Divi, Gutenberg, Shopify e sites HTML.
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 cursor-pointer"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
