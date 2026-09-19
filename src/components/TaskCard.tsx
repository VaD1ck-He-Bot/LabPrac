import { router } from 'expo-router';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTasks } from '../hooks/useTasks';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({
  task,
}: TaskCardProps) {
  const {
    toggleTaskStatus,
    removeTask,
  } = useTasks();

  const { theme } = useTheme();
  const themeColors = colors[theme];

  const isCompleted =
    task.status === 'completed';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
        isCompleted && styles.completedCard,
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: themeColors.text,
            },
            isCompleted && styles.completedTitle,
          ]}
        >
          {task.title}
        </Text>

        <Text
          style={[
            styles.subject,
            {
              color: themeColors.secondaryText,
            },
          ]}
        >
          {task.subject}
        </Text>

        <View style={styles.infoRow}>
          <Text
            style={[
              styles.infoText,
              {
                color: themeColors.secondaryText,
              },
            ]}
          >
            Приоритет:{' '}
            {getPriorityName(task.priority)}
          </Text>

          <Text
            style={[
              styles.infoText,
              {
                color: themeColors.secondaryText,
              },
            ]}
          >
            {isCompleted
              ? 'Выполнено'
              : 'В процессе'}
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                themeColors.secondary,
            },
          ]}
          onPress={() =>
            router.push({
              pathname: '/task/[id]',
              params: {
                id: task.id,
              },
            })
          }
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: themeColors.onPrimary,
              },
            ]}
          >
            Подробнее
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                themeColors.primary,
            },
          ]}
          onPress={() =>
            toggleTaskStatus(task.id)
          }
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: themeColors.onPrimary,
              },
            ]}
          >
            {isCompleted
              ? '↩ Вернуть'
              : '✓ Выполнить'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                themeColors.secondary,
            },
          ]}
          onPress={() =>
            removeTask(task.id)
          }
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: themeColors.onPrimary,
              },
            ]}
          >
            Удалить
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getPriorityName(
  priority: Task['priority']
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
  card: {
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  completedCard: {
    opacity: 0.5,
  },

  content: {
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },

  completedTitle: {
    textDecorationLine: 'line-through',
  },

  subject: {
    fontSize: 14,
    marginBottom: spacing.sm,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  infoText: {
    fontSize: 13,
  },

  buttons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  button: {
    flex: 1,
    padding: spacing.sm,
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 13,
  },
});