import { useState, useEffect, useQuery } from "@/common/react-import";
import type { UseFormReturn } from "@/common/react-import";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type Asset = {
  id: number;
  assetId: string;
  name: string;
  assetType: string;
  description?: string;
};

type AssetSelectionProps = {
  form?: UseFormReturn<any>;
  selectedAssets?: string[];
  selectedAssetIds?: string[];
  setSelectedAssets?: (assets: string[]) => void;
  onChange?: (assets: string[]) => void;
};

export function AssetSelection({ 
  form, 
  selectedAssets = [], 
  selectedAssetIds,
  setSelectedAssets,
  onChange 
}: AssetSelectionProps) {
  // Use either selectedAssetIds (new prop) or selectedAssets (old prop)
  const effectiveSelectedAssets = selectedAssetIds || selectedAssets || [];
  // Fetch assets for selection
  const { data: assets = [] } = useQuery<Asset[]>({
    queryKey: ["/api/assets"],
  });

  // Handle asset selection change
  const handleAssetChange = (checked: boolean, assetId: string) => {
    // Create an updated list of assets
    const updatedAssets = checked
      ? [...effectiveSelectedAssets, assetId]
      : effectiveSelectedAssets.filter((a) => a !== assetId);
      
    // Call the appropriate update handler - newer onChange or legacy setSelectedAssets
    if (onChange) {
      onChange(updatedAssets);
    } else if (setSelectedAssets) {
      setSelectedAssets(updatedAssets);
    }
    
    // If a form is provided, also update the form value directly
    if (form) {
      form.setValue("associatedAssets", updatedAssets, { shouldValidate: true });
    }
  };

  // Set initial associated assets to form values
  useEffect(() => {
    // Only update the form if it exists
    if (form && effectiveSelectedAssets.length > 0) {
      form.setValue("associatedAssets", effectiveSelectedAssets, {
        shouldValidate: true
      });
    }
  }, [effectiveSelectedAssets, form]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Associated Assets</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Select one or more assets affected by this risk.
      </p>

      {form?.formState?.errors?.associatedAssets && (
        <p className="text-sm font-medium text-destructive">
          {form.formState.errors.associatedAssets.message as string}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 mt-2">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <Card key={asset.assetId} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id={asset.assetId}
                    checked={effectiveSelectedAssets.includes(asset.assetId)}
                    onCheckedChange={(checked) =>
                      handleAssetChange(checked as boolean, asset.assetId)
                    }
                  />
                  <div className="grid gap-1 leading-none pl-2">
                    <Label
                      htmlFor={asset.assetId}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {asset.name}
                    </Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-secondary/80 text-secondary-foreground">{asset.assetId}</Badge>
                      <Badge className="bg-primary/80 text-primary-foreground">{asset.assetType}</Badge>
                    </div>
                    {asset.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {asset.description}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-2 text-sm text-muted-foreground py-2">
            No assets available. Create assets before assigning risks.
          </p>
        )}
      </div>
    </div>
  );
}