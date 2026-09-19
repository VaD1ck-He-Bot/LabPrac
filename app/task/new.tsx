import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import Screen from '../../src/components/ui/Screen';
import TaskForm from '../../src/components/TaskForm';
import { useTasks } from '../../src/hooks/useTasks';

export default function NewTask() {
  const { createTask } = useTasks();

  const handleAddTask = (
    input: Parameters<typeof createTask>[0]
  ) => {
    createTask(input);
    router.back();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <TaskForm onAdd={handleAddTask} />
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