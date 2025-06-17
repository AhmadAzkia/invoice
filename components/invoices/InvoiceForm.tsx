"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  invoiceNumber: z.string().min(1, "Nomor invoice diperlukan"),
  issueDate: z.string().min(1, "Tanggal penerbitan diperlukan"),
  dueDate: z.string().min(1, "Tanggal jatuh tempo diperlukan"),
  status: z.string().min(1, "Status diperlukan"),
  clientId: z.string().min(1, "Klien diperlukan"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Deskripsi diperlukan"),
        quantity: z.coerce.number().min(1, "Kuantitas minimal 1"),
        unitPrice: z.coerce.number().min(1, "Harga harus lebih dari 0"),
      })
    )
    .min(1, "Minimal satu item diperlukan"),
});

type FormValues = z.infer<typeof formSchema>;

interface InvoiceFormProps {
  onSubmit?: (data: FormValues) => void;
  initialData?: Partial<FormValues>;
  isSubmitting?: boolean;
  clients?: { id: string; name: string }[];
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit = () => {}, initialData = {}, isSubmitting = false, clients = [] }) => {
  // Define form with validation schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceNumber: initialData.invoiceNumber || `INV-${format(new Date(), "yyyyMMdd")}-001`,
      issueDate: initialData.issueDate || format(new Date(), "yyyy-MM-dd"),
      dueDate: initialData.dueDate || format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      status: initialData.status || "DRAFT",
      clientId: initialData.clientId || "",
      notes: initialData.notes || "",
      items: initialData.items || [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Handle submit function
  function handleSubmit(values: FormValues) {
    onSubmit(values);
  } // Gunakan data klien dari props

  // Calculate total
  const calculateTotal = () => {
    const items = form.getValues("items");
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Informasi Invoice</h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Invoice</FormLabel>
                      <FormControl>
                        <Input placeholder="INV-20250617-001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Penerbitan</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            <CalendarIcon className="h-4 w-4 absolute right-3 top-2.5 text-neutral-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Jatuh Tempo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="date" {...field} />
                            <CalendarIcon className="h-4 w-4 absolute right-3 top-2.5 text-neutral-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="SENT">Terkirim</SelectItem>
                            <SelectItem value="PAID">Lunas</SelectItem>
                            <SelectItem value="DUE">Jatuh Tempo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Klien</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih klien" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {" "}
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catatan</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Masukkan catatan terkait invoice ini..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Item Invoice</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}>
                  <Plus className="h-4 w-4 mr-1" /> Tambah Item
                </Button>
              </div>

              {fields.map((item, index) => (
                <div key={item.id} className="space-y-4 p-4 border rounded-md mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item #{index + 1}</h4>
                    {index > 0 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Input placeholder="Deskripsi item..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kuantitas</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga Satuan</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="1000" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="text-right text-sm font-medium">Subtotal: Rp {new Intl.NumberFormat("id-ID").format(form.getValues(`items.${index}.quantity`) * form.getValues(`items.${index}.unitPrice`))}</div>
                </div>
              ))}

              <div className="mt-6 text-right">
                <div className="text-xl font-bold">Total: Rp {new Intl.NumberFormat("id-ID").format(calculateTotal())}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" disabled={isSubmitting}>
            Simpan Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan & Kirim Invoice"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvoiceForm;
