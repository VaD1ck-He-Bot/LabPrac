import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

import TaskCard from '../src/components/TaskCard';
import { useTasks } from '../src/hooks/useTasks';
import Screen from '../src/components/ui/Screen';
import EmptyState from '../src/components/ui/EmptyState';
import AppButton from '../src/components/ui/AppButton';

import { useTheme } from '../src/context/ThemeContext';
import { colors } from '../src/theme/colors';
import { spacing } from '../src/theme/spacing';

import {
  getActiveTaskCount,
  getCompletedTaskCount,
} from '../src/utils/task';

export default function Index() {
  const { tasks } = useTasks();

  const { theme } = useTheme();
  const themeColors = colors[theme];

  const activeCount =
    getActiveTaskCount(tasks);

  const completedCount =
    getCompletedTaskCount(tasks);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={[
              styles.subtitle,
              {
                color: themeColors.text,
              },
            ]}
          >
            Учебные задачи на сегодня
          </Text>

          <View style={styles.stats}>
            <Text
              style={[
                styles.statText,
                {
                  color: themeColors.secondaryText,
                },
              ]}
            >
              Всего: {tasks.length}
            </Text>

            <Text
              style={[
                styles.statText,
                {
                  color: themeColors.secondaryText,
                },
              ]}
            >
              Активных: {activeCount}
            </Text>

            <Text
              style={[
                styles.statText,
                {
                  color: themeColors.secondaryText,
                },
              ]}
            >
              Выполнено: {completedCount}
            </Text>
          </View>
        </View>

        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <TaskCard task={item} />
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <EmptyState
              title="Задач пока нет"
              description="Добавьте первую учебную задачу."
              actionLabel="Добавить задачу"
              onAction={() =>
                router.push('/task/new')
              }
            />
          }
          contentContainerStyle={
            styles.listContent
          }
        />

        <AppButton
          title="+ Добавить задачу"
          onPress={() =>
            router.push('/task/new')
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },

  header: {
    marginBottom: spacing.md,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statText: {
    fontSize: 14,
  },

  listContent: {
    paddingBottom: spacing.sm,
  },
});