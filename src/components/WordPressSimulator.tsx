import React from 'react';
import { 
  Hotel, 
  Utensils, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Star, 
  Phone, 
  Mail, 
  Compass,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface WordPressSimulatorProps {
  onOpenEmbedModal: () => void;
  onExitPreview: () => void;
}

export const WordPressSimulator: React.FC<WordPressSimulatorProps> = ({
  onOpenEmbedModal,
  onExitPreview,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-zinc-100 text-zinc-900 overflow-x-hidden">
      
      {/* WordPress Admin / Simulator Top Banner */}
      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-zinc-200 bg-zinc-900 px-4 py-2 text-xs text-white shadow-md">
        <div className="flex items-center space-x-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold">Simulação de Site WordPress:</span>
          <span className="text-zinc-400 hidden sm:inline">The Grand Lumière Hotel & Spa (Tema Luxury)</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenEmbedModal}
            className="rounded-md bg-white/10 px-2.5 py-1 font-semibold text-white hover:bg-white/20 transition-colors"
          >
            Obter Código WP
          </button>
          <button
            onClick={onExitPreview}
            className="rounded-md bg-white text-zinc-900 px-2.5 py-1 font-semibold hover:bg-zinc-100 transition-colors"
          >
            Voltar ao Chat
          </button>
        </div>
      </div>

      {/* Simulated WordPress Website Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <section className="relative rounded-3xl bg-zinc-900 text-white p-8 sm:p-14 overflow-hidden shadow-xl border border-zinc-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <Star className="h-3.5 w-3.5 text-zinc-400 fill-zinc-400" />
              <span>5 Estrelas Luxo & Gastronomia</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Uma Experiência Imersiva em Hospitalidade
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Bem-vindo ao The Grand Lumière. Desfrute de alta gastronomia com 3 estrelas Michelin, tratamentos de spa com ouro 24k e serviço de concierge com inteligência artificial disponível 24 horas.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button className="rounded-xl bg-white text-zinc-900 px-5 py-2.5 text-xs font-bold hover:bg-zinc-100 transition-all shadow-xs">
                Reservar Acomodação
              </button>
              <button 
                onClick={onOpenEmbedModal}
                className="rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 px-4 py-2.5 text-xs font-semibold hover:text-white hover:bg-zinc-700 transition-all"
              >
                Instalar no Meu WordPress
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-zinc-800/40 to-transparent pointer-events-none" />
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
              <Utensils className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Restaurante Le Miroir</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Alta gastronomia francesa contemporânea comandada pelo renomado Chef Antoine Dubois. Menu degustação em 7 tempos harmonizado.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Spa L'Élixir & Bem-Estar</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tratamentos exclusivos com infusão de ouro 24k, sauna finlandesa, piscina aquecida de borda infinita e hidroterapia.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Concierge IA no Canto da Tela</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Clique no <strong>ícone flutuante no canto inferior direito</strong> desta tela para testar como seus clientes interagirão no seu site real!
            </p>
          </div>
        </section>

        {/* Informative Box */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-left">
            <h4 className="text-base font-bold text-zinc-900">
              Pronto para ativar no seu site WordPress?
            </h4>
            <p className="text-xs text-zinc-500">
              Basta copiar o script gerado e colar no seu plugin de cabeçalho/rodapé ou no Elementor.
            </p>
          </div>
          <button
            onClick={onOpenEmbedModal}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 shadow-xs cursor-pointer shrink-0"
          >
            <span>Ver Instruções do WordPress</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>

      </div>
    </div>
  );
};
