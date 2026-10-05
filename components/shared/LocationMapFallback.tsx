import React from "react";
import { MapPin, Navigation, Compass, Globe } from "lucide-react";

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
  const city = location?.city || "Industrial Sector";
  const state = location?.state || "HQ Area";
  const country = location?.country || "United States";
  const address = location?.address;
  const lat = location?.latitude || 37.7749;
  const lng = location?.longitude || -122.4194;

  const mapApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

  return (
    <div className="rounded-2xl bg-[#0a1124] border border-slate-800/80 overflow-hidden shadow-lg">
      {/* Visual Map/HUD Simulation Container */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-br from-slate-950 via-[#07122b] to-[#041d38] p-4 flex flex-col justify-between overflow-hidden">
        {/* Futuristic Grid background lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b22_1px,transparent_1px),linear-gradient(to_bottom,#1e293b22_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Radar concentric circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-cyan-500/10 pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-cyan-500/15 pointer-events-none" />

        {/* Top HUD Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: "12s" }} />
            <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono text-slate-400 backdrop-blur-md">
            <Globe className="w-3 h-3 text-teal-400" />
            <span>
              {lat.toFixed(4)}° N, {Math.abs(lng).toFixed(4)}° W
            </span>
          </div>
        </div>

        {/* Center Target Marker */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-12 h-12 rounded-full bg-cyan-500/20 animate-ping" />
            <div className="w-9 h-9 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Navigation className="w-5 h-5 transform -rotate-45" />
            </div>
          </div>
          <div className="mt-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-xs font-bold text-white shadow-md">
            {city}, {state}
          </div>
        </div>

        {/* Bottom Coordinates status */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>AIRSPACE: UNRESTRICTED CLASS G</span>
          <span>ELEVATION: ~450 FT AGL</span>
        </div>
      </div>

      {/* Location Details Footer */}
      <div className="p-4 bg-[#080f22] border-t border-slate-800/80 flex items-start gap-3">
        <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-white">
            {city}, {state}, {country}
          </h4>
          {address ? (
            <p className="text-xs text-slate-400 mt-0.5">{address}</p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5">
              Exact deployment coordinates provided upon pilot selection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LocationMapFallback;
