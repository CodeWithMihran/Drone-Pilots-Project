"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Briefcase,
  FileCheck2,
  DollarSign,
  ShieldCheck,
  Star,
  User,
  Settings,
  LogOut,
  PlusCircle,
  Users,
  Building,
  BarChart3,
  Menu,
  X,
  Compass,
  Clock,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export function DashboardSidebar({ role }: { role: "PILOT" | "COMPANY" | "ADMIN" }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pilotNav: NavItem[] = [
    { name: "Dashboard", href: "/pilot/dashboard", icon: LayoutDashboard },
    { name: "Find Jobs", href: "/pilot/jobs", icon: Compass },
    { name: "My Applications", href: "/pilot/applications", icon: FileCheck2 },
    { name: "Active Projects", href: "/pilot/active-jobs", icon: Clock },
    { name: "Earnings & Payouts", href: "/pilot/earnings", icon: DollarSign },
    { name: "Certification", href: "/pilot/certification", icon: ShieldCheck },
    { name: "Reviews", href: "/pilot/reviews", icon: Star },
    { name: "Pilot Profile", href: "/pilot/profile", icon: User },
    { name: "Settings", href: "/pilot/settings", icon: Settings },
  ];

  const companyNav: NavItem[] = [
    { name: "Dashboard", href: "/company/dashboard", icon: LayoutDashboard },
    { name: "Post New Job", href: "/company/post-job", icon: PlusCircle },
    { name: "My Jobs", href: "/company/jobs", icon: Briefcase },
    { name: "Applications", href: "/company/applications", icon: FileCheck2 },
    { name: "Verified Pilots", href: "/company/pilots", icon: Users },
    { name: "Reviews", href: "/company/reviews", icon: Star },
    { name: "Company Profile", href: "/company/profile", icon: Building },
    { name: "Settings", href: "/company/settings", icon: Settings },
  ];

  const adminNav: NavItem[] = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Pilot Verifications", href: "/admin/certifications", icon: ShieldCheck },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Pilots Directory", href: "/admin/pilots", icon: User },
    { name: "Companies", href: "/admin/companies", icon: Building },
    { name: "All Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Platform Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Admin Settings", href: "/admin/settings", icon: Settings },
  ];

  const items = role === "PILOT" ? pilotNav : role === "COMPANY" ? companyNav : adminNav;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/70 dark:bg-[#0d1117] border-r border-border/80 dark:border-zinc-800 p-5 sm:p-6 transition-colors">
      {/* User Badge Info Card */}
      <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-[#161b22] border border-border/80 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-950 dark:bg-zinc-800 text-[#fabf28] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {session?.user?.name || "User"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fabf28]" />
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {role === "PILOT" ? "Commercial Pilot" : role === "COMPANY" ? "Enterprise Client" : "Administrator"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">
          WORKSPACE
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== `/${role.toLowerCase()}/dashboard` && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive
                      ? "text-[#fabf28] dark:text-zinc-950"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </Link>
          );
        })}
      </div>

      {/* Quick Action Button for Company (Post a brief) */}
      {role === "COMPANY" && (
        <div className="pt-3 pb-2">
          <Link
            href="/company/post-job"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 text-xs font-bold shadow-xs transition-all active:scale-[0.98]"
          >
            <span>Post a Mission</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Logout & Footer */}
      <div className="pt-4 border-t border-border/80 dark:border-zinc-800/80 mt-auto space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-68 h-[calc(100vh-4rem)] sticky top-16 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-3 rounded-full bg-[#fabf28] text-zinc-950 shadow-lg font-bold flex items-center gap-2 active:scale-95 transition-transform"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs pr-1">Menu</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 h-full z-10 animate-fade-in shadow-2xl">
            {sidebarContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardSidebar;
