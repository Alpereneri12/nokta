import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { HomeScreen } from './src/screens/HomeScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ScreenName } from './src/screens';

export default function App() {
  const [current, setCurrent] = useState<ScreenName>('Home');

  return (
    <>
      <StatusBar style="dark" />
      {current === 'Home' && (
        <HomeScreen
          onNavigate={(screen) => setCurrent(screen)}
        />
      )}
      {current === 'Tasks' && (
        <TasksScreen onBack={() => setCurrent('Home')} />
      )}
      {current === 'Settings' && (
        <SettingsScreen onBack={() => setCurrent('Home')} />
      )}
    </>
  );
}
