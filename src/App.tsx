import React, { useState, useMemo } from 'react';
import { useStore } from './store';
import { useTheme } from './theme';
import { Sidebar } from './components/Sidebar';
import { TaskItem } from './components/TaskItem';
import { TaskDetail } from './components/TaskDetail';
import { isToday, isPast, startOfDay } from 'date-fns';
import { Plus, Search, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const {
    tasks,
    projects,
    addProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    permanentlyDeleteTask,
    addSubtask,
    updateSubtask,
    deleteSubtask,
  } = useStore();

  const { theme, toggleTheme } = useTheme();

  const [activeFilter, setActiveFilter] = useState('today');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTask = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply main filter
    if (activeFilter === 'today') {
      filtered = filtered.filter(t => 
        t.status !== 'deleted' && 
        (
          (t.dueDate && (isToday(t.dueDate) || isPast(t.dueDate))) || 
          (!t.dueDate && isToday(t.createdAt))
        )
      );
    } else if (activeFilter === 'all') {
      filtered = filtered.filter(t => t.status !== 'deleted');
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    } else if (activeFilter === 'deleted') {
      filtered = filtered.filter(t => t.status === 'deleted');
    } else if (activeFilter.startsWith('project_')) {
      const projectId = activeFilter.split('_')[1];
      filtered = filtered.filter(t => t.projectId === projectId && t.status !== 'deleted');
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description?.toLowerCase().includes(query)
      );
    }

    // Sort: incomplete first, then by due date, then creation date
    return filtered.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      
      if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return b.createdAt - a.createdAt;
    });
  }, [tasks, activeFilter, searchQuery]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const projectId = activeFilter.startsWith('project_') ? activeFilter.split('_')[1] : projects[0].id;
      const dueDate = activeFilter === 'today' ? startOfDay(new Date()).getTime() : undefined;
      
      addTask(projectId, newTaskTitle.trim(), dueDate);
      setNewTaskTitle('');
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    updateTask(id, { status: newStatus });
  };

  const getHeaderTitle = () => {
    if (activeFilter === 'today') return 'Meu Dia';
    if (activeFilter === 'all') return 'Todas as Tarefas';
    if (activeFilter === 'completed') return 'Concluídas';
    if (activeFilter === 'deleted') return 'Lixeira';
    if (activeFilter.startsWith('project_')) {
      const p = projects.find(p => p.id === activeFilter.split('_')[1]);
      return p ? p.name : 'Projeto';
    }
    return 'Tarefas';
  };

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 overflow-hidden font-sans text-zinc-900 dark:text-zinc-100 transition-colors">
      <Sidebar
        projects={projects}
        activeFilter={activeFilter}
        setActiveFilter={(f) => {
          setActiveFilter(f);
          setSelectedTaskId(null);
        }}
        onAddProject={addProject}
        onDeleteProject={deleteProject}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50/50 dark:bg-zinc-950/50 transition-colors">
        <header className="px-8 py-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 sticky top-0 z-10 transition-colors">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">{getHeaderTitle()}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'tarefa' : 'tarefas'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-transparent focus:bg-white dark:focus:bg-zinc-950 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm w-64 transition-all dark:text-zinc-100 dark:placeholder-zinc-500"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto">
            {activeFilter !== 'deleted' && activeFilter !== 'completed' && (
              <form onSubmit={handleAddTask} className="mb-8 relative shadow-sm rounded-xl">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Plus className="w-5 h-5 text-blue-500" />
                </div>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Adicionar nova tarefa..."
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow hover:shadow-md"
                />
              </form>
            )}

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredTasks.map(task => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaskItem
                      task={task}
                      project={projects.find(p => p.id === task.projectId)}
                      onToggleStatus={handleToggleStatus}
                      onSelect={(t) => setSelectedTaskId(t.id)}
                      onDelete={activeFilter === 'deleted' ? permanentlyDeleteTask : deleteTask}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <CheckCircle2 className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">Nenhuma tarefa encontrada</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                    {searchQuery ? 'Tente buscar com outros termos.' : 'Aproveite o seu dia!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedTask && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className="border-l border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 z-20 transition-colors"
          >
            <div className="w-80 h-full">
              <TaskDetail
                task={selectedTask}
                projects={projects}
                onClose={() => setSelectedTaskId(null)}
                onUpdate={updateTask}
                onAddSubtask={addSubtask}
                onUpdateSubtask={updateSubtask}
                onDeleteSubtask={deleteSubtask}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
