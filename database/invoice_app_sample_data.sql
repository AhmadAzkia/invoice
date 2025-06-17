-- SQL untuk menambahkan data sampel ke dalam tabel-tabel

USE invoice_app;

-- Mendapatkan ID client untuk digunakan pada invoice
SET @client1_id = (SELECT id FROM `Client` WHERE name = 'PT Sejahtera' LIMIT 1);
SET @client2_id = (SELECT id FROM `Client` WHERE name = 'Yayasan Cerdas' LIMIT 1);
SET @client3_id = (SELECT id FROM `Client` WHERE name = 'CV Maju Jaya' LIMIT 1);
SET @client4_id = (SELECT id FROM `Client` WHERE name = 'Sekolah Bintang Madani' LIMIT 1);

-- Menambahkan data sampel untuk Invoice
INSERT INTO `Invoice` (
  `id`, 
  `invoiceNumber`, 
  `clientId`, 
  `issueDate`, 
  `dueDate`, 
  `status`, 
  `notes`, 
  `total`, 
  `createdAt`, 
  `updatedAt`
) VALUES
  (UUID(), 'INV-2506-1001', @client1_id, '2025-06-01', '2025-06-15', 'DUE', 'Pembayaran untuk jasa konsultasi bulan Juni', 4000000, NOW(), NOW()),
  (UUID(), 'INV-2506-1002', @client2_id, '2025-06-05', '2025-06-25', 'SENT', 'Pembayaran untuk pengembangan website', 3250000, NOW(), NOW()),
  (UUID(), 'INV-2506-1003', @client3_id, '2025-06-10', '2025-06-24', 'DRAFT', 'Pembayaran untuk desain logo dan branding', 2000000, NOW(), NOW()),
  (UUID(), 'INV-2506-1004', @client4_id, '2025-06-11', '2025-06-25', 'PAID', 'Pembayaran untuk pelatihan staff', 5000000, NOW(), NOW());

-- Mendapatkan ID invoice untuk digunakan pada invoice items
SET @invoice1_id = (SELECT id FROM `Invoice` WHERE invoiceNumber = 'INV-2506-1001' LIMIT 1);
SET @invoice2_id = (SELECT id FROM `Invoice` WHERE invoiceNumber = 'INV-2506-1002' LIMIT 1);
SET @invoice3_id = (SELECT id FROM `Invoice` WHERE invoiceNumber = 'INV-2506-1003' LIMIT 1);
SET @invoice4_id = (SELECT id FROM `Invoice` WHERE invoiceNumber = 'INV-2506-1004' LIMIT 1);

-- Menambahkan data sampel untuk InvoiceItem
INSERT INTO `InvoiceItem` (
  `id`, 
  `description`, 
  `quantity`, 
  `unitPrice`, 
  `invoiceId`
) VALUES
  -- Items untuk Invoice 1
  (UUID(), 'Jasa Konsultasi Bisnis (20 jam)', 1, 4000000, @invoice1_id),
  
  -- Items untuk Invoice 2
  (UUID(), 'Pembuatan Website Perusahaan', 1, 2500000, @invoice2_id),
  (UUID(), 'Konfigurasi Domain dan Hosting (1 tahun)', 1, 750000, @invoice2_id),
  
  -- Items untuk Invoice 3
  (UUID(), 'Desain Logo Perusahaan', 1, 1500000, @invoice3_id),
  (UUID(), 'Brand Guidelines', 1, 500000, @invoice3_id),
  
  -- Items untuk Invoice 4
  (UUID(), 'Program Pelatihan Digital Marketing (10 orang)', 1, 5000000, @invoice4_id);

-- Menampilkan data yang sudah dimasukkan
SELECT c.name as client_name, i.invoiceNumber, i.status, i.total, i.issueDate, i.dueDate
FROM Invoice i
JOIN Client c ON i.clientId = c.id
ORDER BY i.issueDate DESC;
