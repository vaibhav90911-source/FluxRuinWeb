import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Github,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  Terminal,
  Shield,
  Sparkles,
  FileCode,
  BookOpen,
  History,
  AlertCircle,
  Copy,
  Check,
  Globe,
  Palette,
  Boxes,
  Scroll,
  Settings2,
  Package
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { DISCORD_INVITE_URL } from '../data/constants';
import { CodeBlock } from '../components/CodeBlock';

interface PluginDetailPageProps {
  onOpenDiscord: () => void;
}

export const PluginDetailPage: React.FC<PluginDetailPageProps> = ({ onOpenDiscord }) => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<'config' | 'docs' | 'changelog'>('config');
  const [copiedLink, setCopiedLink] = useState(false);
  const projects = useProjects();

  const plugin = slug ? projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) : undefined;

  // Unknown project / 404 state
  if (!plugin) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0D121B] border border-white/10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold text-white">Project Not Found</h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            The project slug &ldquo;<span className="text-white font-mono">/{slug}</span>&rdquo; does not exist on Flux.
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
                    <span className="text-xs font-mono text-zinc-500">/{p.slug}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detect platform & type
  const projectType = plugin.projectType || plugin.category || 'Plugin';
  
  const detectPlatform = (url: string, platform?: string): string => {
    if (platform && platform !== 'External') return platform;
    const lower = url.toLowerCase();
    if (lower.includes('modrinth.com')) return 'Modrinth';
    if (lower.includes('curseforge.com')) return 'CurseForge';
    if (lower.includes('github.com')) return 'GitHub';
    if (lower.includes('builtbybit.com')) return 'BuiltByBit';
    if (lower.includes('planetminecraft.com')) return 'PlanetMinecraft';
    return 'Official Release Site';
  };

  const platformName = detectPlatform(plugin.downloadUrl, plugin.downloadPlatform);

  const getDownloadButtonLabel = () => {
    if (platformName === 'Modrinth') return 'Download on Modrinth';
    if (platformName === 'CurseForge') return 'Download on CurseForge';
    if (platformName === 'GitHub') return 'Get on GitHub Releases';
    if (platformName === 'BuiltByBit') return 'Get on BuiltByBit';
    if (platformName === 'PlanetMinecraft') return 'Download on PlanetMinecraft';
    return 'Go to Download Page';
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(plugin.downloadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div id="dynamic-plugin-page" className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Breadcrumb & "Back to Projects" Button */}
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
          <span className="text-white font-medium">/{plugin.slug}</span>
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
                <span>Hosted on {platformName}</span>
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

            {/* Metadata pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Updated: {plugin.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{plugin.stars} stars</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Official Release</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span>By {plugin.author}</span>
              </div>
            </div>

            {/* Supported platforms */}
            <div className="pt-2">
              <div className="text-[11px] font-mono uppercase text-zinc-500 mb-1.5">
                Supported Platforms & Environments:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {plugin.supportedPlatforms.map((plat) => (
                  <span
                    key={plat}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/5"
                  >
                    {plat}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Action Box: External Download Notice and Link */}
          <div className="lg:w-80 shrink-0 p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 space-y-4">
            
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-400 font-mono">Pricing:</span>
              <span className="text-sm font-bold text-white font-mono">{plugin.price}</span>
            </div>

            {/* External Download Button (No direct download) */}
            <a
              id="plugin-download-btn"
              href={plugin.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all duration-200 shadow-md group cursor-pointer"
            >
              <span>{getDownloadButtonLabel()}</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* External Download Explanation */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                <Shield className="w-3.5 h-3.5 text-zinc-300" />
                <span>Verified External Download</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Downloads are verified and hosted on <strong className="text-white">{platformName}</strong>. You will be redirected to the official release page.
              </p>
            </div>

            {/* Copy Direct Link button */}
            <button
              onClick={handleCopyLink}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy {platformName} Link</span>
                </>
              )}
            </button>

            {/* Discord Support Button */}
            <button
              id="plugin-purchase-discord-btn"
              onClick={onOpenDiscord}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors cursor-pointer"
            >
              <span>Community & Support</span>
            </button>

            {/* GitHub Repository Link */}
            {plugin.githubUrl && (
              <a
                id="plugin-github-btn"
                href={plugin.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-white/[0.07] text-zinc-400 hover:text-white text-xs transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Source on GitHub</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
              </a>
            )}

            <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-500 text-center font-mono">
              Release integrity guaranteed • Flux Ecosystem
            </div>

          </div>

        </div>

      </div>

      {/* Navigation Tabs: Configuration / Docs / Changelog */}
      <div className="flex items-center gap-2 border-b border-white/10 mb-8 overflow-x-auto scrollbar-none pb-1">
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
            {projectType === 'Config' ? 'config.yml Setup' : projectType === 'Skript' ? 'Skript Code Preview' : 'Configuration & Setup'}
          </span>
        </button>

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

        <button
          id="tab-changelog"
          onClick={() => setActiveTab('changelog')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'changelog'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Changelog ({plugin.changelog.length})</span>
        </button>
      </div>

      {/* Tab 1: Configuration / Code File Guide */}
      {activeTab === 'config' && (
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
        </div>
      )}

      {/* Tab 3: Changelog */}
      {activeTab === 'changelog' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Release History & Changelog
            </h3>
            <p className="text-xs text-zinc-400">
              Track patches, optimizations, and updates for {plugin.name}.
            </p>
          </div>

          <div className="relative border-l border-white/10 ml-4 space-y-8 pl-6">
            {plugin.changelog.map((entry, idx) => (
              <div key={entry.version} className="relative group">
                {/* Node icon */}
                <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-white border-4 border-black" />

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-base font-bold font-mono text-white">
                    {entry.version}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {entry.date}
                  </span>
                  {idx === 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      CURRENT STABLE
                    </span>
                  )}
                </div>

                {/* Highlights */}
                {entry.highlights.length > 0 && (
                  <ul className="text-xs text-zinc-300 space-y-1 mb-3">
                    {entry.highlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-zinc-500">•</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Categorized Changes */}
                <div className="space-y-1.5 pt-1">
                  {entry.types.map((t, i) => {
                    const badgeColor =
                      t.type === 'added'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : t.type === 'fixed'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-white/10 text-white border-white/20';

                    return (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span
                          className={`uppercase text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${badgeColor}`}
                        >
                          {t.type}
                        </span>
                        <span className="text-zinc-400">{t.text}</span>
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
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
                    <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
                      {other.description}
                    </p>
                    <div className="text-[11px] font-mono text-zinc-400">
                      /{other.slug} →
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
