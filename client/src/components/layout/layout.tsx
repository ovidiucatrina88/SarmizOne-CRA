import { useState } from "react";
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
  ChevronDown,
  ChevronUp,
  DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: BarChart3,
    subItems: []
  },
  { 
    name: "Assets", 
    href: "/assets", 
    icon: Database,
    subItems: [
      { name: "Asset Inventory", href: "/assets" },
      { name: "Asset Hierarchy", href: "/assets/hierarchy" },
      { name: "Enterprise Architecture", href: "/assets/enterprise-architecture" },
      { name: "Vulnerabilities", href: "/assets/vulnerabilities" },
      { name: "Import Vulnerabilities", href: "/assets/vulnerabilities/import" }
    ]
  },
  { 
    name: "Legal Entities", 
    href: "/legal-entities", 
    icon: Building2,
    subItems: []
  },
  { 
    name: "Risks", 
    href: "/risks", 
    icon: AlertTriangle,
    subItems: [
      { name: "Risk Register", href: "/risks" },
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
    icon: TrendingUp,
    subItems: []
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
    icon: FileText,
    subItems: []
  },
  { 
    name: "Integrations", 
    href: "/integrations", 
    icon: Settings,
    subItems: []
  },
  { 
    name: "Admin", 
    href: "/admin", 
    icon: Users,
    subItems: [
      { name: "User Management", href: "/admin" },
      { name: "Change Password", href: "/change-password" }
    ]
  }
];

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageIcon?: string | React.ReactNode;
  pageActions?: React.ReactNode;
}

export default function Layout({ children, pageTitle, pageDescription, pageIcon, pageActions }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(['Assets', 'Risks', 'Controls', 'Cost Modules', 'Admin']);

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    );
  };

  // Get page subtitle based on current route
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

  return (
    <div className={`h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-all duration-300`}>
        {/* Header */}
        <div className={`${sidebarCollapsed ? 'p-4' : 'p-6'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          {!sidebarCollapsed && (
            <>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>CyberSec Risk</h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Risk Management Platform</p>
            </>
          )}
          {sidebarCollapsed && (
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedSections.includes(item.name);
              const isMainActive = location === item.href;
              const isSubActive = hasSubItems && item.subItems.some(sub => location === sub.href || (sub.href !== "/" && location.startsWith(sub.href)));
              const isActive = isMainActive || isSubActive;
              
              return (
                <div key={item.name}>
                  {/* Main menu item */}
                  <div className="flex items-center">
                    <Link href={item.href} className="flex-1">
                      <div
                        className={`flex items-center ${sidebarCollapsed ? 'px-3 py-3 justify-center' : 'px-3 py-2'} text-sm font-medium rounded-lg transition-all duration-200 group ${
                          isActive
                            ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'}`
                            : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <item.icon className={`${sidebarCollapsed ? 'h-6 w-6' : 'mr-3 h-5 w-5'} transition-all`} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {hasSubItems && (
                              <div 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleSection(item.name);
                                }}
                                className="ml-2 p-1 rounded hover:bg-gray-600 transition-colors"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                  </div>
                  
                  {/* Sub menu items */}
                  {hasSubItems && isExpanded && !sidebarCollapsed && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubItemActive = location === subItem.href || 
                          (subItem.href !== "/" && location.startsWith(subItem.href));
                        
                        return (
                          <Link key={subItem.name} href={subItem.href}>
                            <div
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                                isSubItemActive
                                  ? `${darkMode ? 'bg-blue-500 text-white' : 'bg-blue-500 text-white'}`
                                  : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`
                              }`}
                            >
                              <span className="ml-3">{subItem.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Toggle Button */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full ${sidebarCollapsed ? 'px-0' : ''} ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="mr-2 h-5 w-5" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
          <div className="flex-1">
            {pageTitle ? (
              <div className="flex items-center space-x-3">
                {pageIcon && (
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                    {typeof pageIcon === 'string' ? (
                      <span className="text-white text-sm font-bold">{pageIcon}</span>
                    ) : (
                      <div className="text-white w-5 h-5">{pageIcon}</div>
                    )}
                  </div>
                )}
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                  {pageDescription && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{pageDescription}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getPageSubtitle()}</p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {pageActions}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={`${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {darkMode ? (
                <>
                  <Sun className="mr-2 h-5 w-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-5 w-5" />
                  Dark Mode
                </>
              )}
            </Button>
          </div>
        </div>
        
        <main className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}