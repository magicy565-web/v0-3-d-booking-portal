"use client";

import { useState } from "react";
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
  getStatusLabel,
  getStatusLabelCn,
} from "@/lib/floor-data";
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

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold text-card-foreground">
          Exhibition Center
        </h2>
        <p className="text-sm text-muted-foreground">
          Select a floor and zone to book
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Floor Selector */}
          <div>
            <h3 className="text-sm font-medium text-card-foreground mb-3">
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
                    "flex flex-col items-center justify-center rounded-lg border p-3 transition-all hover:border-primary/50",
                    selectedFloor === floor.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  )}
                >
                  <span className="text-lg font-semibold text-card-foreground">
                    {floor.id}F
                  </span>
                  <span className="text-[10px] text-muted-foreground text-center leading-tight mt-1">
                    {floor.coreFunction.split("、")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Selected Floor Info */}
          {selectedFloorData && (
            <Card className="bg-secondary/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BuildingIcon className="h-4 w-4" />
                  {selectedFloorData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-xs text-muted-foreground mb-3">
                  {selectedFloorData.coreFunction}
                </p>

                {/* Zones list */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-card-foreground">
                    Available Zones ({selectedFloorData.zones.length})
                  </p>
                  {selectedFloorData.zones.map((zone) => (
                    <button
                      key={zone.id}
                      onClick={() => onZoneSelect(zone, selectedFloorData)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-md border p-2 text-left transition-all hover:border-primary/50",
                        selectedZone?.id === zone.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: getStatusColor(zone.status) }}
                        />
                        <div>
                          <p className="text-xs font-medium text-card-foreground">
                            {zone.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {zone.area} sqm
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            zone.status === "available"
                              ? "default"
                              : zone.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {getStatusLabelCn(zone.status)}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Selected Zone Details */}
          {selectedZone && (
            <>
              <Separator />

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    Zone Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pb-3">
                  <div>
                    <h4 className="font-semibold text-card-foreground">
                      {selectedZone.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedZone.nameEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <SquareIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Area</p>
                        <p className="text-sm font-medium">
                          {selectedZone.area} sqm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm font-medium">{selectedZone.type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-secondary/50 p-2">
                    <span className="text-xs text-muted-foreground">Status</span>
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
                        className="text-sm font-medium"
                        style={{ color: getStatusColor(selectedZone.status) }}
                      >
                        {getStatusLabelCn(selectedZone.status)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {selectedZone.description}
                  </p>

                  {selectedZone.price > 0 && (
                    <div className="rounded-md bg-primary/10 p-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">
                          Daily Rate
                        </span>
                        <span className="text-lg font-bold text-primary">
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
                  <Separator />

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Select Dates
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "MM/dd", {
                                    locale: zhCN,
                                  })}{" "}
                                  -{" "}
                                  {format(dateRange.to, "MM/dd", {
                                    locale: zhCN,
                                  })}
                                </>
                              ) : (
                                format(dateRange.from, "PPP", { locale: zhCN })
                              )
                            ) : (
                              <span>Pick dates</span>
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
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              Duration
                            </span>
                            <span>{totalDays} days</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              Daily Rate
                            </span>
                            <span>¥{selectedZone.price.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-medium">Total</span>
                            <span className="text-lg font-bold text-primary">
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
        <div className="border-t border-border p-4">
          {bookingSuccess ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 p-3 text-green-600">
              <CheckCircleIcon className="h-5 w-5" />
              <span className="font-medium">Booking Submitted!</span>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleBooking}
              disabled={isBooking || !dateRange.from || !dateRange.to}
            >
              {isBooking ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  Reserve Zone
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Non-bookable notice */}
      {selectedZone && (selectedZone.status !== "available" || selectedZone.price === 0) && (
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3 text-center text-sm text-muted-foreground">
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
