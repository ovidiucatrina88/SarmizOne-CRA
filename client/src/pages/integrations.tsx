import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JiraIntegration } from "@/components/integrations/jira-integration";

export default function IntegrationsPage() {
  return (
    <Layout
      pageTitle="Integrations"
      pageIcon="INT"
      pageDescription="Connect and synchronize with external systems for automated risk management workflows"
    >
      <Tabs defaultValue="jira" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="jira">JIRA</TabsTrigger>
          {/* Add more integrations as tabs here */}
        </TabsList>
        
        <TabsContent value="jira">
          <JiraIntegration />
        </TabsContent>
        
        {/* Add more integration tabs content here */}
      </Tabs>
    
  );
}