import React from "react";
import { MapPin } from "lucide-react";

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
  const address = location?.address;
  const lat = location?.latitude || 37.7749;
  const lng = location?.longitude || -122.4194;

  return (
    <div className="overflow-hidden rounded-3xl bg-white dark:bg-[#161b22] border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:border-zinc-350 dark:hover:border-zinc-700 transition-all duration-300">
      {/* Architectural Map Header Canvas */}
      <div className="relative h-36 bg-[#faf8f5] dark:bg-zinc-900/60 p-4 flex flex-col justify-between border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="relative z-10 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-2xs">
            {title}
          </span>

          <span className="text-[11px] font-mono text-muted-foreground">
            {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° W
          </span>
        </div>

        {/* Center Target Indicator */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="w-9 h-9 rounded-full bg-[#fabf28]/20 border border-[#fabf28] flex items-center justify-center text-[#fabf28] shadow-xs">
            <MapPin className="w-4 h-4 text-zinc-900 dark:text-[#fabf28]" />
          </div>
        </div>
      </div>

      {/* Location Details Footer */}
      <div className="p-4 sm:p-5 space-y-2 text-xs">
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

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px]">
          <span className="text-muted-foreground">FAA Jurisdiction:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Class G / Airspace Authorized
          </span>
        </div>
      </div>
    </div>
  );
}

export default LocationMapFallback;
