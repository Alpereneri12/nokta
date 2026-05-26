/**
 * ExpertCallScreen.tsx
 *
 * Phase C: Uygulama içinden uzmana WebRTC görüntülü çağrı.
 * Jitsi Meet WebView ile ekran paylaşımı + ses + video.
 * FORGE döngüsünde 2 cycle üst üste FAIL/ROLLBACK → bu ekran tetiklenir.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  onBack: () => void;
  onBridgeSaved: (summary: string) => void;
  /** Auto-triggered when FORGE stuck count >= 2 */
  autoTriggered?: boolean;
}

const JITSI_ROOM_BASE = 'forge-audit-231118066';

export const ExpertCallScreen: React.FC<Props> = ({
  onBack,
  onBridgeSaved,
  autoTriggered = false,
}) => {
  const [inCall, setInCall] = useState(false);
  const [roomName, setRoomName] = useState(JITSI_ROOM_BASE);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const jitsiUrl = `https://meet.jit.si/${roomName}#config.startWithVideoMuted=false&config.startWithAudioMuted=false&config.enableScreensharing=true&userInfo.displayName=231118066-Alperen`;

  const startCall = () => {
    if (!roomName.trim()) {
      Alert.alert('Oda adı girin');
      return;
    }
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setShowSummary(true);
  };

  const saveBridge = () => {
    if (!summary.trim()) {
      Alert.alert('Görüşme özeti boş olamaz');
      return;
    }
    onBridgeSaved(summary);
    Alert.alert('✅ BRIDGE.md güncellendi');
    onBack();
  };

  if (showSummary) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowSummary(false)} style={styles.backBtn}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>📝 Görüşme Özeti</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Görüşmede ne konuştunuz? (BRIDGE.md'ye eklenecek)</Text>
          <TextInput
            style={styles.summaryInput}
            multiline
            placeholder="Uzmanla görüşme özeti..."
            placeholderTextColor="#555"
            value={summary}
            onChangeText={setSummary}
          />
          <TouchableOpacity style={styles.saveBtn} onPress={saveBridge}>
            <Text style={styles.saveBtnText}>💾 BRIDGE.md'ye Kaydet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (inCall) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.callHeader}>
          <Text style={styles.callTitle}>📞 Görüşme: {roomName}</Text>
          <TouchableOpacity style={styles.endCallBtn} onPress={endCall}>
            <Text style={styles.endCallText}>📵 Kapat</Text>
          </TouchableOpacity>
        </View>
        <WebView
          source={{ uri: jitsiUrl }}
          style={styles.webview}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback
          javaScriptEnabled
          domStorageEnabled
          allowsFullscreenVideo
          mediaCapturePermissionGrantType="grant"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📞 Uzmana Bağlan</Text>
      </View>

      <View style={styles.content}>
        {autoTriggered && (
          <View style={styles.alertCard}>
            <Text style={styles.alertText}>
              ⚠️ FORGE döngüsünde 2 ardışık FAIL/ROLLBACK tespit edildi.{'\n'}
              Uzman desteği önerilir.
            </Text>
          </View>
        )}

        <Text style={styles.label}>Jitsi Oda Adı</Text>
        <TextInput
          style={styles.input}
          value={roomName}
          onChangeText={setRoomName}
          placeholder="forge-audit-231118066"
          placeholderTextColor="#555"
          autoCapitalize="none"
        />

        <Text style={styles.hint}>
          Sınıf arkadaşına bu oda adını ver, o da{'\n'}
          meet.jit.si/{roomName} adresinden katılsın.
        </Text>

        <TouchableOpacity style={styles.callBtn} onPress={startCall}>
          <Text style={styles.callBtnText}>📞 Görüşmeyi Başlat</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Gereksinimler</Text>
          <Text style={styles.infoBody}>
            ✅ Ekran paylaşımı{'\n'}
            ✅ Ses{'\n'}
            ✅ Video{'\n'}
            📝 Görüşme sonrası özet BRIDGE.md'ye kaydedilir
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a14' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  callHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1a1a2e',
  },
  backBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  backText: { color: '#7b8cde', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  callTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  content: { flex: 1, padding: 20, gap: 14 },
  alertCard: {
    backgroundColor: '#4a1010',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ef5350',
  },
  alertText: { color: '#ef9a9a', fontSize: 14, lineHeight: 20 },
  label: { color: '#aaa', fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 160,
    textAlignVertical: 'top',
    flex: 1,
  },
  hint: { color: '#555', fontSize: 12, lineHeight: 18 },
  callBtn: {
    backgroundColor: '#1b5e20',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  callBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  endCallBtn: {
    backgroundColor: '#b71c1c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  endCallText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  saveBtn: {
    backgroundColor: '#1a237e',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  infoBody: { color: '#aaa', fontSize: 13, lineHeight: 22 },
  webview: { flex: 1 },
});
