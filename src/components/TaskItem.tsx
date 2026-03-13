import React from 'react';
import { Task, Project } from '../types';
import { cn } from '../utils';
import { CheckCircle2, Circle, Clock, Trash2 } from 'lucide-react';
import { format, isToday, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TaskItemProps = {
  task: Task;
  project?: Project;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onSelect: (task: Task) => void;
  onDelete: (id: string) => void;
};

export function TaskItem({ task, project, onToggleStatus, onSelect, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const isDeleted = task.status === 'deleted';

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleStatus(task.id, task.status);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <div
      onClick={() => onSelect(task)}
      className={cn(
        "group flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md",
        isCompleted ? "opacity-60 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/50" : "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-500/50",
        isDeleted ? "opacity-50" : ""
      )}
    >
      <button
        onClick={handleToggle}
        className={cn(
          "flex-shrink-0 transition-colors",
          isCompleted ? "text-green-500 dark:text-green-500" : "text-zinc-300 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400"
        )}
      >
        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate transition-colors",
          isCompleted ? "text-zinc-500 dark:text-zinc-500 line-through" : "text-zinc-800 dark:text-zinc-200"
        )}>
          {task.title}
        </p>
        
        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {project && (
            <div className="flex items-center gap-1.5">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate max-w-[100px]">{project.name}</span>
            </div>
          )}
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1",
              isPast(task.dueDate) && !isToday(task.dueDate) && !isCompleted ? "text-red-500 dark:text-red-400 font-medium" : "",
              isToday(task.dueDate) && !isCompleted ? "text-blue-500 dark:text-blue-400 font-medium" : ""
            )}>
              <Clock className="w-3 h-3" />
              <span>{format(task.dueDate, "dd MMM", { locale: ptBR })}</span>
            </div>
          )}

          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-1">
              <span>
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="p-2 text-zinc-400 dark:text-zinc-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity"
        title={isDeleted ? "Excluir permanentemente" : "Mover para lixeira"}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
