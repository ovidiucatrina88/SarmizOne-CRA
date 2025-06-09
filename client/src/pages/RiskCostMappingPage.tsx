import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  BarChart, 
  AlertTriangle, 
  Building2, 
  ArrowRight,
  Search,
  RefreshCw,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  Treemap
} from 'recharts';
import { LegalEntityCostMatrix } from "@/components/legal-entity/legal-entity-cost-matrix";

export default function RiskCostMappingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all data at component level
  const { data: risksResponse, isLoading: isLoadingRisks } = useQuery({
    queryKey: ['/api/risks'],
  });
  
  const { data: costModulesResponse, isLoading: isLoadingModules } = useQuery({
    queryKey: ['/api/cost-modules'],
  });
  
  const { data: riskCostsResponse, isLoading: isLoadingCosts, refetch: refetchCosts } = useQuery({
    queryKey: ['/api/risk-costs/calculate/all'],
  });
  
  const { data: legalEntitiesResponse, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['/api/legal-entities'],
  });
  
  const { data: assetsResponse, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['/api/assets'],
  });
  
  // Extract normalized data from API responses
  const risks = Array.isArray(risksResponse?.data) 
    ? risksResponse.data 
    : [];
                
  const costModules = Array.isArray(costModulesResponse?.data) 
    ? costModulesResponse.data.map((module: any) => ({
        ...module,
        // Normalize field names for consistency in the UI
        cisControl: module.cis_control || module.cisControl || [],
        costFactor: module.cost_factor || module.costFactor || 0,
        costType: module.cost_type || module.costType || 'fixed'
      }))
    : [];
    
  const legalEntities = Array.isArray(legalEntitiesResponse?.data) 
    ? legalEntitiesResponse.data 
    : [];
    
  const assets = Array.isArray(assetsResponse?.data) 
    ? assetsResponse.data 
    : [];
  
  // Helper function to get chart data from risk costs
  const getChartData = () => {
    // Get calculated risk costs data
    const calculatedCosts = Array.isArray(riskCostsResponse?.data) 
      ? riskCostsResponse.data 
      : [];
      
    // Create a map to hold totals by module type
    const moduleTypeCostMap = new Map();
    
    // Ensure we have cost modules data
    if (Array.isArray(costModules)) {
      // Find all unique module types
      const moduleTypes = costModules
        .map(module => module.moduleType)
        .filter((value, index, self) => self.indexOf(value) === index);
      
      // Initialize the map with zero values
      moduleTypes.forEach(type => {
        if (type) moduleTypeCostMap.set(type, 0);
      });
      
      // Sum up costs for each module type
      calculatedCosts.forEach((riskCost: any) => {
        if (riskCost.costModules && Array.isArray(riskCost.costModules)) {
          riskCost.costModules.forEach((costModule: any) => {
            const moduleType = costModules.find(m => m.id === costModule.moduleId)?.moduleType;
            if (moduleType) {
              const currentTotal = moduleTypeCostMap.get(moduleType) || 0;
              const weight = costModule.weight || 1;
              const value = costModule.value || 0;
              moduleTypeCostMap.set(moduleType, currentTotal + (value * weight));
            }
          });
        }
      });
    }
    
    // Convert map to chart data format
    return Array.from(moduleTypeCostMap.entries()).map(([type, value]) => ({
      name: type || 'Unknown',
      value: Number(value) || 0
    }));
  };
  
  // Helper function to get color for module type
  const getModuleColor = (type: string) => {
    const colors: {[key: string]: string} = {
      'regulatory': '#8884d8',
      'direct': '#82ca9d',
      'operational': '#ffc658',
      'reputational': '#ff8042',
      'legal': '#0088fe',
      'productivity': '#00C49F',
      'recovery': '#FFBB28',
      'response': '#FF8042'
    };
    
    return colors[type.toLowerCase()] || '#8884d8';
  };
  
  // Columns for the risks table
  const riskColumns = [
    {
      accessorKey: "riskId",
      header: "Risk ID",
      cell: ({ row }: any) => (
        <div className="font-medium">{row.original.riskId}</div>
      ),
    },
    {
      accessorKey: "name",
      header: "Risk Name",
      cell: ({ row }: any) => (
        <div className="max-w-[300px] truncate">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "severity",
      header: "Severity",
      cell: ({ row }: any) => {
        const severity = row.original.severity || "medium";
        let colorClass = "bg-yellow-100 text-yellow-800";
        
        if (severity === "high") {
          colorClass = "bg-red-100 text-red-800";
        } else if (severity === "low") {
          colorClass = "bg-green-100 text-green-800";
        }
        
        return (
          <div className={`inline-block px-2 py-1 rounded-md text-xs font-medium capitalize ${colorClass}`}>
            {severity}
          </div>
        );
      },
    },
    {
      accessorKey: "costImpact",
      header: "Cost Impact",
      cell: ({ row }: any) => {
        // Find cost impact for this risk by checking both riskId (string) and id (number)
        const costData = Array.isArray(riskCostsResponse?.data) 
          ? riskCostsResponse.data.find((cost: any) => 
              cost.riskId === row.original.riskId || 
              cost.id === row.original.id
            ) 
          : null;
        
        const totalCost = costData ? (costData.totalCost || costData.costImpact || 0) : 0;
        
        // Format based on cost magnitude
        let colorClass = "text-gray-500";
        if (totalCost > 500000) {
          colorClass = "text-red-600 font-bold";
        } else if (totalCost > 100000) {
          colorClass = "text-yellow-600 font-semibold";
        } else if (totalCost > 0) {
          colorClass = "text-green-600";
        }
        
        return (
          <div className={colorClass}>
            {totalCost > 0 ? formatCurrency(totalCost) : "Not mapped"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link href={`/risks/${row.original.id}`}>
                <ArrowRight className="h-4 w-4 mr-1" />
                Details
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link href={`/risks/${row.original.id}?tab=costs`}>
                <DollarSign className="h-4 w-4 mr-1" />
                Cost Mapping
              </Link>
            </Button>
          </div>
        );
      },
    }
  ];
  
  // Columns for the cost modules table
  const moduleColumns = [
    {
      accessorKey: "name",
      header: "Module Name",
    },
    {
      accessorKey: "costType",
      header: "Cost Type",
      cell: ({ row }: any) => {
        const costType = row.original.costType;
        
        // Map to display text
        const typeMap: {[key: string]: string} = {
          fixed: "Fixed Cost",
          per_event: "Per Event",
          per_hour: "Per Hour",
          percentage: "Percentage",
        };
        
        const typeDisplay = typeMap[costType] || costType;
        
        return <div className="capitalize">{typeDisplay}</div>;
      },
    },
    {
      accessorKey: "costFactor",
      header: "Cost Factor",
      cell: ({ row }: any) => {
        const { costType, costFactor } = row.original;
        
        if (costType === "percentage") {
          return <div>{(costFactor * 100).toFixed(2)}%</div>;
        }
        
        return <div>{formatCurrency(costFactor)}</div>;
      },
    },
    {
      accessorKey: "cisControl",
      header: "CIS Controls",
      cell: ({ row }: any) => {
        const controls = row.original.cisControl || [];
        
        if (!controls.length) {
          return <div className="text-muted-foreground">-</div>;
        }
        
        return (
          <div className="flex flex-wrap gap-1">
            {controls.slice(0, 3).map((control: string) => (
              <span 
                key={control} 
                className="inline-block px-2 py-1 bg-accent text-xs rounded-sm"
              >
                {control}
              </span>
            ))}
            {controls.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{controls.length - 3} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link href={`/cost-modules/${row.original.id}`}>
                <ArrowRight className="h-4 w-4 mr-1" />
                Details
              </Link>
            </Button>
          </div>
        );
      },
    }
  ];
  
  // Filter risks based on search term
  const filteredRisks = Array.isArray(risks) 
    ? risks.filter((risk: any) => 
        risk.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        risk.riskId?.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];
  
  // Get the chart data
  const chartData = getChartData();
  
  return (
    
      <div className="container px-4 py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Risk-to-Cost Mapping</h1>
          <p className="text-muted-foreground mt-1">
            Assign cost modules to risks with materiality weights for FAIR-MAM financial impact calculations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => refetchCosts()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalculate Costs
          </Button>
          <Button asChild>
            <Link href="/cost-modules/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Module
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search risks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="risks">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Risks
          </TabsTrigger>
          <TabsTrigger value="modules">
            <DollarSign className="h-4 w-4 mr-2" />
            Cost Modules
          </TabsTrigger>
          <TabsTrigger value="matrix">
            <Building2 className="h-4 w-4 mr-2" />
            Legal Entity Matrix
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <BarChart className="h-4 w-4 mr-2" />
            Cost Breakdown
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="risks">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-2 bg-gray-700 border-b border-gray-600">
              <CardTitle className="text-white">Risk Cost Impact</CardTitle>
              <CardDescription className="text-gray-300">
                Assign cost modules to risks to calculate materiality-weighted financial impact
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={riskColumns}
                data={filteredRisks}
                isLoading={isLoadingRisks || isLoadingCosts}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="modules">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-2 bg-gray-700 border-b border-gray-600">
              <CardTitle className="text-white">Cost Module Library</CardTitle>
              <CardDescription className="text-gray-300">
                Manage cost modules that can be assigned to risks
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <DataTable
                columns={moduleColumns}
                data={costModules}
                isLoading={isLoadingModules}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="matrix">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-2 bg-gray-700 border-b border-gray-600">
              <CardTitle className="text-white">Legal Entity Cost Matrix</CardTitle>
              <CardDescription className="text-gray-300">
                Materiality heatmap showing cost exposure by legal entity and module type
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <LegalEntityCostMatrix 
                risks={risks}
                assets={assets}
                legalEntities={legalEntities}
                riskCosts={riskCostsResponse?.data || []}
                isLoading={isLoadingCosts || isLoadingEntities || isLoadingAssets}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <Card className="bg-gray-800 border-gray-600">
            <CardHeader className="pb-2 bg-gray-700 border-b border-gray-600">
              <CardTitle className="text-white">Cost Breakdown by Module Type</CardTitle>
              <CardDescription className="text-gray-300">
                Visualize risk cost distribution across different impact categories
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoadingCosts ? (
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto text-muted-foreground animate-pulse" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading cost data...</p>
                  </div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">No Cost Data Available</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Assign costs to risks to view this visualization
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={350}>
                    <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => 
                          value >= 1000000 
                            ? `$${(value / 1000000).toFixed(1)}M` 
                            : value >= 1000 
                              ? `$${(value / 1000).toFixed(1)}K` 
                              : `$${value}`
                        } 
                      />
                      <RechartsTooltip 
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Cost Impact']}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Cost Impact">
                        {chartData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getModuleColor(entry.name)} 
                          />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                  
                  <div className="pt-4 border-t border-gray-600">
                    <h3 className="text-lg font-medium mb-4 text-white">Module Cost Distribution</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                          data={chartData}
                          dataKey="value"
                          ratio={4/3}
                          stroke="#fff"
                          nameKey="name"
                        >
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`treemap-cell-${index}`} 
                              fill={getModuleColor(entry.name)} 
                              name={entry.name}
                            />
                          ))}
                        </Treemap>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-600">
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-white">Cost Module Breakdown</h3>
                      <div className="space-y-2">
                        {chartData
                          .sort((a, b) => b.value - a.value)
                          .map((entry, index) => (
                            <div 
                              key={`breakdown-${index}`} 
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2" 
                                  style={{ backgroundColor: getModuleColor(entry.name) }}
                                />
                                <span className="capitalize text-gray-300">{entry.name}</span>
                              </div>
                              <div className="font-medium text-white">
                                {formatCurrency(entry.value)}
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4 text-white">Cost Percentage</h3>
                      <div className="space-y-2">
                        {(() => {
                          const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
                          
                          return chartData
                            .sort((a, b) => b.value - a.value)
                            .map((entry, index) => {
                              const percentage = (entry.value / total) * 100;
                              return (
                                <div key={`percentage-${index}`} className="space-y-1">
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="capitalize text-gray-300">{entry.name}</span>
                                    <span className="text-white">{percentage.toFixed(1)}%</span>
                                  </div>
                                  <div className="w-full h-2 bg-gray-600 rounded-full">
                                    <div
                                      className="h-2 rounded-full"
                                      style={{ 
                                        width: `${percentage}%`, 
                                        backgroundColor: getModuleColor(entry.name) 
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    
  );
}