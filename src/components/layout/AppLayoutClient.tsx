"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayoutClient({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <SidebarInset className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 print:p-0 print:m-0 print:sm:pl-0">
          <AppHeader />
          <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 print:p-0">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
