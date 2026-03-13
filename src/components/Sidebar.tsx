import React, { useState } from 'react';
import { Project } from '../types';
import { cn } from '../utils';
import { 
  Calendar, 
  Inbox, 
  CheckCircle2, 
  Trash2, 
  Plus,
  Moon,
  Sun
} from 'lucide-react';

type SidebarProps = {
  projects: Project[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onAddProject: (name: string, color: string) => void;
  onDeleteProject: (id: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

export function Sidebar({ projects, activeFilter, setActiveFilter, onAddProject, onDeleteProject, theme, toggleTheme }: SidebarProps) {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(COLORS[4]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim(), newProjectColor);
      setNewProjectName('');
      setIsAddingProject(false);
    }
  };

  const filters = [
    { id: 'today', label: 'Meu Dia', icon: Calendar },
    { id: 'all', label: 'Todas as Tarefas', icon: Inbox },
    { id: 'completed', label: 'Concluídas', icon: CheckCircle2 },
    { id: 'deleted', label: 'Lixeira', icon: Trash2 },
  ];

  return (
    <div className="w-64 bg-zinc-50 dark:bg-zinc-900/40 border-r border-zinc-200 dark:border-zinc-800/60 h-full flex flex-col transition-colors">
      <div className="p-4">
        <h1 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-blue-500" />
          TAREFAS
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 space-y-1">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                activeFilter === filter.id 
                  ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400" 
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              )}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-8 px-3">
          <div className="flex items-center justify-between px-3 mb-2">
            <h2 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Projetos</h2>
            <button 
              onClick={() => setIsAddingProject(true)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {projects.map(project => (
              <div key={project.id} className="group flex items-center justify-between">
                <button
                  onClick={() => setActiveFilter(`project_${project.id}`)}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    activeFilter === `project_${project.id}`
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="truncate">{project.name}</span>
                </button>
                {project.id !== 'default' && (
                  <button 
                    onClick={() => onDeleteProject(project.id)}
                    className="p-2 text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
                    title="Excluir Projeto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isAddingProject && (
            <form onSubmit={handleAddProject} className="mt-2 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Nome do projeto"
                className="w-full text-sm px-2 py-1 border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 rounded mb-2 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex gap-1 mb-3">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewProjectColor(color)}
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      newProjectColor === color ? "border-zinc-400 dark:border-zinc-500" : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="text-xs px-2 py-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Adicionar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/60">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
        </button>
      </div>
    </div>
  );
}
