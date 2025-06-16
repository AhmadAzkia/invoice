"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  invoiceNumber: string;
  clientName: string;
  amount: string;
  dueDate: string;
  status: string;
}

interface RecentInvoicesTableProps {
  invoices: Invoice[];
}

const RecentInvoicesTable: React.FC<RecentInvoicesTableProps> = ({ invoices }) => {  // Helper function to determine badge variant based on status
  const getBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Jatuh Tempo":
        return "destructive";
      case "Lunas":
        return "secondary"; // Using secondary for success as it's not in default variants
      case "Terkirim":
        return "secondary";
      case "Draft":
        return "outline";
      default:
        return "default";
    }
  };
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Klien</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Tgl Jatuh Tempo</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <TableRow 
                key={invoice.invoiceNumber}
                className="hover:bg-neutral-50 cursor-pointer"
              >
                <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell className="font-medium">{invoice.amount}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell className="text-right">
                  <Badge 
                    variant={getBadgeVariant(invoice.status)}
                    className="font-medium"
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                Tidak ada invoice
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentInvoicesTable;
