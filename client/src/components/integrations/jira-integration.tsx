import React from "@/common/react-import";
import { useState } from "@/common/react-import";
import { zodResolver, useForm, z } from "@/common/react-import";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the schema for JIRA integration settings
const jiraSettingsSchema = z.object({
  host: z.string().min(1, "JIRA host is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().optional(),
  apiToken: z.string().optional(),
  projectKey: z.string().min(1, "Project key is required"),
  riskIssueType: z.string().optional(),
  useApiToken: z.boolean().default(true)
}).refine(data => {
  // Ensure either password or apiToken is provided
  if (data.useApiToken) {
    return !!data.apiToken;
  } else {
    return !!data.password;
  }
}, {
  message: "Either API token or password must be provided",
  path: ["apiToken"]
});

type JiraSettings = z.infer<typeof jiraSettingsSchema>;

export function JiraIntegration() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    imported: number;
    updated: number;
    errors: string[];
  } | null>(null);

  // Create form
  const form = useForm<JiraSettings>({
    resolver: zodResolver(jiraSettingsSchema),
    defaultValues: {
      host: "",
      username: "",
      password: "",
      apiToken: "",
      projectKey: "",
      riskIssueType: "Risk",
      useApiToken: true
    }
  });

  // Form submission handler
  const onSubmit = async (values: JiraSettings) => {
    setIsImporting(true);
    setImportResults(null);

    try {
      // Prepare the configuration
      const config = {
        host: values.host,
        username: values.username,
        password: values.useApiToken ? undefined : values.password,
        apiToken: values.useApiToken ? values.apiToken : undefined,
        projectKey: values.projectKey,
        riskIssueType: values.riskIssueType
      };

      // Call the API to import risks from JIRA
      const response = await apiRequest(
        'POST', 
        '/api/integrations/jira/import', 
        config
      );
      
      const result = await response.json() as {
        imported: number;
        updated: number;
        errors: string[];
      };

      setImportResults(result);

      // Show success toast
      const total = result.imported + result.updated;
      if (total > 0) {
        toast({
          title: "JIRA Import Successful",
          description: `Imported ${result.imported} new risks and updated ${result.updated} existing risks.`,
        });

        // Invalidate relevant queries to refresh the UI
        queryClient.invalidateQueries({ queryKey: ['/api/risks'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/summary'] });
      } else if (result.errors.length > 0) {
        toast({
          title: "JIRA Import Completed with Errors",
          description: `Import completed, but encountered ${result.errors.length} errors.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "JIRA Import Completed",
          description: "No new risks were found to import.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error("JIRA import error:", error);
      toast({
        title: "JIRA Import Failed",
        description: errorMessage || "An unexpected error occurred during the import.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>JIRA Integration</CardTitle>
        <CardDescription>
          Import risks from JIRA and map them to assets based on components. FAIR-U risk parameters will be set to default values and should be updated in the Risk Register after import.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JIRA Host</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your-domain.atlassian.net"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your JIRA domain without https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="your.email@company.com"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your JIRA account email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useApiToken"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Use API Token</FormLabel>
                      <FormDescription>
                        Recommended for JIRA Cloud instances
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("useApiToken") ? (
                <FormField
                  control={form.control}
                  name="apiToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Token</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your JIRA API token"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Create a token in your Atlassian account settings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your JIRA password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Only use for JIRA Server instances
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="projectKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="KEY"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The key of the JIRA project containing risks
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riskIssueType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Issue Type</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Risk"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The issue type used for risks in JIRA (e.g., Risk, Security)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                'Import Risks from JIRA'
              )}
            </Button>
          </form>
        </Form>

        {/* Import Results */}
        {importResults && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{importResults.imported}</div>
                <div className="text-sm">New Risks</div>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{importResults.updated}</div>
                <div className="text-sm">Updated Risks</div>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <div className="text-2xl font-bold">{importResults.errors.length}</div>
                <div className="text-sm">Errors</div>
              </div>
            </div>
            
            {(importResults.imported > 0 || importResults.updated > 0) && (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle>FAIR-U Parameters Update Required</AlertTitle>
                <AlertDescription>
                  The imported risks have been assigned default FAIR-U parameter values. Please review and update these values in the Risk Register to ensure accurate risk calculations.
                </AlertDescription>
              </Alert>
            )}

            {importResults.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Import Errors</AlertTitle>
                <AlertDescription>
                  <div className="max-h-40 overflow-y-auto">
                    <ul className="list-disc list-inside">
                      {importResults.errors.map((error, i) => (
                        <li key={i} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}