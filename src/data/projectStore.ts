import { PluginItem } from '../types';
import { DISCORD_INVITE_URL } from './constants';

const PROJECTS_STORAGE_KEY = 'flux_published_projects';

// Initially empty, per user instruction: "remove this projects that u automatically added"
const INITIAL_PROJECTS: PluginItem[] = [];

export function getAllProjects(): PluginItem[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      return INITIAL_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_PROJECTS;
  } catch (err) {
    console.error('Failed to load projects from storage:', err);
    return INITIAL_PROJECTS;
  }
}

export function getProjectBySlug(slug: string): PluginItem | undefined {
  const all = getAllProjects();
  return all.find((p) => p.slug.toLowerCase() === slug.toLowerCase() || p.id.toLowerCase() === slug.toLowerCase());
}

export function saveProject(project: PluginItem): PluginItem {
  const all = getAllProjects();
  const index = all.findIndex((p) => p.id === project.id || p.slug.toLowerCase() === project.slug.toLowerCase());

  let updatedList: PluginItem[];
  if (index >= 0) {
    // Update existing project
    updatedList = [...all];
    updatedList[index] = { ...project };
  } else {
    // Add new project
    updatedList = [project, ...all];
  }

  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedList));
    // Dispatch a custom event so other components can reactively update
    window.dispatchEvent(new Event('flux_projects_updated'));
  } catch (err) {
    console.error('Failed to save project to storage:', err);
  }

  return project;
}

export function deleteProject(id: string): boolean {
  const all = getAllProjects();
  const filtered = all.filter((p) => p.id !== id && p.slug !== id);

  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('flux_projects_updated'));
    return true;
  } catch (err) {
    console.error('Failed to delete project:', err);
    return false;
  }
}

// Utility to create a default project object with sensible defaults
export function createDefaultProjectTemplate(type: string = 'Plugin'): PluginItem {
  const id = `project-${Date.now()}`;
  
  if (type === 'Texture Pack') {
    return {
      id,
      slug: 'my-texture-pack',
      name: 'My Texture Pack',
      tagline: 'Clean custom texture pack with enhanced visuals and custom models.',
      description: 'A modern texture pack engineered for optimal framerates and vibrant vanilla-plus aesthetics.',
      longDescription: 'Features custom textures, polished block models, and UI enhancements. 100% vanilla compatible.',
      version: 'v1.0.0',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      author: 'Flux',
      category: 'Texture Pack',
      projectType: 'Texture Pack',
      tags: ['Texture Pack', 'Resource Pack', '16x', 'Vanilla Friendly'],
      stars: 1,
      downloads: '0',
      price: 'Free',
      isPopular: false,
      isNew: true,
      features: [
        'Enhanced visual textures and block models',
        'Custom GUI and inventory themes',
        'Zero FPS drop / high optimization',
        'Compatible with OptiFine, Iris, and Vanilla'
      ],
      downloadUrl: 'https://modrinth.com',
      downloadPlatform: 'Modrinth',
      githubUrl: '',
      purchaseUrl: '',
      configExample: {
        filename: 'pack.mcmeta',
        language: 'json',
        description: 'Resource pack metadata and format declaration.',
        code: `{\n  "pack": {\n    "pack_format": 15,\n    "description": "§bFlux Custom Texture Pack §7- §fEnhanced Visuals"\n  }\n}`
      },
      docs: {
        title: 'Installation Instructions',
        description: 'How to install and activate this texture pack.',
        steps: [
          { step: 1, title: 'Visit Modrinth Page', detail: 'Click the download link to open the official release on Modrinth.' },
          { step: 2, title: 'Download Resource Pack', detail: 'Download the .zip file from Modrinth.' },
          { step: 3, title: 'Place in resourcepacks folder', detail: 'Open Minecraft > Options > Resource Packs > Open Pack Folder, and place the .zip file inside.' }
        ]
      },
      changelog: [
        {
          version: 'v1.0.0',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          highlights: ['Initial release on Modrinth'],
          types: [{ type: 'added', text: 'Initial release with core textures.' }]
        }
      ],
      supportedPlatforms: ['Minecraft 1.20+', 'OptiFine', 'Iris / Sodium']
    };
  }

  if (type === 'Modpack') {
    return {
      id,
      slug: 'my-modpack',
      name: 'My Custom Modpack',
      tagline: 'Curated modpack with optimized performance and QoL gameplay.',
      description: 'A lightweight and feature-packed modpack published on Modrinth with pre-configured settings.',
      longDescription: 'Carefully tuned mod list delivering superior client-side FPS, memory optimization, and visual fidelity.',
      version: 'v1.0.0',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      author: 'Flux',
      category: 'Modpack',
      projectType: 'Modpack',
      tags: ['Modpack', 'Fabric', 'Performance', 'Quality of Life'],
      stars: 1,
      downloads: '0',
      price: 'Free',
      isPopular: false,
      isNew: true,
      features: [
        'Over 50+ optimized performance and QoL mods',
        'Pre-configured shaders and sound enhancements',
        'One-click install through Modrinth App or Prism Launcher',
        'Multiplayer and server-friendly'
      ],
      downloadUrl: 'https://modrinth.com',
      downloadPlatform: 'Modrinth',
      githubUrl: '',
      purchaseUrl: '',
      configExample: {
        filename: 'modlist.json',
        language: 'json',
        description: 'Key mods included in this modpack release.',
        code: `{\n  "name": "Flux Modpack",\n  "loader": "Fabric 0.15.11",\n  "minecraft": "1.20.4",\n  "core_mods": ["Sodium", "Lithium", "Iris", "FerriteCore", "ModernFix"]\n}`
      },
      docs: {
        title: 'Modpack Installation Guide',
        description: 'How to install this modpack on your Minecraft launcher.',
        steps: [
          { step: 1, title: 'Open on Modrinth', detail: 'Click the download link to view the modpack page on Modrinth.' },
          { step: 2, title: 'One-Click Install', detail: 'Click "Install" in the Modrinth App, or download the .mrpack file for Prism / CurseForge launcher.' },
          { step: 3, title: 'Launch Game', detail: 'Select the profile and launch Minecraft.' }
        ]
      },
      changelog: [
        {
          version: 'v1.0.0',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          highlights: ['Initial Modpack release'],
          types: [{ type: 'added', text: 'Curated mod list with optimized settings.' }]
        }
      ],
      supportedPlatforms: ['Fabric 1.20.4', 'Modrinth App', 'Prism Launcher']
    };
  }

  if (type === 'Skript') {
    return {
      id,
      slug: 'my-skript',
      name: 'My Custom Skript',
      tagline: 'Lightweight Skript for custom Minecraft server mechanics.',
      description: 'Clean, lag-free Skript code designed for Paper and Spigot servers.',
      longDescription: 'Efficient Skript utilizing modern Skript syntax and asynchronous processing where supported.',
      version: 'v1.0.0',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      author: 'Flux',
      category: 'Skript',
      projectType: 'Skript',
      tags: ['Skript', 'Server Mechanics', 'Spigot', 'Paper'],
      stars: 1,
      downloads: '0',
      price: 'Free',
      isPopular: false,
      isNew: true,
      features: [
        'Pure Skript syntax without bloated dependencies',
        'Custom commands, permissions, and GUI support',
        'Instant live reload with /sk reload',
        'Optimized variable handling and garbage cleanup'
      ],
      downloadUrl: 'https://modrinth.com',
      downloadPlatform: 'Modrinth',
      githubUrl: '',
      purchaseUrl: '',
      configExample: {
        filename: 'script.sk',
        language: 'yaml',
        description: 'Primary Skript file source code.',
        code: `# ========================================\n# Custom Server Skript\n# ========================================\n\ncommand /fluxstatus:\n    permission: flux.admin\n    trigger:\n        send "&b[Flux]&f Server running at optimal performance!" to player\n`
      },
      docs: {
        title: 'Skript Installation Guide',
        description: 'How to install and activate this script on your server.',
        steps: [
          { step: 1, title: 'Get from Modrinth / Link', detail: 'Download the .sk file or copy the raw script from the link.' },
          { step: 2, title: 'Save in scripts folder', detail: 'Place the .sk file into /plugins/Skript/scripts/' },
          { step: 3, title: 'Reload Skript', detail: 'Run /sk reload <filename> in server console or chat.' }
        ]
      },
      changelog: [
        {
          version: 'v1.0.0',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          highlights: ['Initial Skript release'],
          types: [{ type: 'added', text: 'Initial release with core commands.' }]
        }
      ],
      supportedPlatforms: ['Skript 2.8+', 'Paper 1.20+', 'Purpur 1.20+']
    };
  }

  if (type === 'Config') {
    return {
      id,
      slug: 'my-config',
      name: 'Custom Server Config',
      tagline: 'Pre-configured and production-tuned config.yml setup.',
      description: 'Carefully tuned configuration file optimized for TPS stability and anti-lag performance.',
      longDescription: 'Battle-tested configurations ready to drop into your server files for instantaneous performance improvements.',
      version: 'v1.0.0',
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      author: 'Flux',
      category: 'Config',
      projectType: 'Config',
      tags: ['Config', 'config.yml', 'Optimization', 'Server Setup'],
      stars: 1,
      downloads: '0',
      price: 'Free',
      isPopular: false,
      isNew: true,
      features: [
        'Eliminates common server lag vectors and tick spikes',
        'Includes detailed inline explanations for every setting',
        'Drop-in replacement for default files',
        'Benchmarked on 100+ player live servers'
      ],
      downloadUrl: 'https://modrinth.com',
      downloadPlatform: 'Modrinth',
      githubUrl: '',
      purchaseUrl: '',
      configExample: {
        filename: 'config.yml',
        language: 'yaml',
        description: 'Tuned configuration ready for deployment.',
        code: `# ========================================\n# Production Optimized config.yml\n# ========================================\n\nperformance:\n  tick_rate: 20\n  view_distance: 8\n  simulation_distance: 6\n  entity_activation_range:\n    monsters: 24\n    animals: 16\n    misc: 8\n`
      },
      docs: {
        title: 'Config Setup Guide',
        description: 'How to install and apply this configuration file.',
        steps: [
          { step: 1, title: 'Open Download Link', detail: 'Navigate to the download link on Modrinth or GitHub.' },
          { step: 2, title: 'Backup Current Config', detail: 'Make a backup of your existing config file before replacing it.' },
          { step: 3, title: 'Apply & Restart', detail: 'Paste the new config into your server folder and restart your server.' }
        ]
      },
      changelog: [
        {
          version: 'v1.0.0',
          date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          highlights: ['Initial config release'],
          types: [{ type: 'added', text: 'Optimized server settings preset.' }]
        }
      ],
      supportedPlatforms: ['Paper 1.20+', 'Purpur 1.20+', 'Pufferfish', 'Velocity']
    };
  }

  // Default: Plugin
  return {
    id,
    slug: 'my-plugin',
    name: 'My New Plugin',
    tagline: 'High-performance plugin for Minecraft server environments.',
    description: 'Detailed description of your plugin capabilities, optimization features, and architecture.',
    longDescription:
      'Engineered with modern practices, minimal CPU overhead, and instant reload capabilities. Seamlessly integrates with Spigot, Paper, and Purpur servers.',
    version: 'v1.0.0',
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    author: 'Flux',
    category: 'Plugin',
    projectType: 'Plugin',
    tags: ['Plugin', 'Paper', 'Spigot', 'High Performance'],
    stars: 1,
    downloads: '0',
    price: 'Free',
    isPopular: false,
    isNew: true,
    features: [
      'Sub-millisecond processing loop',
      'Configurable via config.yml',
      'Instant hot-reload without server restart',
      'Paper & Purpur optimization hooks'
    ],
    downloadUrl: 'https://modrinth.com',
    downloadPlatform: 'Modrinth',
    githubUrl: '',
    purchaseUrl: '',
    configExample: {
      filename: 'config.yml',
      language: 'yaml',
      description: 'Default configuration file generated on first run.',
      code: `# ========================================\n# Plugin Configuration\n# ========================================\n\nenabled: true\ndebug_mode: false\nrefresh_interval_ticks: 20\n\nmessages:\n  prefix: "&b[Flux]&r "\n  reloaded: "&aConfiguration reloaded successfully!"\n`
    },
    docs: {
      title: 'Installation & Setup Guide',
      description: 'Follow these quick steps to install and start using this plugin on your server.',
      steps: [
        {
          step: 1,
          title: 'Get on Modrinth',
          detail: 'Navigate to the official Modrinth project page to download the latest verified release.',
          command: 'curl -O <modrinth_download_url>'
        },
        {
          step: 2,
          title: 'Deploy to Plugins Folder',
          detail: 'Place the downloaded .jar into your server /plugins directory.',
          command: 'mv plugin.jar /server/plugins/'
        },
        {
          step: 3,
          title: 'Restart or Reload Server',
          detail: 'Start your server or run the reload command to generate the configuration files.',
          command: '/reload confirm'
        }
      ]
    },
    changelog: [
      {
        version: 'v1.0.0',
        date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        highlights: ['Initial production release'],
        types: [
          { type: 'added', text: 'Initial release with core features and config support.' }
        ]
      }
    ],
    supportedPlatforms: ['Paper 1.20+', 'Purpur 1.20+', 'Spigot 1.20+']
  };
}
