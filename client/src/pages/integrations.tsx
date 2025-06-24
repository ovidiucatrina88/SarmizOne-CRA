import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JiraIntegration } from "@/components/integrations/jira-integration";
import { BackstageIntegration } from "@/components/integrations/backstage-integration";
import Layout from "@/components/layout/layout";

export default function IntegrationsPage() {
  return (
    <Layout
      pageTitle="Integrations"
      pageIcon="INT"
      pageDescription="Connect and synchronize with external systems for automated risk management workflows"
    >
      <Tabs defaultValue="backstage" className="w-full">
        <TabsList className="mb-4 bg-gray-700">
          <TabsTrigger value="backstage" className="data-[state=active]:bg-gray-600 text-white">
            Backstage
          </TabsTrigger>
          <TabsTrigger value="jira" className="data-[state=active]:bg-gray-600 text-white">
            JIRA
          </TabsTrigger>
          {/* Add more integrations as tabs here */}
        </TabsList>
        
        <TabsContent value="backstage">
          <BackstageIntegration />
        </TabsContent>
        
        <TabsContent value="jira">
          <JiraIntegration />
        </TabsContent>
        
        {/* Add more integration tabs content here */}
      </Tabs>
    </Layout>
  );
}