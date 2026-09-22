import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Terminal } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

interface FooterProps {
  onOpenDiscord: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDiscord }) => {
  const projects = useProjects();

  return (
    <footer id="app-footer" className="border-t border-white/[0.08] bg-[#050505] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 flex items-center justify-center bg-black shrink-0">
                <img
                  src="/logo.png"
                  alt="FLUX Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-lg font-bold tracking-wider text-white">FLUX</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Modern server plugins and developer utilities designed for reliable production environments.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Overview</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white transition-colors">Platform Highlights</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">All Plugins & Projects</Link>
              </li>
              <li>
                <button onClick={onOpenDiscord} className="hover:text-white transition-colors text-left cursor-pointer">
                  Join Community Discord
                </button>
              </li>
            </ul>
          </div>

          {/* Dynamic Plugins or Community */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-3">
              {projects.length > 0 ? 'Published Catalog' : 'Community & Updates'}
            </h4>
            <ul className="space-y-2 text-xs font-mono">
              {projects.length > 0 ? (
                projects.slice(0, 4).map((p) => (
                  <li key={p.slug}>
                    <Link to={`/${p.slug}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                      <span className="text-zinc-500">/</span>
                      <span className="text-zinc-300">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white rounded-full">{p.version}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <button onClick={onOpenDiscord} className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                      <span className="text-zinc-500">#</span>announcements
                    </button>
                  </li>
                  <li>
                    <button onClick={onOpenDiscord} className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                      <span className="text-zinc-500">#</span>plugin-releases
                    </button>
                  </li>
                  <li>
                    <button onClick={onOpenDiscord} className="hover:text-white transition-colors text-left flex items-center gap-1.5 cursor-pointer">
                      <span className="text-zinc-500">#</span>support-tickets
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Developer Resources */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-3">Developer Hub</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <Link to="/features" className="hover:text-white transition-colors">
                  API Specifications
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <Link to="/features" className="hover:text-white transition-colors">
                  Security Hardening
                </Link>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                <Link to="/projects" className="hover:text-white transition-colors">
                  Release Matrix
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Flux. Built for performance and reliability.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-zinc-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="text-zinc-400 font-mono">v2.4 LTS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
