"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  User,
  ShieldCheck,
  Building2,
  Briefcase,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  // Handle clicking outside the profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = (session?.user as any)?.role;
  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated" && !!session?.user;

  const getDashboardLink = () => {
    if (role === "PILOT") return "/pilot/dashboard";
    if (role === "COMPANY") return "/company/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    return "/login";
  };

  const getRoleLabel = (r?: string) => {
    if (r === "PILOT") return "Commercial Pilot";
    if (r === "COMPANY") return "Enterprise Company";
    if (r === "ADMIN") return "System Administrator";
    return "Member";
  };

  const navLinks = [
    { name: "Find Pilots", href: "/pilots" },
    { name: "Browse Jobs", href: "/jobs" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "Why AeroLink", href: "/#services" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#faf8f5]/90 dark:bg-[#0d1117]/90 backdrop-blur-md transition-colors">
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

        {/* Right Section: Auth & Theme */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isLoading ? (
            /* Subtle skeleton placeholder to avoid flash of logged-out buttons during session check */
            <div className="h-9 w-32 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
          ) : isLoggedIn ? (
            /* Logged-in Header: Notification Bell + User Profile Avatar Pill */
            <div className="flex items-center gap-3">
              <NotificationBell />

              <div className="relative" ref={dropdownRef}>
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground transition-all shadow-xs cursor-pointer select-none"
                >
                  {/* User Profile Avatar */}
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-950 dark:bg-white text-[#fabf28] dark:text-zinc-950 flex items-center justify-center text-xs font-bold shrink-0">
                      {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}

                  {/* User Full Name */}
                  <span className="text-xs sm:text-sm font-semibold text-foreground max-w-[130px] sm:max-w-[170px] truncate">
                    {session.user?.name || "User"}
                  </span>

                  {/* Dropdown Arrow */}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                      profileDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#161b22] border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-fade-in text-foreground">
                    {/* User Info Header */}
                    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs font-semibold text-foreground truncate">{session.user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
                      <div className="mt-1.5">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </div>

                    {/* Role-Specific Navigation Options */}
                    <div className="py-1">
                      {/* For Pilot */}
                      {role === "PILOT" && (
                        <>
                          <Link
                            href="/pilot/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#fabf28]" />
                            Dashboard
                          </Link>
                          <Link
                            href="/pilot/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <User className="w-4 h-4 text-primary" />
                            Pilot Profile
                          </Link>
                          <Link
                            href="/pilot/certification"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            FAA Certifications
                          </Link>
                          <Link
                            href="/pilot/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                          </Link>
                        </>
                      )}

                      {/* For Company */}
                      {role === "COMPANY" && (
                        <>
                          <Link
                            href="/company/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#fabf28]" />
                            Dashboard
                          </Link>
                          <Link
                            href="/company/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-primary" />
                            Company Profile
                          </Link>
                          <Link
                            href="/company/jobs"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <Briefcase className="w-4 h-4 text-[#fabf28]" />
                            My Jobs
                          </Link>
                          <Link
                            href="/company/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                          </Link>
                        </>
                      )}

                      {/* For Admin */}
                      {role === "ADMIN" && (
                        <>
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#fabf28]" />
                            Admin Dashboard
                          </Link>
                          <Link
                            href="/admin/users"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <Users className="w-4 h-4 text-primary" />
                            User Management
                          </Link>
                          <Link
                            href="/admin/settings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Logged-out Header: Sign in + Get started with generous horizontal padding */
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-foreground hover:bg-black/[0.04] dark:hover:bg-white/[0.06] rounded-full transition-all whitespace-nowrap"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-2.5 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 text-xs sm:text-sm font-bold tracking-tight shadow-xs transition-all duration-150 active:scale-[0.98] whitespace-nowrap w-auto"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Header Bar */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {isLoggedIn && <NotificationBell />}
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
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-[#faf8f5] dark:bg-[#131720] px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          {/* User profile card in mobile drawer if logged in */}
          {isLoggedIn && (
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3 mb-3">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-950 dark:bg-white text-[#fabf28] dark:text-zinc-950 flex items-center justify-center text-xs font-bold shrink-0">
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{session.user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>
          )}

          {/* Standard Navigation Links */}

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

          {/* Role-specific Links or Auth Buttons */}
          <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-2">
            {isLoading ? (
              <div className="h-10 w-full rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex flex-col gap-1.5">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-xs transition-all active:scale-[0.98]"
                >
                  Go to Dashboard
                </Link>

                {role === "PILOT" && (
                  <Link
                    href="/pilot/certification"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground font-semibold text-xs"
                  >
                    FAA Certifications
                  </Link>
                )}

                {role === "COMPANY" && (
                  <Link
                    href="/company/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground font-semibold text-xs"
                  >
                    My Jobs
                  </Link>
                )}

                {role === "ADMIN" && (
                  <Link
                    href="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground font-semibold text-xs"
                  >
                    User Management
                  </Link>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-center py-2 rounded-full text-destructive font-semibold text-xs hover:bg-destructive/10 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 px-6 rounded-full bg-[#fabf28] hover:bg-[#e6ae22] text-zinc-950 font-bold text-xs tracking-tight shadow-xs transition-all active:scale-[0.98]"
                >
                  Get started
                </Link>

                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-foreground font-semibold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
