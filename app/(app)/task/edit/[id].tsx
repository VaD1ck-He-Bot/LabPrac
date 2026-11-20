
import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TaskForm from '../../../../src/components/TaskForm';
import { useTasksQuery } from '../../../../src/hooks/useTasksQuery';
import { useTaskMutations } from '../../../../src/hooks/useTaskMutations';
import { useTheme } from '../../../../src/context/ThemeContext';
import { colors } from '../../../../src/theme/colors';
import Screen from '../../../../src/components/ui/Screen';
import AppButton from '../../../../src/components/ui/AppButton';

export default function EditTask() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useTasksQuery();

  const { updateMutation } = useTaskMutations();

  const { theme } = useTheme();
  const themeColors = colors[theme];

  const task = tasks.find((item) => item.id === id);

  const handleUpdateTask = (
    input: Parameters<typeof updateMutation.mutate>[0]['input'],
  ) => {
    if (!task) return;

    updateMutation.mutate(
      { id: task.id, input },
      {
        onSuccess: () => router.back(),
        onError: (mutationError: unknown) => {
          const message =
            mutationError instanceof Error
              ? mutationError.message
              : 'Не удалось сохранить изменения.';

          Alert.alert('Ошибка', message);
        },
      },
    );
  };

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
              : 'Не удалось загрузить задачи.'}
          </Text>
          <AppButton
            title="Повторить"
            onPress={() => refetch()}
          />
        </View>
      </Screen>
    );
  }

  if (!task) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={{ color: themeColors.text }}>
            Задача не найдена.
          </Text>
          <AppButton
            title="Назад"
            onPress={() => router.back()}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        {updateMutation.isPending && (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
            <Text style={{ color: themeColors.text }}>
              Сохранение изменений...
            </Text>
          </View>
        )}

        <TaskForm
          initialTask={task}
          onUpdate={handleUpdateTask}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 12,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
});
