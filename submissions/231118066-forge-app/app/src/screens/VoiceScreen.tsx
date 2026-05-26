/**
 * VoiceScreen.tsx
 *
 * Phase A: Mikrofon girişini expo-av ile yakala,
 * RMS değerinden bar animasyonu üret.
 * Sessizlikte sönsün, konuşunca canlansın.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import { AuditWidget } from '../audit/AuditWidget';
import { AuditReport } from '../audit/types';

const { width: SCREEN_W } = Dimensions.get('window');
const BAR_COUNT = 24;
const BAR_MAX_HEIGHT = 120;
const POLL_MS = 80;

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

interface Props {
  onBack: () => void;
  onAvatarPress: () => void;
}

export const VoiceScreen: React.FC<Props> = ({ onBack, onAvatarPress }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [statusText, setStatusText] = useState('Mikrofona dokunarak başla');
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const barsAnim = useRef<Animated.Value[]>(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(4)),
  ).current;

  // Current RMS level shared with avatar screen
  const rmsRef = useRef(0);

  const animateBars = useCallback((rms: number) => {
    rmsRef.current = rms;
    barsAnim.forEach((bar, i) => {
      const phase = Math.sin((Date.now() / 200) + i * 0.7);
      const noise = Math.random() * 0.3 + 0.7;
      const height = clamp(rms * BAR_MAX_HEIGHT * noise * (0.6 + 0.4 * phase), 4, BAR_MAX_HEIGHT);
      Animated.spring(bar, {
        toValue: height,
        useNativeDriver: false,
        speed: 40,
        bounciness: 2,
      }).start();
    });
  }, [barsAnim]);

  const silenceBars = useCallback(() => {
    barsAnim.forEach((bar) => {
      Animated.spring(bar, {
        toValue: 4,
        useNativeDriver: false,
        speed: 20,
        bounciness: 0,
      }).start();
    });
  }, [barsAnim]);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Mikrofon izni gerekli');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: 2,
          audioEncoder: 3,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: 'aac' as any,
          audioQuality: 127,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {},
      });
      await rec.startAsync();
      recordingRef.current = rec;
      setIsRecording(true);
      setStatusText('Dinliyorum...');

      intervalRef.current = setInterval(async () => {
        try {
          const status = await rec.getStatusAsync();
          if (status.isRecording) {
            // metering is -160 (silence) to 0 (max)
            const db = (status as any).metering ?? -60;
            const normalized = clamp((db + 60) / 60, 0, 1);
            animateBars(normalized);
          }
        } catch (_) {}
      }, POLL_MS);
    } catch (e) {
      Alert.alert('Kayıt başlatılamadı', String(e));
    }
  };

  const stopRecording = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    silenceBars();
    setIsRecording(false);
    setStatusText('Mikrofona dokunarak başla');
    try {
      await recordingRef.current?.stopAndUnloadAsync();
    } catch (_) {}
    recordingRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
  }, []);

  const handleReport = (r: AuditReport) => {
    console.log('[VoiceScreen] audit:', r.id);
  };

  const barWidth = (SCREEN_W - 48) / BAR_COUNT - 3;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🎙️ Ses Görselleştirici</Text>
      </View>

      {/* Bars */}
      <View style={styles.vizContainer}>
        <View style={styles.barsRow}>
          {barsAnim.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.bar,
                {
                  width: barWidth,
                  height: anim,
                  backgroundColor: isRecording
                    ? `hsl(${200 + i * 4}, 80%, 55%)`
                    : '#333',
                },
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.statusText}>{statusText}</Text>

      {/* Record button */}
      <TouchableOpacity
        style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.recordBtnText}>
          {isRecording ? '⏹ Durdur' : '🎙️ Kayıt Başlat'}
        </Text>
      </TouchableOpacity>

      {/* Avatar link */}
      <TouchableOpacity style={styles.avatarBtn} onPress={onAvatarPress}>
        <Text style={styles.avatarBtnText}>🪞 Avatar Sahnesine Git →</Text>
      </TouchableOpacity>

      <AuditWidget screenName="Voice" onReport={handleReport} />
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
  backBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  backText: { color: '#7b8cde', fontSize: 15, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  vizContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: BAR_MAX_HEIGHT + 8,
  },
  bar: {
    borderRadius: 3,
    minHeight: 4,
  },
  statusText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  recordBtn: {
    marginHorizontal: 40,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  recordBtnActive: {
    backgroundColor: '#7b1fa2',
    borderColor: '#ce93d8',
  },
  recordBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  avatarBtn: {
    marginHorizontal: 40,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 80,
  },
  avatarBtnText: { color: '#7b8cde', fontSize: 15, fontWeight: '600' },
});
