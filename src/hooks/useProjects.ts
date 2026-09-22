import { useState, useEffect } from 'react';
import { PluginItem } from '../types';
import { getAllProjects } from '../data/projectStore';

export function useProjects(): PluginItem[] {
  const [projects, setProjects] = useState<PluginItem[]>(() => getAllProjects());

  useEffect(() => {
    const refresh = () => {
      setProjects(getAllProjects());
    };

    // Initial check
    refresh();

    window.addEventListener('flux_projects_updated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('flux_projects_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return projects;
}
