"use client";

import Link from "next/link";
import { Plus, CalendarClock, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import StatCard from "@/components/dashboard/StatCard";
import RecentInvoicesTable from "@/components/dashboard/RecentInvoicesTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function Home() {
  const { stats, recentInvoices, monthlyRevenue, isLoading } = useDashboardData();

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
        {isLoading
          ? // Loading state
            Array(4)
              .fill(0)
              .map((_, index) => <div key={index} className="h-[120px] rounded-md bg-neutral-100 animate-pulse" />)
          : // Loaded data
            stats.map((stat, index) => <StatCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />)}
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
            {isLoading ? (
              <>
                <div className="h-[400px] lg:col-span-2 rounded-md bg-neutral-100 animate-pulse" />
                <div className="h-[400px] rounded-md bg-neutral-100 animate-pulse" />
              </>
            ) : (
              <>
                <RevenueChart data={monthlyRevenue} />

                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle>Invoice Terkini</CardTitle>
                  </CardHeader>
                  <CardContent>{recentInvoices.length > 0 ? <RecentInvoicesTable invoices={recentInvoices.slice(0, 3)} /> : <p className="text-neutral-500 py-4 text-center">Belum ada invoice.</p>}</CardContent>
                  <CardFooter className="pt-0">
                    <Link href="/invoices" className="w-full">
                      <Button variant="outline" className="w-full gap-2">
                        Lihat Semua Invoice <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>

          {/* Quick Actions and Upcoming Dates */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/invoices/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" /> Buat Invoice Baru
                  </Button>
                </Link>
                <Link href="/clients/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" /> Tambah Klien Baru
                  </Button>
                </Link>
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
                  {isLoading ? (
                    // Loading state
                    Array(3)
                      .fill(0)
                      .map((_, index) => <div key={index} className="h-[60px] rounded-md bg-neutral-100 animate-pulse" />)
                  ) : recentInvoices.length > 0 ? (
                    recentInvoices.slice(0, 3).map((invoice: any, index) => (
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
                    ))
                  ) : (
                    <p className="text-neutral-500 py-4 text-center">Tidak ada tanggal penting.</p>
                  )}
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
              {isLoading ? (
                <div className="h-[400px] rounded-md bg-neutral-100 animate-pulse" />
              ) : recentInvoices.length > 0 ? (
                <RecentInvoicesTable invoices={recentInvoices} />
              ) : (
                <p className="text-neutral-500 py-4 text-center">Belum ada invoice.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Daftar Klien</CardTitle>
              <Link href="/clients/new">
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" /> Tambah Klien
                </Button>
              </Link>
            </CardHeader>
            <CardContent>{isLoading ? <div className="h-[400px] rounded-md bg-neutral-100 animate-pulse" /> : <p className="text-neutral-500">Belum ada klien yang ditampilkan.</p>}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
