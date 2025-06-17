# Panduan Setup Database MySQL dengan PHPMyAdmin

Dokumen ini menjelaskan cara untuk membuat database MySQL dan tabel-tabel yang dibutuhkan untuk aplikasi Invoice Generator menggunakan PHPMyAdmin.

## Langkah 1: Akses PHPMyAdmin

1. Buka XAMPP Control Panel dan pastikan service Apache dan MySQL sudah berjalan (status "Running")
2. Buka browser dan akses `http://localhost/phpmyadmin/`

## Langkah 2: Buat Database Baru

1. Di sidebar kiri PHPMyAdmin, klik tombol "New" untuk membuat database baru
2. Masukkan nama database: `invoice_app`
3. Pilih Collation: `utf8mb4_unicode_ci`
4. Klik tombol "Create"

## Langkah 3: Import Skema Database

1. Klik pada database `invoice_app` yang baru dibuat di sidebar kiri
2. Klik tab "Import" di menu atas
3. Klik tombol "Choose File" dan pilih file `invoice_app_schema.sql` yang tersedia di folder `database` pada proyek ini
4. Scroll ke bawah dan klik tombol "Import"

## Langkah 4: Import Data Sampel (Opsional)

1. Pastikan masih berada di database `invoice_app`
2. Klik tab "Import" di menu atas
3. Klik tombol "Choose File" dan pilih file `invoice_app_sample_data.sql` yang tersedia di folder `database` pada proyek ini
4. Scroll ke bawah dan klik tombol "Import"

## Langkah 5: Konfigurasi .env untuk Prisma

Setelah database berhasil dibuat, update file `.env` dalam proyek dengan DATABASE_URL yang benar:

```
DATABASE_URL="mysql://root:@localhost:3306/invoice_app"
```

Jika MySQL Anda menggunakan password, maka sesuaikan URL di atas:

```
DATABASE_URL="mysql://root:password@localhost:3306/invoice_app"
```

## Langkah 6: Generate Prisma Client dan Jalankan Migrasi

Setelah mengupdate .env, jalankan perintah berikut di terminal:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Ini akan menghasilkan client Prisma dan membuat migrasi awal untuk database Anda.

## Catatan Penting

- Pastikan struktur database di MySQL sesuai dengan skema Prisma yang didefinisikan di `prisma/schema.prisma`
- Jika terjadi kesalahan, periksa apakah versi MySQL Anda kompatibel (disarankan menggunakan MySQL 5.7 atau yang lebih baru)
- Pastikan hak akses pengguna database sesuai (biasanya pengguna 'root' memiliki hak akses penuh)
