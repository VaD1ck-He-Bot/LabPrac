export type TaskStatus =
  'active' | 'completed';

export type TaskPriority =
  'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: string;
  dueDate?: string;
}

/*
 * Данные, которые нужны для краткого
 * отображения задачи.
 *
 * Pick берёт только выбранные свойства
 * из интерфейса Task.
 */
export type TaskPreview = Pick<
  Task,
  'id' | 'title' | 'priority' | 'status'
>;

/*
 * Данные для создания новой задачи.
 *
 * Omit исключает свойства, которые
 * создаются автоматически.
 */
export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdAt' | 'status'
>;

/*
 * Данные для изменения задачи.
 */
export type UpdateTaskInput =
  Partial<CreateTaskInput> & {
    status?: TaskStatus;
  };