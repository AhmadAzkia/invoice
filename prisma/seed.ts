import { PrismaClient } from "../app/generated/prisma";
import { format } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Bersihkan database dulu jika ada data lama
  await prisma.invoiceItem.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.client.deleteMany({});

  console.log("Database telah dibersihkan");

  // Buat data client
  const clients = [
    {
      name: "PT Sejahtera",
      email: "contact@ptsejahtera.com",
      phone: "+6281234567890",
      address: "Jl. Raya Kemang No. 10, Jakarta Selatan",
      company: "PT Sejahtera Indonesia Jaya",
    },
    {
      name: "Yayasan Cerdas",
      email: "info@yayasancerdas.org",
      phone: "+6287654321098",
      address: "Jl. Pendidikan No. 5, Bandung",
      company: "Yayasan Cerdas Indonesia",
    },
    {
      name: "Sekolah Bintang Madani",
      email: "admin@bintangmadani.sch.id",
      phone: "+6282112345678",
      address: "Jl. Pahlawan No. 20, Surabaya",
      company: "Yayasan Pendidikan Bintang Madani",
    },
    {
      name: "CV Maju Jaya",
      email: "contact@majujaya.co.id",
      phone: "+6281298765432",
      address: "Jl. Industri Raya No. 8, Tangerang",
      company: "CV Maju Jaya Sentosa",
    },
  ];

  for (const clientData of clients) {
    await prisma.client.create({ data: clientData });
  }

  console.log("Data client berhasil dibuat");

  // Ambil client yang sudah dibuat
  const createdClients = await prisma.client.findMany();

  // Format tanggal untuk invoice
  const currentDate = new Date();
  const dueDate1 = new Date();
  dueDate1.setDate(currentDate.getDate() + 7);
  const dueDate2 = new Date();
  dueDate2.setDate(currentDate.getDate() + 14);

  // Buat invoice untuk PT Sejahtera
  const ptSejahtera = createdClients.find((c) => c.name === "PT Sejahtera");
  if (ptSejahtera) {
    const invoice1 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-202506-003",
        clientId: ptSejahtera.id,
        issueDate: currentDate,
        dueDate: dueDate1,
        status: "DUE",
        total: 4000000,
        notes: "Pembayaran layanan digital marketing bulan Juni 2025",
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice1.id,
        description: "Pengelolaan Media Sosial",
        quantity: 1,
        unitPrice: 2500000,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice1.id,
        description: "Iklan Facebook & Instagram",
        quantity: 1,
        unitPrice: 1500000,
      },
    });

    console.log(`Invoice ${invoice1.invoiceNumber} berhasil dibuat`);
  }

  // Buat invoice untuk Yayasan Cerdas
  const yayasanCerdas = createdClients.find((c) => c.name === "Yayasan Cerdas");
  if (yayasanCerdas) {
    const invoice2 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-202506-002",
        clientId: yayasanCerdas.id,
        issueDate: currentDate,
        dueDate: dueDate2,
        status: "SENT",
        total: 3250000,
        notes: "Pengembangan website yayasan",
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice2.id,
        description: "Desain UI/UX Website",
        quantity: 1,
        unitPrice: 1750000,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice2.id,
        description: "Pengembangan Frontend",
        quantity: 1,
        unitPrice: 1500000,
      },
    });

    console.log(`Invoice ${invoice2.invoiceNumber} berhasil dibuat`);
  }

  // Buat invoice untuk Sekolah Bintang Madani
  const sekolah = createdClients.find((c) => c.name === "Sekolah Bintang Madani");
  if (sekolah) {
    const invoice3 = await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-202506-001",
        clientId: sekolah.id,
        issueDate: new Date(currentDate.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 hari lalu
        dueDate: new Date(currentDate.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 hari mendatang
        status: "PAID",
        total: 5000000,
        notes: "Pengembangan sistem informasi akademik",
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice3.id,
        description: "Analisis dan Desain Sistem",
        quantity: 1,
        unitPrice: 2000000,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice3.id,
        description: "Pengembangan Backend",
        quantity: 1,
        unitPrice: 1500000,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice3.id,
        description: "Implementasi Database",
        quantity: 1,
        unitPrice: 1500000,
      },
    });

    console.log(`Invoice ${invoice3.invoiceNumber} berhasil dibuat`);
  }

  // Generate data untuk grafik pendapatan bulanan (6 bulan terakhir)
  // Buat invoice untuk bulan-bulan sebelumnya
  for (let i = 1; i <= 5; i++) {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - i);

    // Format tanggal agar sesuai dengan bulan
    const invoiceDate = new Date(pastDate.getFullYear(), pastDate.getMonth(), 15);

    // Pilih client secara acak
    const randomClient = createdClients[Math.floor(Math.random() * createdClients.length)];

    // Buat random amount
    const amount = Math.floor(Math.random() * 6000000) + 3000000;

    // Generate nomor invoice berdasarkan tanggal
    const invoiceNumber = `INV-${format(invoiceDate, "yyyyMM")}-${String(i).padStart(3, "0")}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        clientId: randomClient.id,
        issueDate: invoiceDate,
        dueDate: new Date(invoiceDate.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 hari setelah issue date
        status: "PAID", // Sudah dibayar untuk masuk ke pendapatan bulanan
        total: amount,
        notes: `Layanan bulan ${format(invoiceDate, "MMMM yyyy")}`,
      },
    });

    await prisma.invoiceItem.create({
      data: {
        invoiceId: invoice.id,
        description: `Layanan ${i % 2 === 0 ? "Pengembangan Web" : "Digital Marketing"} bulan ${format(invoiceDate, "MMMM yyyy")}`,
        quantity: 1,
        unitPrice: amount,
      },
    });

    console.log(`Invoice historis ${invoice.invoiceNumber} berhasil dibuat`);
  }

  console.log("Seeder selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
