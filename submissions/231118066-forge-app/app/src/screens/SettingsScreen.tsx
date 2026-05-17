import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { AuditWidget } from '../audit/AuditWidget';
import { AuditReport } from '../audit/types';

interface Props {
  onBack: () => void;
}

export const SettingsScreen: React.FC<Props> = ({ onBack }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoReport, setAutoReport] = useState(true);

  const handleReport = (report: AuditReport) => {
    console.log('[SettingsScreen] audit report saved:', report.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>⚙️ Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>PREFERENCES</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#ddd', true: '#1a1a2e' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ddd', true: '#1a1a2e' }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.sectionLabel}>AUDIT</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Auto-save reports</Text>
          <Switch
            value={autoReport}
            onValueChange={setAutoReport}
            trackColor={{ false: '#ddd', true: '#1a1a2e' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About ForgeApp</Text>
          <Text style={styles.infoBody}>
            Student: 231118066{'\n'}
            Track: A — Drop-in Discipline{'\n'}
            Widget: nokta-audit{'\n'}
            FORGE cycles: ≥3 success + ≥1 rollback
          </Text>
        </View>
      </ScrollView>

      <AuditWidget screenName="Settings" onReport={handleReport} fabPosition="bottom-right" />
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
  content: { padding: 16, paddingBottom: 80 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  rowLabel: { fontSize: 15, color: '#222' },
  infoCard: {
    backgroundColor: '#f0f0ff',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  infoTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  infoBody: { fontSize: 13, color: '#444', lineHeight: 20 },
});
