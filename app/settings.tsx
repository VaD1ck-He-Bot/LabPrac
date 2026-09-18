import {
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../src/context/ThemeContext';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

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
          Текущая тема:{' '}
          {isDark ? 'тёмная' : 'светлая'}
        </Text>

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
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginTop: 15,
    color: '#666',
  },
});