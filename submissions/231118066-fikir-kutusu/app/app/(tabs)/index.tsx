import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [input, setInput] = useState("");
  const [cards, setCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const processIdeas = async () => {
    if (!input.trim()) {
      Alert.alert("Hata", "Lütfen önce bir metin yapıştırın.");
      return;
    }

    setLoading(true);

    // BURAYA KENDİ API KEY'İNİ YAPIŞTIR
    const API_KEY = "AIzaSyDn7pFiFchM3yx-WEwi_Tv22PIPnDWHw1w";

    // Denenecek model varyasyonları
    const configs = [{ ver: "v1beta", model: "gemini-2.5-flash" }];

    let isResolved = false;

    for (const config of configs) {
      if (isResolved) break;

      // URL'i senin anahtarının desteklediği 2.5 versiyonuna çekiyoruz
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

      try {
        console.log(`Deneniyor: ${config.ver} - ${config.model}`);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Aşağıdaki dağınık notları analiz et. Tekrarları sil. Her bir benzersiz fikri "BAŞLIK | ÖZET | KATEGORİ" formatında, aralarında '---' olacak şekilde listele: \n\n ${input}`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();

        if (response.ok && data.candidates) {
          const text = data.candidates[0].content.parts[0].text;
          const processedCards = text
            .split("---")
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);

          setCards(processedCards);
          isResolved = true;
          console.log("BAŞARI: Bağlantı kuruldu!");
        } else {
          console.log(
            `Başarısız (${config.model}):`,
            data.error?.message || "Bilinmeyen hata",
          );
        }
      } catch (error) {
        console.log(`Network Hatası (${config.model}):`, error);
      }
    }

    if (!isResolved) {
      Alert.alert(
        "Bağlantı Sorunu",
        "Modellerin hiçbiri yanıt vermedi. API anahtarınızın 'Generative Language API' için yetkili olduğundan emin olun.",
      );
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fikir Kütüphanecisi 📚</Text>
      <TextInput
        style={styles.input}
        placeholder="WhatsApp notlarını buraya yapıştır..."
        multiline
        value={input}
        onChangeText={setInput}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={processIdeas}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Fikirleri Düzenle</Text>
        )}
      </TouchableOpacity>

      <ScrollView style={styles.cardList} showsVerticalScrollIndicator={false}>
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardText}>{card}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a1a1a",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    height: 180,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cardList: { marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#4A90E2",
    elevation: 1,
  },
  cardText: { fontSize: 15, color: "#333", lineHeight: 22 },
});
