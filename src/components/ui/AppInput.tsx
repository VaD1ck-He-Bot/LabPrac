import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
} from 'react-native';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function AppInput({
  label,
  error,
  ...props
}: AppInputProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <>
      <Text
        style={[
          styles.label,
          {
            color: themeColors.text,
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        {...props}
        style={[
          styles.input,
          {
            backgroundColor:
              themeColors.inputBackground,
            borderColor: themeColors.border,
            color: themeColors.text,
          },
          props.style,
        ]}
        placeholderTextColor={themeColors.secondaryText}
      />

      {error && (
        <Text
          style={[
            styles.error,
            {
              color: themeColors.error,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },

  input: {
    borderWidth: 1,
    padding: spacing.sm,
    fontSize: 15,
    marginBottom: spacing.sm,
  },

  error: {
    marginBottom: spacing.sm,
  },
});