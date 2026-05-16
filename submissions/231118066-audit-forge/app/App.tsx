import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
// @ts-ignore
import { AuditWidget } from 'nokta-audit'; 

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'tasks' | 'profile'>('home');

  // Bilerek yapay zeka tarafından tamir edilecek mantıksal hatalar (bug) bırakıyoruz
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.title}>🏠 Ana Sayfa</Text>
            <Text style={styles.buggyText}>BUG_1: Grafik yüklenemedi, sonsuz döngüde kaldı.</Text>
            {/* Hata: Buton var ama hiçbir fonksiyonu tetiklemiyor */}
            <TouchableOpacity style={styles.buggyButton}>
              <Text style={{color: '#fff'}}>Verileri Yenile (Çalışmıyor)</Text>
            </TouchableOpacity>
          </View>
        );
      case 'tasks':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.title}>📋 Görev Takip</Text>
            <Text style={styles.buggyText}>BUG_2: Yeni görev ekleme butonu ekranın dışına taşıyor ve tıklanamıyor.</Text>
            <View style={{ marginTop: 500 }}>
              <TouchableOpacity style={styles.buggyButton}>
                <Text style={{color: '#fff'}}>Görünmez Görev Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'profile':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.title}>👤 Kullanıcı Profili</Text>
            <Text style={styles.buggyText}>BUG_3: Profil resmi yüklenirken uygulama çöküyor (Null Pointer).</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ekran Değiştirme Menüsü */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => setCurrentScreen('home')} style={styles.navButton}>
          <Text>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('tasks')} style={styles.navButton}>
          <Text>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('profile')} style={styles.navButton}>
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Aktif Ekran İçeriği */}
      {renderScreen()}

      {/* Hocanın Drop-in Raporlama Widget'ı */}
      <AuditWidget />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  navButton: {
    padding: 10,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buggyText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  buggyButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
  }
});