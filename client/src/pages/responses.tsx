import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RiskResponse, Risk } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { ResponseList } from "@/components/responses/response-list";
import { ResponseForm } from "@/components/responses/response-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import Layout from "@/components/layout/layout";

export default function Responses() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<RiskResponse | null>(null);

  // Fetch all risk responses
  const { data: responses, isLoading: responsesLoading, error: responsesError } = useQuery({
    queryKey: ["/api/responses"],
  });

  // Fetch all risks to provide context for risk responses
  const { data: risks, isLoading: risksLoading } = useQuery({
    queryKey: ["/api/risks"],
  });

  const isLoading = responsesLoading || risksLoading;
  const error = responsesError;

  const handleCreateNew = () => {
    setSelectedResponse(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (response: RiskResponse) => {
    setSelectedResponse(response);
    setIsCreateModalOpen(true);
  };

  const handleClose = () => {
    setIsCreateModalOpen(false);
    setSelectedResponse(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Card>
          <div className="p-6">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-500">Error loading risk responses</h2>
        <p className="mt-2 text-gray-600">Please try again later or contact support.</p>
      </div>
    );
  }

  return (
    <Layout
      pageTitle="Risk Responses"
      pageIcon="RSP"
      pageDescription="Manage risk response strategies and track implementation status"
      pageActions={
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Response
        </Button>
      }
    >
      <ResponseList responses={responses} risks={risks} onEdit={handleEdit} />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedResponse ? "Edit Risk Response" : "Add New Risk Response"}
            </DialogTitle>
          </DialogHeader>
          <ResponseForm response={selectedResponse} risks={risks} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
