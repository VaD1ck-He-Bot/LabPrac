import {
  createContext,
  useState,
} from 'react';

import {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from '../types/task';

interface TasksContextType {
  tasks: Task[];

  createTask: (input: CreateTaskInput) => void;

  updateTask: (
    id: string,
    input: UpdateTaskInput
  ) => void;

  removeTask: (id: string) => void;

  toggleTaskStatus: (id: string) => void;

  getTaskById: (id: string) => Task | undefined;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Сделать лабораторную №1',
    subject: 'Разработка мобильных приложений',
    priority: 'high',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Прочитать главу 5',
    subject: 'Базы данных',
    priority: 'medium',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Подготовить презентацию',
    subject: 'Компьютерные сети',
    priority: 'high',
    status: 'completed',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Повторить TypeScript',
    subject: 'Программирование',
    priority: 'low',
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export const TasksContext = createContext<
  TasksContextType | undefined
>(undefined);

export function TasksProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const createTask = (input: CreateTaskInput) => {
    const newTask: Task = {
      ...input,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    setTasks((currentTasks) => [
      newTask,
      ...currentTasks,
    ]);
  };

  const updateTask = (
    id: string,
    input: UpdateTaskInput
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...input,
            }
          : task
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== id
      )
    );
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === 'active'
                  ? 'completed'
                  : 'active',
            }
          : task
      )
    );
  };

  const getTaskById = (id: string) => {
    return tasks.find(
      (task) => task.id === id
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        removeTask,
        toggleTaskStatus,
        getTaskById,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}