# Database Setup for Invoice Generator

Folder ini berisi script dan file SQL untuk membuat database MySQL yang digunakan oleh aplikasi Invoice Generator.

## Struktur Folder

- `invoice_app_schema.sql` - Script SQL untuk membuat database dan tabel-tabel yang diperlukan
- `invoice_app_sample_data.sql` - Script SQL untuk mengisi data sampel
- `setup_database.sh` - Script Bash untuk pengguna Linux/Mac untuk membuat database (memerlukan MySQL client)
- `setup_database.bat` - Script Batch untuk pengguna Windows untuk membuat database (memerlukan MySQL client)
- `SETUP_DATABASE.md` - Panduan detail untuk setup database menggunakan PHPMyAdmin

## Cara Menggunakan

### Menggunakan PHPMyAdmin

Lihat panduan lengkap di [SETUP_DATABASE.md](SETUP_DATABASE.md)

### Menggunakan Command Line (Windows)

1. Pastikan MySQL sudah terinstal dan dapat diakses dari command line
2. Buka Command Prompt atau PowerShell
3. Navigasi ke folder ini (`cd path\to\database`)
4. Jalankan script `setup_database.bat`
5. Ikuti instruksi yang ditampilkan

### Menggunakan Command Line (Linux/Mac)

1. Pastikan MySQL sudah terinstal dan dapat diakses dari command line
2. Buka Terminal
3. Navigasi ke folder ini (`cd path/to/database`)
4. Berikan permission execute ke script: `chmod +x setup_database.sh`
5. Jalankan script `./setup_database.sh`
6. Ikuti instruksi yang ditampilkan

## Struktur Database

### Tabel Client

- `id` - Primary key, UUID
- `name` - Nama client (wajib)
- `email` - Email client (opsional)
- `phone` - Nomor telepon (opsional)
- `address` - Alamat (opsional)
- `company` - Nama perusahaan (opsional)
- `createdAt` - Waktu pembuatan record
- `updatedAt` - Waktu update terakhir record

### Tabel Invoice

- `id` - Primary key, UUID
- `invoiceNumber` - Nomor invoice, unik
- `clientId` - Foreign key ke tabel Client
- `issueDate` - Tanggal penerbitan invoice
- `dueDate` - Tanggal jatuh tempo pembayaran
- `status` - Status invoice (DRAFT, SENT, PAID, DUE)
- `notes` - Catatan tambahan untuk invoice
- `total` - Total nilai invoice
- `createdAt` - Waktu pembuatan record
- `updatedAt` - Waktu update terakhir record

### Tabel InvoiceItem

- `id` - Primary key, UUID
- `description` - Deskripsi item
- `quantity` - Jumlah item
- `unitPrice` - Harga per unit
- `invoiceId` - Foreign key ke tabel Invoice

## Catatan Penting

- Database menggunakan MySQL dengan charset UTF-8MB4 dan collation utf8mb4_unicode_ci untuk mendukung berbagai karakter termasuk emoji
- Tabel Invoice dan InvoiceItem memiliki constraint ON DELETE CASCADE, artinya jika client dihapus maka semua invoice terkait juga akan terhapus
- Semua ID menggunakan UUID alih-alih integer auto-increment untuk keamanan dan memudahkan migrasi data
