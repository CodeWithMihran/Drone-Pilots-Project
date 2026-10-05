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
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
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
    <div className="flex flex-col h-full bg-[#080e1e] border-r border-slate-800/80 p-4">
      {/* User Badge Info */}
      <div className="mb-6 p-3.5 rounded-2xl bg-[#0e1730] border border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 flex-shrink-0 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-cyan-300 text-sm">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {session?.user?.name || "User"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] font-bold text-cyan-400 tracking-wide uppercase">
                {role} ACCOUNT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-cyan-400" : "text-slate-400"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
            </Link>
          );
        })}
      </div>

      {/* Logout & Footer */}
      <div className="pt-4 border-t border-slate-800/80 mt-auto space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/20 transition"
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
      <aside className="hidden lg:block w-64 h-[calc(100vh-4rem)] sticky top-16 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-3.5 rounded-2xl bg-cyan-500 text-slate-950 shadow-xl shadow-cyan-500/30 font-bold flex items-center gap-2"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 h-full z-10 animate-fade-in">
            {sidebarContent}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
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
