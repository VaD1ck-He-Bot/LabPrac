import { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TaskCard from './src/components/TaskCard';
import TaskForm from './src/components/TaskForm';
import { Task } from './src/types/task';

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

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const completedCount = tasks.filter(
    (task) => task.isCompleted
  ).length;

  const handleAddTask = (task: Task) => {
    setTasks((currentTasks) => [task, ...currentTasks]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Campus Planner</Text>

          <Text style={styles.subtitle}>
            Учебные задачи на сегодня
          </Text>

          <View style={styles.stats}>
            <Text style={styles.statText}>
              Всего: {tasks.length}
            </Text>

            <Text style={styles.statText}>
              Выполнено: {completedCount}
            </Text>
          </View>
        </View>

        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Список пока пуст
            </Text>
          }
          ListFooterComponent={
            <TaskForm onAdd={handleAddTask} />
          }
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    flex: 1,
  },

  header: {
    padding: 12,
    paddingBottom: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },

  stats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },

  statText: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  listContent: {
    padding: 12,
    paddingTop: 6,
    flexGrow: 1,
  },

  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontSize: 15,
    marginTop: 30,
  },
});