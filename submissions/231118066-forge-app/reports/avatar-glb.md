# Audit Report

**Screen:** `Avatar`
**Timestamp:** 2026-05-27T11:42:08.000Z
**Note:** Avatar ekranı açılıyor ama 3D model görünmüyor. Siyah ekran geliyor. Fallback sphere de render edilmiyor.

## Annotations

- **Box 1:** x=0 y=100 w=390 h=400 — GLView alanı tamamen siyah — model yüklenmiyor
- **Box 2:** x=24 y=520 w=340 h=48 — "Konuştur" butonu çalışıyor ama avatar yok

## Hypothesis

> GLB dosyası expo-asset ile yüklenirken `localUri` null dönüyor. `Asset.fromModule` require path'i Expo bundler tarafından çözülemiyor olabilir.

## Expected Fix

> `Asset.fromModule(require(...))` yerine `Asset.fromURI(uri)` denenmeli. Ayrıca fallback sphere mesh her koşulda render edilmeli, GLB yüklenince üzerine geçilmeli.
