"use client";

import React from "react";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b bg-white py-3 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <input type="text" placeholder="Cari..." className="pl-10 pr-4 py-2 w-full rounded-full bg-neutral-50 focus:bg-white focus:outline-none border border-neutral-200 text-sm" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Ahmad Azkia</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
            <Avatar>
              <AvatarImage src="/avatar-placeholder.jpg" alt="Ahmad Azkia" />
              <AvatarFallback>AA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
