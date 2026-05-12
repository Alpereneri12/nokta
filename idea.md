# Proje Fikri: Nokta - Akıllı Eğitim ve Görev Takip Sistemi

### 🎯 Vizyon ve Kapsam
Bu proje, Andrej Karpathy'nin **Software 2.0** vizyonundan ilham alarak geliştirilmiştir. Klasik yazılım yaklaşımlarının ötesinde, kullanıcı verilerini anlamlandıran ve ihtiyaç duyulduğunda "Expert-in-the-loop" (süreçteki uzman) katmanıyla insan desteğini sisteme entegre eden hibrit bir takip platformudur.

### 🚀 Temel Fonksiyonlar
1. **Dinamik Görev Yönetimi:** Kullanıcıların eğitim süreçlerini (ödev, sınav, proje) öncelik ve kategori bazlı takip etmesini sağlar.
2. **Akıllı İstatistik Paneli:** Verilerin anlık işlenmesiyle (Toplam/Aktif/Biten) kullanıcıya gelişim raporu sunar.
3. **Uzman Destek Katmanı (Expert-in-the-loop):** Yazılımın tek başına yetmediği karmaşık akademik sorularda, kullanıcının doğrudan bir mentora/uzmana mesaj iletebildiği interaktif bir kanal sunar.

### 🧠 Karar Günlüğü (Decision Log)
- **Framework Seçimi:** Hızlı prototipleme ve native performans dengesi için **React Native / Expo** tercih edilmiştir.
- **Arayüz Tasarımı:** Karmaşıklığı azaltmak amacıyla minimalist bir UI/UX yapısı benimsenmiş, kullanıcı odaklı (user-centric) bir deneyim hedeflenmiştir.
- **Mimari Karar:** Uzman desteği alanı, sistemin ölçeklenebilirliğini artırmak adına her göreve spesifik (task-specific) mesajlaşma altyapısıyla kurgulanmıştır.

### 📈 Gelecek Hedefleri
İlerleyen aşamalarda bu sistemin, kullanıcının girdiği görev başlıklarından otomatik çalışma planı çıkaran bir **LLM (Large Language Model)** katmanıyla güçlendirilmesi planlanmaktadır.
