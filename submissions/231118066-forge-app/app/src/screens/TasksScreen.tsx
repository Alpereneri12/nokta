import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { AuditWidget } from '../audit/AuditWidget';
import { AuditReport } from '../audit/types';

interface Task {
  id: string;
  title: string;
  done: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Mount AuditWidget on all screens', done: true },
  { id: '2', title: 'Generate 3 audit reports', done: false },
  { id: '3', title: 'Run FORGE cycle ≥3 times', done: false },
  { id: '4', title: 'Log results in FORGE.md', done: false },
];

interface Props {
  onBack: () => void;
}

export const TasksScreen: React.FC<Props> = ({ onBack }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [newTitle, setNewTitle] = useState('');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTitle.trim(), done: false },
    ]);
    setNewTitle('');
  };

  const handleReport = (report: AuditReport) => {
    console.log('[TasksScreen] audit report saved:', report.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>📋 Tasks</Text>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="New task..."
          placeholderTextColor="#aaa"
          value={newTitle}
          onChangeText={setNewTitle}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.taskCard, item.done && styles.taskDone]}
            onPress={() => toggleTask(item.id)}
          >
            <Text style={styles.taskCheck}>{item.done ? '✅' : '⬜'}</Text>
            <Text style={[styles.taskTitle, item.done && styles.taskTitleDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <AuditWidget screenName="Tasks" onReport={handleReport} fabPosition="bottom-right" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  backBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  backText: { color: '#4a4e69', fontSize: 15, fontWeight: '600' },
  heading: { fontSize: 22, fontWeight: '800', color: '#1a1a2e' },
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
    color: '#222',
  },
  addBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 22, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 80 },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  taskDone: { opacity: 0.6 },
  taskCheck: { fontSize: 18 },
  taskTitle: { fontSize: 14, color: '#222', flex: 1 },
  taskTitleDone: { textDecorationLine: 'line-through', color: '#999' },
});
