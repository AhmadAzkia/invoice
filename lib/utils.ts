import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to Indonesian Rupiah currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date with various options
 */
export function formatDate(
  date: Date | string,
  options: {
    format?: "short" | "long" | "numeric";
    includeTime?: boolean;
  } = {}
): string {
  const { format = "short", includeTime = false } = options;
  const dateObj = date instanceof Date ? date : new Date(date);

  // Format options
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: format === "numeric" ? "numeric" : format === "long" ? "long" : "short",
    year: "numeric",
  };

  if (includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
  }

  return dateObj.toLocaleDateString("id-ID", formatOptions);
}

/**
 * Generate a unique invoice number based on date and optional prefix
 */
export function generateInvoiceNumber(prefix = "INV"): string {
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Random 4-digit number
  const random = Math.floor(1000 + Math.random() * 9000);

  return `${prefix}-${year}${month}${day}-${random}`;
}

/**
 * Convert invoice status to human-readable label
 */
export function statusToLabel(status: string): string {
  const statusMap: Record<string, string> = {
    PAID: "Lunas",
    SENT: "Terkirim",
    DUE: "Jatuh Tempo",
    DRAFT: "Draft",
  };

  return statusMap[status] || status;
}

/**
 * Get CSS class for status badge
 */
export function getStatusBadgeClass(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "PAID":
    case "Lunas":
      return "secondary";
    case "SENT":
    case "Terkirim":
      return "default";
    case "DUE":
    case "Jatuh Tempo":
      return "destructive";
    case "DRAFT":
    case "Draft":
      return "outline";
    default:
      return "default";
  }
}

/**
 * Calculate due date (e.g., 14 days from issue date)
 */
export function calculateDueDate(issueDate: Date | string, daysToAdd = 14): Date {
  const date = new Date(issueDate);
  date.setDate(date.getDate() + daysToAdd);
  return date;
}
