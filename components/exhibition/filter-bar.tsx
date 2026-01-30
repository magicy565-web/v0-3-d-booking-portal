"use client";

import { cn } from "@/lib/utils";
import { 
  LayoutGridIcon, 
  ShoppingBagIcon, 
  VideoIcon, 
  BuildingIcon, 
  StoreIcon 
} from "lucide-react";

interface FilterBarProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTER_OPTIONS = [
  { id: "All", label: "All", icon: LayoutGridIcon },
  { id: "Retail", label: "Retail", icon: ShoppingBagIcon },
  { id: "Livestream", label: "Livestream", icon: VideoIcon },
  { id: "Office", label: "Office", icon: BuildingIcon },
  { id: "Showroom", label: "Showroom", icon: StoreIcon },
];

export function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20">
      <div className="flex items-center gap-1.5 rounded-2xl bg-slate-900/90 p-1.5 shadow-xl backdrop-blur-md border border-white/10">
        {FILTER_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = activeFilter === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
