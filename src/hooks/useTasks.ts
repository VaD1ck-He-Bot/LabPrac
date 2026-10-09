import { useContext } from 'react';

import { TasksContext } from '../context/TaskContext';

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error(
      'useTasks должен быть использован в TasksProvider'
    );
  }

  return context;
}