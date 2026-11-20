
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { useAuth } from '../../src/auth/AuthContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError('');

    if (!login.trim() || !password) {
      setError('Введите логин и пароль.');
      return;
    }

    try {
      setIsSubmitting(true);

      await signIn({
        login: login.trim(),
        password,
      });

      router.replace('/');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось выполнить вход. Попробуйте ещё раз.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const backgroundColor = isDark ? '#121212' : '#f5f5f5';
  const textColor = isDark ? '#fff' : '#222';
  const inputColor = isDark ? '#252525' : '#fff';
  const borderColor = isDark ? '#555' : '#ccc';

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={[styles.title, { color: textColor }]}>
            Campus Planner
          </Text>

          <Text style={[styles.subtitle, { color: textColor }]}>
            Войдите в свой аккаунт
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                backgroundColor: inputColor,
                borderColor,
              },
            ]}
            placeholder="Логин"
            placeholderTextColor={isDark ? '#aaa' : '#777'}
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            returnKeyType="next"
          />

          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                backgroundColor: inputColor,
                borderColor,
              },
            ]}
            placeholder="Пароль"
            placeholderTextColor={isDark ? '#aaa' : '#777'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            editable={!isSubmitting}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <Text
            accessibilityRole="button"
            onPress={isSubmitting ? undefined : handleLogin}
            style={[
              styles.button,
              isSubmitting && styles.buttonDisabled,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              'Войти'
            )}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  error: {
    color: '#e53935',
    fontSize: 14,
  },
  button: {
    overflow: 'hidden',
    backgroundColor: '#2563eb',
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
