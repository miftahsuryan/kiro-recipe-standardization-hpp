# Standardisasi Resep & HPP

Modul frontend berbasis web untuk membantu koki dan pemilik usaha kuliner mendigitalisasi resep dari "insting/perkiraan" menjadi data metrik yang terukur dan konsisten.

## Fitur

- **Manajemen Resep** — buat, edit, dan duplikasi resep dengan bahan, takaran, dan langkah memasak terstandarisasi
- **Kalkulasi HPP Otomatis** — hitung Harga Pokok Penjualan per porsi secara real-time berdasarkan harga bahan
- **Simulasi Harga Jual** — hitung harga jual rekomendasi berdasarkan margin keuntungan yang diinginkan
- **Manajemen Harga Bahan Baku** — kelola harga bahan terpusat; perubahan harga otomatis memperbarui HPP semua resep terkait
- **Versi & Riwayat Resep** — lacak perubahan resep, bandingkan versi, dan pulihkan versi lama (maks 20 versi per resep)
- **Kalkulator Skala Porsi** — sesuaikan takaran bahan secara proporsional untuk skala produksi berbeda
- **Ekspor PDF & CSV** — bagikan data resep dan HPP ke luar aplikasi
- **Panduan Memasak** — tampilan step-by-step saat produksi berlangsung

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Client state | Zustand |
| Server state | TanStack Query (React Query) |
| Testing | Vitest + React Testing Library + fast-check |
| Export | jsPDF + native Blob API |

## Struktur Proyek

```
src/
├── app/                  # Router, global providers
├── features/
│   ├── recipes/          # Manajemen resep
│   ├── ingredients/      # Manajemen harga bahan baku
│   ├── versions/         # Riwayat & diff versi resep
│   ├── export/           # Ekspor PDF & CSV
│   └── cooking-guide/    # Panduan memasak step-by-step
├── shared/
│   ├── components/       # UI primitives (Button, Input, Modal, Toast, dll)
│   ├── hooks/            # useDebounce, useToast
│   ├── lib/              # Pure functions: kalkulasi, validasi, sort/filter
│   └── types/            # Semua TypeScript interfaces & enums
└── stores/               # Zustand stores
```

Arsitektur mengikuti pola **Feature-Sliced Design (FSD)** yang dimodifikasi. Semua business logic (kalkulasi HPP, validasi, scaling) hidup sebagai pure functions di `src/shared/lib/` — dapat diuji secara independen tanpa side effects.

## Memulai

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan tests
npx vitest --run

# Type check
npx tsc --noEmit
```

## Formula Bisnis

| Kalkulasi | Formula |
|---|---|
| HPP per Porsi | `Σ(qty × harga) / porsi` |
| Harga Jual | `HPP / (1 − margin/100)` |
| Skala Takaran | `(qty_asli / porsi_asli) × porsi_target` |

Semua nilai mata uang diformat dalam Rupiah (Rp) dengan format angka Indonesia (titik ribuan, koma desimal).

## Testing

Property-based tests menggunakan **fast-check** (minimal 100 iterasi per property) untuk memvalidasi invariant kalkulasi bisnis. Unit tests menggunakan Vitest + React Testing Library.

```bash
# Jalankan semua tests
npx vitest --run

# Dengan coverage
npx vitest --run --coverage
```
