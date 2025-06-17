-- MySQL SQL untuk membuat database dan tabel-tabel untuk aplikasi Invoice Generator

-- Membuat database
CREATE DATABASE IF NOT EXISTS invoice_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Menggunakan database tersebut
USE invoice_app;

-- Membuat tabel enumerasi untuk InvoiceStatus
CREATE TABLE IF NOT EXISTS `InvoiceStatus` (
  `name` VARCHAR(191) NOT NULL,
  
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mengisi tabel enumerasi dengan nilai-nilai yang mungkin
INSERT INTO `InvoiceStatus` (`name`) VALUES 
  ('DRAFT'),
  ('SENT'),
  ('PAID'),
  ('DUE');

-- Membuat tabel Client
CREATE TABLE IF NOT EXISTS `Client` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `address` TEXT NULL,
  `company` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Membuat tabel Invoice
CREATE TABLE IF NOT EXISTS `Invoice` (
  `id` VARCHAR(191) NOT NULL,
  `invoiceNumber` VARCHAR(191) NOT NULL,
  `clientId` VARCHAR(191) NOT NULL,
  `issueDate` DATETIME(3) NOT NULL,
  `dueDate` DATETIME(3) NOT NULL,
  `status` ENUM('DRAFT', 'SENT', 'PAID', 'DUE') NOT NULL DEFAULT 'DRAFT',
  `notes` TEXT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Invoice_invoiceNumber_key` (`invoiceNumber`),
  INDEX `Invoice_clientId_idx` (`clientId`),
  CONSTRAINT `Invoice_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Membuat tabel InvoiceItem
CREATE TABLE IF NOT EXISTS `InvoiceItem` (
  `id` VARCHAR(191) NOT NULL,
  `description` VARCHAR(191) NOT NULL,
  `quantity` INT NOT NULL,
  `unitPrice` DECIMAL(10, 2) NOT NULL,
  `invoiceId` VARCHAR(191) NOT NULL,
  
  PRIMARY KEY (`id`),
  INDEX `InvoiceItem_invoiceId_idx` (`invoiceId`),
  CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Menambahkan data sampel untuk Client
INSERT INTO `Client` (`id`, `name`, `email`, `phone`, `address`, `company`, `createdAt`, `updatedAt`) VALUES
  (UUID(), 'PT Sejahtera', 'contact@ptsejahtera.com', '021-555-1234', 'Jl. Sudirman No. 123, Jakarta', 'PT Sejahtera Abadi', NOW(), NOW()),
  (UUID(), 'Yayasan Cerdas', 'admin@yayasancerdas.org', '022-555-5678', 'Jl. Pendidikan No. 45, Bandung', 'Yayasan Cerdas Indonesia', NOW(), NOW()),
  (UUID(), 'CV Maju Jaya', 'info@cvmajujaya.com', '031-555-9012', 'Jl. Industri No. 67, Surabaya', 'CV Maju Jaya', NOW(), NOW()),
  (UUID(), 'Sekolah Bintang Madani', 'humas@bintangmadani.sch.id', '024-555-3456', 'Jl. Pendidikan No. 89, Semarang', 'Yayasan Bintang Madani', NOW(), NOW());

-- Kita tidak menyisipkan data sampel untuk Invoice dan InvoiceItem
-- karena perlu mendapatkan ID client yang dihasilkan secara dinamis terlebih dahulu
-- Data invoice akan ditambahkan melalui aplikasi atau seeder Prisma
