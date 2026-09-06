# Product: Standardisasi Resep dan HPP

Modul frontend berbasis web untuk membantu **koki dan pemilik usaha kuliner** mendigitalisasi resep dari "insting/perkiraan" menjadi data metrik yang terukur dan konsisten.

## Fitur Utama

- **Manajemen Resep** — buat, edit, duplikasi resep dengan bahan, takaran, dan langkah memasak terstandarisasi
- **Kalkulasi HPP Otomatis** — hitung Harga Pokok Penjualan per porsi secara real-time berdasarkan harga bahan
- **Simulasi Harga Jual** — hitung harga jual rekomendasi berdasarkan margin keuntungan yang diinginkan
- **Manajemen Harga Bahan Baku** — kelola harga bahan terpusat; perubahan harga otomatis memperbarui HPP semua resep terkait
- **Versi & Riwayat Resep** — lacak perubahan resep, bandingkan versi, dan pulihkan versi lama (maks 20 versi per resep)
- **Kalkulator Skala Porsi** — sesuaikan takaran bahan secara proporsional untuk skala produksi berbeda
- **Ekspor PDF & CSV** — bagikan data resep dan HPP ke luar aplikasi
- **Panduan Memasak** — tampilan step-by-step saat produksi berlangsung

## Domain & Terminologi Kunci

- **HPP**: Harga Pokok Penjualan = total biaya bahan / jumlah porsi
- **Porsi**: jumlah sajian dari satu kali produksi resep
- **Bahan**: komponen baku dengan satuan ukuran dan harga satuan
- **Versi Resep**: snapshot resep yang tersimpan setiap kali resep diperbarui
- **Harga Jual Rekomendasi**: `HPP / (1 − margin/100)`
- **Kategori Resep**: appetizer, main course, dessert, beverage, other

## Target Pengguna

Koki dan pemilik usaha kuliner skala kecil–menengah yang ingin mengontrol konsistensi rasa dan biaya produksi makanan.
