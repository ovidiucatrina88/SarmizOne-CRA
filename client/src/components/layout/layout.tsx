import React, { useState, useEffect } from "react";
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
  DollarSign,
  LogOut,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Risk, Asset, Control } from "@shared/schema";

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

// Apply theme class to document root for CSS variable cascading
const applyThemeToDocument = (darkMode: boolean) => {
  if (typeof document !== 'undefined') {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }
};

export default function Layout({ children, pageTitle, pageDescription, pageIcon, pageActions }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or default to true
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : true;
    }
    return true;
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['Assets', 'Risks', 'Controls', 'Cost Modules', 'Admin']);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all data for search functionality
  const { data: risksData } = useQuery({
    queryKey: ["/api/risks"],
    enabled: searchQuery.length > 0
  });

  const { data: assetsData } = useQuery({
    queryKey: ["/api/assets"],
    enabled: searchQuery.length > 0
  });

  const { data: controlsData } = useQuery({
    queryKey: ["/api/controls"],
    enabled: searchQuery.length > 0
  });

  // Search functionality - similar to risks page
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search risks
    if (risksData && (risksData as any).data) {
      const risks = (risksData as any).data as Risk[];
      const filteredRisks = risks.filter(risk =>
        risk.name.toLowerCase().includes(searchLower) ||
        risk.riskId.toLowerCase().includes(searchLower) ||
        risk.description?.toLowerCase().includes(searchLower) ||
        risk.threatCommunity.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      filteredRisks.forEach(risk => {
        results.push({
          type: 'risk',
          id: risk.riskId,
          name: risk.name,
          description: `Risk ID: ${risk.riskId}`,
          severity: risk.severity,
          url: `/risks/${risk.riskId}`
        });
      });
    }

    // Search assets
    if (assetsData && (assetsData as any).data) {
      const assets = (assetsData as any).data as Asset[];
      const filteredAssets = assets.filter(asset =>
        asset.name.toLowerCase().includes(searchLower) ||
        asset.assetId.toLowerCase().includes(searchLower) ||
        asset.description?.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      filteredAssets.forEach(asset => {
        results.push({
          type: 'asset',
          id: asset.assetId,
          name: asset.name,
          description: `Asset ID: ${asset.assetId}`,
          assetType: asset.type,
          url: `/assets/${asset.assetId}`
        });
      });
    }

    // Search controls
    if (controlsData && (controlsData as any).data) {
      const controls = (controlsData as any).data as Control[];
      const filteredControls = controls.filter(control =>
        control.name.toLowerCase().includes(searchLower) ||
        control.controlId.toLowerCase().includes(searchLower) ||
        control.description?.toLowerCase().includes(searchLower)
      ).slice(0, 5);

      filteredControls.forEach(control => {
        results.push({
          type: 'control',
          id: control.controlId,
          name: control.name,
          description: `Control ID: ${control.controlId}`,
          status: control.implementationStatus,
          url: `/controls/${control.controlId}`
        });
      });
    }

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [searchQuery, risksData, assetsData, controlsData]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchResultClick = (url: string) => {
    setLocation(url);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.href = '/login';
    },
    onError: (error: Error) => {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Save dark mode preference to localStorage and apply theme whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      applyThemeToDocument(darkMode);
    }
  }, [darkMode]);

  // Apply theme on initial load
  useEffect(() => {
    applyThemeToDocument(darkMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => !prev);
  };

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
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pageTitle}</h1>
                {pageDescription && (
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{pageDescription}</p>
                )}
              </div>
            ) : (
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{getPageSubtitle()}</p>
            )}
          </div>
          
          {/* Global Search */}
          <div className="relative mx-6 flex-1 max-w-md">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input
                type="search"
                placeholder="Search risks, assets, controls..."
                className={`w-full pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'}`}
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className={`absolute top-full left-0 right-0 mt-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto`}>
                <div className={`p-3 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Search Results ({searchResults.length})
                  </h3>
                </div>
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSearchResultClick(result.url)}
                      className={`px-3 py-2 cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          result.type === 'risk' ? 'bg-red-100 text-red-600' :
                          result.type === 'asset' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {result.type === 'risk' && <AlertTriangle className="h-4 w-4" />}
                          {result.type === 'asset' && <Database className="h-4 w-4" />}
                          {result.type === 'control' && <Shield className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                            {result.name}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                            {result.description}
                          </p>
                          {result.severity && (
                            <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                              result.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              result.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              result.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {result.severity}
                            </span>
                          )}
                        </div>
                        <div className={`text-xs uppercase font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {result.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {pageActions}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className={`${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              {logoutMutation.isPending ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
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