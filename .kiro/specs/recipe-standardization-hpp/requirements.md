# Requirements Document

## Introduction

Fitur Standardisasi Resep dan HPP (Harga Pokok Penjualan) adalah modul frontend berbasis web yang memungkinkan koki dan pemilik usaha kuliner untuk mendigitalisasi resep dari sekadar "insting atau perkiraan" menjadi data metrik yang terukur dan konsisten. Modul ini mencakup manajemen resep standar (bahan, takaran, langkah memasak), perhitungan HPP per porsi secara otomatis, serta tampilan antarmuka yang intuitif untuk memastikan konsistensi rasa dan kontrol biaya produksi makanan.

---

## Glossary

- **Sistem**: Aplikasi frontend Standardisasi Resep dan HPP.
- **Pengguna**: Koki atau pemilik usaha kuliner yang menggunakan Sistem.
- **Resep**: Kumpulan bahan, takaran, dan langkah memasak yang terstandarisasi untuk menghasilkan satu sajian.
- **Bahan**: Komponen baku yang digunakan dalam sebuah Resep, dilengkapi satuan dan takaran tertentu.
- **Takaran**: Jumlah kuantitatif suatu Bahan yang dinyatakan dalam satuan terukur (gram, ml, sendok teh, dll.).
- **Porsi**: Jumlah sajian yang dihasilkan dari satu kali produksi Resep.
- **HPP (Harga Pokok Penjualan)**: Total biaya bahan baku yang dibutuhkan untuk memproduksi satu Porsi Resep.
- **Harga Bahan**: Harga satuan (per gram, per liter, per butir, dll.) dari setiap Bahan.
- **Margin Keuntungan**: Persentase keuntungan yang diinginkan Pengguna di atas HPP untuk menentukan harga jual.
- **Harga Jual Rekomendasi**: Harga jual yang dihitung Sistem berdasarkan HPP ditambah Margin Keuntungan.
- **Langkah Memasak**: Instruksi prosedural yang terurut untuk memproses Bahan menjadi sajian akhir.
- **Versi Resep**: Riwayat perubahan suatu Resep yang tersimpan untuk keperluan audit dan perbandingan.
- **Kategori Resep**: Pengelompokan Resep berdasarkan jenis sajian (misal: appetizer, main course, dessert, minuman).
- **Pencarian**: Fungsi untuk menemukan Resep berdasarkan kata kunci nama atau Bahan.
- **Pratinjau Cetak**: Tampilan Resep yang dioptimalkan untuk dicetak atau disimpan sebagai PDF.

---

## Requirements

### Requirement 1: Manajemen Resep — Buat dan Edit Resep

**User Story:** Sebagai koki, saya ingin membuat dan mengedit resep dengan bahan, takaran, dan langkah memasak yang terukur, agar resep tidak lagi bergantung pada ingatan atau insting saja.

#### Acceptance Criteria

1. THE Sistem SHALL menampilkan formulir pembuatan Resep baru yang memuat kolom: nama resep (maksimal 150 karakter), Kategori Resep, jumlah Porsi (antara 1 hingga 9.999), deskripsi singkat (maksimal 500 karakter), daftar Bahan, dan daftar Langkah Memasak.
2. WHEN Pengguna mengisi nama Bahan, THE Sistem SHALL menampilkan hingga 10 saran nama Bahan dari daftar Bahan yang tersimpan sebelumnya.
3. WHEN Pengguna menambahkan Bahan, THE Sistem SHALL meminta Pengguna mengisi Takaran (antara 0,01 hingga 99.999 dengan presisi maksimal 2 angka desimal) dan satuan ukuran untuk setiap Bahan.
4. THE Sistem SHALL mendukung satuan ukuran berikut untuk Takaran: gram (g), kilogram (kg), mililiter (ml), liter (l), sendok teh (sdt), sendok makan (sdm), buah, butir, dan lembar.
5. IF Pengguna mencoba menyimpan Resep dengan kolom nama Resep kosong, jumlah Porsi kosong atau di luar rentang, tanpa minimal satu Bahan, atau tanpa minimal satu Langkah Memasak, THEN THE Sistem SHALL menampilkan pesan validasi yang menjelaskan setiap kolom yang tidak valid dan mencegah penyimpanan.
6. WHEN Pengguna menekan tombol simpan Resep dengan semua kolom wajib terisi dan valid, THE Sistem SHALL menyimpan Resep dan menampilkan halaman detail Resep.
7. WHEN Pengguna menyimpan perubahan urutan Langkah Memasak setelah melakukan seret-dan-lepas (*drag-and-drop*), THE Sistem SHALL mempertahankan urutan baru tersebut.
8. WHEN Pengguna menghapus satu Bahan dari daftar, THE Sistem SHALL memperbarui daftar Bahan dalam waktu tidak lebih dari 1 detik.
9. WHEN Pengguna menghapus satu Bahan dari daftar, THE Sistem SHALL memperbarui kalkulasi HPP dalam waktu tidak lebih dari 1 detik tanpa memuat ulang halaman.
10. WHEN Pengguna membuka Resep yang sudah ada untuk diedit, THE Sistem SHALL menampilkan formulir edit yang memuat semua data Resep yang tersimpan sebelumnya pada kolom yang sesuai.

---

### Requirement 2: Manajemen Resep — Daftar dan Pencarian Resep

**User Story:** Sebagai pemilik usaha kuliner, saya ingin melihat daftar semua resep dan mencarinya dengan cepat, agar saya dapat menemukan dan mengelola resep yang relevan dengan efisien.

#### Acceptance Criteria

1. WHEN Pengguna membuka halaman daftar Resep, THE Sistem SHALL menampilkan semua Resep dalam tampilan kartu (*card view*) yang memuat: nama resep, Kategori Resep, jumlah Porsi, nilai HPP per Porsi, dan tanggal terakhir diperbarui, dengan urutan default berdasarkan tanggal diperbarui terbaru.
2. WHEN Pengguna berhenti mengetik selama 300 milidetik pada kolom Pencarian Resep, THE Sistem SHALL menampilkan hasil pencarian berdasarkan nama resep dalam waktu tidak lebih dari 500 milidetik sejak akhir jeda pengetikan tersebut.
3. WHEN Pengguna memilih satu Kategori Resep pada filter, THE Sistem SHALL menampilkan hanya Resep yang termasuk dalam kategori tersebut, dengan tetap mempertahankan kata kunci pencarian dan kriteria pengurutan yang sedang aktif.
4. WHEN daftar Resep kosong karena belum ada Resep yang dibuat, THE Sistem SHALL menampilkan pesan *empty state* beserta tombol ajakan membuat Resep pertama.
5. WHEN Pengguna memilih opsi pengurutan, THE Sistem SHALL menampilkan ulang daftar Resep sesuai opsi yang dipilih: nama resep (A–Z atau Z–A), HPP per Porsi (rendah ke tinggi atau tinggi ke rendah), atau tanggal diperbarui (terbaru atau terlama).
6. WHEN jumlah Resep melebihi 20 item dalam satu tampilan, THE Sistem SHALL menerapkan paginasi sehingga tidak lebih dari 20 Resep ditampilkan per halaman.
7. IF pencarian atau filter aktif menghasilkan nol Resep yang cocok, THEN THE Sistem SHALL menampilkan pesan yang menginformasikan bahwa tidak ada Resep yang sesuai dengan kriteria yang dipilih, beserta opsi untuk mereset filter atau kata kunci pencarian.

---

### Requirement 3: Perhitungan HPP Otomatis

**User Story:** Sebagai pemilik usaha kuliner, saya ingin HPP per porsi dihitung secara otomatis berdasarkan harga bahan yang saya masukkan, agar saya tidak perlu menghitung manual dan terhindar dari kesalahan kalkulasi.

#### Acceptance Criteria

1. THE Sistem SHALL menghitung HPP per Porsi dengan rumus: jumlahkan (Takaran setiap Bahan × Harga Bahan per satuan), kemudian bagi dengan jumlah Porsi.
2. WHEN Pengguna mengubah Takaran, Harga Bahan, atau jumlah Porsi pada formulir Resep, THE Sistem SHALL memperbarui tampilan nilai HPP per Porsi dalam waktu tidak lebih dari 500 milidetik tanpa memuat ulang halaman.
3. THE Sistem SHALL menampilkan rincian kontribusi biaya setiap Bahan terhadap total HPP dalam bentuk tabel yang memuat: nama Bahan, Takaran, satuan, harga satuan, dan total biaya per Bahan.
4. THE Sistem SHALL menampilkan nilai HPP per Porsi dengan presisi dua angka desimal dan menggunakan simbol mata uang Rupiah (Rp).
5. IF Pengguna memasukkan nilai Harga Bahan atau Takaran yang bukan angka positif, THEN THE Sistem SHALL menampilkan pesan kesalahan pada kolom tersebut dan tidak memperbarui kalkulasi HPP.
6. THE Sistem SHALL menampilkan total biaya keseluruhan Resep (HPP per Porsi × jumlah Porsi) di samping nilai HPP per Porsi.
7. IF jumlah Porsi pada Resep adalah nol atau bernilai negatif, THEN THE Sistem SHALL menampilkan pesan kesalahan yang menginformasikan bahwa jumlah Porsi harus berupa bilangan bulat positif dan tidak menghitung HPP.

---

### Requirement 4: Simulasi Harga Jual dan Margin Keuntungan

**User Story:** Sebagai pemilik usaha kuliner, saya ingin mensimulasikan harga jual berdasarkan margin keuntungan yang saya tentukan, agar saya bisa membuat keputusan penetapan harga yang lebih tepat.

#### Acceptance Criteria

1. THE Sistem SHALL menampilkan kalkulator simulasi harga jual pada halaman detail Resep yang memuat kolom input Margin Keuntungan dalam persentase (%) dengan nilai awal kosong.
2. WHEN Pengguna mengisi nilai Margin Keuntungan yang valid, THE Sistem SHALL menghitung dan menampilkan Harga Jual Rekomendasi menggunakan rumus: HPP per Porsi ÷ (1 − (Margin Keuntungan ÷ 100)), dibulatkan ke 2 angka desimal.
3. WHEN Pengguna mengubah nilai Margin Keuntungan, THE Sistem SHALL memperbarui Harga Jual Rekomendasi dalam waktu tidak lebih dari 300 milidetik tanpa memuat ulang halaman.
4. IF Pengguna memasukkan nilai Margin Keuntungan kurang dari 0% atau lebih dari atau sama dengan 100%, THEN THE Sistem SHALL menampilkan pesan validasi yang menginformasikan batas nilai yang diperbolehkan (0% hingga kurang dari 100%) dan tidak menghitung Harga Jual Rekomendasi.
5. IF Pengguna memasukkan nilai Margin Keuntungan berupa karakter non-numerik, THEN THE Sistem SHALL menampilkan pesan validasi yang menginformasikan bahwa input harus berupa angka dan tidak menghitung Harga Jual Rekomendasi.
6. THE Sistem SHALL menampilkan ringkasan finansial yang mencakup: HPP per Porsi, Harga Jual Rekomendasi, nilai Keuntungan per Porsi (Harga Jual Rekomendasi − HPP per Porsi), dan Margin Keuntungan dalam bentuk persen (%), di mana seluruh nilai mata uang ditampilkan dengan 2 angka desimal.
7. IF HPP per Porsi pada Resep adalah nol atau tidak tersedia, THEN THE Sistem SHALL menonaktifkan kolom input Margin Keuntungan dan menampilkan pesan yang menginformasikan bahwa simulasi tidak dapat dilakukan karena HPP belum dihitung.

---

### Requirement 5: Manajemen Harga Bahan Baku

**User Story:** Sebagai pemilik usaha kuliner, saya ingin mengelola daftar harga bahan baku secara terpusat, agar perubahan harga pasar langsung tercermin pada HPP semua resep yang menggunakan bahan tersebut.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan halaman manajemen Harga Bahan yang memuat daftar semua Bahan beserta harga satuan, satuan ukuran, dan tanggal pembaruan harga terakhir.
2. WHEN Pengguna menyimpan perubahan Harga Bahan pada halaman manajemen Harga Bahan, THE Sistem SHALL memperbarui nilai HPP pada semua Resep yang menggunakan Bahan tersebut dalam waktu tidak lebih dari 3 detik setelah penyimpanan berhasil.
3. WHEN Pengguna menyimpan perubahan Harga Bahan pada halaman manajemen Harga Bahan, THE Sistem SHALL menampilkan jumlah Resep yang HPP-nya telah diperbarui sebagai konfirmasi hasil operasi.
4. THE Sistem SHALL menampilkan indikator visual pada setiap Resep yang menggunakan minimal satu Bahan dengan tanggal pembaruan harga dalam 7 hari kalender terakhir dihitung dari tanggal hari ini.
5. WHEN Pengguna memilih untuk menghapus Bahan dari daftar Harga Bahan, THE Sistem SHALL menampilkan dialog konfirmasi yang menyebutkan jumlah Resep yang menggunakan Bahan tersebut sebelum penghapusan dilakukan.
6. IF Bahan yang akan dihapus digunakan oleh satu atau lebih Resep dan Pengguna mengonfirmasi penghapusan, THEN THE Sistem SHALL menandai Bahan tersebut sebagai tidak aktif pada semua Resep yang bersangkutan dan menampilkan peringatan pada halaman detail setiap Resep tersebut.
7. IF Pengguna memasukkan nilai harga satuan Bahan yang bukan angka positif atau melebihi 999.999.999, THEN THE Sistem SHALL menampilkan pesan kesalahan yang menjelaskan batas nilai yang valid dan mencegah penyimpanan perubahan tersebut.

---

### Requirement 6: Versi Resep dan Riwayat Perubahan

**User Story:** Sebagai koki, saya ingin melihat riwayat perubahan resep, agar saya bisa melacak evolusi resep dan kembali ke versi sebelumnya jika diperlukan.

#### Acceptance Criteria

1. WHEN Pengguna menyimpan perubahan pada Resep yang sudah ada, THE Sistem SHALL membuat Versi Resep baru dan menyimpan Versi Resep sebelumnya ke dalam riwayat.
2. WHEN Pengguna membuka halaman detail Resep, THE Sistem SHALL menampilkan daftar Versi Resep yang diurutkan dari terbaru ke terlama, memuat: nomor versi, tanggal dan waktu penyimpanan, dan nama Pengguna yang menyimpan.
3. WHEN Pengguna memilih Versi Resep tertentu dari daftar riwayat, THE Sistem SHALL menampilkan tampilan perbandingan (*diff view*) yang menyoroti perbedaan pada setiap field Resep antara versi yang dipilih dan versi aktif saat ini.
4. WHEN Pengguna memilih untuk memulihkan Versi Resep lama dan mengonfirmasi pemulihan, THE Sistem SHALL membuat Versi Resep baru berdasarkan data versi yang dipulihkan, sehingga versi aktif sebelumnya tetap tersimpan dalam riwayat.
5. IF Pengguna membatalkan pemulihan Versi Resep pada dialog konfirmasi, THEN THE Sistem SHALL menutup dialog konfirmasi tanpa mengubah versi aktif yang sedang berlaku.
6. WHEN Pengguna memilih untuk memulihkan Versi Resep lama, THE Sistem SHALL menampilkan konfirmasi sebelum memulai proses pemulihan.
7. WHEN jumlah Versi Resep pada satu Resep mencapai 20 dan Pengguna menyimpan perubahan baru, THE Sistem SHALL menghapus Versi Resep yang paling lama secara otomatis untuk memberi ruang bagi versi baru.

---

### Requirement 7: Tampilan Detail Resep dan Panduan Memasak

**User Story:** Sebagai koki, saya ingin melihat detail resep dalam tampilan yang bersih dan terstruktur, agar saya bisa mengikuti langkah memasak dengan tepat saat produksi berlangsung.

#### Acceptance Criteria

1. THE Sistem SHALL menampilkan halaman detail Resep yang memuat: nama resep, Kategori Resep, jumlah Porsi, daftar Bahan dengan Takaran, daftar Langkah Memasak berurutan, dan ringkasan HPP yang mencakup total biaya bahan dan biaya per Porsi.
2. THE Sistem SHALL menampilkan setiap Langkah Memasak dengan nomor urut yang jelas dan teks instruksi dengan ukuran font minimal 16px.
3. WHERE Pengguna mengakses halaman detail Resep dari perangkat dengan lebar layar kurang dari 768 piksel, THE Sistem SHALL menampilkan antarmuka yang responsif sehingga seluruh konten Resep dapat dibaca tanpa *horizontal scrolling*.
4. WHEN Pengguna mengaktifkan Pratinjau Cetak pada halaman detail Resep, THE Sistem SHALL menampilkan tata letak yang menyembunyikan elemen navigasi situs dan tombol aksi, sehingga halaman dapat dicetak atau disimpan sebagai PDF hanya memuat konten Resep.
5. WHEN Pengguna mengaktifkan mode panduan memasak langkah demi langkah, THE Sistem SHALL menampilkan satu Langkah Memasak pada satu waktu dengan tombol navigasi ke langkah berikutnya dan sebelumnya.
6. IF Pengguna berada pada Langkah Memasak pertama dalam mode panduan memasak langkah demi langkah, THEN THE Sistem SHALL menonaktifkan tombol navigasi "sebelumnya"; IF Pengguna berada pada Langkah Memasak terakhir, THEN THE Sistem SHALL menonaktifkan tombol navigasi "berikutnya".

---

### Requirement 8: Duplikasi dan Variasi Resep

**User Story:** Sebagai koki, saya ingin menduplikasi resep yang sudah ada untuk membuat variasi baru, agar saya tidak perlu memulai dari awal ketika ingin mengembangkan resep turunan.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan tombol duplikasi pada halaman detail Resep dan pada kartu Resep di halaman daftar.
2. WHEN Pengguna menduplikasi Resep, THE Sistem SHALL membuat salinan Resep baru dengan nama "[Nama Resep Asli] — Salinan" dengan panjang nama maksimal 255 karakter, menetapkan status salinan sebagai Draft, dan membuka formulir edit salinan tersebut secara langsung.
3. WHEN Pengguna menduplikasi Resep, THE Sistem SHALL menyalin semua Bahan, Takaran, Langkah Memasak, dan nilai Harga Bahan dari Resep asli ke salinan baru, sehingga salinan memiliki data yang identik dengan Resep asli pada saat duplikasi dilakukan.
4. THE Sistem SHALL menyimpan salinan Resep sebagai Resep baru yang independen sehingga perubahan pada salinan tidak memengaruhi Resep asli, dan perubahan pada Resep asli tidak memengaruhi salinan.
5. IF proses duplikasi Resep gagal, THEN THE Sistem SHALL menampilkan pesan kesalahan yang menginformasikan kegagalan duplikasi dan tidak membuat salinan Resep baru maupun membuka formulir edit.

---

### Requirement 9: Skala Resep (Pengali Porsi)

**User Story:** Sebagai koki, saya ingin menyesuaikan jumlah porsi resep secara dinamis, agar takaran bahan otomatis terhitung proporsional untuk produksi skala besar maupun kecil.

#### Acceptance Criteria

1. THE Sistem SHALL menampilkan kalkulator skala Resep pada halaman detail Resep dengan nilai awal Porsi target sama dengan jumlah Porsi asli Resep, dan menerima input Porsi target berupa bilangan bulat positif antara 1 hingga 10.000.
2. WHEN Pengguna mengubah jumlah Porsi target pada kalkulator skala, THE Sistem SHALL menghitung ulang Takaran setiap Bahan secara proporsional menggunakan rumus (Takaran Asli ÷ Porsi Asli) × Porsi Target, dibulatkan ke 2 angka desimal, dan menampilkan hasilnya tanpa mengubah data Resep asli.
3. WHEN Pengguna mengubah jumlah Porsi target pada kalkulator skala, THE Sistem SHALL memperbarui tampilan total biaya bahan yang disesuaikan dalam waktu tidak lebih dari 500 milidetik setelah input berubah.
4. IF Pengguna memasukkan jumlah Porsi target kurang dari 1, lebih dari 10.000, atau bukan bilangan bulat positif, THEN THE Sistem SHALL menampilkan pesan validasi yang menjelaskan aturan input yang valid dan mempertahankan tampilan Takaran berdasarkan nilai Porsi target valid terakhir yang berhasil dihitung.

---

### Requirement 10: Ekspor Data Resep

**User Story:** Sebagai pemilik usaha kuliner, saya ingin mengekspor data resep dan HPP ke format yang bisa dibagikan, agar informasi biaya dapat dianalisis lebih lanjut di luar aplikasi.

#### Acceptance Criteria

1. THE Sistem SHALL menyediakan opsi ekspor PDF dan CSV pada halaman detail Resep.
2. WHEN Pengguna memilih ekspor PDF, THE Sistem SHALL menghasilkan dokumen PDF yang memuat: nama resep, daftar Bahan dengan Takaran dan satuan, Langkah Memasak, rincian biaya per Bahan, HPP per Porsi, dan Harga Jual Rekomendasi jika Margin Keuntungan telah diisi.
3. WHEN Pengguna memilih ekspor CSV, THE Sistem SHALL menghasilkan berkas CSV yang memuat kolom: nama bahan, takaran, satuan, harga satuan, total biaya per bahan, dan HPP per Porsi; dengan baris pertama sebagai header kolom.
4. WHEN proses ekspor selesai, THE Sistem SHALL memulai pengunduhan berkas ke perangkat Pengguna secara otomatis dan menampilkan notifikasi keberhasilan dalam 3 detik setelah proses selesai.
5. IF proses ekspor gagal karena kesalahan sistem, THEN THE Sistem SHALL menampilkan pesan kesalahan yang menjelaskan kegagalan, menyarankan Pengguna untuk mencoba kembali, dan tidak menghasilkan berkas sebagian atau berkas kosong.
6. IF Resep belum memiliki data HPP yang dihitung, THEN THE Sistem SHALL menonaktifkan opsi ekspor PDF dan CSV dan menampilkan keterangan bahwa ekspor memerlukan data HPP yang telah dihitung.
