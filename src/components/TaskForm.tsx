import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import {
  Task,
  TaskPriority,
} from '../types/task';

interface TaskFormProps {
  initialTask?: Task;
  onAdd?: (task: Task) => void;
  onUpdate?: (task: Task) => void;
}

export default function TaskForm({
  initialTask,
  onAdd,
  onUpdate,
}: TaskFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [title, setTitle] = useState(
    initialTask?.title ?? ''
  );

  const [subject, setSubject] = useState(
    initialTask?.subject ?? ''
  );

  const [priority, setPriority] = useState<TaskPriority>(
    initialTask?.priority ?? 'medium'
  );

  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();

    if (!trimmedTitle || !trimmedSubject) {
      Alert.alert(
        'Ошибка',
        'Введите название задачи и название предмета.'
      );
      return;
    }

    if (initialTask && onUpdate) {
      const updatedTask: Task = {
        ...initialTask,
        title: trimmedTitle,
        subject: trimmedSubject,
        priority,
      };

      onUpdate(updatedTask);
    } else if (onAdd) {
      const newTask: Task = {
        id: String(Date.now()),
        title: trimmedTitle,
        subject: trimmedSubject,
        priority,
        isCompleted: false,
      };

      onAdd(newTask);

      setTitle('');
      setSubject('');
      setPriority('medium');
    }
  };

  return (
    <View
      style={[
        styles.container,
        isDark && styles.darkContainer,
      ]}
    >
      <Text
        style={[
          styles.heading,
          isDark && styles.darkText,
        ]}
      >
        {initialTask
          ? 'Изменить задачу'
          : 'Новая задача'}
      </Text>

      <TextInput
        style={[
          styles.input,
          isDark && styles.darkInput,
        ]}
        placeholder="Название задачи"
        placeholderTextColor={isDark ? '#aaa' : '#999'}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[
          styles.input,
          isDark && styles.darkInput,
        ]}
        placeholder="Предмет"
        placeholderTextColor={isDark ? '#aaa' : '#999'}
        value={subject}
        onChangeText={setSubject}
      />

      <Text
        style={[
          styles.label,
          isDark && styles.darkText,
        ]}
      >
        Приоритет
      </Text>

      <View style={styles.priorityRow}>
        <PriorityButton
          title="Низкий"
          selected={priority === 'low'}
          onPress={() => setPriority('low')}
          isDark={isDark}
        />

        <PriorityButton
          title="Средний"
          selected={priority === 'medium'}
          onPress={() => setPriority('medium')}
          isDark={isDark}
        />

        <PriorityButton
          title="Высокий"
          selected={priority === 'high'}
          onPress={() => setPriority('high')}
          isDark={isDark}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSave}
      >
        <Text style={styles.addButtonText}>
          {initialTask
            ? 'Сохранить изменения'
            : '+ Добавить задачу'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface PriorityButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  isDark: boolean;
}

function PriorityButton({
  title,
  selected,
  onPress,
  isDark,
}: PriorityButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        isDark && styles.darkPriorityButton,
        selected && styles.selectedPriority,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.priorityText,
          isDark && styles.darkText,
          selected && styles.selectedPriorityText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginTop: 8,
    marginBottom: 20,
  },

  darkContainer: {
    backgroundColor: '#333',
    borderColor: '#555',
  },

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  darkText: {
    color: '#fff',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 15,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#fff',
  },

  darkInput: {
    backgroundColor: '#444',
    borderColor: '#666',
    color: '#fff',
  },

  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  priorityRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },

  priorityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 9,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  darkPriorityButton: {
    backgroundColor: '#444',
    borderColor: '#666',
  },

  selectedPriority: {
    backgroundColor: '#555',
    borderColor: '#555',
  },

  priorityText: {
    fontSize: 13,
    color: '#000',
  },

  selectedPriorityText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  addButton: {
    backgroundColor: '#555',
    padding: 11,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});