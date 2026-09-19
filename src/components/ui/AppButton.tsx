import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: AppButtonProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor:
            variant === 'primary'
              ? themeColors.primary
              : themeColors.secondary,
        },
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  disabledButton: {
    opacity: 0.5,
  },

  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});