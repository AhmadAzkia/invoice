"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { z } from "zod";

// Schema untuk validasi data client
const clientSchema = z.object({
  name: z.string().min(1, "Nama client harus diisi"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
});

export type ClientFormData = z.infer<typeof clientSchema>;

// Schema untuk validasi data invoice
const invoiceItemSchema = z.object({
  description: z.string().min(1, "Deskripsi item harus diisi"),
  quantity: z.coerce.number().min(1, "Kuantitas minimal 1"),
  unitPrice: z.coerce.number().min(0, "Harga tidak boleh negatif"),
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Nomor invoice harus diisi"),
  clientId: z.string().min(1, "Client harus dipilih"),
  issueDate: z.string().min(1, "Tanggal penerbitan harus diisi"),
  dueDate: z.string().min(1, "Tanggal jatuh tempo harus diisi"),
  status: z.enum(["DRAFT", "SENT", "PAID", "DUE"], {
    errorMap: () => ({ message: "Status invoice tidak valid" }),
  }),
  notes: z.string().optional().or(z.literal("")),
  items: z.array(invoiceItemSchema).min(1, "Minimal satu item invoice harus diisi"),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

// CRUD operations untuk Client
export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, data: clients };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return { success: false, error: "Gagal mengambil data client" };
  }
}

export async function getClientById(id: string) {
  try {
    const client = await prisma.client.findUnique({
      where: { id },
    });
    return { success: true, data: client };
  } catch (error) {
    console.error("Error fetching client:", error);
    return { success: false, error: "Gagal mengambil data client" };
  }
}

export async function createClient(data: ClientFormData) {
  try {
    const validatedData = clientSchema.parse(data);
    const client = await prisma.client.create({
      data: validatedData,
    });
    revalidatePath("/clients");
    return { success: true, data: client };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating client:", error);
    return { success: false, error: "Gagal membuat client baru" };
  }
}

export async function updateClient(id: string, data: ClientFormData) {
  try {
    const validatedData = clientSchema.parse(data);
    const client = await prisma.client.update({
      where: { id },
      data: validatedData,
    });
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true, data: client };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating client:", error);
    return { success: false, error: "Gagal memperbarui data client" };
  }
}

export async function deleteClient(id: string) {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Error deleting client:", error);
    return { success: false, error: "Gagal menghapus client" };
  }
}

// CRUD operations untuk Invoice
export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: {
        issueDate: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });
    return { success: true, data: invoices };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: "Gagal mengambil data invoice" };
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        client: true,
        items: true,
      },
    });
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { success: false, error: "Gagal mengambil data invoice" };
  }
}

export async function getInvoiceByNumber(invoiceNumber: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        client: true,
        items: true,
      },
    });
    return { success: true, data: invoice };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return { success: false, error: "Gagal mengambil data invoice" };
  }
}

export async function createInvoice(data: InvoiceFormData) {
  try {
    const validatedData = invoiceSchema.parse(data);

    // Hitung total dari items
    const total = validatedData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const invoice = await prisma.$transaction(async (prisma) => {
      // Buat invoice
      const newInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber: validatedData.invoiceNumber,
          clientId: validatedData.clientId,
          issueDate: new Date(validatedData.issueDate),
          dueDate: new Date(validatedData.dueDate),
          status: validatedData.status,
          notes: validatedData.notes || "",
          total: total,
        },
      });

      // Buat item invoice
      for (const item of validatedData.items) {
        await prisma.invoiceItem.create({
          data: {
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            invoiceId: newInvoice.id,
          },
        });
      }

      return newInvoice;
    });

    revalidatePath("/invoices");
    return { success: true, data: invoice };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error creating invoice:", error);
    return { success: false, error: "Gagal membuat invoice baru" };
  }
}

export async function updateInvoice(id: string, data: InvoiceFormData) {
  try {
    const validatedData = invoiceSchema.parse(data);

    // Hitung total dari items
    const total = validatedData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const invoice = await prisma.$transaction(async (prisma) => {
      // Update invoice
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          invoiceNumber: validatedData.invoiceNumber,
          clientId: validatedData.clientId,
          issueDate: new Date(validatedData.issueDate),
          dueDate: new Date(validatedData.dueDate),
          status: validatedData.status,
          notes: validatedData.notes || "",
          total: total,
        },
      });

      // Hapus semua item yang ada
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: id },
      });

      // Buat item baru
      for (const item of validatedData.items) {
        await prisma.invoiceItem.create({
          data: {
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            invoiceId: id,
          },
        });
      }

      return updatedInvoice;
    });

    revalidatePath("/invoices");
    revalidatePath(`/invoices/${id}`);
    return { success: true, data: invoice };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error updating invoice:", error);
    return { success: false, error: "Gagal memperbarui invoice" };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/invoices");
    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: "Gagal menghapus invoice" };
  }
}

// Fungsi untuk dashboard
export async function getDashboardStats() {
  try {
    // Get 30-day revenue
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Pendapatan 30 hari terakhir (invoice dengan status PAID)
    const revenueResult = await prisma.invoice.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "PAID",
        issueDate: {
          gte: thirtyDaysAgo,
        },
      },
    });
    const revenue = revenueResult._sum.total || 0;

    // Invoice yang belum dibayar (status SENT atau DUE)
    const unpaidResult = await prisma.invoice.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: {
          in: ["SENT", "DUE"],
        },
      },
    });
    const unpaid = unpaidResult._sum.total || 0;

    // Invoice yang jatuh tempo (status DUE)
    const overdueResult = await prisma.invoice.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "DUE",
      },
    });
    const overdue = overdueResult._sum.total || 0;

    // Hitung jumlah klien aktif
    const clientCount = await prisma.client.count();

    return {
      success: true,
      data: {
        revenue,
        unpaid,
        overdue,
        clientCount,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Gagal mengambil data statistik" };
  }
}

export async function getMonthlyRevenue() {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start from first day of the month

    // Get all paid invoices in the last 6 months
    const invoices = await prisma.invoice.findMany({
      where: {
        status: "PAID",
        issueDate: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        issueDate: true,
        total: true,
      },
    });

    // Prepare monthly data
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    const monthlyData: Record<string, number> = {};

    // Initialize with 0 for the last 6 months
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      const monthKey = months[d.getMonth()];
      monthlyData[monthKey] = 0;
    }

    // Sum up the totals by month
    invoices.forEach((invoice) => {
      const month = months[invoice.issueDate.getMonth()];
      if (monthlyData[month] !== undefined) {
        monthlyData[month] += Number(invoice.total);
      }
    });

    // Convert to array format for chart
    const chartData = Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .reverse(); // So data is in chronological order

    return { success: true, data: chartData };
  } catch (error) {
    console.error("Error fetching monthly revenue:", error);
    return { success: false, error: "Gagal mengambil data pendapatan bulanan" };
  }
}

export async function getRecentInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      take: 5,
      orderBy: {
        issueDate: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
          },
        },
      },
    });

    return { success: true, data: invoices };
  } catch (error) {
    console.error("Error fetching recent invoices:", error);
    return { success: false, error: "Gagal mengambil data invoice terbaru" };
  }
}
