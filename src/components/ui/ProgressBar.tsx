import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useEffect } from 'react';

import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({
  completed,
  total,
}: ProgressBarProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const progress = useSharedValue(0);

  const progressValue =
    total > 0
      ? Math.min(completed / total, 1)
      : 0;

  useEffect(() => {
    progress.value = withTiming(
      progressValue,
      {
        duration: 500,
      }
    );
  }, [progressValue]);

  const animatedStyle =
    useAnimatedStyle(() => {
      const width = interpolate(
        progress.value,
        [0, 1],
        [0, 100]
      );

      return {
        width: `${width}%`,
      };
    });

  const percentage =
    Math.round(progressValue * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: themeColors.text,
            },
          ]}
        >
          Прогресс выполнения
        </Text>

        <Text
          style={[
            styles.percentage,
            {
              color: themeColors.secondaryText,
            },
          ]}
        >
          {percentage}%
        </Text>
      </View>

      <View
        style={[
          styles.track,
          {
            backgroundColor:
              themeColors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            {
              backgroundColor:
                themeColors.primary,
            },
            animatedStyle,
          ]}
        />
      </View>

      <Text
        style={[
          styles.counter,
          {
            color:
              themeColors.secondaryText,
          },
        ]}
      >
        Выполнено: {completed} из {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
  },

  percentage: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    borderRadius: 5,
  },

  counter: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});