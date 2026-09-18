import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import TaskForm from '../../../src/components/TaskForm';
import { useTasks } from '../../../src/context/TaskContext';
import { useTheme } from '../../../src/context/ThemeContext';

export default function EditTask() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { tasks, updateTask } = useTasks();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const task = tasks.find(
    (item) => item.id === id
  );

  if (!task) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          isDark && styles.darkBackground,
        ]}
        edges={['left', 'right', 'bottom']}
      >
        <View style={styles.container}>

          <Text
            style={[
              styles.title,
              isDark && styles.darkText,
            ]}
          >
            Задача не найдена
          </Text>

        </View>
      </SafeAreaView>
    );
  }

  const handleUpdateTask = (updatedTask: typeof task) => {
    updateTask(updatedTask);
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

        <TaskForm
          initialTask={task}
          onUpdate={handleUpdateTask}
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

  darkBackground: {
    backgroundColor: '#222',
  },

  container: {
    flex: 1,
    padding: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  darkText: {
    color: '#fff',
  },
});