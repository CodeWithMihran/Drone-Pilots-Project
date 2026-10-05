import React from "react";
import Link from "next/link";
import { Navigation, ShieldCheck, CheckCircle2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#040813] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Navigation className="w-4 h-4 text-cyan-400 transform -rotate-45" />
                </div>
              </div>
              <span className="font-bold text-base tracking-tight text-white">
                CERTIFIED DRONE PILOTS
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              The premier marketplace connecting verified, Part 107 commercial drone pilots with industrial leaders in agriculture, infrastructure, mapping, and construction.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              100% Admin Verified Pilot Certification
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-cyan-400 transition">
                  Browse Drone Jobs
                </Link>
              </li>
              <li>
                <Link href="/pilots" className="hover:text-cyan-400 transition">
                  Find Verified Pilots
                </Link>
              </li>
              <li>
                <Link href="/company/post-job" className="hover:text-cyan-400 transition">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/register?role=PILOT" className="hover:text-cyan-400 transition">
                  Apply as a Pilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Industries
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs?service=AGRICULTURAL_SPRAYING" className="hover:text-cyan-400 transition">
                  Agricultural Spraying
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=INFRASTRUCTURE_INSPECTION" className="hover:text-cyan-400 transition">
                  Infrastructure Inspection
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=REAL_ESTATE_MAPPING" className="hover:text-cyan-400 transition">
                  Real Estate & 3D Mapping
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=CONSTRUCTION_MONITORING" className="hover:text-cyan-400 transition">
                  Construction Monitoring
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=LAND_SURVEYING" className="hover:text-cyan-400 transition">
                  Land Surveying & LiDAR
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Compliance & Safety
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                FAA Part 107 Compliant
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Escrow Milestone Security
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                Verified Flight Logs & Reviews
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Certified Drone Pilots Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
            <Link href="/safety" className="hover:text-slate-400 transition">Aviation Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
