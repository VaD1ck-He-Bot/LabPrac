
export type TaskStatus = 'active' | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
}

export type TaskPreview = Pick<
  Task,
  'id' | 'title' | 'priority' | 'status'
>;

export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdAt' | 'status'
>;

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  status?: TaskStatus;
};
