# Audit Report

**Screen:** `Voice`
**Timestamp:** 2026-05-27T10:15:22.000Z
**Note:** Bar animasyonu sessizlikte tamamen sönmüyor — konuşma bitince barlar minimum seviyeye inmesi 300ms+ sürüyor. Geçiş yumuşak değil.

## Annotations

- **Box 1:** x=24 y=180 w=320 h=130 — Bar görselleştirici: sessizlik → aktif geçiş çok ani

## Hypothesis

> `silenceBars()` animasyonu çok hızlı tetikleniyor, RMS threshold 0 olunca anında söndürüyor. Kademeli fade gerekiyor.

## Expected Fix

> `silenceBars()` içinde `Animated.timing` duration değeri 80ms'den 300ms'ye çıkarılmalı. Ayrıca RMS < 0.05 olduğunda direkt sıfırlamak yerine önceki değerden kademeli azaltma yapılmalı.
