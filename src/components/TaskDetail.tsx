import React, { useState, useEffect } from 'react';
import { Task, Project, Subtask } from '../types';
import { cn } from '../utils';
import { 
  X, 
  Calendar as CalendarIcon, 
  AlignLeft, 
  CheckSquare, 
  Trash2, 
  Plus,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TaskDetailProps = {
  task: Task;
  projects: Project[];
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onUpdateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  onDeleteSubtask: (taskId: string, subtaskId: string) => void;
};

export function TaskDetail({ 
  task, 
  projects, 
  onClose, 
  onUpdate, 
  onAddSubtask, 
  onUpdateSubtask, 
  onDeleteSubtask 
}: TaskDetailProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [newSubtask, setNewSubtask] = useState('');

  // Sync state when task changes
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
  }, [task]);

  const handleTitleBlur = () => {
    if (title.trim() && title !== task.title) {
      onUpdate(task.id, { title: title.trim() });
    } else {
      setTitle(task.title);
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      onUpdate(task.id, { description: description.trim() });
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const project = projects.find(p => p.id === task.projectId);

  return (
    <div className="w-80 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800/60 h-full flex flex-col shadow-xl absolute right-0 top-0 z-10 sm:relative sm:shadow-none transition-colors">
      <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <select
            value={task.projectId}
            onChange={(e) => onUpdate(task.id, { projectId: e.target.value })}
            className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id} className="dark:bg-zinc-900">{p.name}</option>
            ))}
          </select>
        </div>
        <button onClick={onClose} className="p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className={cn(
              "w-full text-xl font-semibold bg-transparent border-none focus:ring-0 p-0 placeholder-zinc-300 dark:placeholder-zinc-700 transition-colors",
              task.status === 'completed' ? "text-zinc-400 dark:text-zinc-600 line-through" : "text-zinc-900 dark:text-zinc-100"
            )}
            placeholder="Título da tarefa"
          />
        </div>

        {/* Status & Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-24 text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> Status
            </div>
            <select
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value as any })}
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="todo" className="dark:bg-zinc-900">A Fazer</option>
              <option value="in_progress" className="dark:bg-zinc-900">Em Andamento</option>
              <option value="completed" className="dark:bg-zinc-900">Concluído</option>
              <option value="deleted" className="dark:bg-zinc-900">Lixeira</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="w-24 text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" /> Data
            </div>
            <input
              type="date"
              value={task.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m, d] = e.target.value.split('-');
                  const date = new Date(Number(y), Number(m) - 1, Number(d)).getTime();
                  onUpdate(task.id, { dueDate: date });
                } else {
                  onUpdate(task.id, { dueDate: undefined });
                }
              }}
              className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2 py-1 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500 [color-scheme:light] dark:[color-scheme:dark] transition-colors"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-2">
            <AlignLeft className="w-4 h-4" /> Descrição
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Adicione detalhes sobre a tarefa..."
            className="w-full min-h-[100px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm text-zinc-700 dark:text-zinc-300 resize-y focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-400 dark:placeholder-zinc-600 transition-colors"
          />
        </div>

        {/* Subtasks */}
        <div>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-sm font-medium mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> Subtarefas
            </div>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-600 dark:text-zinc-300">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            {task.subtasks.map(subtask => (
              <div key={subtask.id} className="flex items-start gap-2 group">
                <button
                  onClick={() => onUpdateSubtask(task.id, subtask.id, { completed: !subtask.completed })}
                  className={cn(
                    "mt-0.5 flex-shrink-0 transition-colors",
                    subtask.completed ? "text-green-500" : "text-zinc-300 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400"
                  )}
                >
                  {subtask.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => onUpdateSubtask(task.id, subtask.id, { title: e.target.value })}
                  className={cn(
                    "flex-1 text-sm bg-transparent border-none focus:ring-0 p-0 transition-colors",
                    subtask.completed ? "text-zinc-400 dark:text-zinc-600 line-through" : "text-zinc-700 dark:text-zinc-300"
                  )}
                />
                <button
                  onClick={() => onDeleteSubtask(task.id, subtask.id)}
                  className="p-1 text-zinc-400 dark:text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSubtask} className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Adicionar subtarefa"
              className="flex-1 text-sm bg-transparent border-none focus:ring-0 p-0 placeholder-zinc-400 dark:placeholder-zinc-600 text-zinc-700 dark:text-zinc-300"
            />
          </form>
        </div>
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-between items-center text-xs text-zinc-400 dark:text-zinc-500">
        <span>Criado em {format(task.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
        <button
          onClick={() => onUpdate(task.id, { status: 'deleted' })}
          className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
          title="Mover para lixeira"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
