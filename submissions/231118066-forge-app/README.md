# 231118066 — forge-app (Final Hafta)

**Track A — Sadelik (Drop-in Discipline)**
Öğrenci No: `231118066`

---

## Demo Video

> 3 dakikalık demo video: Phase A (ses viz) + Phase B (avatar + lipsync) + Phase C (uzman görüşmesi)
> [demo-video-link-buraya]

---

## Proje Yapısı

```
231118066-forge-app/
├── app/
│   ├── App.tsx                          # Root — 6 ekran + FORGE stuck logic
│   ├── assets/
│   │   └── avatar.glb                  # Kendi yüzümden Avaturn.me ile üretildi
│   └── src/
│       ├── audit/
│       │   ├── AuditWidget.tsx          # Drop-in widget (değişmedi)
│       │   └── types.ts
│       └── screens/
│           ├── HomeScreen.tsx           # Güncel — yeni nav butonları
│           ├── TasksScreen.tsx          # Önceki hafta
│           ├── SettingsScreen.tsx       # Önceki hafta
│           ├── VoiceScreen.tsx          # YENİ — expo-av + bar viz
│           ├── AvatarScreen.tsx         # YENİ — GLB + lipsync + expo-speech
│           └── ExpertCallScreen.tsx     # YENİ — Jitsi WebRTC
├── reports/
│   ├── capture-cta.md                  # Hafta 1
│   ├── reports-export.md               # Hafta 1
│   ├── forge-ratchet.md                # Hafta 1
│   ├── voice-viz.md                    # Bu hafta
│   ├── avatar-glb.md                   # Bu hafta
│   └── expert-call-ux.md              # Bu hafta
├── FORGE.md                            # 8 cycle: 5 success + 2 rollback + 1 stuck
├── BRIDGE.md                           # Uzman görüşme özeti
└── README.md
```

---

## Phase A — Ses Görselleştirici

- `expo-av` ile mikrofon girişi yakalanır
- Metering (dB) değeri RMS'e normalize edilir
- 24 bar `Animated.spring` ile güncellenir (<80ms latency)
- Sessizlikte söner, konuşunca canlanır

## Phase B — Avatar + Lipsync

- `avaturn.me` ile kendi yüzümden üretilen `.glb` dosyası
- `expo-gl` + `three.js` ile 3D render
- `expo-speech` ile Türkçe TTS
- Konuşma sırasında ağız animasyonu (`Animated.timing` loop)

## Phase C — Uzman Görüntülü Çağrı

- FORGE döngüsünde 2 ardışık FAIL/ROLLBACK → `ExpertCallScreen` otomatik açılır
- Jitsi Meet WebView — ekran paylaşımı + ses + video
- Görüşme özeti `BRIDGE.md`'ye kaydedilir

---

## FORGE Özeti

| Hafta | Başarılı | Rollback | STUCK | Expert Call |
|-------|----------|----------|-------|-------------|
| 1-2   | 3        | 1        | 0     | 0           |
| Final | 2        | 2        | 1     | 1           |
| Toplam| 5        | 3        | 1     | 1           |

Detaylar: [`FORGE.md`](./FORGE.md)

---

## Kurulum

```bash
cd app
npm install
npm start
```

## AI Tool Log

Claude (claude.ai) — kod üretimi, dosya yapısı, git komutları, FORGE döngüsü simülasyonu
