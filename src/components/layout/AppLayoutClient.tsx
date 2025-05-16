
"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayoutClient({ children }: { children: ReactNode }) {
  // AppHeader is h-16, which is 4rem. Tailwind class pt-16 corresponds to this.
  return (
    <SidebarProvider defaultOpen={false} className="pt-16 bg-muted/40">
      <AppHeader /> {/* Moved AppHeader to be sticky at the top of the viewport */}
      
      {/* AppSidebar and SidebarInset are children of SidebarProvider's internal flex wrapper,
          which now has pt-16, so they start below the AppHeader. */}
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col overflow-y-auto sm:pb-4 sm:pl-14 print:p-0 print:m-0 print:sm:pl-0">
        {/* AppHeader removed from here */}
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 print:p-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
