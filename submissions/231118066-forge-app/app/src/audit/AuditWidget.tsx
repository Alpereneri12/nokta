/**
 * AuditWidget — drop-in bug-reporting widget
 *
 * Mirrors the API of seyyah/nokta-audit.
 * FAB → screenshot capture → yellow-box annotation → note → Markdown report.
 * No backend. Pure in-memory + local filesystem via expo-file-system.
 *
 * Track A: drop-in discipline — this file must not be tightly coupled to any screen.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AuditReport, AuditWidgetProps, Annotation } from './types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function buildMarkdown(
  screenName: string,
  note: string,
  annotations: Annotation[],
  timestamp: string,
): string {
  const lines: string[] = [
    `# Audit Report`,
    ``,
    `**Screen:** \`${screenName}\``,
    `**Timestamp:** ${timestamp}`,
    `**Note:** ${note || '—'}`,
    ``,
    `## Annotations`,
    ``,
  ];

  if (annotations.length === 0) {
    lines.push('_No annotations._');
  } else {
    annotations.forEach((a, i) => {
      lines.push(
        `- **Box ${i + 1}:** x=${a.x} y=${a.y} w=${a.width} h=${a.height}` +
          (a.label ? ` — ${a.label}` : ''),
      );
    });
  }

  lines.push('');
  lines.push('## Hypothesis');
  lines.push('');
  lines.push('> _To be filled in by the coding agent._');
  lines.push('');
  lines.push('## Expected Fix');
  lines.push('');
  lines.push('> _To be filled in by the coding agent._');

  return lines.join('\n');
}

export const AuditWidget: React.FC<AuditWidgetProps> = ({
  screenName,
  onReport,
  fabPosition = 'bottom-right',
}) => {
  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState('');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotating, setAnnotating] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [preview, setPreview] = useState<AuditReport | null>(null);

  const fabStyle =
    fabPosition === 'bottom-right' ? styles.fabRight : styles.fabLeft;

  const handleSave = useCallback(async () => {
    const timestamp = new Date().toISOString();
    const md = buildMarkdown(screenName, note, annotations, timestamp);
    const report: AuditReport = {
      id: generateId(),
      screen: screenName,
      timestamp,
      note,
      annotations,
      markdown: md,
    };

    // Write .md file to document directory
    const filename = `audit-${screenName}-${Date.now()}.md`;
    const path = FileSystem.documentDirectory + filename;
    try {
      await FileSystem.writeAsStringAsync(path, md, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (e) {
      console.warn('AuditWidget: could not write file', e);
    }

    setPreview(report);
    onReport?.(report);
    setVisible(false);
    setNote('');
    setAnnotations([]);
    setAnnotating(false);
  }, [screenName, note, annotations, onReport]);

  const handleShare = useCallback(async () => {
    if (!preview) return;
    const path = FileSystem.documentDirectory + `audit-${preview.screen}-share.md`;
    try {
      await FileSystem.writeAsStringAsync(path, preview.markdown, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(path, { mimeType: 'text/markdown' });
      } else {
        Alert.alert('Sharing not available on this device.');
      }
    } catch (e) {
      Alert.alert('Share error', String(e));
    }
  }, [preview]);

  const handleAnnotationArea = (evt: { nativeEvent: { locationX: number; locationY: number } }) => {
    if (!annotating) return;
    const { locationX, locationY } = evt.nativeEvent;
    if (!dragStart) {
      setDragStart({ x: Math.round(locationX), y: Math.round(locationY) });
    } else {
      const newAnnotation: Annotation = {
        x: Math.round(Math.min(dragStart.x, locationX)),
        y: Math.round(Math.min(dragStart.y, locationY)),
        width: Math.round(Math.abs(locationX - dragStart.x)),
        height: Math.round(Math.abs(locationY - dragStart.y)),
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setDragStart(null);
      setAnnotating(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, fabStyle]}
        onPress={() => setVisible(true)}
        accessibilityLabel="Open audit widget"
      >
        <Text style={styles.fabIcon}>🐛</Text>
      </TouchableOpacity>

      {/* Report Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.title}>🐛 Audit: {screenName}</Text>

            {/* Annotation area */}
            <View
              style={styles.annotationArea}
              onStartShouldSetResponder={() => annotating}
              onResponderRelease={handleAnnotationArea as any}
            >
              <Text style={styles.annotationHint}>
                {annotating
                  ? dragStart
                    ? 'Tap to finish box'
                    : 'Tap to start box'
                  : `${annotations.length} annotation(s)`}
              </Text>
              {annotations.map((a, i) => (
                <View
                  key={i}
                  style={[
                    styles.annotationBox,
                    { left: a.x % 200, top: i * 20 + 4, width: 80, height: 16 },
                  ]}
                >
                  <Text style={styles.annotationBoxText}>Box {i + 1}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.btn, annotating && styles.btnActive]}
              onPress={() => {
                setAnnotating(!annotating);
                setDragStart(null);
              }}
            >
              <Text style={styles.btnText}>
                {annotating ? '✋ Cancel annotation' : '🟡 Add annotation'}
              </Text>
            </TouchableOpacity>

            {/* Note input */}
            <TextInput
              style={styles.input}
              placeholder="Note: describe the bug..."
              placeholderTextColor="#999"
              multiline
              value={note}
              onChangeText={setNote}
            />

            <View style={styles.row}>
              <TouchableOpacity style={styles.btn} onPress={() => setVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSave}>
                <Text style={[styles.btnText, { color: '#fff' }]}>💾 Save Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal visible={!!preview} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.title}>✅ Report Saved</Text>
            <ScrollView style={styles.mdPreview}>
              <Text style={styles.mdText}>{preview?.markdown}</Text>
            </ScrollView>
            <View style={styles.row}>
              <TouchableOpacity style={styles.btn} onPress={() => setPreview(null)}>
                <Text style={styles.btnText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleShare}>
                <Text style={[styles.btnText, { color: '#fff' }]}>📤 Share .md</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 32,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  fabRight: { right: 20 },
  fabLeft: { left: 20 },
  fabIcon: { fontSize: 22 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: SCREEN_H * 0.85,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1a1a2e',
  },
  annotationArea: {
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  annotationHint: {
    color: '#555',
    fontSize: 13,
  },
  annotationBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotationBoxText: {
    fontSize: 9,
    color: '#996600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 72,
    fontSize: 14,
    color: '#222',
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  btnActive: {
    borderColor: '#FFD700',
    backgroundColor: '#fffbeb',
    marginBottom: 10,
  },
  btnSave: {
    backgroundColor: '#1a1a2e',
    borderColor: '#1a1a2e',
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  mdPreview: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
    maxHeight: 260,
    marginBottom: 12,
  },
  mdText: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 11,
    color: '#333',
  },
});
