
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getTasks } from '../api/tasks';
import { ApiRequestError } from '../api/client';
import { useAuth } from '../auth/AuthContext';

export function useTasksQuery() {
  const { user, accessToken, signOut } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['tasks', user?.id],

    queryFn: async () => {
      if (!accessToken || !user) {
        throw new Error('Необходимо войти в аккаунт.');
      }

      try {
        const result = await getTasks(accessToken);
        return result;
      } catch (error) {
        if (
          error instanceof ApiRequestError &&
          error.status === 401
        ) {
          queryClient.clear();
          await signOut();
        }

        throw error;
      }
    },

    enabled: Boolean(accessToken && user),

    retry: (failureCount, error) => {
      if (
        error instanceof ApiRequestError &&
        error.status === 401
      ) {
        return false;
      }

      return failureCount < 2;
    },
  });
}
