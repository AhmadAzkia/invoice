import InvoiceForm from "@/components/invoices/InvoiceForm";

export default function NewInvoicePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Invoice</h1>
      <InvoiceForm />
    </main>
  );
}
