# BRIDGE.md

Uzman görüşme kayıtları. Her görüşme `ExpertCallScreen` üzerinden Jitsi Meet ile yapılır.
Görüşme özeti uygulama içinden bu dosyaya eklenir.

---

## Görüşme — 2026-05-27T18:30:00.000Z

**Katılımcılar:** 231118066 Alperen + Sınıf arkadaşı (uzman rolünde)

**Tetikleyici:** FORGE döngüsü Cycle 2 ve Cycle 3'te ardışık ROLLBACK — STUCK durumu.

**Sorun:** AvatarScreen'de GLB dosyası expo-asset ile yüklenirken `localUri` null dönüyordu. GLTFLoader path'i bulamıyordu.

**Uzmanın önerisi:** `Asset.fromModule` yerine `Asset.fromURI` kullanılmasını ve `downloadAsync` sonrası `localUri` kontrolü eklenmesini önerdi. Ayrıca fallback sphere mesh'in her zaman render edilmesi gerektiğini söyledi.

**Uygulanan düzeltme:** GLB yükleme bloğuna `if (!asset.localUri) throw new Error('localUri null')` kontrolü eklendi, fallback mesh her zaman önce render edilip GLB yüklenince yerini alacak şekilde güncellendi.

**Sonuç:** Cycle 4 başarılı commit — `a3f9c21`

**Ekran paylaşımı:** ✅ Yapıldı (60 sn+, demo videoda 1:45 - 2:50 arası)

---

> Sonraki görüşmeler uygulama içinden otomatik olarak bu dosyaya eklenir.
