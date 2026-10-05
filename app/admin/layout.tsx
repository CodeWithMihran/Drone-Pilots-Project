import React from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-[#060b18] min-h-[calc(100vh-4rem)]">
      <DashboardSidebar role="ADMIN" />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
