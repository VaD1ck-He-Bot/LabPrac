import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TaskForm from '../../src/components/TaskForm';
import { useTasks } from '../../src/context/TaskContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function NewTask() {
  const { addTask } = useTasks();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const handleAddTask = (task: Parameters<typeof addTask>[0]) => {
    addTask(task);
    router.back();
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDark && styles.darkBackground,
      ]}
      edges={['left', 'right', 'bottom']}
    >
      <View style={styles.container}>

        <TaskForm onAdd={handleAddTask} />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  darkBackground: {
    backgroundColor: '#222',
  },

  container: {
    flex: 1,
    padding: 12,
  },

  darkText: {
    color: '#fff',
  },
});