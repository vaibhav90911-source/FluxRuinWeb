import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenDiscord: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDiscord }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      id="main-navigation-header"
      className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Left: Brand Logo / Name */}
        <Link
          id="nav-brand-logo"
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 flex items-center justify-center p-0.5 bg-black group-hover:border-white/60 group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(255,255,255,0.2)] transition-all duration-300 shrink-0">
            <img
              src="/logo.png"
              alt="FLUX Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white group-hover:text-zinc-200 transition-colors">
            FLUX
          </span>
        </Link>

        {/* Center: Main Page Navigation Links (Home, Features, Projects & Plugins) */}
        <nav id="nav-center-links" className="hidden md:flex items-center gap-1.5">
          <Link
            id="nav-link-home"
            to="/"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive('/') && location.pathname === '/'
                ? 'text-white bg-white/15 border border-white/20 shadow-[0_0_16px_rgba(255,255,255,0.12)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]'
            }`}
          >
            Home
          </Link>

          <Link
            id="nav-link-features"
            to="/features"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive('/features')
                ? 'text-white bg-white/15 border border-white/20 shadow-[0_0_16px_rgba(255,255,255,0.12)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]'
            }`}
          >
            Features
          </Link>

          <Link
            id="nav-link-projects"
            to="/projects"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isActive('/projects')
                ? 'text-white bg-white/15 border border-white/20 shadow-[0_0_16px_rgba(255,255,255,0.12)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)]'
            }`}
          >
            Projects & Plugins
          </Link>
        </nav>

        {/* Right: Prominent "Join Discord" CTA button */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="nav-join-discord-btn"
            onClick={onOpenDiscord}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-95 focus:outline-none cursor-pointer"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Join Discord</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            id="nav-join-discord-mobile-quick"
            onClick={onOpenDiscord}
            className="p-2.5 rounded-full bg-white text-black focus:outline-none"
            aria-label="Discord"
          >
            <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </button>
          
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-drawer"
          className="md:hidden bg-[#0A0A0A] border-b border-white/10 px-4 pt-3 pb-6 space-y-3"
        >
          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium ${
                isActive('/') && location.pathname === '/'
                  ? 'text-white bg-white/15'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Home
            </Link>

            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium ${
                isActive('/features')
                  ? 'text-white bg-white/15'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Features
            </Link>

            <Link
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium ${
                isActive('/projects')
                  ? 'text-white bg-white/15'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Projects & Plugins
            </Link>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDiscord();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white text-black font-bold text-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Join Discord Server</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
