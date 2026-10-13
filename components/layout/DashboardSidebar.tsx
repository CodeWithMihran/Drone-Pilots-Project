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
} from "lucide-react";

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
    <div className="flex flex-col h-full bg-surface border-r border-border p-4 transition-colors">
      {/* User Badge Info */}
      <div className="mb-6 p-3 rounded-panel bg-surface-2 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-control bg-primary/15 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">
              {session?.user?.name || "User"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-success"></span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {role === "PILOT" ? "Pilot" : role === "COMPANY" ? "Company" : "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-subtle">
          Workspace
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== `/${role.toLowerCase()}/dashboard` && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-control text-xs font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary" />}
            </Link>
          );
        })}
      </div>

      {/* Logout & Footer */}
      <div className="pt-4 border-t border-border mt-auto space-y-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-control text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
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

      {/* Mobile Drawer Trigger */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg font-semibold flex items-center gap-2"
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
