"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CircleDollarSign, AlertCircle, Users, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  CircleDollarSign,
  AlertCircle,
  Users,
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  // Get the icon component from our map
  const IconComponent = iconMap[icon];

  // Determine background and text colors based on icon
  const getColors = () => {
    switch (icon) {
      case "DollarSign":
        return {
          bg: "bg-green-50",
          iconColor: "text-green-600",
          gradient: "from-green-500 to-green-600",
        };
      case "CircleDollarSign":
        return {
          bg: "bg-blue-50",
          iconColor: "text-blue-600",
          gradient: "from-blue-500 to-blue-600",
        };
      case "AlertCircle":
        return {
          bg: "bg-red-50",
          iconColor: "text-red-600",
          gradient: "from-red-500 to-red-600",
        };
      case "Users":
        return {
          bg: "bg-purple-50",
          iconColor: "text-purple-600",
          gradient: "from-purple-500 to-purple-600",
        };
      default:
        return {
          bg: "bg-neutral-100",
          iconColor: "text-neutral-700",
          gradient: "from-neutral-700 to-neutral-800",
        };
    }
  };

  const colors = getColors();

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <div className="h-1 bg-gradient-to-r w-full" style={{ backgroundImage: `linear-gradient(to right, var(--${colors.gradient.split("-")[1]}-500), var(--${colors.gradient.split("-")[3]}-500))` }} />
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        {IconComponent && (
          <div className={`rounded-full ${colors.bg} p-3`}>
            <IconComponent className={`h-6 w-6 ${colors.iconColor}`} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
