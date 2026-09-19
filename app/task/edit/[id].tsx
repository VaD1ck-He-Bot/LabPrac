import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import TaskForm from '../../../src/components/TaskForm';
import { useTasks } from '../../../src/hooks/useTasks';
import Screen from '../../../src/components/ui/Screen';
import EmptyState from '../../../src/components/ui/EmptyState';

export default function EditTask() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    getTaskById,
    updateTask,
  } = useTasks();

  const task = getTaskById(id);

  if (!task) {
    return (
      <Screen>
        <EmptyState
          title="Задача не найдена"
          description="Возможно, задача была удалена."
          actionLabel="Назад"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const handleUpdateTask = (
    input: Parameters<typeof updateTask>[1]
  ) => {
    updateTask(task.id, input);
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TaskForm
          initialTask={task}
          onUpdate={handleUpdateTask}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
});