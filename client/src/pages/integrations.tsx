import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JiraIntegration } from "@/components/integrations/jira-integration";
import { BackstageIntegration } from "@/components/integrations/backstage-integration";
import Layout from "@/components/layout/layout";
import { GlowCard } from "@/components/ui/glow-card";

export default function IntegrationsPage() {
  return (
    <Layout
      pageTitle="Integrations"
      pageIcon="INT"
      pageDescription="Connect and synchronize with external systems for automated risk management workflows"
    >
      <GlowCard className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Connections</p>
          <h3 className="text-lg font-semibold text-white">Integration Hub</h3>
        </div>
        <Tabs defaultValue="backstage" className="w-full">
          <TabsList className="mb-4 rounded-xl border border-white/10 bg-white/5 text-white">
            <TabsTrigger value="backstage" className="data-[state=active]:bg-white/10">Backstage</TabsTrigger>
            <TabsTrigger value="jira" className="data-[state=active]:bg-white/10">JIRA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="backstage">
            <BackstageIntegration />
          </TabsContent>
          
          <TabsContent value="jira">
            <JiraIntegration />
          </TabsContent>
        </Tabs>
      </GlowCard>
    </Layout>
  );
}
