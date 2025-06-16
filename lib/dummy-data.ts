// Dummy data for dashboard
export const dummyStats = [
  { title: "Pendapatan (30 Hari)", value: "Rp 7.500.000", icon: "DollarSign" },
  { title: "Belum Dibayar", value: "Rp 12.250.000", icon: "CircleDollarSign" },
  { title: "Jatuh Tempo", value: "Rp 4.000.000", icon: "AlertCircle" },
  { title: "Klien Aktif", value: "8", icon: "Users" },
];

export const dummyRecentInvoices = [
  { invoiceNumber: "INV-202506-003", clientName: "PT Sejahtera", amount: "Rp 4.000.000", dueDate: "10 Jun 2025", status: "Jatuh Tempo" },
  { invoiceNumber: "INV-202506-002", clientName: "Yayasan Cerdas", amount: "Rp 3.250.000", dueDate: "25 Jun 2025", status: "Terkirim" },
  { invoiceNumber: "INV-202506-001", clientName: "Sekolah Bintang Madani", amount: "Rp 5.000.000", dueDate: "20 Jun 2025", status: "Lunas" },
  { invoiceNumber: "INV-202505-015", clientName: "CV Maju Jaya", amount: "Rp 2.000.000", dueDate: "15 Jun 2025", status: "Lunas" },
  { invoiceNumber: "INV-202505-014", clientName: "PT Sejahtera", amount: "Rp 6.000.000", dueDate: "30 Mei 2025", status: "Draft" },
];

export const dummyChartData = [
  { month: "Jan", total: 6500000 },
  { month: "Feb", total: 5900000 },
  { month: "Mar", total: 8000000 },
  { month: "Apr", total: 8100000 },
  { month: "Mei", total: 5600000 },
  { month: "Jun", total: 9500000 },
];
