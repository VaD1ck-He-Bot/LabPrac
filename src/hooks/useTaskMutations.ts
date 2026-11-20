
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createTask,
  updateTask,
  deleteTask,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '../api/tasks';

import { ApiRequestError } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export function useTaskMutations() {
  const { user, accessToken, signOut } = useAuth();
  const queryClient = useQueryClient();

  async function handleUnauthorized(error: unknown) {
    if (error instanceof ApiRequestError && error.status === 401) {
      queryClient.clear();
      await signOut();
    }
  }

  const createMutation = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      if (!accessToken || !user) {
        throw new Error('Необходимо войти в аккаунт.');
      }

      return createTask(input, accessToken);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id],
      });
    },
    onError: handleUnauthorized,
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: UpdateTaskInput;
    }) => {
      if (!accessToken || !user) {
        throw new Error('Необходимо войти в аккаунт.');
      }

      return updateTask(id, input, accessToken);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id],
      });
    },
    onError: handleUnauthorized,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!accessToken || !user) {
        throw new Error('Необходимо войти в аккаунт.');
      }

      return deleteTask(id, accessToken);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ['tasks', user?.id],
      });
    },
    onError: handleUnauthorized,
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
