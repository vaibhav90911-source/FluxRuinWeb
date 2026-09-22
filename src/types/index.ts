export interface PluginConfig {
  filename: string;
  language: string;
  code: string;
  description: string;
}

export interface DocStep {
  step: number;
  title: string;
  detail: string;
  command?: string;
}

export interface PluginDocs {
  title: string;
  description: string;
  steps: DocStep[];
}

export interface ChangelogItem {
  version: string;
  date: string;
  highlights: string[];
  types: {
    type: 'added' | 'fixed' | 'improved';
    text: string;
  }[];
}

export interface PluginItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  version: string;
  lastUpdated: string;
  author: string;
  category: string;
  tags: string[];
  stars: number;
  downloads: string;
  price: string;
  isPopular?: boolean;
  isNew?: boolean;
  features: string[];
  downloadUrl: string;
  downloadPlatform?: string; // e.g. 'Modrinth', 'CurseForge', 'GitHub', 'BuiltByBit', etc.
  projectType?: string; // 'Plugin', 'Texture Pack', 'Modpack', 'Skript', 'Config'
  githubUrl?: string;
  purchaseUrl?: string;
  configExample: PluginConfig;
  docs: PluginDocs;
  changelog: ChangelogItem[];
  supportedPlatforms: string[];
}

export interface PlatformFeature {
  id: string;
  title: string;
  shortDesc: string;
  detailedDesc: string;
  metric: string;
  metricLabel: string;
  iconName: string;
  tags: string[];
  specs: { label: string; value: string }[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}
