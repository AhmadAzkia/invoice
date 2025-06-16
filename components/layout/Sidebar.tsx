"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, Settings, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Invoice",
      href: "/invoices",
      icon: FileText,
    },
    {
      label: "Klien",
      href: "/clients",
      icon: Users,
    },
    {
      label: "Pengaturan",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className={cn("bg-white border-r border-neutral-100 transition-all duration-300 min-h-screen flex flex-col", collapsed ? "w-[80px]" : "w-[250px]")}>
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!collapsed && <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Aeterna</h1>}
          <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <Separator />

      {/* Navigation Items */}
      <nav className="p-2 flex-1">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-neutral-100", pathname === item.href && "bg-neutral-100 font-medium", collapsed && "justify-center px-2")}>
                <item.icon className="h-5 w-5 text-neutral-700" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 mt-auto">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Keluar</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
