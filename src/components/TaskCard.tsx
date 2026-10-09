import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

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


  const statusAnimation = useSharedValue(
    isCompleted ? 1 : 0
  );

  const animatedStatusStyle =
    useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale:
              0.8 +
              statusAnimation.value * 0.2,
          },
        ],
        opacity:
          0.6 +
          statusAnimation.value * 0.4,
      };
    });


  const detailsAnimation = useSharedValue(0);

  const animatedDetailsStyle =
    useAnimatedStyle(() => {
      return {
        opacity: detailsAnimation.value,
        maxHeight:
          detailsAnimation.value * 200,
      };
    });


  const [detailsVisible, setDetailsVisible] =
    React.useState(false);


  const handleToggleStatus = () => {
    statusAnimation.value = withSpring(
      isCompleted ? 0 : 1
    );

    toggleTaskStatus(task.id);
  };


  const handleToggleDetails = () => {
    const newValue = detailsVisible ? 0 : 1;

    detailsAnimation.value =
      withTiming(newValue, {
        duration: 250,
      });

    setDetailsVisible(!detailsVisible);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            themeColors.surface,
          borderColor:
            themeColors.border,
        },
        isCompleted &&
          styles.completedCard,
      ]}
    >
      {/* информация */}

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: themeColors.text,
            },
            isCompleted &&
              styles.completedTitle,
          ]}
        >
          {task.title}
        </Text>

        <Text
          style={[
            styles.subject,
            {
              color:
                themeColors.secondaryText,
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
                color:
                  themeColors.secondaryText,
              },
            ]}
          >
            Приоритет:{' '}
            {getPriorityName(task.priority)}
          </Text>

          <Animated.View
            style={[
              styles.statusContainer,
              animatedStatusStyle,
            ]}
          >
            <Text
              style={[
                styles.infoText,
                {
                  color:
                    themeColors.secondaryText,
                },
              ]}
            >
              {isCompleted
                ? '✓ Выполнено'
                : 'В процессе'}
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Подробнее */}

      <TouchableOpacity
        style={[
          styles.detailsButton,
          {
            backgroundColor:
              themeColors.secondary,
          },
        ]}
        onPress={handleToggleDetails}
      >
        <Text
          style={[
            styles.buttonText,
            {
              color:
                themeColors.onPrimary,
            },
          ]}
        >
          {detailsVisible
            ? 'Скрыть ▲'
            : 'Подробнее ▼'}
        </Text>
      </TouchableOpacity>

      {/* Раскрываемая область */}

      <Animated.View
        style={[
          styles.detailsContainer,
          animatedDetailsStyle,
        ]}
      >
        <View
          style={[
            styles.detailsContent,
            {
              borderTopColor:
                themeColors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.detailsTitle,
              {
                color: themeColors.text,
              },
            ]}
          >
            Дополнительная информация
          </Text>

          <Text
            style={[
              styles.detailsText,
              {
                color:
                  themeColors.secondaryText,
              },
            ]}
          >
            Предмет: {task.subject}
          </Text>

          <Text
            style={[
              styles.detailsText,
              {
                color:
                  themeColors.secondaryText,
              },
            ]}
          >
            Приоритет:{' '}
            {getPriorityName(task.priority)}
          </Text>

          <Text
            style={[
              styles.detailsText,
              {
                color:
                  themeColors.secondaryText,
              },
            ]}
          >
            Статус:{' '}
            {isCompleted
              ? 'Выполнено'
              : 'В процессе'}
          </Text>

          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor:
                  themeColors.primary,
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
                  color:
                    themeColors.onPrimary,
                },
              ]}
            >
              Открыть задачу
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Основные кнопки */}

      <View style={styles.buttons}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                themeColors.primary,
            },
          ]}
          onPress={handleToggleStatus}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  themeColors.onPrimary,
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
                color:
                  themeColors.onPrimary,
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

  statusContainer: {
    alignItems: 'center',
  },

  infoText: {
    fontSize: 13,
  },

  detailsButton: {
    padding: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  detailsContainer: {
    overflow: 'hidden',
  },

  detailsContent: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  detailsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },

  detailsText: {
    fontSize: 13,
    marginBottom: 4,
  },

  editButton: {
    padding: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
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