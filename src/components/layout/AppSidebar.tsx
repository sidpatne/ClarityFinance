"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Target,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/expenses", icon: CreditCard, label: "Expenses" },
  { href: "/budgets", icon: Target, label: "Budgets" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {/* Placeholder for logo or app name in collapsed state if needed */}
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
           <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <span className="text-lg font-semibold">ClarityFinance</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard") || (pathname === "/" && item.href === "/dashboard")}
                tooltip={item.label}
                className={cn(
                  (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard") || (pathname === "/" && item.href === "/dashboard")) && "bg-sidebar-accent text-sidebar-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
         <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
                <Link href="#"> {/* Placeholder for settings page */}
                <Settings className="h-5 w-5" />
                <span>Settings</span>
                </Link>
            </SidebarMenuButton>
           </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
