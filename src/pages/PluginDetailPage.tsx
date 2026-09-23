import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  FileCode,
  Globe,
  Terminal,
  AlertCircle,
  Copy,
  Check,
  Zap,
  CheckCircle2,
  Boxes,
  Palette,
  Scroll,
  Settings2
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#080808] my-4 shadow-xl">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#101010] border-b border-white/5 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-white font-medium">{filename}</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[11px]"
            title="Copy code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      )}

      <div className="relative p-4 font-mono text-xs overflow-x-auto text-[#E6EDF3] leading-relaxed">
        {!filename && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}

        <pre className="flex">
          {showLineNumbers && (
            <div className="select-none text-zinc-600 text-right pr-4 border-r border-white/5 mr-4 shrink-0">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code className="text-zinc-200">{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

export const PluginDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const projects = useProjects();

  const plugin = slug
    ? projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id === slug)
    : undefined;

  const hasConfig = Boolean(
    plugin?.configExample &&
    plugin.configExample.code &&
    plugin.configExample.code.trim().length > 0 &&
    plugin.configExample.code.trim() !== '# Empty file'
  );

  const [activeTab, setActiveTab] = useState<'config' | 'docs'>(hasConfig ? 'config' : 'docs');

  useEffect(() => {
    if (!hasConfig && activeTab === 'config') {
      setActiveTab('docs');
    }
  }, [hasConfig, activeTab]);

  if (!plugin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0D121B] border border-white/10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-white">Project Not Found</h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            The requested project does not exist on Flux.
          </p>

          <div className="pt-2">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </Link>
          </div>

          {projects.length > 0 && (
            <div className="pt-8 border-t border-white/5 text-left">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">
                Available projects & plugins:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/${p.slug}`}
                    className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between group"
                  >
                    <span className="text-sm font-medium text-white group-hover:text-zinc-300">
                      {p.name}
                    </span>
                    <span className="text-xs text-zinc-400">View project →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const projectType = plugin.projectType || plugin.category || 'Plugin';
  const platformName = plugin.downloadPlatform || 'Modrinth';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Texture Pack':
        return <Palette className="w-4 h-4" />;
      case 'Modpack':
        return <Boxes className="w-4 h-4" />;
      case 'Skript':
        return <Scroll className="w-4 h-4" />;
      case 'Config':
        return <Settings2 className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type?: string) => {
    switch (type) {
      case 'Texture Pack':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Modpack':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'Skript':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'Config':
        return 'bg-zinc-400/10 text-zinc-300 border-zinc-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div id="plugin-detail-page" className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Top Breadcrumbs & Back link */}
      <div className="flex items-center justify-between mb-8">
        <Link
          id="back-to-projects-btn"
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-medium transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Projects</span>
        </Link>

        <div className="text-xs font-mono text-zinc-500 hidden sm:flex items-center gap-2">
          <span>flux</span>
          <span>/</span>
          <span className="text-zinc-400">{projectType.toLowerCase().replace(/\s+/g, '-')}</span>
          <span>/</span>
          <span className="text-white font-medium">{plugin.name}</span>
        </div>
      </div>

      {/* Project Header Section */}
      <div className="rounded-3xl bg-[#0A0A0A] border border-white/10 p-6 sm:p-10 mb-10 shadow-2xl relative overflow-hidden">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          
          <div className="space-y-4 max-w-3xl">
            
            {/* Category and Version Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full border text-xs font-mono font-medium ${getTypeBadgeColor(projectType)}`}>
                {projectType}
              </span>

              <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10 text-xs font-mono">
                {plugin.version}
              </span>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>Available on {platformName}</span>
              </span>
            </div>

            {/* Project Name & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {plugin.name}
              </h1>
              <p className="text-base sm:text-lg text-zinc-300 font-medium mt-1">
                {plugin.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm text-[#8B949E] leading-relaxed">
              {plugin.longDescription}
            </p>

            {/* Metadata Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {plugin.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.04] text-zinc-300 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {/* Right Action Box: Primary Platform CTA */}
          <div className="w-full lg:w-72 rounded-2xl bg-white/[0.03] border border-white/10 p-5 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-white/5">
              <span>Access</span>
              <span className="font-bold text-white uppercase">{plugin.price}</span>
            </div>

            {/* Primary Platform Download CTA */}
            <a
              id="cta-download-platform"
              href={plugin.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all duration-200 shadow-md hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95 group"
            >
              <span>Get on {platformName}</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>

            {/* GitHub Source Link if Available */}
            {plugin.githubUrl && (
              <a
                href={plugin.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-mono transition-colors"
              >
                <span>View Source on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              </a>
            )}

            {/* Supported Platform Badges */}
            <div className="pt-2 text-[11px] font-mono text-zinc-500">
              <div className="mb-1.5 uppercase tracking-wider text-[10px] text-zinc-400">Supported In:</div>
              <div className="flex flex-wrap gap-1">
                {plugin.supportedPlatforms.map((plat) => (
                  <span key={plat} className="px-2 py-0.5 rounded-full bg-white/[0.05] text-zinc-300">
                    {plat}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Navigation Tabs: Configuration (only if added) / Docs */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto scrollbar-none pb-1">
        {hasConfig && plugin.configExample && (
          <button
            id="tab-config-guide"
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'config'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>
              {plugin.configExample.filename || 'Configuration'}
            </span>
          </button>
        )}

        <button
          id="tab-quickstart-docs"
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'docs'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Installation Guide</span>
        </button>
      </div>

      {/* Tab 1: Configuration / Code File Guide (Rendered only when config is added) */}
      {hasConfig && plugin.configExample && activeTab === 'config' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {plugin.configExample.filename} Reference
              </h3>
              <p className="text-xs text-[#8B949E]">
                {plugin.configExample.description}
              </p>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              Format: <span className="text-white uppercase font-bold">{plugin.configExample.language}</span>
            </div>
          </div>

          <CodeBlock
            code={plugin.configExample.code}
            language={plugin.configExample.language}
            filename={plugin.configExample.filename}
          />

          {/* Key Feature Specs Included */}
          <div className="rounded-3xl bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-4">
            <h4 className="text-sm font-mono uppercase tracking-wider text-white">
              Features Included in this Release
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plugin.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Installation Guide */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {plugin.docs.title}
            </h3>
            <p className="text-xs text-zinc-400">
              {plugin.docs.description}
            </p>
          </div>

          <div className="space-y-4">
            {plugin.docs.steps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/10 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center font-mono text-xs font-bold">
                    {step.step}
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    {step.title}
                  </h4>
                </div>

                <p className="text-xs text-zinc-400 pl-11">
                  {step.detail}
                </p>

                {step.command && (
                  <div className="pl-10">
                    <CodeBlock
                      code={step.command}
                      language="bash"
                      filename={`Step ${step.step} Instruction`}
                      showLineNumbers={false}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Feature Specs when viewing docs */}
          <div className="rounded-3xl bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-4 mt-6">
            <h4 className="text-sm font-mono uppercase tracking-wider text-white">
              Features Included
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plugin.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Explore More Items Section */}
      {projects.filter((p) => p.slug !== plugin.slug).length > 0 && (
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-bold text-white">
              More Content from Flux
            </h4>
            <Link
              to="/projects"
              className="text-xs text-white hover:underline font-mono inline-flex items-center gap-1"
            >
              <span>View All ({projects.length})</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {projects
              .filter((p) => p.slug !== plugin.slug)
              .slice(0, 3)
              .map((other) => {
                const oType = other.projectType || other.category || 'Plugin';
                return (
                  <Link
                    key={other.slug}
                    to={`/${other.slug}`}
                    className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/30 transition-all block group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm group-hover:text-zinc-300 transition-colors">
                        {other.name}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getTypeBadgeColor(oType)}`}>
                        {oType}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {other.description}
                    </p>
                    <div className="text-[11px] font-medium text-white group-hover:underline">
                      View {other.name} →
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
};
