import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../types/task';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <View style={[styles.card, task.isCompleted && styles.completedCard]}>
      <View style={styles.content}>
        <Text style={[styles.title, task.isCompleted && styles.completedTitle]}>
          {task.title}
        </Text>

        <Text style={styles.subject}>{task.subject}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.priority}>
            Приоритет: {getPriorityName(task.priority)}
          </Text>

          <Text style={styles.status}>
            {task.isCompleted ? 'Выполнено' : 'В процессе'}
          </Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => onToggle(task.id)}
        >
          <Text style={styles.buttonText}>
            {task.isCompleted ? '↩ Вернуть' : '✓ Выполнить'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(task.id)}
        >
          <Text style={styles.buttonText}>Удалить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function getPriorityName(priority: Task['priority']) {
  switch (priority) {
    case 'low':
      return 'Низкий';
    case 'medium':
      return 'Средний';
    case 'high':
      return 'Высокий';
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
  },

  completedCard: {
    opacity: 0.5,
  },

  content: {
    marginBottom: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  completedTitle: {
    textDecorationLine: 'line-through',
  },

  subject: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  priority: {
    fontSize: 13,
    color: '#555',
  },

  status: {
    fontSize: 13,
  },

  buttons: {
    flexDirection: 'row',
    gap: 8,
  },

  completeButton: {
    flex: 1,
    backgroundColor: '#555',
    padding: 9,
    alignItems: 'center',
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 9,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});