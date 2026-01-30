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
      <div className="flex flex-col items-center gap-1 rounded-xl bg-card/90 p-2 shadow-lg backdrop-blur-sm border border-border">
        <button
          onClick={() => {
            const currentIndex = selectedFloor
              ? floorsData.findIndex((f) => f.id === selectedFloor)
              : -1;
            if (currentIndex < floorsData.length - 1) {
              onFloorSelect(floorsData[currentIndex + 1].id);
            }
          }}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Go up"
        >
          <ChevronUpIcon className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-1">
          {[...floorsData].reverse().map((floor) => (
            <button
              key={floor.id}
              onClick={() =>
                onFloorSelect(selectedFloor === floor.id ? null : floor.id)
              }
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg text-sm font-semibold transition-all",
                selectedFloor === floor.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary/50 text-card-foreground hover:bg-secondary"
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
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Go down"
        >
          <ChevronDownIcon className="h-4 w-4" />
        </button>

        {selectedFloor && (
          <button
            onClick={() => onFloorSelect(null)}
            className="mt-1 p-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground text-xs"
            title="View all floors"
          >
            <BuildingIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
