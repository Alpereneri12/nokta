# Fikir Kutusu - Eğitim ve Gelişim Takip Sistemi

Bu proje, öğrencilerin akademik gelişimlerini, ders görevlerini ve proje fikirlerini "Expert-in-the-loop" (Uzman Destekli) bir yapay zeka mimarisiyle takip etmelerini sağlayan hibrit bir mobil uygulamadır.

## 📌 Proje Bilgileri

- **Öğrenci Adı:** Alperen Eri
- **Öğrenci No:** 231118066
- **Seçilen Kulvar:** Track 1 (Eğitim ve Gelişim Takip Sistemi)

---

## 🚀 Canlı Önizleme & Demo

- **Expo Go / Canlı Önizleme Linki:** [https://expo.dev/preview/@alpereneri12/fikir-kutusu](https://expo.dev/accounts/alpereneri/projects/DersGorevTakip/builds/05a31eae-57bf-4850-ab08-2f09e784e9e2)
- **60 Saniyelik Uygulama Demo Videosu:** [Google Drive / YouTube Video Linki](<(https://www.youtube.com/shorts/U22ndn50-mM)>)

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend / Mobile:** React Native, Expo SDK, TypeScript
- **State Management:** React Hooks (useState, useEffect)
- **Styling:** NativeWind / StyleSheet
- **Derleme ve Dağıtım:** EAS (Expo Application Services)

---

## 📋 Decision Log (Karar Günlüğü)

### 1. Mimari ve Framework Seçimi (12.05.2026)

- **Karar:** Uygulamanın hibrit olarak hızlıca ayağa kaldırılması ve çapraz platform desteği için native yapılar yerine **React Native ve Expo CLI** tercih edilmiştir.
- **Neden:** Kısıtlı sürede hızlı prototipleme ve EAS Build altyapısının sağladığı kolaylıklar.

### 2. "Expert-in-the-loop" Entegrasyonu (12.05.2026)

- **Karar:** Yapay zekanın sadece görev listelemekle kalmayıp, öğrencinin takıldığı adımlarda bir "Akademik Mentor/Uzman" gibi devreye girmesini sağlayan bir yönlendirme arayüzü eklenmiştir.
- **Neden:** Track 1 isterlerinde yer alan akıllı asistan ve gelişim takibi kriterini karşılamak.

### 3. Build ve Teslimat Stratejisi (12.05.2026)

- **Karar:** Local Android Studio emülatör derlemesi yerine projenin bulutta **EAS Build** ile paketlenmesine ve doğrudan kurulabilir bir `app-release.apk` üretilmesine karar verilmiştir.
- **Neden:** Teslimatın hocanın ortamında doğrudan test edilebilmesini güvenceye almak.
