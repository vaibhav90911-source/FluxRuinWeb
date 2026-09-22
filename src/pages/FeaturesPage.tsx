import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Sliders, Headphones, RefreshCw, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { PLATFORM_FEATURES } from '../data/features';

interface FeaturesPageProps {
  onOpenDiscord: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenDiscord }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-white" />;
      case 'Sliders':
        return <Sliders className="w-6 h-6 text-white" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-white" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-white" />;
      default:
        return <Zap className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div id="features-page" className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/15 text-zinc-300 text-xs font-mono mb-4">
          <Layers className="w-3.5 h-3.5 text-zinc-400" />
          <span>PLATFORM HIGHLIGHTS</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Engineered for Production
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
          Four foundational pillars designed for maximum reliability, speed, and clean operation across servers and clients.
        </p>
      </div>

      {/* 4 Clean Feature Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {PLATFORM_FEATURES.map((feature) => (
          <div
            key={feature.id}
            id={`feature-box-${feature.id}`}
            className="group p-6 sm:p-7 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] hover:border-white/30 hover:bg-[#111111] hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Feature Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 group-hover:bg-white/10 transition-transform duration-200">
                {getIcon(feature.iconName)}
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-zinc-200 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                {feature.shortDesc}
              </p>

              {/* Feature Highlights / Tags */}
              <div className="space-y-2.5 mb-6">
                {feature.tags.slice(0, 4).map((tag) => (
                  <div key={tag} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate">{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Footer */}
            <div className="pt-4 border-t border-white/5">
              <div className="text-2xl font-mono font-bold text-white">
                {feature.metric}
              </div>
              <div className="text-[11px] text-zinc-500 font-medium">
                {feature.metricLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA to Projects & Discord */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-[#0A0A0A] border border-white/10">
        <div>
          <h4 className="text-lg font-bold text-white mb-1">
            Ready to explore Flux projects?
          </h4>
          <p className="text-xs text-zinc-400">
            Check out published plugins, texture packs, modpacks, skripts, or join our Discord.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            id="features-browse-plugins-btn"
            to="/projects"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-colors shadow-md active:scale-98 cursor-pointer"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            id="features-join-discord-btn"
            onClick={onOpenDiscord}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
          >
            <span>Join Discord</span>
          </button>
        </div>
      </div>

    </div>
  );
};
