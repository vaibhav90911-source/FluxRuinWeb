import { collection, doc, onSnapshot, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { PluginItem } from '../types';

const PROJECTS_STORAGE_KEY = 'flux_published_projects';
const FIRESTORE_COLLECTION = 'projects';

// Helper to sanitize objects for Firestore (removes any undefined properties)
function sanitizeForFirestore<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item
    );
  }
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined) continue;
    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      clean[key] = sanitizeForFirestore(val);
    } else if (Array.isArray(val)) {
      clean[key] = val.map((item) =>
        typeof item === 'object' && item !== null ? sanitizeForFirestore(item) : item
      );
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

// In-memory cache for ultra-fast instantaneous reads
let memoryProjects: PluginItem[] = (() => {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore error
  }
  return [];
})();

let isFirestoreListenerInitialized = false;

// Initialize real-time live sync with Firebase Firestore
export function initFirestoreProjectsSync(): () => void {
  if (isFirestoreListenerInitialized) {
    return () => {};
  }
  isFirestoreListenerInitialized = true;

  try {
    const projectsCol = collection(db, FIRESTORE_COLLECTION);
    
    // Real-time listener: triggers instantly for all connected users whenever anything changes
    const unsubscribe = onSnapshot(
      projectsCol,
      (snapshot) => {
        const firestoreProjects: PluginItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as PluginItem;
          if (data && (data.id || data.slug)) {
            firestoreProjects.push(data);
          }
        });

        // If Firestore had documents, update memory and localStorage
        if (firestoreProjects.length > 0) {
          memoryProjects = firestoreProjects;
          try {
            localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(memoryProjects));
          } catch {
            // Ignore storage quota error
          }
          window.dispatchEvent(new Event('flux_projects_updated'));
        } else if (memoryProjects.length > 0) {
          // If Firestore is completely empty but local storage has existing projects, sync them to Firestore
          memoryProjects.forEach((proj) => {
            const clean = sanitizeForFirestore(proj);
            setDoc(doc(db, FIRESTORE_COLLECTION, proj.id), clean).catch((err) => {
              console.error('Initial migration to Firestore error:', err);
            });
          });
        }
      },
      (error) => {
        console.warn('Firestore real-time subscription error:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to initialize Firestore listener:', err);
    return () => {};
  }
}

// Start listener immediately
initFirestoreProjectsSync();

export function getAllProjects(): PluginItem[] {
  return memoryProjects;
}

export function getProjectBySlug(slug: string): PluginItem | undefined {
  const all = getAllProjects();
  const clean = slug.toLowerCase();
  return all.find((p) => p.slug.toLowerCase() === clean || p.id.toLowerCase() === clean);
}

export function saveProject(project: PluginItem): PluginItem {
  const all = [...memoryProjects];
  const index = all.findIndex(
    (p) => p.id === project.id || p.slug.toLowerCase() === project.slug.toLowerCase()
  );

  let updatedList: PluginItem[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = { ...project };
  } else {
    updatedList = [project, ...all];
  }

  memoryProjects = updatedList;

  // Immediate local update for zero-lag UI responsiveness
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event('flux_projects_updated'));
  } catch (err) {
    console.error('Failed to save to local cache:', err);
  }

  // Real-time Cloud Save to Firebase Firestore
  try {
    const cleanDoc = sanitizeForFirestore(project);
    setDoc(doc(db, FIRESTORE_COLLECTION, project.id), cleanDoc)
      .then(() => {
        // Document updated in Firestore; all clients will receive onSnapshot immediately
      })
      .catch((err) => {
        console.error('Firestore saveProject error:', err);
      });
  } catch (err) {
    console.error('Failed to dispatch Firestore setDoc:', err);
  }

  return project;
}

export function deleteProject(id: string): boolean {
  const all = [...memoryProjects];
  const filtered = all.filter((p) => p.id !== id && p.slug !== id);

  memoryProjects = filtered;

  // Immediate local update
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('flux_projects_updated'));
  } catch (err) {
    console.error('Failed to update local cache on delete:', err);
  }

  // Cloud delete in Firebase Firestore
  try {
    deleteDoc(doc(db, FIRESTORE_COLLECTION, id))
      .then(() => {
        // Deleted in Firestore
      })
      .catch((err) => {
        console.error('Firestore deleteProject error:', err);
      });
  } catch (err) {
    console.error('Failed to dispatch Firestore deleteDoc:', err);
  }

  return true;
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
      docs: {
        title: 'Installation Instructions',
        description: 'How to install and activate this texture pack.',
        steps: [
          { step: 1, title: 'Visit Modrinth Page', detail: 'Click the download link to open the official release on Modrinth.' },
          { step: 2, title: 'Download Resource Pack', detail: 'Download the .zip file from Modrinth.' },
          { step: 3, title: 'Place in resourcepacks folder', detail: 'Open Minecraft > Options > Resource Packs > Open Pack Folder, and place the .zip file inside.' }
        ]
      },
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
      docs: {
        title: 'Modpack Installation Guide',
        description: 'How to install this modpack on your Minecraft launcher.',
        steps: [
          { step: 1, title: 'Open on Modrinth', detail: 'Click the download link to view the modpack page on Modrinth.' },
          { step: 2, title: 'One-Click Install', detail: 'Click "Install" in the Modrinth App, or download the .mrpack file for Prism / CurseForge launcher.' },
          { step: 3, title: 'Launch Game', detail: 'Select the profile and launch Minecraft.' }
        ]
      },
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
      docs: {
        title: 'Skript Installation Guide',
        description: 'How to install and activate this script on your server.',
        steps: [
          { step: 1, title: 'Get from Modrinth / Link', detail: 'Download the .sk file or copy the raw script from the link.' },
          { step: 2, title: 'Save in scripts folder', detail: 'Place the .sk file into /plugins/Skript/scripts/' },
          { step: 3, title: 'Reload Skript', detail: 'Run /sk reload <filename> in server console or chat.' }
        ]
      },
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
    supportedPlatforms: ['Paper 1.20+', 'Purpur 1.20+', 'Spigot 1.20+']
  };
}
