"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "../notifications/NotificationBell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const role = (session?.user as any)?.role;

  const getDashboardLink = () => {
    if (role === "PILOT") return "/pilot/dashboard";
    if (role === "COMPANY") return "/company/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    return "/login";
  };

  const getRoleLabel = (r?: string) => {
    if (r === "PILOT") return "Commercial Pilot";
    if (r === "COMPANY") return "Enterprise Company";
    if (r === "ADMIN") return "Administrator";
    return "Member";
  };

  const navLinks = [
    { name: "Find Pilots", href: "/pilots" },
    { name: "Browse Jobs", href: "/jobs" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Why AeroLink", href: "/#services" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#faf8f5]/90 dark:bg-[#070709]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Logo size="sm" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-150",
                  isActive
                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Actions, Auth & Theme */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-2.5">
              <NotificationBell />

              <Link
                href="/company/post-job"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 text-xs font-bold tracking-tight shadow-xs transition-all active:scale-[0.98]"
              >
                <span>Post a brief</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>

              <Button asChild variant="secondary" size="sm" className="rounded-full text-xs font-semibold h-9 px-4 border border-zinc-200 dark:border-zinc-800">
                <Link href={getDashboardLink()} className="gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              </Button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-colors shadow-2xs"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-950 text-[#fabf28] flex items-center justify-center text-xs font-bold">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-fade-in text-foreground">
                    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-foreground">{session.user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#fabf28]" />
                      Dashboard
                    </Link>

                    {role === "PILOT" && (
                      <Link
                        href="/pilot/certification"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        FAA Certifications
                      </Link>
                    )}

                    {role === "COMPANY" && (
                      <Link
                        href="/company/post-job"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-[#fabf28]" />
                        Post a Brief
                      </Link>
                    )}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-xs font-semibold px-4 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]">
                <Link href="/login">Sign In</Link>
              </Button>
              <Link
                href="/company/post-job"
                className="group inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-xs transition-all active:scale-[0.98]"
              >
                <span>Post a brief</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {session && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-[#faf8f5] dark:bg-[#0c0c0e] px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-2">
            <Link
              href="/company/post-job"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-full bg-[#fabf28] text-zinc-950 font-bold text-xs shadow-xs"
            >
              Post a brief ↗
            </Link>

            {!session && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground font-semibold text-xs"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
