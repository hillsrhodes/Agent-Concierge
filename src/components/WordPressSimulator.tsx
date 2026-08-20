import React from 'react';
import { 
  Building2, 
  Compass, 
  Sparkles, 
  Star, 
  ArrowRight,
  ShieldCheck,
  Landmark,
  Layers,
  MapPin
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
          <span className="font-semibold">WordPress Website Live Simulation:</span>
          <span className="text-zinc-400 hidden sm:inline">Harmony Homes • Las Vegas Luxury Custom Residences</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenEmbedModal}
            className="rounded-md bg-white/10 px-2.5 py-1 font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            Get WP Snippets
          </button>
          <button
            onClick={onExitPreview}
            className="rounded-md bg-white text-zinc-900 px-2.5 py-1 font-semibold hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Return to Concierge Chat
          </button>
        </div>
      </div>

      {/* Simulated WordPress Website Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        
        {/* Hero Section */}
        <section className="relative rounded-3xl bg-zinc-900 text-white p-8 sm:p-14 overflow-hidden shadow-xl border border-zinc-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <Star className="h-3.5 w-3.5 text-[#87735A] fill-[#87735A]" />
              <span>Over 40 Years of Luxury Building Excellence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Translating Vision into Architectural Reality
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Welcome to Harmony Homes. Guided by founder Jim Rhodes, we pioneer custom luxury residences, Desert Modernism aesthetics, and end-to-end Design & Build mastery across Las Vegas.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button 
                onClick={onOpenEmbedModal}
                className="rounded-xl bg-white text-zinc-900 px-5 py-2.5 text-xs font-bold hover:bg-zinc-100 transition-all shadow-xs cursor-pointer"
              >
                Schedule Private Consultation
              </button>
              <button 
                onClick={onOpenEmbedModal}
                className="rounded-xl border border-zinc-700 bg-zinc-800/80 text-zinc-300 px-4 py-2.5 text-xs font-semibold hover:text-white hover:bg-zinc-700 transition-all cursor-pointer"
              >
                Install on WordPress
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-zinc-800/40 to-transparent pointer-events-none" />
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-[#87735A]">
              <Building2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Egan Crest (Coming 2026)</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Elevated luxury enclave showcasing Desert Modernism architecture, panoramic unobstructed Las Vegas Strip views, and multi-slide pocket glass walls.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-[#87735A]">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">5-Step Design & Build</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Proprietary turnkey methodology: 1. Vision & Strategy | 2. Integrated Planning | 3. Engineering Alignment | 4. Precision Execution | 5. Turnkey Delivery.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-[#87735A]">
              <Landmark className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">SkyFire Estate Showcase</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              A completed modernist trophy residence featuring cantilevered steel pavilions, 500-bottle wine gallery, and seamless indoor-outdoor desert flow.
            </p>
          </div>
        </section>

        {/* Informative Box */}
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-left">
            <h4 className="text-base font-bold text-zinc-900">
              Experience the Agent Concierge in the bottom right corner
            </h4>
            <p className="text-xs text-zinc-500">
              Interact with the luxury real estate advisor to inquire about land acquisitions, architectural schematics, or schedule a private consultation with Jim Rhodes and leadership.
            </p>
          </div>
          <button
            onClick={onOpenEmbedModal}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 shadow-xs cursor-pointer shrink-0"
          >
            <span>WordPress Integration Snippets</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </section>

      </div>
    </div>
  );
};
