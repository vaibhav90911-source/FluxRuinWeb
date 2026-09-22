import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Terminal,
  Shield,
  ArrowRight,
  Download,
  Star,
  ExternalLink,
  Filter,
  Package,
  Palette,
  Boxes,
  Scroll,
  Settings2,
  Globe
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { DISCORD_INVITE_URL } from '../data/constants';

interface ProjectsPageProps {
  onOpenDiscord: () => void;
}

const CATEGORY_TABS = [
  'All',
  'Plugins',
  'Texture Packs',
  'Modpacks',
  'Skripts',
  'Configs'
];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenDiscord }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const projects = useProjects();

  // Helper to detect platform
  const detectPlatform = (url: string, platform?: string): string => {
    if (platform && platform !== 'External') return platform;
    const lower = url.toLowerCase();
    if (lower.includes('modrinth.com')) return 'Modrinth';
    if (lower.includes('curseforge.com')) return 'CurseForge';
    if (lower.includes('github.com')) return 'GitHub';
    if (lower.includes('builtbybit.com')) return 'BuiltByBit';
    if (lower.includes('planetminecraft.com')) return 'PlanetMinecraft';
    return 'External';
  };

  // Type-specific icon
  const getTypeIcon = (type?: string) => {
    switch (type) {
      case 'Texture Pack':
        return Palette;
      case 'Modpack':
        return Boxes;
      case 'Skript':
        return Scroll;
      case 'Config':
        return Settings2;
      default:
        return Package;
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

  const filteredProjects = projects.filter((project) => {
    const pType = project.projectType || project.category || 'Plugin';
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      project.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      pType.toLowerCase().includes(selectedCategory.toLowerCase().replace(/s$/, '')) ||
      project.category.toLowerCase().includes(selectedCategory.toLowerCase().replace(/s$/, ''));

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="projects-page" className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-zinc-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>DISCOVER FLUX ECOSYSTEM</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Projects, Packs & Configurations
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Browse verified Minecraft plugins, texture packs, modpacks, server skripts, and optimized config.yml files. All downloads are securely hosted on Modrinth and official release links.
          </p>
        </div>

        {/* Quick Discord CTA banner */}
        <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 shrink-0 text-right">
          <div className="text-xs text-zinc-400 mb-1">Need help or customized files?</div>
          <button
            onClick={onOpenDiscord}
            className="text-xs font-semibold text-white hover:text-zinc-300 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Join Our Discord</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="projects-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plugins, texture packs, modpacks, skripts..."
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#0A0A0A] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-zinc-500 shrink-0 hidden sm:block mr-1" />
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow-sm'
                  : 'bg-[#0A0A0A] text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-zinc-500 font-mono mb-6 flex items-center justify-between">
        <span>Showing {filteredProjects.length} of {projects.length} available items</span>
        {searchQuery && <span>Filter: &ldquo;{searchQuery}&rdquo;</span>}
      </div>

      {/* Content Grid Layout */}
      {projects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#0A0A0A] border border-white/10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">No Projects Published Yet</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            No projects have been published yet. Stay connected in our Discord community to be notified the moment new plugins, texture packs, modpacks, and configs are released.
          </p>
          <div className="pt-2">
            <button
              id="projects-empty-join-discord-btn"
              onClick={onOpenDiscord}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-sm transition-all shadow-sm cursor-pointer"
            >
              <span>Join Discord Community</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#0A0A0A] border border-white/10 space-y-4">
          <Terminal className="w-10 h-10 text-zinc-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No items match your filter</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try adjusting your search query or reset the category filter to view all available content.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((item) => {
            const itemType = item.projectType || item.category || 'Plugin';
            const platform = detectPlatform(item.downloadUrl, item.downloadPlatform);
            const Icon = getTypeIcon(itemType);

            return (
              <div
                key={item.slug}
                className="group relative rounded-2xl bg-[#0A0A0A] border border-white/[0.08] hover:border-white/30 hover:bg-[#111111] hover:shadow-[0_0_25px_rgba(255,255,255,0.06)] hover:-translate-y-0.5 transition-all duration-200 p-6 flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Header: Icon, Name, Slugs & Badges */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 group-hover:bg-white/10 transition-transform duration-200">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/${item.slug}`}
                            className="text-xl font-bold text-white hover:text-zinc-300 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                            {item.version}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-zinc-400">/{item.slug}</span>
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${getTypeBadgeColor(itemType)}`}>
                            {itemType}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10 whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>

                  {/* Tagline & Description */}
                  <p className="text-sm font-medium text-white/90 mb-2">{item.tagline}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.03] text-zinc-400 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[11px]">
                      <Globe className="w-3 h-3 text-zinc-400" />
                      <span>{platform}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* External Download Link - Opens Modrinth / External Platform */}
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 hover:border-white/25 text-white text-xs font-medium border border-white/10 transition-colors"
                      title={`Open on ${platform}`}
                    >
                      <span>Get on {platform}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </a>

                    {/* View Details / Docs */}
                    <Link
                      to={`/${item.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-95"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-16 p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Need custom packs or server setups?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            Connect directly with Flux on Discord for custom configurations, skript mechanics, and modpack deployments.
          </p>
        </div>
        <button
          id="projects-cta-discord-btn"
          onClick={onOpenDiscord}
          className="px-6 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm whitespace-nowrap cursor-pointer"
        >
          Join Discord
        </button>
      </div>

    </div>
  );
};
