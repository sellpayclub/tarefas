export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'deleted';

export type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: number;
  subtasks: Subtask[];
  createdAt: number;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: number;
};
