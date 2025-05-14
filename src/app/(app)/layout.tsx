
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Shapes,
  Target,
  BrainCircuit, // Or Sparkles
  Settings,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/AppLogo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/categories", label: "Categories", icon: Shapes },
  { href: "/budgets", label: "Budgets", icon: Target },
  { href: "/predictions", label: "AI Predictions", icon: BrainCircuit },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="p-0">
          <div className="flex items-center justify-between p-2">
             <AppLogo className="group-data-[collapsible=icon]:hidden" />
             <AppLogo showText={false} className="hidden group-data-[collapsible=icon]:block" />
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden md:flex" />
          </div>
        </SidebarHeader>
        <Separator className="bg-sidebar-border" />
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{children: item.label}}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator className="bg-sidebar-border" />
        <SidebarFooter>
           {/* Placeholder for settings or user profile button */}
           <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{children: "Settings (Coming Soon)"}} disabled>
                    <Settings />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-screen">
        <div className="flex items-center justify-start p-4 border-b md:hidden">
            <SidebarTrigger />
            <AppLogo showText={false} className="ml-2" />
            <h1 className="ml-2 text-lg font-semibold">SpendWise</h1>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
