
import { router, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Screen from '../../../src/components/ui/Screen';
import AppButton from '../../../src/components/ui/AppButton';
import { useTasksQuery } from '../../../src/hooks/useTasksQuery';
import { useTaskMutations } from '../../../src/hooks/useTaskMutations';
import { useTheme } from '../../../src/context/ThemeContext';
import { colors } from '../../../src/theme/colors';

export default function TaskDetails() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTasksQuery();

  const { updateMutation, deleteMutation } = useTaskMutations();
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const task = tasks.find((item) => item.id === id);

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ color: themeColors.text }}>
            Загрузка задачи...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={{ color: themeColors.text }}>
            {error instanceof Error
              ? error.message
              : 'Не удалось загрузить задачу.'}
          </Text>
          <AppButton title="Повторить" onPress={() => refetch()} />
        </View>
      </Screen>
    );
  }

  if (!task) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Задача не найдена
          </Text>
          <Text style={{ color: themeColors.secondaryText }}>
            Возможно, задача была удалена или ещё не загружена.
          </Text>
          <AppButton title="Повторить загрузку" onPress={() => refetch()} />
          <AppButton
            title="Назад"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </Screen>
    );
  }

  const isCompleted = task.status === 'completed';

  const toggleStatus = () => {
    updateMutation.mutate(
      {
        id: task.id,
        input: {
          status: isCompleted ? 'active' : 'completed',
        },
      },
      {
        onError: (mutationError: unknown) => {
          Alert.alert(
            'Ошибка',
            mutationError instanceof Error
              ? mutationError.message
              : 'Не удалось изменить статус задачи.',
          );
        },
      },
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить задачу?',
      `Задача «${task.title}» будет удалена.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(task.id, {
              onSuccess: () => router.back(),
              onError: (mutationError: unknown) => {
                Alert.alert(
                  'Ошибка',
                  mutationError instanceof Error
                    ? mutationError.message
                    : 'Не удалось удалить задачу.',
                );
              },
            });
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: themeColors.text }]}>
          {task.title}
        </Text>

        <Text style={[styles.label, { color: themeColors.secondaryText }]}>
          Предмет:
        </Text>
        <Text style={[styles.value, { color: themeColors.text }]}>
          {task.subject}
        </Text>

        <Text style={[styles.label, { color: themeColors.secondaryText }]}>
          Приоритет:
        </Text>
        <Text style={[styles.value, { color: themeColors.text }]}>
          {getPriorityName(task.priority)}
        </Text>

        <Text style={[styles.label, { color: themeColors.secondaryText }]}>
          Статус:
        </Text>
        <Text style={[styles.value, { color: themeColors.text }]}>
          {isCompleted ? 'Выполнено' : 'В процессе'}
        </Text>

        <View style={styles.buttons}>
          <AppButton
            title={
              updateMutation.isPending
                ? 'Сохранение...'
                : isCompleted
                  ? 'Вернуть в работу'
                  : 'Выполнить'
            }
            onPress={toggleStatus}
            disabled={updateMutation.isPending}
          />

          <AppButton
            title="Редактировать"
            variant="secondary"
            onPress={() =>
              router.push({
                pathname: '/task/edit/[id]',
                params: { id: task.id },
              })
            }
          />

          <AppButton
            title={
              deleteMutation.isPending
                ? 'Удаление...'
                : 'Удалить задачу'
            }
            onPress={handleDelete}
            disabled={deleteMutation.isPending}
          />

          <AppButton
            title="Назад к списку"
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      </View>
    </Screen>
  );
}

function getPriorityName(priority: 'low' | 'medium' | 'high') {
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
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
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
  },
  value: {
    fontSize: 16,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
  },
});
