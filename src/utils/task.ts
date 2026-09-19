import {
  Task,
  TaskPriority,
  TaskStatus,
} from '../types/task';

/**
 * Возвращает количество активных задач.
 */
export function getActiveTaskCount(
  tasks: Task[]
): number {
  return tasks.filter(
    (task) => task.status === 'active'
  ).length;
}

/**
 * Возвращает количество завершённых задач.
 */
export function getCompletedTaskCount(
  tasks: Task[]
): number {
  return tasks.filter(
    (task) => task.status === 'completed'
  ).length;
}

/**
 * Сортирует задачи по приоритету.
 * Высокий → средний → низкий.
 *
 * Создаётся новый массив,
 * исходный массив не изменяется.
 */
export function sortTasksByPriority(
  tasks: Task[]
): Task[] {
  const priorityOrder: Record<
    TaskPriority,
    number
  > = {
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...tasks].sort(
    (a, b) =>
      priorityOrder[a.priority] -
      priorityOrder[b.priority]
  );
}

/**
 * Возвращает только задачи
 * указанного статуса.
 */
export function filterTasksByStatus(
  tasks: Task[],
  status: TaskStatus
): Task[] {
  return tasks.filter(
    (task) => task.status === status
  );
}

/**
 * Проверяет, просрочена ли задача.
 *
 * Если даты выполнения нет,
 * задача не считается просроченной.
 */
export function isTaskOverdue(
  task: Task,
  now: Date = new Date()
): boolean {
  if (!task.dueDate) {
    return false;
  }

  return (
    task.status === 'active' &&
    new Date(task.dueDate) < now
  );
}