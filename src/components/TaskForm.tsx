import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

import {
  CreateTaskInput,
  Task,
  TaskPriority,
  UpdateTaskInput,
} from '../types/task';

import AppButton from './ui/AppButton';
import AppInput from './ui/AppInput';

interface TaskFormProps {
  initialTask?: Task;
  onAdd?: (input: CreateTaskInput) => void;
  onUpdate?: (input: UpdateTaskInput) => void;
}

export default function TaskForm({
  initialTask,
  onAdd,
  onUpdate,
}: TaskFormProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const [title, setTitle] = useState(
    initialTask?.title ?? ''
  );

  const [subject, setSubject] = useState(
    initialTask?.subject ?? ''
  );

  const [priority, setPriority] =
    useState<TaskPriority>(
      initialTask?.priority ?? 'medium'
    );

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();

    if (!trimmedTitle || !trimmedSubject) {
      return;
    }

    if (initialTask && onUpdate) {
      const updateInput: UpdateTaskInput = {
        title: trimmedTitle,
        subject: trimmedSubject,
        priority,
      };

      onUpdate(updateInput);
      return;
    }

    if (onAdd) {
      const input: CreateTaskInput = {
        title: trimmedTitle,
        subject: trimmedSubject,
        priority,
      };

      onAdd(input);

      setTitle('');
      setSubject('');
      setPriority('medium');
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.heading,
          {
            color: themeColors.text,
          },
        ]}
      >
        {initialTask
          ? 'Изменить задачу'
          : 'Новая задача'}
      </Text>

      <AppInput
        label="Название задачи"
        placeholder="Название задачи"
        value={title}
        onChangeText={setTitle}
      />

      <AppInput
        label="Предмет"
        placeholder="Название предмета"
        value={subject}
        onChangeText={setSubject}
      />

      <Text
        style={[
          styles.label,
          {
            color: themeColors.text,
          },
        ]}
      >
        Приоритет
      </Text>

      <View style={styles.priorityRow}>
        <PriorityButton
          title="Низкий"
          selected={priority === 'low'}
          onPress={() => setPriority('low')}
        />

        <PriorityButton
          title="Средний"
          selected={priority === 'medium'}
          onPress={() => setPriority('medium')}
        />

        <PriorityButton
          title="Высокий"
          selected={priority === 'high'}
          onPress={() => setPriority('high')}
        />
      </View>

      <AppButton
        title={
          initialTask
            ? 'Сохранить изменения'
            : '+ Добавить задачу'
        }
        onPress={handleSave}
      />
    </View>
  );
}

interface PriorityButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

function PriorityButton({
  title,
  selected,
  onPress,
}: PriorityButtonProps) {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  return (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        {
          backgroundColor:
            themeColors.inputBackground,
          borderColor: themeColors.border,
        },
        selected && {
          backgroundColor: themeColors.primary,
          borderColor: themeColors.primary,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.priorityText,
          {
            color: selected
              ? themeColors.onPrimary
              : themeColors.text,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  priorityButton: {
    flex: 1,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
  },

  priorityText: {
    fontSize: 13,
  },
});