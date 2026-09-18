import { createContext, useContext, useState } from 'react';
import { Task } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Сделать лабораторную №1',
    subject: 'Разработка мобильных приложений',
    priority: 'high',
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Прочитать главу 5',
    subject: 'Базы данных',
    priority: 'medium',
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Подготовить презентацию',
    subject: 'Компьютерные сети',
    priority: 'high',
    isCompleted: true,
  },
  {
    id: '4',
    title: 'Повторить TypeScript',
    subject: 'Программирование',
    priority: 'low',
    isCompleted: false,
  },
];

const TaskContext = createContext<TaskContextType | undefined>(
  undefined
);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (task: Task) => {
    setTasks((currentTasks) => [task, ...currentTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider');
  }

  return context;
}