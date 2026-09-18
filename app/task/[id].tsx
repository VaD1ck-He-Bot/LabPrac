import { router, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTasks } from '../../src/context/TaskContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { tasks, toggleTask } = useTasks();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const task = tasks.find((item) => item.id === id);

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

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>
              Назад
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          {task.title}
        </Text>

        <Text
          style={[
            styles.label,
            isDark && styles.darkText,
          ]}
        >
          Предмет:
        </Text>

        <Text
          style={[
            styles.value,
            isDark && styles.darkText,
          ]}
        >
          {task.subject}
        </Text>

        <Text
          style={[
            styles.label,
            isDark && styles.darkText,
          ]}
        >
          Приоритет:
        </Text>

        <Text
          style={[
            styles.value,
            isDark && styles.darkText,
          ]}
        >
          {getPriorityName(task.priority)}
        </Text>

        <Text
          style={[
            styles.label,
            isDark && styles.darkText,
          ]}
        >
          Статус:
        </Text>

        <Text
          style={[
            styles.value,
            isDark && styles.darkText,
          ]}
        >
          {task.isCompleted
            ? 'Выполнено'
            : 'В процессе'}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => toggleTask(task.id)}
        >
          <Text style={styles.buttonText}>
            {task.isCompleted
              ? 'Вернуть в работу'
              : 'Выполнить'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            router.push({
              pathname: '/task/edit/[id]',
              params: { id: task.id },
            })
          }
        >
          <Text style={styles.buttonText}>
            Редактировать
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

function getPriorityName(
  priority: 'low' | 'medium' | 'high'
) {
  switch (priority) {
    case 'low':
      return 'Низкий';

    case 'medium':
      return 'Средний';

    case 'high':
      return 'Высокий';
  }
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
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },

  value: {
    fontSize: 16,
    marginTop: 4,
  },

  darkText: {
    color: '#fff',
  },

  button: {
    backgroundColor: '#555',
    padding: 11,
    alignItems: 'center',
    marginTop: 15,
  },

  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});