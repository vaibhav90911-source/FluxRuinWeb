import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div id="not-found-page" className="min-h-screen pt-36 pb-20 px-4 text-center max-w-2xl mx-auto">
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0A0A0A] border border-white/10 space-y-6">
        <div className="text-6xl font-mono font-bold text-white">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The requested route does not exist. Check the URL or explore our core pages below.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
          <Link
            to="/projects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-zinc-400" />
            <span>Browse All Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
