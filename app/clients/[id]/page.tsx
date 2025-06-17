"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getClientById, updateClient, deleteClient } from "@/app/actions/invoices";
import { ClientFormData } from "@/app/actions/invoices";
import ClientForm from "@/components/clients/ClientForm";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    id: string;
  };
}

export default function ClientDetailPage({ params }: Props) {
  const router = useRouter();
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true);
      try {
        const result = await getClientById(params.id);
        if (result.success && result.data) {
          setClient(result.data);
        } else {
          setError("Klien tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("Gagal memuat data klien");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

  const handleSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateClient(params.id, data);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error || "Gagal memperbarui klien");
      }
    } catch (err) {
      console.error("Error updating client:", err);
      setError("Terjadi kesalahan saat memperbarui klien");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus klien ini? Semua invoice yang terkait akan ikut terhapus.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteClient(params.id);
      if (result.success) {
        router.push("/clients");
        router.refresh();
      } else {
        setError(result.error || "Gagal menghapus klien");
      }
    } catch (err) {
      console.error("Error deleting client:", err);
      setError("Terjadi kesalahan saat menghapus klien");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/clients">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{isLoading ? "Memuat..." : client?.name || "Detail Klien"}</h1>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="h-[400px] rounded-md bg-neutral-100 animate-pulse" />
      ) : client ? (
        <div className="space-y-6">
          <ClientForm onSubmit={handleSubmit} isSubmitting={isSubmitting} initialData={client} />

          <div className="border-t pt-6">
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Menghapus..." : "Hapus Klien"}
            </Button>
          </div>
        </div>
      ) : (
        <p>Klien tidak ditemukan</p>
      )}
    </div>
  );
}
