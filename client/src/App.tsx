import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { useAuth } from "@/hooks/useAuth";

import Dashboard from "@/pages/dashboard";
import Assets from "@/pages/assets";
import AssetDetail from "@/pages/asset-detail";
import AssetHierarchy from "@/pages/asset-hierarchy";
import EnterpriseArchitecture from "@/pages/enterprise-architecture";

import Risks from "@/pages/risks";
import RiskLibrary from "@/pages/RiskLibrary";
import RiskDetailPage from "@/pages/RiskDetailPage";
import RiskResponses from "@/pages/risk-responses";
import Controls from "@/pages/controls";
import ControlLibrary from "@/pages/ControlLibrary";
import ControlDetailPage from "@/pages/ControlDetailPage";
import ControlROI from "@/pages/control-roi";
import ControlMappingManagerPage from "@/pages/ControlMappingManager";
import Responses from "@/pages/responses";
import Reports from "@/pages/reports";
import Integrations from "@/pages/integrations";
import LegalEntityPage from "@/pages/LegalEntityPage";
import CostModules from "@/pages/cost-modules";
import CostModuleDetail from "@/pages/CostModuleDetail";
import RiskCostMappingPage from "@/pages/RiskCostMappingPage";
import AdminPage from "@/pages/admin";
import LoginPage from "@/pages/login";
import ChangePasswordPage from "@/pages/change-password";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/layout";

function AuthenticatedRoutes() {
  return (
    <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/assets" component={Assets} />
        <Route path="/asset-hierarchy" component={AssetHierarchy} />
        <Route path="/assets/hierarchy" component={AssetHierarchy} />
        <Route path="/assets/enterprise-architecture" component={EnterpriseArchitecture} />

        <Route path="/assets/:assetId" component={AssetDetail} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/enterprise-architecture" component={EnterpriseArchitecture} />

        <Route path="/risks" component={Risks} />
        <Route path="/risk-library" component={RiskLibrary} />
        <Route path="/risks/templates" component={RiskLibrary} />
        <Route path="/risks/:id" component={RiskDetailPage} />
        <Route path="/risk-responses" component={RiskResponses} />
        <Route path="/controls" component={Controls} />
        <Route path="/control-library" component={ControlLibrary} />
        <Route path="/controls/:id" component={ControlDetailPage} />
        <Route path="/control-roi" component={ControlROI} />
        <Route path="/control-mappings" component={ControlMappingManagerPage} />
        <Route path="/responses" component={Responses} />
        <Route path="/reports" component={Reports} />
        <Route path="/integrations" component={Integrations} />
        <Route path="/legal-entities" component={LegalEntityPage} />
        <Route path="/legal-entities/:id" component={LegalEntityPage} />
        <Route path="/cost-modules/risk-mapping" component={RiskCostMappingPage} />
        <Route path="/cost-modules/:id" component={CostModuleDetail} />
        <Route path="/cost-modules" component={CostModules} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/change-password" component={ChangePasswordPage} />
        <Route component={NotFound} />
      </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route>
          <LoginPage />
        </Route>
      </Switch>
    );
  }

  return <AuthenticatedRoutes />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
