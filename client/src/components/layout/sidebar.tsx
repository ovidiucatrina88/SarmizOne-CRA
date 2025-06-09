import { useLocation, Link } from "wouter";
import {
  Home,
  SquareStack,
  AlertTriangle,
  Shield,
  LineChart,
  FileBarChart,
  Plug,
  Building2,
  BookMarked,
  DollarSign,
  BarChart,
  LayoutDashboard,
  Bug,
  Wrench
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { 
      name: "Dashboard", 
      href: "/", 
      icon: LayoutDashboard 
    },
    { 
      name: "Assets", 
      href: "/assets", 
      icon: SquareStack,
      subItems: [
        { name: "Asset Inventory", href: "/assets" },
        { name: "Enterprise Architecture", href: "/enterprise-architecture" },
        { name: "Vulnerabilities", href: "/vulnerabilities" }
      ]
    },
    { 
      name: "Risks", 
      href: "/risks", 
      icon: AlertTriangle,
      subItems: [
        { name: "My Risks", href: "/risks" },
        { name: "Risk Library", href: "/risk-library" },
        { name: "Risk Responses", href: "/risk-responses" }
      ]
    },
    { 
      name: "Controls", 
      href: "/controls", 
      icon: Shield,
      subItems: [
        { name: "My Controls", href: "/controls" },
        { name: "Control Library", href: "/control-library" }
      ]
    },
    { 
      name: "Analyze", 
      href: "/control-roi", 
      icon: BarChart,
      subItems: [
        { name: "Control ROI", href: "/control-roi" }
      ]
    },
    { 
      name: "Cost Modules", 
      href: "/cost-modules", 
      icon: DollarSign,
      subItems: [
        { name: "Module Library", href: "/cost-modules" },
        { name: "Risk-to-Cost Mapping", href: "/cost-modules/risk-mapping" }
      ]
    },
    { 
      name: "Reports", 
      href: "/reports", 
      icon: FileBarChart 
    },
    { 
      name: "Legal Entities", 
      href: "/legal-entities", 
      icon: Building2
    },
    { 
      name: "Admin", 
      href: "/admin", 
      icon: Wrench,
      subItems: [
        { name: "Integrations", href: "/integrations" }
      ]
    },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border shadow-lg h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary">
        <span className="text-xl font-semibold text-primary-foreground">RiskQuantify</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location === item.href || 
                          (item.subItems && item.subItems.some(sub => location === sub.href));
          const Icon = item.icon;
          
          return (
            <div key={item.name} className="space-y-1">
              <Link
                href={item.href}
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "text-primary-foreground bg-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-primary-foreground" : ""}`} />
                {item.name}
              </Link>
              
              {/* Show subitems if they exist and parent is active */}
              {item.subItems && isActive && (
                <div className="ml-8 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = location === subItem.href;
                    
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center px-2 py-1 text-xs font-medium rounded-md ${
                          isSubActive
                            ? "text-primary bg-accent/30"
                            : "text-muted-foreground hover:bg-muted/30"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
