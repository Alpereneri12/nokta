import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Alert, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';

export default function App() {
  
  const [gorevler, setGorevler] = useState([]);
  const [baslik, setBaslik] = useState('');
  const [aciklama, setAciklama] = useState('');
  const [kategori, setKategori] = useState('Ödev');
  const [oncelik, setOncelik] = useState('Normal');
  const [seciliFiltre, setSeciliFiltre] = useState('Tümü');
  
  // Uzman mesajlarını tutmak için state
  const [uzmanMesajlari, setUzmanMesajlari] = useState({});

  function gorevEkle() {
    if (baslik.trim() === '') {
      Alert.alert('Uyarı', 'Lütfen görev başlığını boş bırakmayın.');
      return;
    }
    let yeniGorev = {
      id: Math.random().toString(),
      baslik: baslik,
      aciklama: aciklama,
      kategori: kategori,
      oncelik: oncelik,
      tamamlandi: false
    };
    setGorevler([...gorevler, yeniGorev]);
    setBaslik('');
    setAciklama('');
  }

  function mesajGonder(id, baslik) {
    const mesaj = uzmanMesajlari[id];
    if (!mesaj || mesaj.trim() === '') {
      Alert.alert("Hata", "Lütfen uzmana iletmek için bir mesaj yazın.");
      return;
    }
    Alert.alert("Başarılı", `"${baslik}" hakkındaki mesajınız uzman ekibimize iletildi!`);
    setUzmanMesajlari({ ...uzmanMesajlari, [id]: '' });
  }

  function gorevSil(silinecekId) {
    setGorevler(gorevler.filter(g => g.id !== silinecekId));
  }

  function gorevDurumDegistir(id) {
    setGorevler(gorevler.map(g => g.id === id ? { ...g, tamamlandi: !g.tamamlandi } : g));
  }

  // İstatistik Hesaplamaları
  let toplamSayi = gorevler.length;
  let bitenSayi = gorevler.filter(g => g.tamamlandi).length;
  let aktifSayi = toplamSayi - bitenSayi;

  let ekrandaGosterilecekler = gorevler.filter(g => {
    if (seciliFiltre === 'Aktif') return !g.tamamlandi;
    if (seciliFiltre === 'Tamamlanan') return g.tamamlandi;
    return true;
  });

  const renderGorev = ({ item }) => (
    <View style={[styles.kart, item.tamamlandi ? styles.kartTamamlandi : null]}>
      <View style={styles.kartSol}>
        <Text style={[styles.kartBaslik, item.tamamlandi ? styles.ustuCizili : null]}>{item.baslik}</Text>
        {item.aciklama !== '' && <Text style={styles.kartAciklama}>{item.aciklama}</Text>}
        
        <View style={styles.etiketAlani}>
          <Text style={styles.etiket}>{item.kategori}</Text>
          <Text style={[styles.etiket, item.oncelik === 'Acil' ? {backgroundColor: '#FED7D7', color: '#C53030'} : null]}>
            {item.oncelik} Öncelik
          </Text>
        </View>

        <View style={styles.uzmanPanel}>
          <TextInput 
            style={styles.uzmanInput}
            placeholder="Uzmana sorunuzu yazın..."
            value={uzmanMesajlari[item.id] || ''}
            onChangeText={(text) => setUzmanMesajlari({...uzmanMesajlari, [item.id]: text})}
          />
          <TouchableOpacity 
            style={styles.uzmanGonderBtn} 
            onPress={() => mesajGonder(item.id, item.baslik)}
          >
            <Text style={styles.uzmanGonderYazi}>Uzmana İlet</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.kartSag}>
        <TouchableOpacity style={[styles.buton, styles.butonTamamla]} onPress={() => gorevDurumDegistir(item.id)}>
          <Text style={styles.butonYazi}>{item.tamamlandi ? 'Geri Al' : 'Bitir'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buton, styles.butonSil]} onPress={() => gorevSil(item.id)}>
          <Text style={styles.butonYazi}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.anaKapsayici}>
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Text style={styles.baslikYazisi}>Ders & Görev Takibi</Text>
        
        {/* GÖRSELDEKİ İSTATİSTİK KUTUSU */}
        <View style={styles.istatistikKutusu}>
          <View style={styles.istatistikOge}>
            <Text style={styles.istatistikDeger}>{toplamSayi}</Text>
            <Text style={styles.istatistikMetin}>Toplam</Text>
          </View>
          <View style={styles.istatistikOge}>
            <Text style={styles.istatistikDeger}>{aktifSayi}</Text>
            <Text style={styles.istatistikMetin}>Aktif</Text>
          </View>
          <View style={styles.istatistikOge}>
            <Text style={styles.istatistikDeger}>{bitenSayi}</Text>
            <Text style={styles.istatistikMetin}>Biten</Text>
          </View>
        </View>

        <View style={styles.girisKutusu}>
          <TextInput style={styles.metinKutusu} placeholder="Ne yapman gerekiyor?" value={baslik} onChangeText={setBaslik} />
          
          <View style={styles.secimSatiri}>
            <Text style={styles.secimBasligi}>Kategori:</Text>
            {['Ödev', 'Sınav', 'Proje'].map(kat => (
              <TouchableOpacity key={kat} style={[styles.secimButonu, kategori === kat && styles.secimButonuAktif]} onPress={() => setKategori(kat)}>
                <Text style={kategori === kat ? styles.secimYaziAktif : styles.secimYazi}>{kat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.secimSatiri}>
            <Text style={styles.secimBasligi}>Öncelik:</Text>
            {['Düşük', 'Normal', 'Acil'].map(onc => (
              <TouchableOpacity key={onc} style={[styles.secimButonu, oncelik === onc && styles.secimButonuAktif]} onPress={() => setOncelik(onc)}>
                <Text style={oncelik === onc ? styles.secimYaziAktif : styles.secimYazi}>{onc}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.ekleButonu} onPress={gorevEkle}>
            <Text style={styles.ekleButonuYazisi}>+ Görevi Listeye Ekle</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtreAlani}>
          {['Tümü', 'Aktif', 'Tamamlanan'].map(f => (
            <TouchableOpacity key={f} style={[styles.filtreButonu, seciliFiltre === f && styles.filtreButonuAktif]} onPress={() => setSeciliFiltre(f)}>
              <Text style={seciliFiltre === f ? styles.filtreYaziAktif : styles.filtreYazi}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={ekrandaGosterilecekler}
          keyExtractor={item => item.id}
          renderItem={renderGorev}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  anaKapsayici: { flex: 1, backgroundColor: '#F4F6F8', paddingTop: 50, paddingHorizontal: 16 },
  baslikYazisi: { fontSize: 26, fontWeight: '800', color: '#1A202C', marginBottom: 20 },
  
  // GÖRSELDEKİ STİL
  istatistikKutusu: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFFFFF', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 15, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 4 },
  istatistikOge: { alignItems: 'center' },
  istatistikDeger: { fontSize: 22, fontWeight: 'bold', color: '#2D3748' },
  istatistikMetin: { fontSize: 13, color: '#718096', marginTop: 4 },

  girisKutusu: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 20, elevation: 3 },
  metinKutusu: { backgroundColor: '#F7FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 10, borderRadius: 8, marginBottom: 10 },
  secimSatiri: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  secimBasligi: { fontWeight: '600', color: '#4A5568', width: 65, fontSize: 13 },
  secimButonu: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#EDF2F7', borderRadius: 15, marginRight: 8 },
  secimButonuAktif: { backgroundColor: '#4299E1' },
  secimYazi: { color: '#4A5568', fontSize: 12 },
  secimYaziAktif: { color: '#FFFFFF', fontWeight: 'bold' },
  ekleButonu: { backgroundColor: '#48BB78', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  ekleButonuYazisi: { color: '#FFFFFF', fontWeight: 'bold' },
  
  filtreAlani: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 8, padding: 4, marginBottom: 16 },
  filtreButonu: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  filtreButonuAktif: { backgroundColor: '#FFFFFF', borderRadius: 6, elevation: 2 },
  filtreYaziAktif: { color: '#2B6CB0', fontWeight: 'bold' },
  
  kart: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', marginBottom: 12, elevation: 2 },
  kartSol: { flex: 1, paddingRight: 10 },
  kartBaslik: { fontSize: 16, fontWeight: 'bold', color: '#2D3748' },
  etiketAlani: { flexDirection: 'row', marginTop: 5 },
  etiket: { backgroundColor: '#EDF2F7', color: '#4A5568', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 5 },
  
  uzmanPanel: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  uzmanInput: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 6, padding: 8, fontSize: 12, marginBottom: 6 },
  uzmanGonderBtn: { backgroundColor: '#3182CE', paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  uzmanGonderYazi: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  kartSag: { justifyContent: 'center', alignItems: 'flex-end' },
  buton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, marginBottom: 5, width: 70, alignItems: 'center' },
  butonTamamla: { backgroundColor: '#4299E1' },
  butonSil: { backgroundColor: '#E53E3E' },
  butonYazi: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' }
});