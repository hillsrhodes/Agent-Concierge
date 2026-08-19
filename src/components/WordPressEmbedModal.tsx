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
  Laptop
} from 'lucide-react';

interface WordPressEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordPressEmbedModal: React.FC<WordPressEmbedModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'script' | 'iframe' | 'wordpress_guide'>('script');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://meusite.com';

  const scriptSnippet = `<!-- Widget Flutuante Agent Concierge para WordPress -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${currentOrigin}/';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '620px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.borderRadius = '20px';
    iframe.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
    iframe.allow = 'microphone';
    document.body.appendChild(iframe);
  })();
</script>`;

  const iframeSnippet = `<!-- Iframe incorporado para páginas específicas ou Elementor / Gutenberg -->
<iframe 
  src="${currentOrigin}/" 
  width="100%" 
  height="700px" 
  style="border: 1px solid #e4e4e7; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);"
  allow="microphone"
></iframe>`;

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
                Como Inserir o Ícone Flutuante no WordPress
              </h3>
              <p className="text-xs text-zinc-500">
                Instruções e código pronto para colar no seu site WordPress (Elementor, Divi, WPCode ou tema)
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
        <div className="flex items-center gap-2 border-b border-zinc-100 px-6 py-2 bg-zinc-50/30">
          <button
            onClick={() => setActiveTab('script')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'script'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            1. Widget Flutuante (Script no Rodapé)
          </button>

          <button
            onClick={() => setActiveTab('iframe')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'iframe'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            2. Iframe para Página ou Bloco
          </button>

          <button
            onClick={() => setActiveTab('wordpress_guide')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'wordpress_guide'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            3. Passo a Passo no WordPress
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'script' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Código do Widget Flutuante para o Rodapé
                </span>
                <p className="text-xs text-zinc-600">
                  Cole este trecho de código no rodapé (Footer) do seu WordPress usando o plugin <strong>WPCode</strong> ou nas opções do seu tema (ex: Astra, Divi, Elementor Pro).
                </p>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copyToClipboard(scriptSnippet, 'script')}
                  className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-sans font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  {copiedType === 'script' ? (
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
                <pre className="overflow-x-auto whitespace-pre-wrap">{scriptSnippet}</pre>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 space-y-2">
                <p className="font-bold text-zinc-900">O que este código faz?</p>
                <p>
                  Ele injeta o ícone flutuante do <strong>Agent Concierge</strong> no canto inferior direito de todas as páginas do seu site WordPress, permitindo que os visitantes conversem diretamente com a IA.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'iframe' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                  Código Iframe para Páginas e Construtores Visuais
                </span>
                <p className="text-xs text-zinc-600">
                  Ideal se você deseja colocar o chat incorporado no meio de uma página de "Contato", "Atendimento VIP" ou "Concierge" usando o bloco HTML do WordPress, Elementor ou Divi.
                </p>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-200">
                <button
                  onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                  className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-sans font-semibold text-white hover:bg-white/20 transition-colors"
                >
                  {copiedType === 'iframe' ? (
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
                <pre className="overflow-x-auto whitespace-pre-wrap">{iframeSnippet}</pre>
              </div>
            </div>
          )}

          {activeTab === 'wordpress_guide' && (
            <div className="space-y-4 text-xs text-zinc-700">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">
                Guia de Instalação no WordPress (3 Maneiras Fáceis)
              </span>

              {/* Method 1: WPCode */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-2 bg-white">
                <h4 className="font-bold text-sm text-zinc-900">
                  Método 1: Com o Plugin Gratuito "WPCode" (Recomendado)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 leading-relaxed">
                  <li>No painel do WordPress, vá em <strong>Plugins → Adicionar Novo</strong> e instale o <strong>WPCode</strong> (Insert Headers and Footers).</li>
                  <li>Acesse <strong>Code Snippets → Header & Footer</strong> no menu lateral do WordPress.</li>
                  <li>Cole o código na caixa <strong>Footer</strong>.</li>
                  <li>Clique em <strong>Salvar Alterações</strong>. Pronto! O ícone flutuante aparecerá em todo o site.</li>
                </ol>
              </div>

              {/* Method 2: Elementor */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-2 bg-white">
                <h4 className="font-bold text-sm text-zinc-900">
                  Método 2: Com o Elementor
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 leading-relaxed">
                  <li>Edite qualquer página ou o modelo de <em>Footer</em> no Elementor.</li>
                  <li>Arraste o widget <strong>HTML</strong> para a seção desejada.</li>
                  <li>Cole o código do Script ou do Iframe na caixa de código.</li>
                  <li>Clique em <strong>Publicar / Atualizar</strong>.</li>
                </ol>
              </div>

              {/* Method 3: Gutenberg */}
              <div className="rounded-xl border border-zinc-200 p-4 space-y-2 bg-white">
                <h4 className="font-bold text-sm text-zinc-900">
                  Método 3: Bloco HTML Padrão do WordPress (Gutenberg)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 leading-relaxed">
                  <li>Edite uma página ou post no editor padrão do WordPress.</li>
                  <li>Adicione um novo bloco digitando <code className="bg-zinc-100 px-1.5 py-0.5 rounded font-mono">/html</code> (HTML Personalizado).</li>
                  <li>Cole o código do Iframe e salve a página.</li>
                </ol>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/70 px-6 py-3">
          <span className="text-xs text-zinc-500">
            Compatível com qualquer tema WordPress, WooCommerce, Elementor, Divi e Gutenberg.
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
