import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiskResponseForm } from "@/components/risk-responses/risk-response-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function RiskResponses() {
  const { toast } = useToast();
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch risk responses
  const { 
    data: riskResponses, 
    isLoading: responsesLoading,
    refetch: refetchResponses
  } = useQuery({
    queryKey: ["/api/risk-responses"],
  });

  // Fetch risks for dropdown list
  const { 
    data: risks, 
    isLoading: risksLoading 
  } = useQuery({
    queryKey: ["/api/risks"],
  });

  const handleAddSuccess = () => {
    setIsAddDialogOpen(false);
    refetchResponses();
    toast({
      title: "Success",
      description: "Risk response added successfully",
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedResponse(null);
    refetchResponses();
    toast({
      title: "Success",
      description: "Risk response updated successfully",
    });
  };

  const handleDeleteResponse = async (id) => {
    try {
      const response = await fetch(`/api/risk-responses/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete risk response");
      }
      
      refetchResponses();
      toast({
        title: "Success",
        description: "Risk response deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Get response type badge color
  const getResponseTypeColor = (responseType) => {
    switch(responseType) {
      case "mitigate": return "bg-blue-900 text-blue-200 border-blue-700";
      case "transfer": return "bg-purple-900 text-purple-200 border-purple-700";
      case "avoid": return "bg-red-900 text-red-200 border-red-700";
      case "accept": return "bg-amber-900 text-amber-200 border-amber-700";
      default: return "bg-gray-700 text-gray-200 border-gray-600";
    }
  };

  // Get risk name from risk ID
  const getRiskName = (riskId) => {
    if (!risks || !Array.isArray(risks.data)) return "Unknown Risk";
    const risk = risks.data.find(r => r.riskId === riskId);
    return risk ? risk.name : "Unknown Risk";
  };

  const isLoading = responsesLoading || risksLoading;

  if (isLoading) {
    return (
      
        <div className="space-y-6">
          <div className="flex justify-between">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <Skeleton className="h-6 w-1/4" />
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>
      
    );
  }

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <Button 
          onClick={() => refetchResponses()} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Response
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Risk Response</DialogTitle>
            </DialogHeader>
            <RiskResponseForm 
              risks={risks?.data || []} 
              onSuccess={handleAddSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Risk Responses</h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Risk</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Response Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Justification</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Details</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskResponses?.data && riskResponses.data.length > 0 ? (
                  riskResponses.data.map((response) => (
                    <tr key={response.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="py-3 px-4 text-white font-medium">
                        {getRiskName(response.riskId)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getResponseTypeColor(response.responseType)}`}>
                          {response.responseType.charAt(0).toUpperCase() + response.responseType.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {response.justification || "No justification provided"}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {response.responseType === "mitigate" && (
                          <div>
                            <strong className="text-white">Controls: </strong>
                            {response.assignedControls && response.assignedControls.length > 0 
                              ? response.assignedControls.join(", ") 
                              : "None"}
                          </div>
                        )}
                        {response.responseType === "transfer" && (
                          <div>
                            <strong className="text-white">Transfer Method: </strong>
                            {response.transferMethod || "Not specified"}
                          </div>
                        )}
                        {response.responseType === "avoid" && (
                          <div>
                            <strong className="text-white">Avoidance Strategy: </strong>
                            {response.avoidanceStrategy || "Not specified"}
                          </div>
                        )}
                        {response.responseType === "accept" && (
                          <div>
                            <strong className="text-white">Acceptance Reason: </strong>
                            {response.acceptanceReason || "Not specified"}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Dialog open={isEditDialogOpen && selectedResponse?.id === response.id} onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (!open) setSelectedResponse(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedResponse(response);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Edit Risk Response</DialogTitle>
                            </DialogHeader>
                            {selectedResponse && (
                              <RiskResponseForm 
                                risks={risks?.data || []} 
                                response={selectedResponse}
                                onSuccess={handleEditSuccess} 
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleDeleteResponse(response.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      No risk responses found. Click the "Add Response" button to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}