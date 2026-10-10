import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
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

const SWIPE_ACTION_THRESHOLD = 100;
const MAX_SWIPE_DISTANCE = 140;

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
    useAnimatedStyle(() => ({
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
    }));

  // Раскрытие дополнительной информации
  const detailsAnimation = useSharedValue(0);

  const animatedDetailsStyle =
    useAnimatedStyle(() => ({
      opacity: detailsAnimation.value,
      maxHeight:
        detailsAnimation.value * 200,
    }));

  const [detailsVisible, setDetailsVisible] =
    React.useState(false);

  // горизонтальное смещение карточки
  const translateX = useSharedValue(0);

  const animatedCardStyle =
    useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
      ],
    }));

  // прозрачность фоновых подсказок
  const completeBackgroundStyle =
    useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_ACTION_THRESHOLD],
        [0, 1],
        'clamp'
      ),
    }));

  const deleteBackgroundStyle =
    useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [-SWIPE_ACTION_THRESHOLD, 0],
        [1, 0],
        'clamp'
      ),
    }));

  // обычное переключение статуса
  const handleToggleStatus = () => {
    statusAnimation.value = withSpring(
      isCompleted ? 0 : 1
    );

    toggleTaskStatus(task.id);
  };

  // действие после свайпа вправо
  const handleSwipeRight = () => {
    handleToggleStatus();
  };

  // подтверждение удаления
  const handleSwipeLeft = () => {
    Alert.alert(
      'Удалить задачу?',
      `Задача «${task.title}» будет удалена.`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => removeTask(task.id),
        },
      ]
    );
  };

  // жест свайпа
  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      translateX.value = Math.max(
        -MAX_SWIPE_DISTANCE,
        Math.min(
          MAX_SWIPE_DISTANCE,
          event.translationX
        )
      );
    })
    .onEnd((event) => {
      if (
        event.translationX >=
        SWIPE_ACTION_THRESHOLD
      ) {
        translateX.value = withSpring(0);
        runOnJS(handleSwipeRight)();
      } else if (
        event.translationX <=
        -SWIPE_ACTION_THRESHOLD
      ) {
        translateX.value = withSpring(0);
        runOnJS(handleSwipeLeft)();
      } else {
        // недостаточный свайп — вернуть карточку
        translateX.value = withSpring(0);
      }
    });

  const handleToggleDetails = () => {
    const newValue = detailsVisible ? 0 : 1;

    detailsAnimation.value = withTiming(
      newValue,
      { duration: 250 }
    );

    setDetailsVisible(!detailsVisible);
  };

  return (
    <View style={styles.swipeContainer}>
      {/* Фоновые области действий */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.actionBackground,
          styles.completeBackground,
          {
            backgroundColor: themeColors.primary,
          },
          completeBackgroundStyle,
        ]}
      >
        <Text style={styles.actionText}>
          ✓ Выполнить
        </Text>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.actionBackground,
          styles.deleteBackground,
          {
            backgroundColor: themeColors.error,
          },
          deleteBackgroundStyle,
        ]}
      >
        <Text style={styles.actionText}>
          Удалить ✕
        </Text>
      </Animated.View>

      {/* Двигающаяся карточка */}

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor:
                themeColors.surface,
              borderColor:
                themeColors.border,
            },
            isCompleted && styles.completedCard,
            animatedCardStyle,
          ]}
        >
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                { color: themeColors.text },
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

          {/* Раскрытие информации */}

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
                  color: themeColors.onPrimary,
                },
              ]}
            >
              {detailsVisible
                ? 'Скрыть ▲'
                : 'Подробнее ▼'}
            </Text>
          </TouchableOpacity>

          <Animated.View
            pointerEvents={
              detailsVisible ? 'auto' : 'none'
            }
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
                  { color: themeColors.text },
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
                    params: { id: task.id },
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

          {/* Кнопки остаются доступными */}

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
                Alert.alert(
                  'Удалить задачу?',
                  `Задача «${task.title}» будет удалена.`,
                  [
                    {
                      text: 'Отмена',
                      style: 'cancel',
                    },
                    {
                      text: 'Удалить',
                      style: 'destructive',
                      onPress: () =>
                        removeTask(task.id),
                    },
                  ]
                )
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
        </Animated.View>
      </GestureDetector>
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
  swipeContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },

  actionBackground: {
    position: 'absolute',
    top: 0,
    bottom: spacing.sm,
    left: 0,
    right: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  completeBackground: {
    alignItems: 'flex-start',
  },

  deleteBackground: {
    alignItems: 'flex-end',
  },

  actionText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  card: {
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: 0,
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