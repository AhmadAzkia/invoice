# Panduan Pengaturan Database MySQL dengan phpMyAdmin untuk Aeterna Invoice

## Langkah 1: Instal MySQL dan phpMyAdmin

Ada beberapa cara untuk menginstal MySQL dan phpMyAdmin:

### Opsi 1: Menggunakan XAMPP (Direkomendasikan untuk pengembangan)

1. **Download XAMPP**
   - Kunjungi [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
   - Download versi yang sesuai dengan sistem operasi Anda (Windows)
2. **Instal XAMPP**
   - Jalankan installer XAMPP
   - Pastikan komponen "MySQL" dan "phpMyAdmin" dicentang
   - Selesaikan proses instalasi
3. **Jalankan Server MySQL**
   - Buka XAMPP Control Panel
   - Start modul "Apache" dan "MySQL"

### Opsi 2: Instalasi MySQL secara terpisah

1. **Download MySQL**
   - Kunjungi [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
   - Download MySQL Installer untuk Windows
2. **Instal MySQL**

   - Jalankan installer MySQL
   - Pilih "Developer Default" atau "Server only" saat diminta
   - Tetapkan password root (kosongkan jika ingin tanpa password)
   - Selesaikan instalasi

3. **Instal phpMyAdmin** (secara terpisah)
   - Download dari [https://www.phpmyadmin.net/downloads/](https://www.phpmyadmin.net/downloads/)
   - Ekstrak ke folder web server Anda
   - Konfigurasikan sesuai instruksi di situs resmi

## Langkah 2: Buat database untuk aplikasi

1. **Akses phpMyAdmin**

   - Buka browser dan masuk ke `http://localhost/phpmyadmin` (jika menggunakan XAMPP)
   - Login dengan username `root` dan password yang sudah dibuat (atau kosong jika tidak ada password)

2. **Buat Database Baru**
   - Klik tab "Databases"
   - Masukkan nama database: `aeterna_invoice`
   - Klik "Create"

## Langkah 3: Konfigurasi koneksi database di aplikasi

1. **Periksa file .env**

   - Pastikan file `.env` memiliki konfigurasi yang benar:

   ```
   DATABASE_URL="mysql://root:@localhost:3306/aeterna_invoice"
   ```

   - Jika Anda menggunakan password untuk MySQL, ubah menjadi:

   ```
   DATABASE_URL="mysql://root:YourPassword@localhost:3306/aeterna_invoice"
   ```

2. **Lakukan migrasi database**
   - Buka terminal di folder project
   - Jalankan perintah:
   ```
   npx prisma migrate dev --name init
   ```
   - Ini akan membuat tabel-tabel yang diperlukan di database

## Langkah 4: Tambahkan data awal (seeder)

1. **Jalankan seeder**
   - Setelah migrasi berhasil, Anda bisa menjalankan seeder untuk menambahkan data contoh:
   ```
   npm run seed
   ```
   (Catatan: Anda perlu membuat script seed terlebih dahulu di package.json)

## Langkah 5: Verifikasi koneksi

1. **Periksa database melalui phpMyAdmin**

   - Buka `http://localhost/phpmyadmin`
   - Pilih database `aeterna_invoice`
   - Pastikan tabel-tabel seperti `Client`, `Invoice`, dan `InvoiceItem` sudah terbentuk

2. **Jalankan aplikasi**
   - Jalankan aplikasi dengan perintah:
   ```
   npm run dev
   ```
   - Pastikan tidak ada error koneksi database yang muncul

## Troubleshooting

1. **Gagal koneksi ke database**

   - Pastikan server MySQL sudah berjalan
   - Periksa apakah kredensial (username/password) sudah benar
   - Periksa apakah database `aeterna_invoice` sudah dibuat

2. **Error saat migrasi**

   - Pastikan format connection string sudah benar
   - Periksa log error untuk informasi lebih detail
   - Coba hapus database dan buat ulang jika diperlukan

3. **Error "Cannot find module '@prisma/client'"**
   - Jalankan perintah:
   ```
   npx prisma generate
   ```
   - Lalu restart server aplikasi
