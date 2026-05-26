import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { AuditWidget } from '../audit/AuditWidget';
import { AuditReport } from '../audit/types';

interface Props {
  onNavigate: (screen: string) => void;
}

export const HomeScreen: React.FC<Props> = ({ onNavigate }) => {
  const handleReport = (report: AuditReport) => {
    console.log('[HomeScreen] audit report saved:', report.id);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>🏠 ForgeApp</Text>
        <Text style={styles.subtitle}>231118066 · Track A · Final Hafta</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bu Hafta</Text>
          <Text style={styles.cardBody}>
            🎙️ Ses görselleştirici{'\n'}
            🪞 Kişisel avatar + lipsync{'\n'}
            📞 Uzman görüntülü çağrı{'\n'}
            🔄 FORGE döngüsü devam
          </Text>
        </View>

        <Text style={styles.sectionLabel}>YENİ EKRANLAR</Text>

        <TouchableOpacity style={styles.navBtn} onPress={() => onNavigate('Voice')}>
          <Text style={styles.navIcon}>🎙️</Text>
          <View style={styles.navTextGroup}>
            <Text style={styles.navBtnText}>Ses Görselleştirici</Text>
            <Text style={styles.navBtnSub}>Mikrofon → bar animasyonu</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navBtn, styles.navBtnPurple]} onPress={() => onNavigate('Avatar')}>
          <Text style={styles.navIcon}>🪞</Text>
          <View style={styles.navTextGroup}>
            <Text style={styles.navBtnText}>Avatar Sahnesi</Text>
            <Text style={styles.navBtnSub}>GLB model + lipsync</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navBtn, styles.navBtnRed]} onPress={() => onNavigate('ExpertCall')}>
          <Text style={styles.navIcon}>📞</Text>
          <View style={styles.navTextGroup}>
            <Text style={styles.navBtnText}>Uzmana Bağlan</Text>
            <Text style={styles.navBtnSub}>Jitsi WebRTC görüntülü çağrı</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>ÖNCEKİ HAFTALAR</Text>

        <TouchableOpacity style={[styles.navBtn, styles.navBtnDark]} onPress={() => onNavigate('Tasks')}>
          <Text style={styles.navIcon}>📋</Text>
          <View style={styles.navTextGroup}>
            <Text style={styles.navBtnText}>Tasks</Text>
            <Text style={styles.navBtnSub}>Görev takibi</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navBtn, styles.navBtnDark]} onPress={() => onNavigate('Settings')}>
          <Text style={styles.navIcon}>⚙️</Text>
          <View style={styles.navTextGroup}>
            <Text style={styles.navBtnText}>Ayarlar</Text>
            <Text style={styles.navBtnSub}>FORGE durumu + tercihler</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <AuditWidget screenName="Home" onReport={handleReport} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a14' },
  container: { padding: 24, paddingBottom: 100 },
  heading: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#555', marginBottom: 20 },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 8 },
  cardBody: { fontSize: 14, color: '#aaa', lineHeight: 24 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#444',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },
  navBtn: {
    backgroundColor: '#1a237e',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navBtnPurple: { backgroundColor: '#4a148c' },
  navBtnRed: { backgroundColor: '#b71c1c' },
  navBtnDark: { backgroundColor: '#1a1a2e', borderWidth: 1, borderColor: '#333' },
  navIcon: { fontSize: 22 },
  navTextGroup: { flex: 1 },
  navBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  navBtnSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 2 },
});
