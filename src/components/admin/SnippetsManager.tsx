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
  Laptop
} from 'lucide-react';

export const SnippetsManager: React.FC = () => {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'script' | 'iframe' | 'wordpress' | 'webhooks'>('script');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://meusite.com';

  const scriptSnippet = `<!-- ============================================== -->
<!-- WIDGET FLUTUANTE AGENT CONCIERGE (WORDPRESS) -->
<!-- Cole antes do fechamento da tag </body> ou via WPCode -->
<!-- ============================================== -->
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${currentOrigin}/';
    iframe.id = 'agent-concierge-widget-frame';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '24px';
    iframe.style.right = '24px';
    iframe.style.width = '420px';
    iframe.style.height = '640px';
    iframe.style.border = 'none';
    iframe.style.zIndex = '999999';
    iframe.style.borderRadius = '20px';
    iframe.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
    iframe.allow = 'microphone';
    document.body.appendChild(iframe);
  })();
</script>`;

  const iframeSnippet = `<!-- ============================================== -->
<!-- IFRAME EMBED (PÁGINAS, ELEMENTOR, GUTENBERG)   -->
<!-- ============================================== -->
<iframe 
  src="${currentOrigin}/" 
  width="100%" 
  height="750px" 
  style="border: 1px solid #e4e4e7; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); width: 100%; min-height: 700px;"
  allow="microphone"
  loading="lazy"
></iframe>`;

  const functionPhpSnippet = `/**
 * Inserir o Widget Agent Concierge no rodapé de todas as páginas do tema
 * Adicione no final do arquivo functions.php do seu Tema Filho (Child Theme)
 */
function add_agent_concierge_widget() {
    ?>
    <script>
      (function() {
        var iframe = document.createElement('iframe');
        iframe.src = '<?php echo esc_url('${currentOrigin}/'); ?>';
        iframe.style.position = 'fixed';
        iframe.style.bottom = '24px';
        iframe.style.right = '24px';
        iframe.style.width = '420px';
        iframe.style.height = '640px';
        iframe.style.border = 'none';
        iframe.style.zIndex = '999999';
        iframe.style.borderRadius = '20px';
        iframe.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.2)';
        iframe.allow = 'microphone';
        document.body.appendChild(iframe);
      })();
    </script>
    <?php
}
add_action('wp_footer', 'add_agent_concierge_widget');`;

  const webhookJsonSnippet = `// Exemplo de payload para sincronização com PMS / API hoteleira
POST ${currentOrigin}/api/chat
Content-Type: application/json

{
  "message": "Gostaria de agendar uma massagem no Spa às 15h.",
  "guestInfo": {
    "name": "Sr. Henrique Albuquerque",
    "room": "Suíte Real 702",
    "vipTier": "Diamond"
  }
}`;

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
                Códigos & Snippets de Integração
              </h2>
            </div>
            <p className="text-xs text-zinc-500 max-w-2xl">
              Copie o código pronto para incorporar o concierge inteligente no seu site WordPress, Elementor, Divi, WooCommerce, Shopify ou qualquer página HTML.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-white border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 shadow-xs">
              <Sparkles className="h-3 w-3 text-emerald-500 mr-1.5" />
              100% Pronto para Usar
            </span>
          </div>
        </div>
      </div>

      {/* Snippet Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSnippetTab('script')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'script'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <Laptop className="h-3.5 w-3.5" />
          <span>1. Script Widget Flutuante</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSnippetTab('iframe')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'iframe'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>2. Iframe para Elementor / Gutenberg</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSnippetTab('wordpress')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'wordpress'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <FileCode className="h-3.5 w-3.5" />
          <span>3. functions.php (Tema Filho)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSnippetTab('webhooks')}
          className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeSnippetTab === 'webhooks'
              ? 'bg-zinc-900 text-white shadow-xs'
              : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
          }`}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>4. API REST / JSON Endpoint</span>
        </button>
      </div>

      {/* Snippet Content Views */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left 2 Cols: The Code Snippet */}
        <div className="lg:col-span-2 space-y-4">
          
          {activeSnippetTab === 'script' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Snippet 1: Widget Flutuante para o Rodapé
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Carrega o ícone no canto inferior direito do site sem interferir no layout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(scriptSnippet, 'script')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'script' ? (
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
                <pre className="whitespace-pre-wrap leading-relaxed">{scriptSnippet}</pre>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 space-y-2">
                <p className="font-bold text-zinc-900">Como instalar com o plugin WPCode (Grátis):</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600">
                  <li>No WordPress, acesse <strong>Plugins → Adicionar Novo</strong> e instale <strong>WPCode</strong>.</li>
                  <li>No menu esquerdo, vá em <strong>Code Snippets → Header & Footer</strong>.</li>
                  <li>Cole este código na área <strong>Footer</strong> e clique em <strong>Save Changes</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {activeSnippetTab === 'iframe' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Snippet 2: Iframe para Páginas e Construtores
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Ideal para colocar o chat incorporado em uma página inteira de Atendimento ou Contato.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'iframe' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Iframe</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">{iframeSnippet}</pre>
              </div>

              <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-4 text-xs text-zinc-600 space-y-2">
                <p className="font-bold text-zinc-900">Como usar no Elementor ou Divi:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600">
                  <li>No Elementor, arraste o bloco de elemento <strong>HTML</strong> para a sua seção.</li>
                  <li>Cole o código acima e defina a largura da coluna para 100%.</li>
                  <li>Clique em Atualizar / Publicar.</li>
                </ol>
              </div>
            </div>
          )}

          {activeSnippetTab === 'wordpress' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Snippet 3: Gancho PHP no Tema Filho (functions.php)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Para desenvolvedores que preferem injetar via gancho `wp_footer` no código do tema.
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

          {activeSnippetTab === 'webhooks' && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">
                    Snippet 4: Endpoint API REST Backend
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Faça requisições HTTP diretas ao modelo Gemini usando o backend integrado.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(webhookJsonSnippet, 'json')}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  {copiedType === 'json' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copiar Payload</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl border border-zinc-200 bg-zinc-900 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
                <pre className="whitespace-pre-wrap leading-relaxed">{webhookJsonSnippet}</pre>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Quick Tips & Specs */}
        <div className="space-y-4">
          
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5" />
              Especificações Técnicas
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Origem da Aplicação:</span>
                <span className="font-mono text-zinc-800 text-[11px] truncate max-w-[160px]">{currentOrigin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Dimensões Recomendadas:</span>
                <span className="font-semibold text-zinc-800">420px × 640px</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Z-Index Flutuante:</span>
                <span className="font-mono text-zinc-800 font-bold">999999</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Permissão de Áudio:</span>
                <span className="font-semibold text-emerald-600">allow="microphone"</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Compatibilidade:</span>
                <span className="font-semibold text-zinc-800">100% dos Temas WP</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 shadow-xs space-y-2">
            <p className="text-xs font-bold text-zinc-900">Precisa testar antes de colar no site?</p>
            <p className="text-xs text-zinc-500">
              Clique em <strong>Demo Site WordPress</strong> no menu superior para ver exatamente como o widget se comporta sobre um site de hotelaria.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
