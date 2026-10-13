import React from "react";
import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface text-muted-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm leading-relaxed max-w-sm text-muted-foreground">
              A specialized operations marketplace connecting verified, Part 107 commercial drone pilots with industrial teams in agriculture, energy, infrastructure, and surveying.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-control">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              100% Admin Verified Pilot Credentials
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-foreground transition-colors">
                  Browse Missions
                </Link>
              </li>
              <li>
                <Link href="/pilots" className="hover:text-foreground transition-colors">
                  Find Verified Pilots
                </Link>
              </li>
              <li>
                <Link href="/company/post-job" className="hover:text-foreground transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/register?role=PILOT" className="hover:text-foreground transition-colors">
                  Apply as a Pilot
                </Link>
              </li>
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Sectors
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs?service=AGRICULTURAL_SPRAYING" className="hover:text-foreground transition-colors">
                  Agricultural Spraying
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=INFRASTRUCTURE_INSPECTION" className="hover:text-foreground transition-colors">
                  Infrastructure Inspection
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=REAL_ESTATE_MAPPING" className="hover:text-foreground transition-colors">
                  3D Orthomosaic Mapping
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=CONSTRUCTION_MONITORING" className="hover:text-foreground transition-colors">
                  Construction Monitoring
                </Link>
              </li>
              <li>
                <Link href="/jobs?service=LAND_SURVEYING" className="hover:text-foreground transition-colors">
                  Land Surveying & LiDAR
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">
              Operational Standards
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>FAA Part 107 Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>COI Liability Insurance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Escrow Milestone Security</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Verified Telemetry Logs</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-subtle">
          <p>© {new Date().getFullYear()} Aether — Certified Drone Pilots. Operations-grade flight network.</p>
          <div className="flex gap-6">
            <Link href="/jobs" className="hover:text-foreground transition-colors">Open Marketplace</Link>
            <Link href="/pilots" className="hover:text-foreground transition-colors">Certified Roster</Link>
            <Link href="/#how-it-works" className="hover:text-foreground transition-colors">Workflow</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
