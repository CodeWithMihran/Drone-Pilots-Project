"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Navigation,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  Building,
} from "lucide-react";
import { NotificationBell } from "../notifications/NotificationBell";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const role = (session?.user as any)?.role;

  const getDashboardLink = () => {
    if (role === "PILOT") return "/pilot/dashboard";
    if (role === "COMPANY") return "/company/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    return "/login";
  };

  const navLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Verified Pilots", href: "/pilots" },
    { name: "Industries", href: "/#services" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070c18]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Navigation className="w-5 h-5 text-cyan-400 transform -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              CERTIFIED DRONE PILOTS
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-cyan-400/90 uppercase -mt-0.5">
              Industrial Flight Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition ${
                pathname === link.href
                  ? "text-cyan-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Section: Auth & Notifications */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <NotificationBell />

              <Link
                href={getDashboardLink()}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 text-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-cyan-300">
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white max-w-[110px] truncate leading-none">
                      {session.user?.name || "Account"}
                    </p>
                    <span className="text-[10px] font-bold text-cyan-400 leading-tight">
                      {role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0b132b] border border-slate-700/70 shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-800/70">
                      <p className="text-xs font-semibold text-white">{session.user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{session.user?.email}</p>
                    </div>

                    <Link
                      href={getDashboardLink()}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                      Role Dashboard
                    </Link>

                    {role === "PILOT" && (
                      <Link
                        href="/pilot/certification"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        My Certifications
                      </Link>
                    )}

                    {role === "COMPANY" && (
                      <Link
                        href="/company/post-job"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                      >
                        <Briefcase className="w-4 h-4 text-cyan-400" />
                        Post New Job
                      </Link>
                    )}

                    <div className="border-t border-slate-800/70 my-1"></div>

                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {session && <NotificationBell />}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#070c18] px-4 py-4 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-slate-800 pt-3">
            {session ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-center text-sm font-semibold"
                >
                  Go to {role} Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full py-2 text-sm text-rose-400 text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-slate-800 text-center text-xs font-semibold text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-cyan-500 text-center text-xs font-bold text-slate-950"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
