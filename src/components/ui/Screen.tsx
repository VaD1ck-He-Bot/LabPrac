import { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
}

export default function Screen({
  children,
  style,
}: ScreenProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
        },
        style,
      ]}
      edges={['left', 'right', 'bottom']}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});