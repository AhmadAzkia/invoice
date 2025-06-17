"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/app/actions/invoices";
import { ClientFormData } from "@/app/actions/invoices";
import ClientForm from "@/components/clients/ClientForm";

export default function NewClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createClient(data);
      if (result.success) {
        // Navigate back to clients list on success
        router.push("/clients");
        router.refresh();
      } else {
        setError(result.error || "Gagal membuat klien baru");
      }
    } catch (err) {
      console.error("Error creating client:", err);
      setError("Terjadi kesalahan saat membuat klien");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Klien Baru</h1>
        <p className="text-neutral-500 mt-1">Isi informasi klien di bawah ini</p>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

      <ClientForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialData={{
          name: "",
          email: "",
          phone: "",
          address: "",
          company: "",
        }}
      />
    </div>
  );
}
