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

import { useTheme } from '../../src/context/ThemeContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function TaskDetails() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const {
    getTaskById,
    toggleTaskStatus,
  } = useTasks();

  const { theme } = useTheme();
  const themeColors = colors[theme];

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
        <Text
          style={[
            styles.title,
            {
              color: themeColors.text,
            },
          ]}
        >
          {task.title}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: themeColors.secondaryText,
            },
          ]}
        >
          Предмет:
        </Text>

        <Text
          style={[
            styles.value,
            {
              color: themeColors.text,
            },
          ]}
        >
          {task.subject}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: themeColors.secondaryText,
            },
          ]}
        >
          Приоритет:
        </Text>

        <Text
          style={[
            styles.value,
            {
              color: themeColors.text,
            },
          ]}
        >
          {getPriorityName(task.priority)}
        </Text>

        <Text
          style={[
            styles.label,
            {
              color: themeColors.secondaryText,
            },
          ]}
        >
          Статус:
        </Text>

        <Text
          style={[
            styles.value,
            {
              color: themeColors.text,
            },
          ]}
        >
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
    padding: spacing.lg,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.xl,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },

  value: {
    fontSize: 16,
  },

  buttons: {
    marginTop: spacing.xl,
  },
});