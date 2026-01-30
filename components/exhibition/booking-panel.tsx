"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  type Floor,
  type Zone,
  floorsData,
  getStatusColor,
  getStatusLabelCn,
} from "@/lib/floor-data";
import { getZoneImage, GALLERY_STRUCTURE_IMAGE, FLOOR_PREVIEW_IMAGES } from "@/lib/zone-images";
import {
  CalendarIcon,
  MapPinIcon,
  SquareIcon,
  TagIcon,
  BuildingIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronRightIcon,
  ImageIcon,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { zhCN } from "date-fns/locale";

interface BookingPanelProps {
  selectedFloor: number | null;
  selectedZone: Zone | null;
  selectedFloorData: Floor | null;
  onFloorSelect: (floorId: number | null) => void;
  onZoneSelect: (zone: Zone | null, floor: Floor) => void;
}

export function BookingPanel({
  selectedFloor,
  selectedZone,
  selectedFloorData,
  onFloorSelect,
  onZoneSelect,
}: BookingPanelProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async () => {
    if (!selectedZone || selectedZone.status !== "available") return;

    setIsBooking(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsBooking(false);
    setBookingSuccess(true);

    setTimeout(() => setBookingSuccess(false), 3000);
  };

  const totalDays =
    dateRange.from && dateRange.to
      ? Math.ceil(
          (dateRange.to.getTime() - dateRange.from.getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  const totalPrice = selectedZone ? selectedZone.price * totalDays : 0;
  
  // Get zone image
  const zoneImage = selectedZone ? getZoneImage(selectedZone.id) : undefined;

  return (
    <div className="flex h-full flex-col bg-background/80 backdrop-blur-xl border-l border-border/50">
      {/* Header with glassmorphism */}
      <div className="border-b border-border/50 p-5 bg-gradient-to-r from-primary/5 to-transparent">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          Global Exhibition Center
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive 3D Space Booking
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Building Overview Image */}
          {!selectedFloor && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border/50 shadow-lg">
              <Image
                src={GALLERY_STRUCTURE_IMAGE || "/placeholder.svg"}
                alt="Exhibition Center Overview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-sm font-medium">6-Story Exhibition Complex</p>
                <p className="text-white/70 text-xs">Click a floor to explore zones</p>
              </div>
            </div>
          )}

          {/* Floor Selector */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-primary" />
              Select Floor
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {floorsData.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() =>
                    onFloorSelect(selectedFloor === floor.id ? null : floor.id)
                  }
                  className={cn(
                    "flex flex-col items-center justify-center rounded-xl border p-3 transition-all duration-200",
                    "hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                    selectedFloor === floor.id
                      ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/20"
                      : "border-border/50 bg-card/50 backdrop-blur-sm"
                  )}
                >
                  <span className="text-xl font-bold text-foreground">
                    {floor.id}F
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight mt-1 line-clamp-1">
                    {floor.coreFunction.split("、")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Selected Floor Info */}
          {selectedFloorData && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
              {/* Floor Preview Image */}
              {FLOOR_PREVIEW_IMAGES[selectedFloorData.id] && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={FLOOR_PREVIEW_IMAGES[selectedFloorData.id] || "/placeholder.svg"}
                    alt={selectedFloorData.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge className="bg-primary text-primary-foreground text-xs mb-1.5">
                      {selectedFloorData.id}F
                    </Badge>
                    <h3 className="text-white font-bold text-sm">{selectedFloorData.name}</h3>
                  </div>
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  {selectedFloorData.coreFunction.split("、")[0]}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-xs text-muted-foreground mb-4">
                  {selectedFloorData.coreFunction}
                </p>

                {/* Zones list */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                    <MapPinIcon className="h-3.5 w-3.5" />
                    Zones ({selectedFloorData.zones.length})
                  </p>
                  {selectedFloorData.zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => onZoneSelect(zone, selectedFloorData)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg border p-3 text-left transition-all duration-200",
                        "hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm",
                        selectedZone?.id === zone.id
                          ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                          : "border-border/50 bg-background/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full ring-2 ring-white shadow-sm"
                          style={{ backgroundColor: getStatusColor(zone.status) }}
                        />
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {zone.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {zone.area} sqm | {zone.type}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          zone.status === "available"
                            ? "default"
                            : zone.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-[10px] font-medium"
                      >
                        {getStatusLabelCn(zone.status)}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Zone Details */}
          {selectedZone && (
            <>
              <Separator className="bg-border/50" />

              <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm overflow-hidden">
                {/* Zone Image */}
                {zoneImage ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={zoneImage || "/placeholder.svg"}
                      alt={selectedZone.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-white/90 text-foreground text-xs">
                        {selectedZone.type}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-muted/50 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Preview not available</p>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-primary" />
                    Zone Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">
                  <div>
                    <h4 className="font-bold text-foreground text-base">
                      {selectedZone.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedZone.nameEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                      <SquareIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Area</p>
                        <p className="text-sm font-semibold">
                          {selectedZone.area} sqm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Type</p>
                        <p className="text-sm font-semibold">{selectedZone.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                    <span className="text-xs text-muted-foreground font-medium">Status</span>
                    <div className="flex items-center gap-2">
                      {selectedZone.status === "available" && (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      )}
                      {selectedZone.status === "booked" && (
                        <XCircleIcon className="h-4 w-4 text-red-500" />
                      )}
                      {selectedZone.status === "pending" && (
                        <ClockIcon className="h-4 w-4 text-amber-500" />
                      )}
                      <span
                        className="text-sm font-bold"
                        style={{ color: getStatusColor(selectedZone.status) }}
                      >
                        {getStatusLabelCn(selectedZone.status)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedZone.description}
                  </p>

                  {selectedZone.price > 0 && (
                    <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-4 border border-primary/20">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground font-medium">
                          Daily Rate
                        </span>
                        <span className="text-2xl font-bold text-primary">
                          ¥{selectedZone.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Date Selection */}
              {selectedZone.status === "available" && selectedZone.price > 0 && (
                <>
                  <Separator className="bg-border/50" />

                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        Select Dates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent hover:bg-muted/50"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                <span className="font-medium">
                                  {format(dateRange.from, "MM/dd", {
                                    locale: zhCN,
                                  })}{" "}
                                  -{" "}
                                  {format(dateRange.to, "MM/dd", {
                                    locale: zhCN,
                                  })}
                                </span>
                              ) : (
                                format(dateRange.from, "PPP", { locale: zhCN })
                              )
                            ) : (
                              <span className="text-muted-foreground">Pick dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range) =>
                              setDateRange({
                                from: range?.from,
                                to: range?.to,
                              })
                            }
                            numberOfMonths={1}
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>

                      {totalDays > 0 && (
                        <div className="mt-4 space-y-2 p-3 rounded-lg bg-muted/30">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-medium">{totalDays} days</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Daily Rate</span>
                            <span className="font-medium">¥{selectedZone.price.toLocaleString()}</span>
                          </div>
                          <Separator className="my-2 bg-border/50" />
                          <div className="flex justify-between items-baseline">
                            <span className="font-semibold text-sm">Total</span>
                            <span className="text-xl font-bold text-primary">
                              ¥{totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Booking Action */}
      {selectedZone && selectedZone.status === "available" && selectedZone.price > 0 && (
        <div className="border-t border-border/50 p-5 bg-gradient-to-t from-background to-transparent">
          {bookingSuccess ? (
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 p-4 text-green-600 border border-green-500/20">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="font-semibold">Booking Submitted Successfully!</span>
            </div>
          ) : (
            <Button
              className="w-full h-12 text-base font-semibold rounded-xl shadow-lg shadow-primary/20"
              size="lg"
              onClick={handleBooking}
              disabled={isBooking || !dateRange.from || !dateRange.to}
            >
              {isBooking ? (
                <>
                  <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  Reserve Zone
                  <ChevronRightIcon className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Non-bookable notice */}
      {selectedZone && (selectedZone.status !== "available" || selectedZone.price === 0) && (
        <div className="border-t border-border/50 p-5">
          <div className="rounded-xl bg-muted/50 p-4 text-center text-sm text-muted-foreground border border-border/50">
            {selectedZone.status === "booked"
              ? "This zone is currently booked"
              : selectedZone.status === "pending"
              ? "This zone has a pending reservation"
              : "This zone is not available for booking"}
          </div>
        </div>
      )}
    </div>
  );
}
