"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { BookingPanel } from "@/components/exhibition/booking-panel";
import { FloorSelector } from "@/components/exhibition/floor-selector";
import { floorsData, type Floor, type Zone } from "@/lib/floor-data";
import { Button } from "@/components/ui/button";
import { MenuIcon, XIcon, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic import for 3D component to avoid SSR issues
const Building3D = dynamic(
  () =>
    import("@/components/exhibition/building-3d").then((mod) => mod.Building3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading 3D View...</p>
        </div>
      </div>
    ),
  }
);

export default function ExhibitionBookingPage() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedFloorData, setSelectedFloorData] = useState<Floor | null>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const handleFloorSelect = (floorId: number | null) => {
    setSelectedFloor(floorId);
    if (floorId) {
      const floor = floorsData.find((f) => f.id === floorId);
      setSelectedFloorData(floor || null);
    } else {
      setSelectedFloorData(null);
    }
    setSelectedZone(null);
  };

  const handleZoneSelect = (zone: Zone | null, floor: Floor) => {
    setSelectedZone(zone);
    setSelectedFloorData(floor);
    setSelectedFloor(floor.id);
  };

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* Header */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">EC</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground md:text-base">
              Global Exhibition Center
            </h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Cross-border E-commerce Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 bg-card/80 backdrop-blur-sm"
            onClick={() => setShowInfo(!showInfo)}
          >
            <InfoIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 md:hidden bg-card/80 backdrop-blur-sm"
            onClick={() => setShowPanel(!showPanel)}
          >
            {showPanel ? (
              <XIcon className="h-4 w-4" />
            ) : (
              <MenuIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute left-4 top-20 z-30 max-w-sm rounded-xl bg-card/95 p-4 shadow-lg backdrop-blur-sm border border-border md:left-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-card-foreground">How to Use</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="font-medium text-foreground">1.</span>
              Click on a floor to isolate and view its zones
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">2.</span>
              Click on a zone to see details and availability
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">3.</span>
              Select dates and reserve your exhibition space
            </li>
            <li className="flex gap-2">
              <span className="font-medium text-foreground">4.</span>
              Drag to rotate, scroll to zoom the 3D view
            </li>
          </ul>
          <div className="mt-4 flex gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <div className="h-full w-full">
        <Building3D
          selectedFloor={selectedFloor}
          selectedZone={selectedZone}
          onFloorSelect={handleFloorSelect}
          onZoneSelect={handleZoneSelect}
        />
      </div>

      {/* Floor Selector */}
      <FloorSelector
        selectedFloor={selectedFloor}
        onFloorSelect={handleFloorSelect}
      />

      {/* Booking Panel */}
      <div
        className={cn(
          "absolute right-0 top-0 z-10 h-full w-full max-w-sm border-l border-border bg-card shadow-xl transition-transform duration-300 ease-in-out md:translate-x-0",
          showPanel ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full pt-16">
          <BookingPanel
            selectedFloor={selectedFloor}
            selectedZone={selectedZone}
            selectedFloorData={selectedFloorData}
            onFloorSelect={handleFloorSelect}
            onZoneSelect={handleZoneSelect}
          />
        </div>
      </div>

      {/* Mobile overlay when panel is open */}
      {showPanel && (
        <div
          className="absolute inset-0 z-5 bg-foreground/20 md:hidden"
          onClick={() => setShowPanel(false)}
        />
      )}

      {/* Footer info */}
      <div className="absolute bottom-4 left-4 z-10 hidden md:block">
        <div className="rounded-lg bg-card/80 px-3 py-2 text-xs text-muted-foreground backdrop-blur-sm border border-border">
          <span className="font-medium text-card-foreground">6 Floors</span>
          <span className="mx-2">|</span>
          <span>27 Exhibition Zones</span>
          <span className="mx-2">|</span>
          <span className="text-green-600">12 Available</span>
        </div>
      </div>
    </main>
  );
}
