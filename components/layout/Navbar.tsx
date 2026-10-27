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
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide navbar on scroll down, reveal on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Always show near the very top of the page
      if (currentScrollY <= 40) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Small threshold to prevent jitter on trackpads
      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) < 8) return;

      if (diff > 0 && currentScrollY > 64) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
        setProfileDropdownOpen(false);
      } else if (diff < 0) {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ensure navbar is visible and menus closed on route navigation
  useEffect(() => {
    setIsVisible(true);
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
    if (r === "ADMIN") return "System Administrator";
    return "Member";
  };

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Verified Pilots", href: "/pilots" },
    { name: "Industries", href: "/#services" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border dark:border-zinc-800/80 bg-background/85 dark:bg-black/80 backdrop-blur-xl transition-transform duration-300 ease-in-out",
        isVisible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Logo size="sm" />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Toggle, Auth & Notifications */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-2.5">
              <NotificationBell />

              <Button asChild variant="secondary" size="sm">
                <Link href={getDashboardLink()} className="gap-1.5 text-xs font-semibold">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              </Button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-control border border-border bg-surface hover:bg-surface-2 text-foreground transition-colors"
                >
                  <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left hidden lg:block pr-1">
                    <p className="text-xs font-semibold text-foreground max-w-[110px] truncate leading-none">
                      {session.user?.name || "Account"}
                    </p>
                    <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                      {role === "PILOT" ? "Pilot" : role === "COMPANY" ? "Company" : "Admin"}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-panel bg-surface border border-border shadow-xl py-2 z-50 animate-fade-in text-foreground">
                    <div className="px-4 py-2.5 border-b border-border">
                      <p className="text-xs font-semibold text-foreground">{session.user?.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{session.user?.email}</p>
                      <div className="mt-1">
                        <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-surface-2 text-muted-foreground border border-border">
                          {getRoleLabel(role)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      Role Dashboard
                    </Link>

                    {role === "PILOT" && (
                      <Link
                        href="/pilot/certification"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-success" />
                        FAA Certifications
                      </Link>
                    )}

                    {role === "COMPANY" && (
                      <Link
                        href="/company/post-job"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-primary" />
                        Post a Job
                      </Link>
                    )}

                    <div className="border-t border-border my-1"></div>

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
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild variant="primary" size="sm">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {session && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-control border border-border bg-surface text-foreground hover:bg-surface-2"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3 animate-fade-in shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-border pt-3">
            {session ? (
              <div className="space-y-2">
                <Button asChild variant="secondary" block size="md">
                  <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                    Go to {role === "PILOT" ? "Pilot" : role === "COMPANY" ? "Company" : "Admin"} Dashboard
                  </Link>
                </Button>
                <Button
                  variant="danger"
                  block
                  size="md"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="secondary" block size="md">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="primary" block size="md">
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
