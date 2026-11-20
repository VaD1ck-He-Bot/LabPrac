
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '../../src/context/ThemeContext';
import { useAuth } from '../../src/auth/AuthContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const isDark = theme === 'dark';

  async function handleLogout() {
    try {
      await signOut();
      router.replace('/login');
    } catch {
      Alert.alert(
        'Ошибка',
        'Не удалось завершить сеанс. Попробуйте ещё раз.'
      );
    }
  }

  function confirmLogout() {
    Alert.alert(
      'Выход из аккаунта',
      'Вы действительно хотите выйти?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Выйти',
          style: 'destructive',
          onPress: handleLogout,
        },
      ]
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        isDark && styles.darkBackground,
      ]}
      edges={['left', 'right', 'bottom']}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            isDark && styles.darkCard,
          ]}
        >
          <Text
            style={[
              styles.label,
              isDark && styles.darkText,
            ]}
          >
            Тёмная тема
          </Text>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
          />
        </View>

        <Text
          style={[
            styles.currentTheme,
            isDark && styles.darkText,
          ]}
        >
          Текущая тема: {isDark ? 'тёмная' : 'светлая'}
        </Text>

        <View
          style={[
            styles.userCard,
            isDark && styles.darkCard,
          ]}
        >
          <Text
            style={[
              styles.userLabel,
              isDark && styles.darkText,
            ]}
          >
            Вы вошли как:
          </Text>

          <Text
            style={[
              styles.userName,
              isDark && styles.darkText,
            ]}
          >
            {user?.name ?? user?.login ?? 'Пользователь'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>
            Выйти из аккаунта
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  darkBackground: {
    backgroundColor: '#222',
  },
  container: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  darkText: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkCard: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  label: {
    fontSize: 16,
  },
  currentTheme: {
    fontSize: 14,
    marginTop: 3,
    color: '#666',
  },
  userCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    gap: 6,
  },
  userLabel: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
