# 231118066 — forge-app

**Track A — Sadelik (Drop-in Discipline)**  
Öğrenci No: `231118066`

---

## Proje Yapısı

```
231118066-forge-app/
├── app/                        # Expo + TypeScript projesi
│   ├── App.tsx                 # Root component (in-memory navigation)
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   └── src/
│       ├── screens.ts          # Merkezi ekran registry (FORGE agent buraya yazar)
│       ├── audit/
│       │   ├── AuditWidget.tsx # Drop-in widget (FAB → screenshot → annotation → .md)
│       │   └── types.ts        # TypeScript tipleri
│       └── screens/
│           ├── HomeScreen.tsx    # Ekran 1 — AuditWidget mount edilmiş
│           ├── TasksScreen.tsx   # Ekran 2 — AuditWidget mount edilmiş
│           └── SettingsScreen.tsx # Ekran 3 — AuditWidget mount edilmiş
├── reports/
│   ├── capture-cta.md          # Audit raporu 1 (Home ekranı)
│   ├── reports-export.md       # Audit raporu 2 (Tasks ekranı)
│   └── forge-ratchet.md        # Audit raporu 3 (Settings ekranı)
└── FORGE.md                    # Ledger: 4 cycle (3 success + 1 rollback)
```

---

## Track A — Drop-in Disiplini

`AuditWidget` bileşeni **zero coupling** prensibiyle tasarlanmıştır:

- Her ekrana sadece iki satır eklenir:
  ```tsx
  import { AuditWidget } from '../audit/AuditWidget';
  // ...
  <AuditWidget screenName="Home" onReport={handleReport} />
  ```
- Widget kendi modal'ını yönetir, ekrana herhangi bir state inject etmez.
- `.md` rapor dosyası `expo-file-system` ile cihaz lokal depolama alanına kaydedilir. Backend yok.

---

## Kurulum & Çalıştırma

```bash
cd app
npm install
npm start         # Expo Go ile tara
npm run typecheck # TypeScript kontrol
```

---

## FORGE Döngüsü

| Cycle | Rapor | Sonuç |
|-------|-------|-------|
| 1 | capture-cta.md | ✅ COMMIT `edb41e9` |
| 2 | reports-export.md | ❌ ROLLBACK |
| 3 | reports-export.md | ✅ COMMIT `4c4236b` |
| 4 | forge-ratchet.md | ✅ COMMIT `68f27d2` |

Detaylar: [`FORGE.md`](./FORGE.md)
