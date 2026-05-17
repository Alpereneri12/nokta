import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { AuditWidget } from '../audit/AuditWidget';
import { AuditReport } from '../audit/types';

interface Props {
  onNavigate: (screen: 'Tasks' | 'Settings') => void;
}

export const HomeScreen: React.FC<Props> = ({ onNavigate }) => {
  const handleReport = (report: AuditReport) => {
    console.log('[HomeScreen] audit report saved:', report.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>🏠 Home</Text>
        <Text style={styles.subtitle}>ForgeApp — Audit & FORGE demo</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What is this?</Text>
          <Text style={styles.cardBody}>
            This minimal Expo app demonstrates the FORGE loop:{'\n'}
            Capture bugs → generate .md reports → agent repairs → commit.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => onNavigate('Tasks')}
        >
          <Text style={styles.navBtnText}>📋 Go to Tasks →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnSecondary]}
          onPress={() => onNavigate('Settings')}
        >
          <Text style={styles.navBtnText}>⚙️ Settings →</Text>
        </TouchableOpacity>
      </View>

      {/* AuditWidget drop-in: just mount it, pass screenName */}
      <AuditWidget screenName="Home" onReport={handleReport} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  container: { flex: 1, padding: 24 },
  heading: { fontSize: 28, fontWeight: '800', color: '#1a1a2e', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1a1a2e', marginBottom: 8 },
  cardBody: { fontSize: 14, color: '#555', lineHeight: 20 },
  navBtn: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  navBtnSecondary: { backgroundColor: '#4a4e69' },
  navBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
