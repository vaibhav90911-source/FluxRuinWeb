import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  LogOut,
  Shield,
  FileCode,
  Check,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
  X,
  Palette,
  Boxes,
  Scroll,
  Settings2,
  Globe,
  Download
} from 'lucide-react';
import { isOwnerAuthenticated, logoutOwner, getOwnerInfo } from '../data/auth';
import { getAllProjects, saveProject, deleteProject, createDefaultProjectTemplate } from '../data/projectStore';
import { PluginItem } from '../types';
import { DISCORD_INVITE_URL } from '../data/constants';

const PROJECT_TYPE_OPTIONS = [
  { id: 'Plugin', label: 'Plugin', icon: Package, desc: 'Minecraft server plugins (Paper, Spigot, Purpur)' },
  { id: 'Texture Pack', label: 'Texture Pack', icon: Palette, desc: 'Resource packs, 3D models, custom textures' },
  { id: 'Modpack', label: 'Modpack', icon: Boxes, desc: 'Curated mod collections (Fabric, Forge, NeoForge)' },
  { id: 'Skript', label: 'Skript', icon: Scroll, desc: 'Custom server mechanics & automation (.sk)' },
  { id: 'Config', label: 'Config.yml', icon: Settings2, desc: 'Optimized server & plugin YAML setups' }
];

const PLATFORM_PRESETS = [
  { id: 'Modrinth', label: 'Modrinth', urlPrefix: 'https://modrinth.com/' },
  { id: 'CurseForge', label: 'CurseForge', urlPrefix: 'https://curseforge.com/' },
  { id: 'BuiltByBit', label: 'BuiltByBit', urlPrefix: 'https://builtbybit.com/' },
  { id: 'GitHub', label: 'GitHub', urlPrefix: 'https://github.com/' },
  { id: 'PlanetMinecraft', label: 'PlanetMinecraft', urlPrefix: 'https://planetminecraft.com/' },
  { id: 'External', label: 'Custom Link', urlPrefix: 'https://' }
];

export const OwnerPanelPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PluginItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PluginItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Form State
  const [projectType, setProjectType] = useState<string>('Plugin');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [price, setPrice] = useState('Free');
  const [category, setCategory] = useState('Plugin');
  const [tagsInput, setTagsInput] = useState('Paper, Spigot, High Performance');
  const [featuresInput, setFeaturesInput] = useState(
    'Sub-millisecond processing loop\nConfigurable via config.yml\nInstant hot-reload without server restart\nPaper & Purpur optimization hooks'
  );
  const [downloadUrl, setDownloadUrl] = useState('https://modrinth.com');
  const [downloadPlatform, setDownloadPlatform] = useState('Modrinth');
  const [githubUrl, setGithubUrl] = useState('');
  const [purchaseUrl, setPurchaseUrl] = useState('');
  const [configFilename, setConfigFilename] = useState('config.yml');
  const [configCode, setConfigCode] = useState(
    '# Configuration File\nenabled: true\ndebug_mode: false\nrefresh_ticks: 20\n'
  );
  const [supportedPlatformsInput, setSupportedPlatformsInput] = useState('Paper 1.20+, Purpur 1.20+, Spigot 1.20+');

  // Verify auth on mount
  useEffect(() => {
    if (!isOwnerAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }
    loadProjects();
  }, [navigate]);

  const loadProjects = () => {
    setProjects(getAllProjects());
  };

  const handleLogout = () => {
    logoutOwner();
    navigate('/login', { replace: true });
  };

  // Switch project type preset
  const handleSelectProjectType = (newType: string, isFromModalOpen = false) => {
    setProjectType(newType);
    setCategory(newType);
    
    // Only auto-fill defaults if creating new project or user clicks a preset
    if (!editingProject || isFromModalOpen) {
      const tmpl = createDefaultProjectTemplate(newType);
      if (!isFromModalOpen) {
        setName(tmpl.name);
        setSlug(tmpl.slug);
        setTagline(tmpl.tagline);
        setDescription(tmpl.description);
        setLongDescription(tmpl.longDescription);
      }
      setTagsInput(tmpl.tags.join(', '));
      setFeaturesInput(tmpl.features.join('\n'));
      setConfigFilename(tmpl.configExample.filename);
      setConfigCode(tmpl.configExample.code);
      setSupportedPlatformsInput(tmpl.supportedPlatforms.join(', '));
      setDownloadUrl(tmpl.downloadUrl || 'https://modrinth.com');
      setDownloadPlatform(tmpl.downloadPlatform || 'Modrinth');
    }
  };

  const openNewProjectModal = (initialType: string = 'Plugin') => {
    setEditingProject(null);
    const tmpl = createDefaultProjectTemplate(initialType);
    setProjectType(initialType);
    setCategory(initialType);
    setName('');
    setSlug('');
    setTagline(tmpl.tagline);
    setDescription(tmpl.description);
    setLongDescription(tmpl.longDescription);
    setVersion('v1.0.0');
    setPrice('Free');
    setTagsInput(tmpl.tags.join(', '));
    setFeaturesInput(tmpl.features.join('\n'));
    setDownloadUrl('https://modrinth.com');
    setDownloadPlatform('Modrinth');
    setGithubUrl('');
    setPurchaseUrl('');
    setConfigFilename(tmpl.configExample.filename);
    setConfigCode(tmpl.configExample.code);
    setSupportedPlatformsInput(tmpl.supportedPlatforms.join(', '));
    setModalOpen(true);
  };

  const openEditModal = (proj: PluginItem) => {
    setEditingProject(proj);
    const currentType = proj.projectType || proj.category || 'Plugin';
    setProjectType(currentType);
    setName(proj.name);
    setSlug(proj.slug);
    setTagline(proj.tagline);
    setDescription(proj.description);
    setLongDescription(proj.longDescription || proj.description);
    setVersion(proj.version);
    setPrice(proj.price);
    setCategory(proj.category);
    setTagsInput(proj.tags.join(', '));
    setFeaturesInput(proj.features.join('\n'));
    setDownloadUrl(proj.downloadUrl || 'https://modrinth.com');
    setDownloadPlatform(proj.downloadPlatform || detectPlatformFromUrl(proj.downloadUrl || ''));
    setGithubUrl(proj.githubUrl || '');
    setPurchaseUrl(proj.purchaseUrl || '');
    setConfigFilename(proj.configExample?.filename || 'config.yml');
    setConfigCode(proj.configExample?.code || '');
    setSupportedPlatformsInput(proj.supportedPlatforms?.join(', ') || 'Paper 1.20+');
    setModalOpen(true);
  };

  const detectPlatformFromUrl = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.includes('modrinth.com')) return 'Modrinth';
    if (lower.includes('curseforge.com')) return 'CurseForge';
    if (lower.includes('github.com')) return 'GitHub';
    if (lower.includes('builtbybit.com')) return 'BuiltByBit';
    if (lower.includes('planetminecraft.com')) return 'PlanetMinecraft';
    return 'External';
  };

  const handleDownloadUrlChange = (val: string) => {
    setDownloadUrl(val);
    const detected = detectPlatformFromUrl(val);
    if (detected !== 'External') {
      setDownloadPlatform(detected);
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProject) {
      // Auto-generate slug
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (!cleanSlug) {
      alert('Please provide a valid URL slug for the project.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const features = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const platforms = supportedPlatformsInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const finalDownloadUrl = downloadUrl.trim() || 'https://modrinth.com';
    const finalPlatform = downloadPlatform || detectPlatformFromUrl(finalDownloadUrl);

    const projectToSave: PluginItem = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      slug: cleanSlug,
      name: name.trim() || 'Untitled Project',
      tagline: tagline.trim() || 'High-performance Minecraft project.',
      description: description.trim() || 'Project description and overview.',
      longDescription: longDescription.trim() || description.trim() || 'Detailed information about this project.',
      version: version.trim() || 'v1.0.0',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      author: 'Flux',
      category: category.trim() || projectType,
      projectType,
      tags: tags.length > 0 ? tags : [projectType],
      stars: editingProject ? editingProject.stars : 1,
      downloads: editingProject ? editingProject.downloads : '0',
      price: price.trim() || 'Free',
      isPopular: editingProject ? editingProject.isPopular : true,
      isNew: !editingProject,
      features: features.length > 0 ? features : ['Optimized for performance', 'Regular updates & documentation'],
      downloadUrl: finalDownloadUrl,
      downloadPlatform: finalPlatform,
      githubUrl: githubUrl.trim() || undefined,
      purchaseUrl: purchaseUrl.trim() || undefined,
      configExample: {
        filename: configFilename.trim() || 'config.yml',
        language: configFilename.endsWith('.json') ? 'json' : configFilename.endsWith('.sk') ? 'yaml' : 'yaml',
        description: `Configuration/file sample for ${name}`,
        code: configCode || '# Empty file\n'
      },
      docs: editingProject?.docs || {
        title: `${projectType} Installation & Guide`,
        description: `Quick instructions for installing and running ${name}.`,
        steps: [
          {
            step: 1,
            title: `Visit ${finalPlatform} Page`,
            detail: `Click the download link to open the official release page on ${finalPlatform}.`
          },
          {
            step: 2,
            title: 'Download Package',
            detail: `Download the latest release directly from ${finalPlatform}.`
          },
          {
            step: 3,
            title: 'Deploy & Enjoy',
            detail: 'Place the files into your respective server or client directory.'
          }
        ]
      },
      changelog: editingProject?.changelog || [
        {
          version: version.trim() || 'v1.0.0',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          highlights: ['Initial release published on ' + finalPlatform],
          types: [{ type: 'added', text: 'Initial release with full documentation.' }]
        }
      ],
      supportedPlatforms: platforms.length > 0 ? platforms : ['Minecraft 1.20+']
    };

    saveProject(projectToSave);
    loadProjects();
    setModalOpen(false);
    setSaveSuccessMsg(`"${projectToSave.name}" has been successfully published!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    loadProjects();
    setDeleteConfirmId(null);
    setSaveSuccessMsg('Project removed successfully.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const ownerInfo = getOwnerInfo();

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
    <div id="owner-panel-page" className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Top Banner / Session Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 mb-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 p-0.5 bg-black shrink-0">
            <img
              src="/logo.png"
              alt="Owner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Owner Control Panel</h1>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                AUTHORIZED
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Logged in as <strong className="text-white">{ownerInfo?.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            to="/projects"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
          >
            <span>Public Catalog</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium border border-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Success alert */}
      {saveSuccessMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-sm text-emerald-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* Title bar with Add dropdown / quick buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Package className="w-6 h-6 text-white" />
              <span>Published Content & Projects</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Add Plugins, Texture Packs, Modpacks, Skripts, and Config.yml with external download links (Modrinth, etc.).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="owner-add-project-btn"
              onClick={() => openNewProjectModal('Plugin')}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Quick Type Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PROJECT_TYPE_OPTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => openNewProjectModal(item.id)}
                className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/[0.08] hover:border-white/25 hover:bg-[#111111] text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white" />
                </div>
                <div className="text-xs font-bold text-white tracking-tight">{item.label}</div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{item.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Projects List */}
        {projects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0A0A0A] border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
              <Package className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-lg font-bold text-white">No Projects Uploaded Yet</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Your public catalog is currently empty. Click below to add your Plugins, Texture Packs, Modpacks, Skripts, or Config files.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {PROJECT_TYPE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openNewProjectModal(t.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>Add {t.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((proj) => {
              const pType = proj.projectType || proj.category || 'Plugin';
              const pPlatform = proj.downloadPlatform || detectPlatformFromUrl(proj.downloadUrl || '');
              return (
                <div
                  key={proj.id}
                  className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-white">{proj.name}</span>
                      
                      <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${getTypeBadgeColor(pType)}`}>
                        {pType}
                      </span>

                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                        /{proj.slug}
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300">
                        {proj.version}
                      </span>
                      
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        <span>{pPlatform}</span>
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 font-medium">{proj.tagline}</p>
                    <p className="text-xs text-zinc-400 line-clamp-2">{proj.description}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-400">
                      <span className="text-[11px] font-mono text-zinc-500">External URL:</span>
                      <a
                        href={proj.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-zinc-300 hover:text-white hover:underline flex items-center gap-1 truncate max-w-xs"
                      >
                        <span className="truncate">{proj.downloadUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                      to={`/${proj.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
                    >
                      <span>View Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </Link>

                    <button
                      onClick={() => openEditModal(proj)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(proj.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium border border-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Delete Project</h3>
            </div>
            <p className="text-xs text-zinc-400">
              Are you sure you want to remove this project? It will be removed from the public catalog and navigation.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {editingProject ? `Edit ${editingProject.name}` : 'Add New Content'}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Publish Plugins, Texture Packs, Modpacks, Skripts, or Config files to your website
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              
              {/* Type Selector Tabs */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Content Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {PROJECT_TYPE_OPTIONS.map((t) => {
                    const Icon = t.icon;
                    const isSelected = projectType === t.id;
                    return (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => handleSelectProjectType(t.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                        <span className="text-xs font-bold block">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={projectType === 'Texture Pack' ? 'e.g. Flux Default 32x' : projectType === 'Modpack' ? 'e.g. Flux Optimization Pack' : 'e.g. FluxRecording'}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    URL Slug (page path) *
                  </label>
                  <div className="flex items-center rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-2.5 text-sm text-zinc-400">
                    <span>/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase())}
                      placeholder="my-project"
                      className="w-full bg-transparent text-white focus:outline-none pl-1"
                    />
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">Tagline / Short Hook *</label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Fast, reliable, and beautifully tuned for production servers."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                />
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">Short Description *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Concise overview displayed on the project card..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">Detailed Long Description</label>
                <textarea
                  rows={3}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Comprehensive explanation of features, setup, and key benefits..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                />
              </div>

              {/* EXTERNAL DOWNLOAD LINK - Key User Request */}
              <div className="p-5 rounded-3xl bg-black border border-white/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-white" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      External Download Link (Modrinth, CurseForge, etc.) *
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Direct Downloads Disabled
                  </span>
                </div>

                <p className="text-xs text-zinc-400">
                  Visitors cannot directly download files from this site. Clicking download will send them directly to your official release page on Modrinth, CurseForge, or GitHub.
                </p>

                {/* Platform Presets Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 mr-1">Platform:</span>
                  {PLATFORM_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => {
                        setDownloadPlatform(p.id);
                        if (!downloadUrl || downloadUrl === 'https://modrinth.com') {
                          setDownloadUrl(p.urlPrefix);
                        }
                      }}
                      className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                        downloadPlatform === p.id
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-white/5 text-zinc-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Input for the link */}
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={downloadUrl}
                    onChange={(e) => handleDownloadUrlChange(e.target.value)}
                    placeholder="https://modrinth.com/plugin/..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#0A0A0A] border border-white/10 text-white text-sm font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Version, Price, Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.0.0"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">License / Price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Free, Open Source"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">Category Label</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Plugin, Modpack, etc."
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags & Platforms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Paper, Modrinth, Optimization, 1.20"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                    Supported Platforms & Versions
                  </label>
                  <input
                    type="text"
                    value={supportedPlatformsInput}
                    onChange={(e) => setSupportedPlatformsInput(e.target.value)}
                    placeholder="Paper 1.20+, Fabric 1.20.4, Java Edition"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  Key Feature Bullets (one per line)
                </label>
                <textarea
                  rows={3}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Key highlight 1&#10;Key highlight 2&#10;Key highlight 3"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none font-mono text-xs"
                />
              </div>

              {/* Optional GitHub & Discord Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">Source / GitHub URL (Optional)</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1.5">Custom Support / Discord URL (Optional)</label>
                  <input
                    type="text"
                    value={purchaseUrl}
                    onChange={(e) => setPurchaseUrl(e.target.value)}
                    placeholder={DISCORD_INVITE_URL}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Configuration / Code Sample Section */}
              <div className="p-5 rounded-3xl bg-black border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                    File Preview / Code Sample (e.g. config.yml, pack.mcmeta, script.sk)
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Live Code Block on Detail Page</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Filename</label>
                    <input
                      type="text"
                      value={configFilename}
                      onChange={(e) => setConfigFilename(e.target.value)}
                      placeholder="config.yml, pack.mcmeta, or script.sk"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-white text-xs font-mono focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">Preview Label</label>
                    <div className="px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-white/10 text-zinc-400 text-xs font-mono">
                      {configFilename.endsWith('.json') ? 'JSON format' : configFilename.endsWith('.sk') ? 'Skript format' : 'YAML configuration'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">Code / File Content</label>
                  <textarea
                    rows={6}
                    value={configCode}
                    onChange={(e) => setConfigCode(e.target.value)}
                    placeholder="# Insert your config.yml or script sample..."
                    className="w-full p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/10 text-white text-xs font-mono focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProject ? 'Save Changes' : 'Publish to Website'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
