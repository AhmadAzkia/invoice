"use client";

import Link from "next/link";
import { Plus, CalendarClock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StatCard from "@/components/dashboard/StatCard";
import RecentInvoicesTable from "@/components/dashboard/RecentInvoicesTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { dummyStats, dummyRecentInvoices, dummyChartData } from "@/lib/dummy-data";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Selamat Datang Kembali!</h1>
          <p className="text-neutral-500 mt-1">Pantau kinerja bisnis dari dashboard ini</p>
        </div>
        <Link href="/invoices/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Buat Invoice Baru
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dummyStats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoice</TabsTrigger>
          <TabsTrigger value="clients">Klien</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RevenueChart data={dummyChartData} />

            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle>Invoice Terkini</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentInvoicesTable invoices={dummyRecentInvoices.slice(0, 3)} />
              </CardContent>
              <CardFooter className="pt-0">
                <Link href="/invoices" className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    Lihat Semua Invoice <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Quick Actions and Upcoming Dates */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" /> Buat Invoice Baru
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" /> Tambah Klien Baru
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <CalendarClock className="h-4 w-4" /> Jadwalkan Pengingat
                </Button>
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Tanggal Penting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dummyRecentInvoices.slice(0, 3).map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${invoice.status === "Jatuh Tempo" ? "bg-red-500" : invoice.status === "Terkirim" ? "bg-amber-500" : "bg-green-500"}`} />
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-neutral-500 text-sm">{invoice.clientName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{invoice.amount}</p>
                        <p className="text-neutral-500 text-sm">{invoice.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Semua Invoice</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoicesTable invoices={dummyRecentInvoices} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Klien</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-500">Belum ada klien yang ditambahkan.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
