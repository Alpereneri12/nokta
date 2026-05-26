/**
 * App.tsx — ForgeApp v2
 *
 * Ekranlar:
 *   Home → Tasks → Settings (önceki hafta)
 *   Voice → Avatar → ExpertCall (bu hafta)
 *
 * FORGE stuck logic: stuckCount >= 2 → ExpertCall otomatik açılır
 */

import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { VoiceScreen } from './src/screens/VoiceScreen';
import { AvatarScreen } from './src/screens/AvatarScreen';
import { ExpertCallScreen } from './src/screens/ExpertCallScreen';
import * as FileSystem from 'expo-file-system';

type ScreenName = 'Home' | 'Tasks' | 'Settings' | 'Voice' | 'Avatar' | 'ExpertCall';

export default function App() {
  const [current, setCurrent] = useState<ScreenName>('Home');
  const [stuckCount, setStuckCount] = useState(0);
  const [expertAutoTriggered, setExpertAutoTriggered] = useState(false);

  // Called by FORGE cycle tracker when a cycle fails/rolls back
  const onForgeCycleFail = useCallback(() => {
    const next = stuckCount + 1;
    setStuckCount(next);
    if (next >= 2) {
      setExpertAutoTriggered(true);
      setCurrent('ExpertCall');
    }
  }, [stuckCount]);

  const onBridgeSaved = useCallback(async (summary: string) => {
    setStuckCount(0);
    setExpertAutoTriggered(false);
    // Append to BRIDGE.md in document directory
    const path = FileSystem.documentDirectory + 'BRIDGE.md';
    const timestamp = new Date().toISOString();
    const entry = `\n\n## Görüşme — ${timestamp}\n\n${summary}\n`;
    try {
      const existing = await FileSystem.readAsStringAsync(path).catch(() => '# BRIDGE.md\n');
      await FileSystem.writeAsStringAsync(path, existing + entry);
    } catch (e) {
      console.warn('BRIDGE.md write error', e);
    }
  }, []);

  return (
    <>
      <StatusBar style="light" />

      {current === 'Home' && (
        <HomeScreen
          onNavigate={(s) => setCurrent(s as ScreenName)}
        />
      )}
      {current === 'Tasks' && (
        <TasksScreen onBack={() => setCurrent('Home')} />
      )}
      {current === 'Settings' && (
        <SettingsScreen onBack={() => setCurrent('Home')} />
      )}
      {current === 'Voice' && (
        <VoiceScreen
          onBack={() => setCurrent('Home')}
          onAvatarPress={() => setCurrent('Avatar')}
        />
      )}
      {current === 'Avatar' && (
        <AvatarScreen
          onBack={() => setCurrent('Voice')}
          onExpertCall={() => setCurrent('ExpertCall')}
        />
      )}
      {current === 'ExpertCall' && (
        <ExpertCallScreen
          onBack={() => setCurrent('Home')}
          onBridgeSaved={onBridgeSaved}
          autoTriggered={expertAutoTriggered}
        />
      )}
    </>
  );
}
