import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Project, TaskStatus, Subtask } from './types';

const TASKS_KEY = 'tarefas_tasks';
const PROJECTS_KEY = 'tarefas_projects';

export function useStore() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(PROJECTS_KEY);
    return saved ? JSON.parse(saved) : [
      { id: 'default', name: 'Geral', color: '#3b82f6', createdAt: Date.now() }
    ];
  });

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  // Projects
  const addProject = (name: string, color: string = '#3b82f6', description?: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      color,
      description,
      createdAt: Date.now(),
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    // Move tasks to default or delete them? Let's delete them for now or move to 'deleted'
    setTasks(tasks.map(t => t.projectId === id ? { ...t, status: 'deleted' } : t));
  };

  // Tasks
  const addTask = (projectId: string, title: string, dueDate?: number) => {
    const newTask: Task = {
      id: uuidv4(),
      projectId,
      title,
      status: 'todo',
      dueDate,
      subtasks: [],
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    updateTask(id, { status: 'deleted' });
  };

  const permanentlyDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Subtasks
  const addSubtask = (taskId: string, title: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: [...t.subtasks, { id: uuidv4(), title, completed: false }]
        };
      }
      return t;
    }));
  };

  const updateSubtask = (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.map(st => st.id === subtaskId ? { ...st, ...updates } : st)
        };
      }
      return t;
    }));
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subtasks: t.subtasks.filter(st => st.id !== subtaskId)
        };
      }
      return t;
    }));
  };

  return {
    tasks,
    projects,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    permanentlyDeleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  };
}
