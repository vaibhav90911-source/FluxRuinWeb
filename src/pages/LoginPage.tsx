import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginOwner, isOwnerAuthenticated } from '../data/auth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect straight to the owner panel
    if (isOwnerAuthenticated()) {
      navigate('/owner', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const success = loginOwner(email, password);
      if (success) {
        navigate('/owner', { replace: true });
      } else {
        setError('Invalid owner credentials. Please verify your email and password.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div id="login-page" className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="relative z-10 w-full max-w-md">
        
        {/* Card Container */}
        <div className="rounded-3xl bg-[#0A0A0A] border border-white/10 p-8 sm:p-10 shadow-2xl backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-white/20 p-0.5 bg-black mb-4">
              <img
                src="/logo.png"
                alt="FLUX"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Owner Access Portal
            </h1>
            <p className="text-xs text-zinc-400">
              Restricted management panel for Flux projects & configurations
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fluxruinmc@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all duration-200 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as Owner</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
              <span>Public registration is closed</span>
            </div>
            <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
              Return Home
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};
