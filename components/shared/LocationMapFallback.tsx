import React from "react";
import { MapPin, Navigation, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationMapFallbackProps {
  location: {
    city?: string;
    state?: string;
    country?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  title?: string;
}

export function LocationMapFallback({
  location,
  title = "Flight Operation Zone",
}: LocationMapFallbackProps) {
  const city = location?.city || "Station Base";
  const state = location?.state || "Regional Airspace";
  const country = location?.country || "United States";
  const address = location?.address;
  const lat = location?.latitude || 37.7749;
  const lng = location?.longitude || -122.4194;

  return (
    <Card className="overflow-hidden">
      {/* Architectural Map Header Canvas */}
      <div className="relative h-36 bg-surface-2 p-4 flex flex-col justify-between border-b border-border">
        {/* Clean subtle coordinate grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <Badge variant="outline" className="bg-surface font-mono text-[10px]">
            {title}
          </Badge>

          <span className="text-[11px] font-mono text-subtle">
            {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° W
          </span>
        </div>

        {/* Center Target Indicator */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Location Details Footer */}
      <CardContent className="p-4 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Operating Region:</span>
          <span className="font-semibold text-foreground">
            {city}, {state}
          </span>
        </div>

        {address && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Site Address:</span>
            <span className="text-foreground text-right truncate max-w-[200px]">
              {address}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border text-[11px]">
          <span className="text-subtle">FAA Jurisdiction:</span>
          <span className="text-success font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
            Class G / Airspace Authorized
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationMapFallback;
