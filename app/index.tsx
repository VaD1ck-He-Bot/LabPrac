import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../src/context/ThemeContext';
import { router } from 'expo-router';
import TaskCard from '../src/components/TaskCard';
import { useTasks } from '../src/context/TaskContext';

export default function Index() {
    const {
        tasks,
        toggleTask,
        deleteTask,
    } = useTasks();

    const completedCount = tasks.filter(
        (task) => task.isCompleted
    ).length;

    const { theme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                isDark && styles.darkBackground,
            ]}
            edges={['left', 'right', 'bottom']}
        >
            <View style={styles.container}>

                <View style={styles.header}>


                    <Text
                        style={[
                            styles.subtitle,
                            isDark && styles.darkText,
                        ]}
                    >
                        Учебные задачи на сегодня
                    </Text>

                    <View style={styles.stats}>
                        <Text
                            style={[
                                styles.statText,
                                isDark && styles.darkText,
                            ]}
                        >
                            Всего: {tasks.length}
                        </Text>

                        <Text
                            style={[
                                styles.statText,
                                isDark && styles.darkText,
                            ]}
                        >
                            Выполнено: {completedCount}
                        </Text>
                    </View>
                </View>

                <FlatList
                    data={tasks}
                    renderItem={({ item }) => (
                        <TaskCard
                            task={item}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>
                            Список пока пуст
                        </Text>
                    }
                    contentContainerStyle={styles.listContent}
                />

                <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => router.push('/task/new')}
                >
                    <Text style={styles.floatingButtonText}>
                        +
                    </Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },

    container: {
        flex: 1,
    },

    header: {
        padding: 12,
        paddingBottom: 4,
    },

    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    menuButton: {
        fontSize: 28,
        paddingHorizontal: 8,
    },

    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },

    stats: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },

    statText: {
        fontSize: 14,
        fontWeight: 'bold',
    },

    listContent: {
        padding: 12,
        paddingTop: 6,
        flexGrow: 1,
    },

    emptyText: {
        textAlign: 'center',
        color: '#777',
        fontSize: 15,
        marginTop: 30,
    },

    floatingButton: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },

    floatingButtonText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '300',
    },

    darkBackground: {
        backgroundColor: '#222',
    },

    darkText: {
        color: '#fff',
    },
});