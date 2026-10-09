import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTasks } from '../../src/hooks/useTasks';

import Screen from '../../src/components/ui/Screen';
import AppButton from '../../src/components/ui/AppButton';
import EmptyState from '../../src/components/ui/EmptyState';

export default function TaskDetails() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const {
    getTaskById,
    toggleTaskStatus,
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

  const isCompleted =
    task.status === 'completed';

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>
          {task.title}
        </Text>

        <Text style={styles.label}>
          Предмет:
        </Text>

        <Text style={styles.value}>
          {task.subject}
        </Text>

        <Text style={styles.label}>
          Приоритет:
        </Text>

        <Text style={styles.value}>
          {getPriorityName(task.priority)}
        </Text>

        <Text style={styles.label}>
          Статус:
        </Text>

        <Text style={styles.value}>
          {isCompleted
            ? 'Выполнено'
            : 'В процессе'}
        </Text>

        <View style={styles.buttons}>
          <AppButton
            title={
              isCompleted
                ? 'Вернуть в работу'
                : 'Выполнить'
            }
            onPress={() =>
              toggleTaskStatus(task.id)
            }
          />

          <AppButton
            title="Редактировать"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname:
                  '/task/edit/[id]',
                params: {
                  id: task.id,
                },
              })
            }
          />
        </View>
      </View>
    </Screen>
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
  container: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#666',
  },

  value: {
    fontSize: 16,
  },

  buttons: {
    marginTop: 24,
  },
});