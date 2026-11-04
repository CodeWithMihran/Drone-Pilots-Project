"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Clock, ShieldCheck, Briefcase, DollarSign, Star, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await fetch("/api/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case "APPLICATION":
        return <Briefcase className="w-4 h-4 text-[#fabf28]" />;
      case "PAYMENT":
        return <DollarSign className="w-4 h-4 text-emerald-500" />;
      case "REVIEW":
        return <Star className="w-4 h-4 text-[#fabf28]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-[#faf8f5] dark:bg-zinc-900 text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-all shadow-2xs focus-visible:outline-none"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#fabf28] text-[10px] font-bold text-zinc-950 shadow-2xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-3xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden animate-fade-in text-foreground">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 bg-[#faf8f5] dark:bg-zinc-900/60">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-tight uppercase text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#fabf28]/15 text-zinc-900 dark:text-[#fabf28] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                disabled={loading}
                className="text-xs text-[#fabf28] hover:underline flex items-center gap-1 font-semibold transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-xs">
                <Bell className="w-8 h-8 mx-auto mb-2 text-zinc-350 dark:text-zinc-650 opacity-40" />
                No new notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && markAsRead(n._id)}
                  className={`p-4 transition-colors cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/40 ${
                    !n.read ? "bg-[#fabf28]/5 dark:bg-[#fabf28]/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-[#faf8f5] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 mt-0.5 shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <p className={`text-xs ${!n.read ? "text-foreground font-bold" : "text-muted-foreground font-medium"}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 shrink-0 font-mono">
                          <Clock className="w-2.5 h-2.5" />
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed break-words">
                        {n.message}
                      </p>
                      {n.link && (
                        <Link
                          href={n.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-block mt-2 text-[11px] font-bold text-zinc-950 dark:text-[#fabf28] hover:underline"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#fabf28] shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
