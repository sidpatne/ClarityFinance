
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayoutClient({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col overflow-y-auto sm:pb-4 sm:pl-14 print:p-0 print:m-0 print:sm:pl-0">
        <AppHeader />
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 print:p-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
