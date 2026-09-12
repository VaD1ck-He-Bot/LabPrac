import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Task, TaskPriority } from '../types/task';

interface TaskFormProps {
  onAdd: (task: Task) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const handleAdd = () => {
    const trimmedTitle = title.trim();
    const trimmedSubject = subject.trim();

    if (!trimmedTitle || !trimmedSubject) {
      Alert.alert(
        'Ошибка',
        'Введите название задачи и название предмета.'
      );
      return;
    }

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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Новая задача</Text>

      <TextInput
        style={styles.input}
        placeholder="Название задачи"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Предмет"
        value={subject}
        onChangeText={setSubject}
      />

      <Text style={styles.label}>Приоритет</Text>

      <View style={styles.priorityRow}>
        <PriorityButton
          title="Низкий"
          value="low"
          selected={priority === 'low'}
          onPress={() => setPriority('low')}
        />

        <PriorityButton
          title="Средний"
          value="medium"
          selected={priority === 'medium'}
          onPress={() => setPriority('medium')}
        />

        <PriorityButton
          title="Высокий"
          value="high"
          selected={priority === 'high'}
          onPress={() => setPriority('high')}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>+ Добавить задачу</Text>
      </TouchableOpacity>
    </View>
  );
}

interface PriorityButtonProps {
  title: string;
  value: TaskPriority;
  selected: boolean;
  onPress: () => void;
}

function PriorityButton({
  title,
  selected,
  onPress,
}: PriorityButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.priorityButton,
        selected && styles.selectedPriority,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.priorityText,
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

  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 15,
    marginBottom: 10,
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
  },

  selectedPriority: {
    backgroundColor: '#555',
    borderColor: '#555',
  },

  priorityText: {
    fontSize: 13,
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