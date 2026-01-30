"use client";

import { cn } from "@/lib/utils";
import { floorsData } from "@/lib/floor-data";
import { BuildingIcon, ChevronUpIcon, ChevronDownIcon } from "lucide-react";

interface FloorSelectorProps {
  selectedFloor: number | null;
  onFloorSelect: (floorId: number | null) => void;
}

export function FloorSelector({
  selectedFloor,
  onFloorSelect,
}: FloorSelectorProps) {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
      <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-slate-900/90 p-2.5 shadow-xl backdrop-blur-md border border-white/10">
        <button
          onClick={() => {
            const currentIndex = selectedFloor
              ? floorsData.findIndex((f) => f.id === selectedFloor)
              : -1;
            if (currentIndex < floorsData.length - 1) {
              onFloorSelect(floorsData[currentIndex + 1].id);
            }
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          aria-label="Go up"
        >
          <ChevronUpIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-1.5">
          {[...floorsData].reverse().map((floor) => (
            <button
              key={floor.id}
              onClick={() =>
                onFloorSelect(selectedFloor === floor.id ? null : floor.id)
              }
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-xl text-sm font-bold transition-all duration-200",
                selectedFloor === floor.id
                  ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              )}
              title={floor.name}
            >
              {floor.id}F
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            const currentIndex = selectedFloor
              ? floorsData.findIndex((f) => f.id === selectedFloor)
              : floorsData.length;
            if (currentIndex > 0) {
              onFloorSelect(floorsData[currentIndex - 1].id);
            }
          }}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          aria-label="Go down"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        {selectedFloor && (
          <button
            onClick={() => onFloorSelect(null)}
            className="mt-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/50 hover:text-white text-xs"
            title="View all floors"
          >
            <BuildingIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
