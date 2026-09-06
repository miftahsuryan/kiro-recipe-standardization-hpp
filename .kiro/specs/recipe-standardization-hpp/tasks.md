# Implementation Plan: Standardisasi Resep dan HPP

## Overview

Implementasi ini mengikuti arsitektur Feature-Sliced Design (FSD) yang dimodifikasi. Urutan pengerjaan dimulai dari fondasi (tipe data global, pure functions, stores), dilanjutkan dengan komponen UI bersama, lalu fitur-fitur utama secara bertahap. Setiap task dibangun di atas hasil task sebelumnya sehingga tidak ada kode yang menggantung tanpa integrasi.

Stack: React + TypeScript, Zustand, TanStack Query, Tailwind CSS, Vitest, React Testing Library, fast-check.

---

## Tasks

- [ ] 1. Setup struktur proyek dan tipe data global
  - Buat struktur direktori sesuai FSD: `src/app`, `src/features/recipes`, `src/features/ingredients`, `src/features/versions`, `src/features/export`, `src/features/cooking-guide`, `src/shared/components`, `src/shared/hooks`, `src/shared/lib`, `src/shared/types`, `src/stores`
  - Tulis semua TypeScript interfaces dan types di `src/shared/types/index.ts`: `Ingredient`, `RecipeIngredient`, `CookingStep`, `Recipe`, `RecipeSummary`, `RecipeVersion`, `HPPResult`, `CostBreakdownItem`, `ProfitSimulation`, `ScaledIngredient`, `ScaleResult`, `RecipeListFilter`, serta enums `RecipeCategory`, `MeasurementUnit`, `RecipeStatus`, `RecipeSortField`, `SortDirection`
  - Setup Vitest dengan konfigurasi `vitest.config.ts` (environment jsdom, setupFiles, coverage thresholds) dan buat `src/test-setup.ts`
  - Install dan konfigurasi fast-check sebagai dev dependency
  - _Requirements: 1.1, 1.4_

- [ ] 2. Implementasi pure functions — kalkulasi bisnis utama
  - [ ] 2.1 Implementasi `calculateHPP` di `src/shared/lib/calculations.ts`
    - Hitung `totalBiaya = Σ(quantity_i × pricePerUnit_i)`, `hppPerPorsi = totalBiaya / portions` (dibulatkan 2 desimal)
    - Kembalikan `HPPResult` dengan `breakdown` sepanjang daftar bahan; `isValid: false` jika `portions ≤ 0`
    - _Requirements: 3.1, 3.3, 3.6_

  - [ ]* 2.2 Tulis property test untuk `calculateHPP`
    - **Property 1: Kalkulasi HPP Komprehensif**
    - **Validates: Requirements 3.1, 3.3, 3.6**

  - [ ] 2.3 Implementasi `calculateSellingPrice` di `src/shared/lib/calculations.ts`
    - Hitung `hargaJual = HPP / (1 - margin/100)` dan `keuntunganPerPorsi = hargaJual - hppPerPorsi`
    - _Requirements: 4.2, 4.6_

  - [ ]* 2.4 Tulis property test untuk `calculateSellingPrice`
    - **Property 2: Kalkulasi Harga Jual dan Invariant Finansial**
    - **Validates: Requirements 4.2, 4.6**

  - [ ] 2.5 Implementasi `scaleRecipe` di `src/shared/lib/calculations.ts`
    - Hitung `scaledQuantity = round((origQty / origPortions) × targetPortions, 2)` untuk setiap bahan
    - _Requirements: 9.2_

  - [ ]* 2.6 Tulis property test untuk `scaleRecipe`
    - **Property 3: Kalkulasi Skala Porsi Proporsional**
    - **Validates: Requirements 9.2**

  - [ ] 2.7 Implementasi `formatCurrency` di `src/shared/lib/calculations.ts`
    - Format nilai numerik menjadi string dengan prefix "Rp", 2 angka desimal, format angka Indonesia (titik ribuan, koma desimal)
    - _Requirements: 3.4_

  - [ ]* 2.8 Tulis property test untuk `formatCurrency`
    - **Property 18: Format Mata Uang Rupiah Konsisten**
    - **Validates: Requirements 3.4**

- [ ] 3. Implementasi pure functions — validasi input
  - [ ] 3.1 Implementasi `validatePositiveNumber`, `validateMargin`, `validateTargetPortions` di `src/shared/lib/validators.ts`
    - `validatePositiveNumber`: tolak nilai ≤ 0, > 999.999.999 (harga), atau di luar [0.01; 99999.99] (takaran)
    - `validateMargin`: tolak nilai di luar (0, 100) termasuk non-numerik
    - `validateTargetPortions`: tolak nilai di luar [1; 10000] atau bukan bilangan bulat positif
    - _Requirements: 1.3, 3.5, 3.7, 4.4, 4.5, 5.7, 9.4_

  - [ ]* 3.2 Tulis property test untuk `validatePositiveNumber`
    - **Property 5: Validasi Input Numerik Positif**
    - **Validates: Requirements 1.3, 3.5, 5.7**

  - [ ]* 3.3 Tulis property test untuk `validateMargin`
    - **Property 6: Validasi Margin Keuntungan**
    - **Validates: Requirements 4.4, 4.5**

  - [ ]* 3.4 Tulis property test untuk `validateTargetPortions`
    - **Property 7: Validasi Porsi Target Skala**
    - **Validates: Requirements 9.4**

  - [ ] 3.5 Implementasi `validateRecipeForm` di `src/shared/lib/validators.ts`
    - Validasi: nama wajib (1–150 karakter), porsi (1–9999), minimal 1 bahan, minimal 1 langkah memasak
    - Kembalikan `{ isValid: boolean, errors: Record<string, string> }`
    - _Requirements: 1.5_

  - [ ]* 3.6 Tulis property test untuk `validateRecipeForm`
    - **Property 8: Validasi Form Resep**
    - **Validates: Requirements 1.5**

- [ ] 4. Implementasi pure functions — sort, filter, paginate, dan utilitas lainnya
  - [ ] 4.1 Implementasi `sortRecipes`, `filterRecipesByCategory`, `paginateRecipes` di `src/shared/lib/sort-filter.ts`
    - `sortRecipes`: urutkan berdasarkan `name`, `hppPerPorsi`, atau `updatedAt` dengan arah asc/desc
    - `filterRecipesByCategory`: kembalikan hanya resep dengan `category === selectedCategory`
    - `paginateRecipes`: kembalikan maksimal 20 item per halaman
    - _Requirements: 2.1, 2.3, 2.5, 2.6_

  - [ ]* 4.2 Tulis property test untuk `sortRecipes`
    - **Property 9: Sorting Resep Menghasilkan Urutan yang Benar**
    - **Validates: Requirements 2.1, 2.5**

  - [ ]* 4.3 Tulis property test untuk `paginateRecipes`
    - **Property 10: Paginasi Tidak Melebihi Batas Per Halaman**
    - **Validates: Requirements 2.6**

  - [ ]* 4.4 Tulis property test untuk `filterRecipesByCategory`
    - **Property 11: Filter Kategori Konsisten**
    - **Validates: Requirements 2.3**

  - [ ] 4.5 Implementasi `autocompleteFilter` dan `reorderSteps` di `src/shared/lib/sort-filter.ts`
    - `autocompleteFilter`: kembalikan maksimal 10 saran nama bahan yang cocok dengan kata kunci
    - `reorderSteps`: terima array langkah dengan urutan baru, kembalikan array dengan urutan dipertahankan
    - _Requirements: 1.2, 1.7_

  - [ ]* 4.6 Tulis property test untuk `autocompleteFilter`
    - **Property 4: Saran Autocomplete Tidak Melebihi 10**
    - **Validates: Requirements 1.2**

  - [ ]* 4.7 Tulis property test untuk `reorderSteps`
    - **Property 19: Urutan Langkah Memasak Dipertahankan Setelah Drag-and-Drop**
    - **Validates: Requirements 1.7**

  - [ ] 4.8 Implementasi `diffRecipeVersions` di `src/shared/lib/version-utils.ts`
    - Bandingkan dua `RecipeVersion`, kembalikan daftar field yang berbeda tanpa false positive atau missed field
    - _Requirements: 6.3_

  - [ ]* 4.9 Tulis property test untuk `diffRecipeVersions`
    - **Property 16: Diff View Mengidentifikasi Tepat Field yang Berbeda**
    - **Validates: Requirements 6.3**

- [ ] 5. Checkpoint — Pastikan semua unit dan property test pure functions lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 6. Implementasi Zustand stores dan logika store
  - [ ] 6.1 Buat `src/stores/recipeStore.ts` dengan interface `RecipeStore`
    - Implementasi state: `recipes`, `activeRecipe`, `filter`, `hppPreview`
    - Implementasi actions: `setFilter`, `setActiveRecipe`, `updateHPPPreview`
    - _Requirements: 2.1, 2.3, 2.5, 3.2_

  - [ ] 6.2 Buat `src/stores/ingredientStore.ts` dengan interface `IngredientStore`
    - Implementasi state: `ingredients`
    - Implementasi actions: `setIngredients`, `updateIngredientPrice`
    - _Requirements: 5.1, 5.2_

  - [ ] 6.3 Implementasi logika propagasi harga di `ingredientStore`
    - Setelah `updateIngredientPrice`, perbarui `pricePerUnit` pada semua `RecipeIngredient` yang menggunakan `ingredientId` tersebut di semua resep dalam store
    - _Requirements: 5.2_

  - [ ]* 6.4 Tulis property test untuk `updateIngredientPrice` (propagasi)
    - **Property 12: Propagasi Harga Bahan ke Semua Resep Terkait**
    - **Validates: Requirements 5.2**

  - [ ] 6.5 Implementasi `hasRecentPriceUpdate` di store atau selector
    - Hitung `true` jika resep memiliki minimal satu bahan dengan `lastUpdated` ≤ 7 hari lalu
    - _Requirements: 5.4_

  - [ ]* 6.6 Tulis property test untuk `hasRecentPriceUpdate`
    - **Property 13: Indikator Harga Baru Akurat**
    - **Validates: Requirements 5.4**

  - [ ] 6.7 Implementasi `markIngredientInactive` di store
    - Setelah konfirmasi hapus bahan, set `isActiveIngredient: false` pada semua `RecipeIngredient` yang cocok di semua resep
    - _Requirements: 5.6_

  - [ ]* 6.8 Tulis property test untuk `markIngredientInactive`
    - **Property 14: Penandaan Bahan Tidak Aktif Setelah Penghapusan**
    - **Validates: Requirements 5.6**

  - [ ] 6.9 Implementasi `saveRecipeVersion` dan `pruneOldVersions` di store versi
    - Setiap simpan resep: tambah versi baru; jika sudah 20 versi, hapus yang paling lama
    - _Requirements: 6.1, 6.7_

  - [ ]* 6.10 Tulis property test untuk `saveRecipeVersion` dan `pruneOldVersions`
    - **Property 15: Penambahan Versi Setiap Simpan (dan Batas Maksimal 20)**
    - **Validates: Requirements 6.1, 6.7**

  - [ ] 6.11 Implementasi `restoreVersion` di store versi
    - Buat versi baru dari snapshot versi yang dipilih; pertahankan versi aktif sebelumnya dalam riwayat
    - _Requirements: 6.4_

  - [ ]* 6.12 Tulis property test untuk `restoreVersion`
    - **Property 17: Restore Versi Menghasilkan Snapshot yang Identik**
    - **Validates: Requirements 6.4**

- [ ] 7. Checkpoint — Pastikan semua store tests lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 8. Implementasi shared UI components
  - [ ] 8.1 Buat komponen primitif di `src/shared/components/`: `Button`, `Input`, `Select`, `Modal`, `Toast`, `Badge`, `ErrorBoundary`
    - Setiap input form harus memiliki `<label>` terasosiasi secara eksplisit (WCAG 2.1 AA)
    - Pesan error menggunakan `aria-describedby` + `role="alert"`
    - _Requirements: 1.5, 3.5, 4.4_

  - [ ] 8.2 Buat custom hook `useDebounce` di `src/shared/hooks/useDebounce.ts`
    - Debounce nilai input selama N milidetik (digunakan untuk pencarian 300ms)
    - _Requirements: 2.2_

  - [ ] 8.3 Setup router di `src/app/` menggunakan React Router dengan 6 routes:
    - `/recipes`, `/recipes/new`, `/recipes/:id`, `/recipes/:id/edit`, `/recipes/:id/versions`, `/ingredients`
    - Bungkus app dengan `QueryClientProvider` (TanStack Query) dan provider Zustand
    - _Requirements: 1.1, 2.1, 7.1_

- [ ] 9. Implementasi fitur Manajemen Harga Bahan Baku
  - [ ] 9.1 Buat `IngredientManagementPage` di `src/features/ingredients/`
    - Tampilkan `IngredientPriceTable` dengan kolom: nama bahan, harga satuan, satuan ukuran, tanggal pembaruan terakhir
    - _Requirements: 5.1_

  - [ ] 9.2 Implementasi edit inline harga bahan di `IngredientPriceRow`
    - Validasi input harga: angka positif, maks 999.999.999; tampilkan error inline jika tidak valid
    - Setelah simpan: tampilkan jumlah resep yang HPP-nya diperbarui sebagai konfirmasi
    - _Requirements: 5.2, 5.3, 5.7_

  - [ ] 9.3 Implementasi `DeleteIngredientDialog`
    - Tampilkan dialog konfirmasi yang menyebut jumlah resep yang menggunakan bahan tersebut
    - Setelah konfirmasi: panggil `markIngredientInactive` di store
    - _Requirements: 5.5, 5.6_

  - [ ]* 9.4 Tulis unit test untuk `IngredientManagementPage`
    - Test: validasi harga invalid, sukses simpan dengan konfirmasi count resep, dialog hapus bahan
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.6, 5.7_

- [ ] 10. Implementasi fitur Daftar dan Pencarian Resep
  - [ ] 10.1 Buat `RecipeListPage` dan `RecipeCardGrid` di `src/features/recipes/`
    - Tampilkan `RecipeCard` dengan: nama, kategori, porsi, HPP per porsi (format Rp), tanggal diperbarui
    - Urutan default: tanggal diperbarui terbaru
    - Tampilkan `EmptyState` dengan tombol CTA jika belum ada resep
    - _Requirements: 2.1, 2.4_

  - [ ] 10.2 Implementasi `RecipeSearchBar` dengan debounce 300ms
    - Tampilkan hasil pencarian ≤ 500ms setelah jeda ketik; tampilkan pesan no-result jika tidak ada yang cocok
    - _Requirements: 2.2, 2.7_

  - [ ] 10.3 Implementasi `RecipeCategoryFilter` dan `RecipeSortControl`
    - Filter kategori mempertahankan kata kunci dan sort aktif
    - Sort options: nama A–Z/Z–A, HPP rendah–tinggi/tinggi–rendah, diperbarui terbaru/terlama
    - _Requirements: 2.3, 2.5_

  - [ ] 10.4 Implementasi `PaginationControl` dengan maksimal 20 resep per halaman
    - _Requirements: 2.6_

  - [ ] 10.5 Tambahkan indikator visual "harga baru" pada `RecipeCard`
    - Tampilkan ikon + badge warna jika `hasRecentPriceUpdate === true` (tidak hanya warna saja — WCAG)
    - _Requirements: 5.4_

  - [ ]* 10.6 Tulis unit test untuk `RecipeListPage`
    - Test: empty state, daftar terisi, filter aktif tanpa hasil, sort berubah, indikator harga baru
    - _Requirements: 2.1, 2.4, 2.5, 2.6, 2.7, 5.4_

- [ ] 11. Implementasi fitur Form Buat dan Edit Resep
  - [ ] 11.1 Buat `RecipeFormPage` di `src/features/recipes/` untuk route `/recipes/new` dan `/recipes/:id/edit`
    - Render `RecipeMetaFields`: nama (maks 150 karakter), kategori, porsi (1–9999), deskripsi (maks 500 karakter)
    - _Requirements: 1.1, 1.10_

  - [ ] 11.2 Implementasi `IngredientList` dengan `IngredientRow`
    - Setiap baris: `IngredientAutocomplete` (maks 10 saran dari store), `QuantityInput` (0.01–99999.99, maks 2 desimal), `UnitSelect`
    - Tombol hapus bahan: perbarui daftar dan HPP ≤ 1 detik
    - _Requirements: 1.2, 1.3, 1.4, 1.8, 1.9_

  - [ ] 11.3 Implementasi `CookingStepList` dengan drag-and-drop
    - Mendukung seret-dan-lepas untuk reorder langkah
    - Menyediakan alternatif keyboard (tombol ↑↓) untuk aksesibilitas
    - _Requirements: 1.7_

  - [ ] 11.4 Implementasi `HPPSummaryPanel` (live preview)
    - Perbarui tampilan HPP per porsi dan total biaya ≤ 500ms saat takaran/harga/porsi berubah
    - Tampilkan rincian breakdown per bahan dalam tabel
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_

  - [ ] 11.5 Implementasi `FormActionBar` dengan validasi saat simpan
    - Validasi semua field wajib; tampilkan inline error per field, scroll ke field error pertama
    - Setelah simpan berhasil: redirect ke halaman detail resep
    - _Requirements: 1.5, 1.6_

  - [ ]* 11.6 Tulis unit test untuk `RecipeFormPage`
    - Test: submit valid → redirect, submit invalid → error messages, hapus bahan → HPP update, drag-and-drop steps, edit resep existing
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

  - [ ]* 11.7 Tulis unit test untuk `HPPSummaryPanel`
    - Test: tampilan nilai format Rp, porsi = 0 → tidak hitung HPP, bahan inactive → ditandai di breakdown
    - _Requirements: 3.2, 3.4, 3.5, 3.7_

- [ ] 12. Checkpoint — Pastikan semua tests form dan daftar resep lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 13. Implementasi fitur Detail Resep
  - [ ] 13.1 Buat `RecipeDetailPage` di `src/features/recipes/`
    - Tampilkan `RecipeHeader`, `IngredientTable` (dengan kolom biaya), `CookingStepList` (read-only), `HPPSummaryCard`
    - Nomor urut langkah jelas, font size minimal 16px
    - Banner peringatan jika ada bahan tidak aktif
    - _Requirements: 7.1, 7.2_

  - [ ] 13.2 Implementasi responsivitas di `RecipeDetailPage`
    - Di bawah 768px: layout satu kolom, tidak ada horizontal scrolling
    - Form bahan menggunakan accordion pada mobile
    - _Requirements: 7.3_

  - [ ] 13.3 Implementasi pratinjau cetak (`@media print`)
    - Sembunyikan navigasi dan tombol aksi; tampilkan hanya konten resep
    - _Requirements: 7.4_

  - [ ]* 13.4 Tulis unit test untuk `RecipeDetailPage`
    - Test: tampilan lengkap detail, responsivitas mobile, banner bahan tidak aktif
    - _Requirements: 7.1, 7.2, 7.3_

- [ ] 14. Implementasi fitur Simulasi Harga Jual dan Skala Porsi
  - [ ] 14.1 Implementasi `ProfitSimulator` di `src/features/recipes/`
    - Tampilkan di halaman detail resep; input margin keuntungan (%) dengan nilai awal kosong
    - Perbarui harga jual ≤ 300ms setelah input berubah
    - Disable dan tampilkan pesan jika HPP = 0 atau tidak tersedia
    - Tampilkan ringkasan: HPP, harga jual, keuntungan per porsi, margin (%)
    - _Requirements: 4.1, 4.2, 4.3, 4.6, 4.7_

  - [ ]* 14.2 Tulis unit test untuk `ProfitSimulator`
    - Test: disable state saat HPP = 0, kalkulasi valid, error margin invalid, error input non-numerik
    - _Requirements: 4.1, 4.3, 4.4, 4.5, 4.7_

  - [ ] 14.3 Implementasi `PortionScaleCalculator` di `src/features/recipes/`
    - Tampilkan di halaman detail resep; nilai awal = porsi asli resep
    - Perbarui takaran dan total biaya yang di-scale ≤ 500ms; tidak mengubah data resep asli
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 14.4 Tulis unit test untuk `PortionScaleCalculator`
    - Test: scale valid, tampilan hasil proporsional, error porsi invalid, mempertahankan nilai terakhir valid
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 15. Implementasi fitur Versi Resep dan Riwayat Perubahan
  - [ ] 15.1 Buat `VersionHistoryPage` di `src/features/versions/`
    - Tampilkan `VersionList` diurutkan dari terbaru ke terlama
    - Setiap item: nomor versi, tanggal/waktu simpan, nama pengguna yang menyimpan
    - _Requirements: 6.2_

  - [ ] 15.2 Implementasi `DiffViewModal`
    - Tampilkan perbandingan field antara versi yang dipilih dan versi aktif; sorot perbedaan
    - Tombol "Pulihkan" dengan dialog konfirmasi sebelum eksekusi
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

  - [ ]* 15.3 Tulis unit test untuk `DiffViewModal`
    - Test: rendering diff dengan field berbeda, diff tanpa perbedaan, flow konfirmasi restore, pembatalan restore
    - _Requirements: 6.3, 6.4, 6.5, 6.6_

- [ ] 16. Implementasi fitur Duplikasi Resep
  - [ ] 16.1 Tambahkan `DuplicateButton` di `RecipeCard` dan `RecipeDetailPage`
    - Setelah klik: buat salinan dengan nama "[Nama Asli] — Salinan" (maks 255 karakter), status Draft, buka form edit salinan
    - Salin semua bahan, takaran, langkah, harga bahan dari resep asli
    - Salinan independen dari resep asli (perubahan tidak saling mempengaruhi)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [ ]* 16.2 Tulis unit test untuk alur duplikasi resep
    - Test: sukses duplikasi → form edit terbuka, gagal duplikasi → error toast, independensi salinan
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 17. Implementasi fitur Panduan Memasak
  - [ ] 17.1 Implementasi `CookingGuideOverlay` di `src/features/cooking-guide/`
    - Tampilkan satu langkah pada satu waktu dengan tombol navigasi berikutnya/sebelumnya
    - Disable tombol "sebelumnya" di langkah pertama; disable tombol "berikutnya" di langkah terakhir
    - `aria-label` deskriptif pada tombol navigasi; full-screen modal di mobile
    - _Requirements: 7.5, 7.6_

  - [ ]* 17.2 Tulis unit test untuk `CookingGuideOverlay`
    - Test: navigasi step-by-step, disable tombol di langkah pertama/terakhir, render konten langkah yang benar
    - _Requirements: 7.5, 7.6_

- [ ] 18. Implementasi fitur Ekspor PDF dan CSV
  - [ ] 18.1 Implementasi fungsi `generateCSV` di `src/features/export/`
    - Header: nama bahan, takaran, satuan, harga satuan, total biaya per bahan, HPP per Porsi
    - Satu baris per bahan; unduh otomatis via Blob API
    - _Requirements: 10.1, 10.3, 10.4_

  - [ ]* 18.2 Tulis property test untuk `generateCSV`
    - **Property 20: Output CSV Mengandung Semua Kolom dan Baris yang Disyaratkan**
    - **Validates: Requirements 10.3**

  - [ ] 18.3 Implementasi fungsi `generatePDF` di `src/features/export/`
    - Gunakan `jspdf` atau `react-pdf`; muat: nama resep, bahan + takaran + satuan, langkah memasak, rincian biaya, HPP per porsi, harga jual jika margin diisi
    - _Requirements: 10.1, 10.2, 10.4_

  - [ ] 18.4 Implementasi `ExportPanel` di halaman detail resep
    - Disable tombol ekspor jika HPP belum dihitung; tampilkan tooltip penjelasan
    - Tampilkan notifikasi sukses dalam 3 detik setelah unduh selesai
    - Tampilkan pesan error jika ekspor gagal, sarankan coba lagi; tidak menghasilkan file parsial/kosong
    - _Requirements: 10.4, 10.5, 10.6_

  - [ ]* 18.5 Tulis unit test untuk `ExportPanel`
    - Test: ekspor sukses → notifikasi, ekspor gagal → error toast, disable state saat HPP belum ada
    - _Requirements: 10.4, 10.5, 10.6_

- [ ] 19. Integrasi dan wiring antar fitur
  - [ ] 19.1 Wiring TanStack Query untuk semua operasi API (fetch resep, simpan, hapus, fetch bahan)
    - Setup query keys, mutation hooks untuk setiap operasi; tangkap error dengan toast notification
    - _Requirements: 1.6, 5.2, 5.3_

  - [ ] 19.2 Wiring `VersionHistoryPanel` ke `RecipeDetailPage`
    - Tampilkan panel riwayat versi di halaman detail; integrasikan dengan `VersionHistoryPage` dan `DiffViewModal`
    - _Requirements: 6.2, 6.3_

  - [ ] 19.3 Wiring alur simpan resep → create version otomatis
    - Setiap simpan perubahan resep yang sudah ada: panggil `saveRecipeVersion`, pruning otomatis jika sudah 20 versi
    - _Requirements: 6.1, 6.7_

  - [ ] 19.4 Hubungkan `IngredientAutocomplete` dengan `ingredientStore`
    - Autocomplete mengambil data dari store, filter maksimal 10 saran secara real-time
    - _Requirements: 1.2_

  - [ ]* 19.5 Tulis integration test: alur buat resep end-to-end
    - Isi form → simpan → redirect ke halaman detail → versi pertama tersimpan
    - _Requirements: 1.1, 1.5, 1.6, 6.1_

  - [ ]* 19.6 Tulis integration test: alur duplikasi resep
    - Klik duplikasi dari daftar → form edit terbuka dengan nama salinan
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 19.7 Tulis integration test: alur restore versi resep
    - Pilih versi → konfirmasi → versi aktif berubah → versi sebelumnya tetap tersimpan
    - _Requirements: 6.4, 6.5, 6.6_

  - [ ]* 19.8 Tulis integration test: ekspor PDF dan CSV
    - Ekspor berhasil → unduh terpicu → notifikasi sukses
    - _Requirements: 10.2, 10.3, 10.4_

- [ ] 20. Checkpoint akhir — Pastikan semua tests lulus dan semua fitur terintegrasi
  - Pastikan semua tests lulus, tidak ada kode yang menggantung tanpa integrasi, tanyakan kepada pengguna jika ada pertanyaan.

---

## Notes

- Task yang ditandai `*` bersifat opsional dan dapat dilewati untuk implementasi MVP yang lebih cepat
- Setiap task mereferensikan requirement spesifik untuk keterlacakan
- Checkpoint memastikan validasi inkremental sebelum melanjutkan ke lapisan fitur berikutnya
- Property tests memvalidasi properti universal dengan fast-check (minimal 100 iterasi per property)
- Unit tests memvalidasi contoh spesifik, edge case, dan kondisi error
- Integration tests memvalidasi alur end-to-end antar fitur

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.3", "2.5", "2.7", "3.1", "3.5", "4.1", "4.5", "4.8", "8.2"] },
    { "id": 1, "tasks": ["2.2", "2.4", "2.6", "2.8", "3.2", "3.3", "3.4", "3.6", "4.2", "4.3", "4.4", "4.6", "4.7", "4.9", "6.1", "6.2", "8.1", "8.3"] },
    { "id": 2, "tasks": ["6.3", "6.5", "6.7", "6.9", "6.11", "9.1", "10.1"] },
    { "id": 3, "tasks": ["6.4", "6.6", "6.8", "6.10", "6.12", "9.2", "9.3", "10.2", "10.3", "10.4", "11.1"] },
    { "id": 4, "tasks": ["9.4", "10.5", "11.2", "11.3", "11.4", "13.1"] },
    { "id": 5, "tasks": ["10.6", "11.5", "13.2", "13.3", "14.1", "14.3", "15.1", "16.1"] },
    { "id": 6, "tasks": ["11.6", "11.7", "13.4", "14.2", "14.4", "15.2", "16.2", "17.1", "18.1", "18.3"] },
    { "id": 7, "tasks": ["15.3", "17.2", "18.2", "18.4"] },
    { "id": 8, "tasks": ["18.5", "19.1", "19.2", "19.3", "19.4"] },
    { "id": 9, "tasks": ["19.5", "19.6", "19.7", "19.8"] }
  ]
}
```
