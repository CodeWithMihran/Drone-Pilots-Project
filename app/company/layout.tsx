import React from "react";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row bg-background text-foreground transition-colors min-h-[calc(100vh-4rem)]">
      <DashboardSidebar role="COMPANY" />
      <main className="flex-1 px-5 sm:px-8 lg:px-10 py-7 sm:py-9 overflow-y-auto max-w-[1440px] mx-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
