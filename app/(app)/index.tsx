
import { useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

import { router } from 'expo-router';

import Animated, {
  FadeInDown,
  FadeOutUp,
} from 'react-native-reanimated';

import TaskCard from '../../src/components/TaskCard';
import Screen from '../../src/components/ui/Screen';
import EmptyState from '../../src/components/ui/EmptyState';
import AppButton from '../../src/components/ui/AppButton';
import ProgressBar from '../../src/components/ui/ProgressBar';

import { useTasksQuery } from '../../src/hooks/useTasksQuery';
import { useTheme } from '../../src/context/ThemeContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

import {
  getActiveTaskCount,
  getCompletedTaskCount,
  sortTasksByPriority,
} from '../../src/utils/task';

type TaskFilter = 'all' | 'active' | 'completed';

export default function Index() {
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTasksQuery();

  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sortAscending, setSortAscending] = useState(false);

  const activeCount = getActiveTaskCount(tasks);
  const completedCount = getCompletedTaskCount(tasks);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return task.status === 'active';
    }

    if (filter === 'completed') {
      return task.status === 'completed';
    }

    return true;
  });

  const sortedTasks = sortTasksByPriority(filteredTasks);

  if (sortAscending) {
    sortedTasks.reverse();
  }

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ color: themeColors.text }}>
            Загрузка задач...
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text
            style={[
              styles.errorTitle,
              { color: themeColors.text },
            ]}
          >
            Не удалось загрузить задачи
          </Text>

          <Text
            style={[
              styles.errorText,
              { color: themeColors.secondaryText },
            ]}
          >
            {error instanceof Error
              ? error.message
              : 'Проверьте подключение к серверу.'}
          </Text>

          <AppButton
            title="Повторить"
            onPress={() => refetch()}
          />
        </View>
      </Screen>
    );
  }

  const filters: { label: string; value: TaskFilter }[] = [
    { label: 'Все', value: 'all' },
    { label: 'Активные', value: 'active' },
    { label: 'Выполненные', value: 'completed' },
  ];

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text
            style={[
              styles.subtitle,
              { color: themeColors.text },
            ]}
          >
            Учебные задачи на сегодня
          </Text>

          <View style={styles.stats}>
            <Text
              style={[
                styles.statText,
                { color: themeColors.secondaryText },
              ]}
            >
              Всего: {tasks.length}
            </Text>

            <Text
              style={[
                styles.statText,
                { color: themeColors.secondaryText },
              ]}
            >
              Активных: {activeCount}
            </Text>

            <Text
              style={[
                styles.statText,
                { color: themeColors.secondaryText },
              ]}
            >
              Выполнено: {completedCount}
            </Text>
          </View>
        </View>

        <ProgressBar
          completed={completedCount}
          total={tasks.length}
        />

        <View style={styles.filterContainer}>
          {filters.map((item) => {
            const isSelected = filter === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setFilter(item.value)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: isSelected
                      ? '#2563EB'
                      : 'transparent',
                    borderColor: isSelected
                      ? '#2563EB'
                      : themeColors.secondaryText,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : themeColors.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={() => setSortAscending((prev) => !prev)}
          style={[
            styles.sortButton,
            {
              borderColor: themeColors.secondaryText,
            },
          ]}
        >
          <Text
            style={[
              styles.sortText,
              { color: themeColors.text },
            ]}
          >
            Сортировка: {sortAscending ? 'Низкий приоритет' : 'Высокий приоритет'} ↓
          </Text>
        </Pressable>

        <FlatList
          data={sortedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View
              entering={FadeInDown.duration(300)}
              exiting={FadeOutUp.duration(250)}
            >
              <TaskCard task={item} />
            </Animated.View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={() => refetch()}
            />
          }
          ListEmptyComponent={
            tasks.length === 0 ? (
              <EmptyState
                title="Задач пока нет"
                description="Добавьте первую учебную задачу."
                actionLabel="Добавить задачу"
                onAction={() => router.push('/task/new')}
              />
            ) : (
              <View style={styles.emptyFilter}>
                <Text
                  style={[
                    styles.emptyFilterTitle,
                    { color: themeColors.text },
                  ]}
                >
                  Здесь пока пусто
                </Text>

                <Text
                  style={{
                    color: themeColors.secondaryText,
                  }}
                >
                  Задач с таким статусом нет.
                </Text>
              </View>
            )
          }
          contentContainerStyle={styles.listContent}
        />

        <AppButton
          title="+ Добавить задачу"
          onPress={() => router.push('/task/new')}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.md,
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
  filterContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyFilter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyFilterTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: spacing.sm,
    flexGrow: 1,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  sortButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: spacing.sm,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
