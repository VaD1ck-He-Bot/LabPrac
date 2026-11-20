
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Screen from '../../../src/components/ui/Screen';
import TaskForm from '../../../src/components/TaskForm';
import AppButton from '../../../src/components/ui/AppButton';
import { useTaskMutations } from '../../../src/hooks/useTaskMutations';

export default function NewTask() {
  const { createMutation } = useTaskMutations();

  const handleAddTask = (input: Parameters<
    typeof createMutation.mutate
  >[0]) => {
    createMutation.mutate(input, {
      onSuccess: () => {
        router.back();
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : 'Произошла неизвестная ошибка';

        Alert.alert('Не удалось создать задачу', message);
      },
    });
  };

  return (
    <Screen>
      <View style={styles.container}>
        {createMutation.isPending ? (
          <View style={styles.loading}>
            <ActivityIndicator size="small" />
            <Text>Сохранение...</Text>
          </View>
        ) : null}

        <TaskForm onAdd={handleAddTask} />

        {createMutation.isPending ? (
          <AppButton
            title="Сохранение..."
            onPress={() => { }}
            disabled
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
});
