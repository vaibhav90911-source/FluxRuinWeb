import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Boxes, Palette, Settings2 } from 'lucide-react';

interface HomePageProps {
  onOpenDiscord: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenDiscord }) => {
  return (
    <div id="home-page" className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 md:pt-28 pb-12 sm:pb-16 max-w-6xl mx-auto w-full">
      
      {/* Hero Section */}
      <section id="hero-section" className="relative w-full text-center mt-4 sm:mt-8">
        
        {/* Performant static ambient backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_70%)] rounded-full pointer-events-none -z-10" />

        <div className="relative z-10 max-w-4xl mx-auto">
          
          {/* Main Title with Entrance Motion */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-5"
          >
            Engineered for speed.
            <br />
            Built for <span className="text-zinc-400">production.</span>
          </motion.h1>

          {/* Subtitle / Overview */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            A clean suite of high-performance plugins, resource packs, modpacks, and server configs. Fast, reliable, and verified on official platforms.
          </motion.p>

          {/* Prominent Curved CTA Buttons with Snappy Glow Hover */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            <Link
              id="hero-cta-explore-plugins"
              to="/projects"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all duration-200 shadow-md hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-95 group cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              id="hero-cta-view-features"
              to="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30 hover:shadow-[0_0_18px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 font-medium text-sm transition-all duration-200 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-zinc-300" />
              <span>Platform Highlights</span>
            </Link>

            <button
              id="hero-cta-join-discord"
              onClick={onOpenDiscord}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-zinc-400 hover:text-white font-medium text-sm transition-all duration-200 cursor-pointer hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.08)] active:scale-95"
            >
              <span>Join Discord</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* Floating Ecosystem Badges with Snappy Hover Glow */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
        className="mt-12 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        {[
          { icon: Zap, label: 'Paper & Purpur Plugins', desc: 'Zero tick-lag architecture' },
          { icon: Palette, label: 'Custom Texture Packs', desc: 'Optimized 32x & 64x assets' },
          { icon: Boxes, label: 'Curated Modpacks', desc: 'Modrinth & CurseForge verified' },
          { icon: Settings2, label: 'Tuned Server Configs', desc: 'Production-ready templates' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to="/projects"
              className="group p-4 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] hover:border-white/30 hover:bg-[#111111] hover:shadow-[0_0_20px_rgba(255,255,255,0.08)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between text-left cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3 text-white group-hover:scale-105 group-hover:bg-white/10 transition-transform duration-200">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-zinc-200 transition-colors">
                  {item.label}
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </motion.div>

    </div>
  );
};
