
import { apiRequest } from './client';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '../types/task';

export type { Task, CreateTaskInput, UpdateTaskInput };

export async function getTasks(token: string): Promise<Task[]> {
  const response = await apiRequest<{ items: Task[] }>(
    '/tasks',
    token,
  );

  return response.items;
}

export function getTaskById(
  id: string,
  token: string,
): Promise<Task> {
  return apiRequest<Task>(
    `/tasks/${encodeURIComponent(id)}`,
    token,
  );
}

export function createTask(
  input: CreateTaskInput,
  token: string,
): Promise<Task> {
  return apiRequest<Task>('/tasks', token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTask(
  id: string,
  input: UpdateTaskInput,
  token: string,
): Promise<Task> {
  return apiRequest<Task>(
    `/tasks/${encodeURIComponent(id)}`,
    token,
    {
      method: 'PATCH',
      body: JSON.stringify(input),
    },
  );
}

export function deleteTask(
  id: string,
  token: string,
): Promise<void> {
  return apiRequest<void>(
    `/tasks/${encodeURIComponent(id)}`,
    token,
    { method: 'DELETE' },
  );
}
