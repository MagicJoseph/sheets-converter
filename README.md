# Sheets → TS Converter

Lokalne narzędzie do konwersji CSV z Google Sheets na TypeScript / JSON dla prototypu Figma Make.

## Uruchomienie

```bash
npm install
npm run dev
```

Otwórz http://localhost:5173

## Workflow

1. W Google Sheets: **File → Download → CSV** (lub File → Share → Publish to web → CSV)
2. Wklej CSV w pole tekstowe
3. Sprawdź / popraw mapowanie kolumn
4. Kliknij "Konwertuj"
5. Skopiuj wynik i wklej jako `src/data/materials.ts` w projekcie Figma Make

## Struktura oczekiwanego arkusza

| id | title | description | link | access | accessCode |
|----|-------|-------------|------|--------|------------|
| mat-001 | Algebra | Opis... | https://... | free | |
| mat-002 | Analiza | Opis... | https://... | code-required | EDU2024 |

Wartość `access`: `free` lub `code-required`.

## Użycie wygenerowanego pliku w prototypie

```ts
// src/data/materials.ts  ← wklejasz tutaj output z konwertera
import type { Material } from "@/types/material";
export const materials: Material[] = [ ... ];

// w komponencie
import { materials } from "@/data/materials";
```
