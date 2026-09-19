import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

import AppButton from './AppButton';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>
        📚
      </Text>

      <Text
        style={[
          styles.title,
          {
            color: themeColors.text,
          },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: themeColors.secondaryText,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <AppButton
          title={actionLabel}
          onPress={onAction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xl,
  },

  icon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },

  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});