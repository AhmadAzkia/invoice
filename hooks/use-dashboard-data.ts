import { useState, useEffect } from "react";
import { getDashboardStats, getMonthlyRevenue, getRecentInvoices } from "@/app/actions/invoices";
import { formatCurrency, statusToLabel } from "@/lib/utils";
import { Invoice } from "@/components/dashboard/RecentInvoicesTable";

// Define types for our data
interface DashboardStats {
  revenue: number;
  unpaid: number;
  overdue: number;
  clientCount: number;
}

interface MonthlyRevenueData {
  month: string;
  total: number;
}

interface StatCardData {
  title: string;
  value: string;
  icon: string;
}

export function useDashboardData() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    unpaid: 0,
    overdue: 0,
    clientCount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get dashboard stats
        const statsResult = await getDashboardStats();
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data as DashboardStats);
        }

        // Get recent invoices
        const invoicesResult = await getRecentInvoices();
        if (invoicesResult.success && invoicesResult.data) {
          const formattedInvoices = invoicesResult.data.map((invoice) => ({
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.client.name,
            amount: formatCurrency(Number(invoice.total)),
            dueDate: new Date(invoice.dueDate).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            status: statusToLabel(invoice.status),
          }));
          setRecentInvoices(formattedInvoices);
        }

        // Get monthly revenue data
        const revenueResult = await getMonthlyRevenue();
        if (revenueResult.success && revenueResult.data) {
          setMonthlyRevenue(revenueResult.data as MonthlyRevenueData[]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Gagal memuat data dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format stats data for display
  const formattedStats: StatCardData[] = [
    {
      title: "Pendapatan (30 Hari)",
      value: formatCurrency(stats.revenue),
      icon: "DollarSign",
    },
    {
      title: "Belum Dibayar",
      value: formatCurrency(stats.unpaid),
      icon: "CircleDollarSign",
    },
    {
      title: "Jatuh Tempo",
      value: formatCurrency(stats.overdue),
      icon: "AlertCircle",
    },
    {
      title: "Klien Aktif",
      value: String(stats.clientCount),
      icon: "Users",
    },
  ];

  return {
    isLoading,
    stats: formattedStats,
    recentInvoices,
    monthlyRevenue,
    error,
  };
}
