import { Stack, router } from 'expo-router';
import {
  Text,
  TouchableOpacity,
} from 'react-native';

import { TaskProvider } from '../src/context/TaskContext';
import {
  ThemeProvider,
  useTheme,
} from '../src/context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <AppStack />
      </TaskProvider>
    </ThemeProvider>
  );
}

function AppStack() {
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#333' : '#fff',
        },

        headerTintColor: isDark ? '#fff' : '#000',

        headerTitleStyle: {
          color: isDark ? '#fff' : '#000',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Campus Planner',

          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/settings')}
            >
              <Text
                style={{
                  fontSize: 28,
                  color: isDark ? '#fff' : '#000',
                }}
              >
                ⋮
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="task/new"
        options={{
          title: 'Новая задача',
        }}
      />

      <Stack.Screen
        name="task/[id]"
        options={{
          title: 'Задача',
        }}
      />

      <Stack.Screen
        name="task/edit/[id]"
        options={{
          title: 'Редактирование',
        }}
      />

      <Stack.Screen
        name="settings"
        options={{
          title: 'Настройки',
        }}
      />
    </Stack>
  );
}