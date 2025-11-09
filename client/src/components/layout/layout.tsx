import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Shield,
  Building2,
  AlertTriangle,
  Settings,
  FileText,
  TrendingUp,
  Users,
  Database,
  Activity,
  Menu,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  {
    name: "Assets",
    href: "/assets",
    icon: Database,
    subItems: [
      { name: "Asset Inventory", href: "/assets" },
      { name: "Enterprise Architecture", href: "/assets/enterprise-architecture" },
      { name: "Vulnerabilities", href: "/assets/vulnerabilities" },
      { name: "Import Vulnerabilities", href: "/assets/vulnerabilities/import" },
    ],
  },
  { name: "Legal Entities", href: "/legal-entities", icon: Building2 },
  {
    name: "Risks",
    href: "/risks",
    icon: AlertTriangle,
    subItems: [
      { name: "Risk Register", href: "/risks" },
      { name: "Risk Library", href: "/risk-library" },
      { name: "Risk Responses", href: "/risk-responses" },
    ],
  },
  {
    name: "Controls",
    href: "/controls",
    icon: Shield,
    subItems: [
      { name: "My Controls", href: "/controls" },
      { name: "Control Library", href: "/control-library" },
      { name: "Control Mappings", href: "/control-mappings" },
    ],
  },
  { name: "Analyze", href: "/control-roi", icon: TrendingUp },
  {
    name: "Cost Modules",
    href: "/cost-modules",
    icon: DollarSign,
    subItems: [
      { name: "Module Library", href: "/cost-modules" },
      { name: "Risk-to-Cost Mapping", href: "/cost-modules/risk-mapping" },
    ],
  },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Integrations", href: "/integrations", icon: Settings },
  {
    name: "Admin",
    href: "/admin",
    icon: Users,
    subItems: [
      { name: "User Management", href: "/admin" },
      { name: "Change Password", href: "/change-password" },
    ],
  },
] as const;

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageIcon?: string | React.ReactNode;
  pageActions?: React.ReactNode;
}

export default function Layout({ children, pageTitle, pageDescription, pageActions }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/login";
    },
    onError: (error: Error) => {
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getPageSubtitle = () => {
    switch (location) {
      case "/":
        return "Overview of cybersecurity risks and controls";
      case "/assets":
        return "Manage your organization's asset inventory";
      case "/legal-entities":
        return "Manage legal entities across your organization";
      case "/risks":
        return "Track and quantify cybersecurity risks";
      case "/controls":
        return "Implement and monitor security controls";
      case "/control-roi":
        return "Analyze the effectiveness and financial impact of security controls";
      case "/responses":
        return "Define risk response strategies";
      case "/reports":
        return "Generate risk analysis reports";
      case "/integrations":
        return "Connect with external data sources and tools";
      default:
        if (location?.startsWith("/legal-entities/")) {
          return "View and manage legal entity information";
        }
        return "";
    }
  };

  const subtitle = pageDescription || getPageSubtitle();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "flex min-h-screen flex-col border-r border-white/5 bg-sidebar/90 text-sidebar-foreground shadow-[30px_0_90px_rgba(5,8,25,0.55)] backdrop-blur-xl transition-all duration-300",
            sidebarCollapsed ? "w-20" : "w-72",
          )}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/25 text-primary">
                <Activity className="h-6 w-6" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Safe One</p>
                  <p className="text-xl font-semibold text-white">Risk OS</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl border border-white/10"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {NAV_ITEMS.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isActive =
                location === item.href ||
                (hasSubItems && item.subItems!.some((sub) => location === sub.href || location?.startsWith(sub.href)));
              return (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-all duration-200",
                      sidebarCollapsed && "justify-center",
                      isActive
                        ? "bg-primary/20 text-white shadow-glow-primary"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white",
                    )}
                    title={sidebarCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn("h-5 w-5", !sidebarCollapsed && "shrink-0")} />
                    {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                  {!sidebarCollapsed && hasSubItems && (
                    <div className="mb-2 ml-6 space-y-1 border-l border-white/5 pl-4">
                      {item.subItems!.map((sub) => {
                        const subActive = location === sub.href || location?.startsWith(sub.href);
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={cn(
                              "flex items-center rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                              subActive ? "text-primary" : "text-muted-foreground hover:text-white",
                            )}
                          >
                            {sub.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="px-4 py-5 text-xs text-muted-foreground">
            <p className="font-semibold uppercase tracking-[0.35em] text-[0.55rem] text-muted-foreground">Status</p>
            <p className="mt-2 text-sm text-white/80">Connected to Risk Data Mesh · 2 active sessions</p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-white/5 bg-surface-muted/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-6 py-4">
              <div>
                {pageTitle ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Workspace</p>
                    <h1 className="mt-1 text-3xl font-semibold text-white">{pageTitle}</h1>
                    {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {pageActions}
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-white/10"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-white/10 md:hidden"
                  onClick={() => setSidebarCollapsed((prev) => !prev)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-full border border-white/10 px-4"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Logging out
                    </>
                  ) : (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto w-full max-w-[1600px] space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
