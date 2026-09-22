import { PluginItem } from '../types';
import { getAllProjects, getProjectBySlug } from './projectStore';

// Initialized dynamically from storage; starts empty per user request
export const PLUGINS_DATA: PluginItem[] = getAllProjects();

export function getPluginBySlug(slug: string): PluginItem | undefined {
  return getProjectBySlug(slug);
}
