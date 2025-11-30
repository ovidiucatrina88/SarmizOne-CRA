import { useState, useEffect, useMemo, useQuery } from "@/common/react-import";
import type { UseFormReturn } from "@/common/react-import";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const { data: assetsResponse } = useQuery<{ data: Asset[] }>({
    queryKey: ["/api/assets"],
  });

  const assets = useMemo<Asset[]>(() => {
    if (assetsResponse?.data) {
      return assetsResponse.data as Asset[];
    }
    if (Array.isArray(assetsResponse)) {
      return assetsResponse as Asset[];
    }
    return [];
  }, [assetsResponse]);

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
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">
          Associations
        </p>
        <h3 className="text-xl font-semibold text-white">Assets in scope</h3>
        <p className="text-sm text-white/60">
          Select the business services or infrastructure that experience loss if this scenario occurs.
        </p>
      </div>

      {form?.formState?.errors?.associatedAssets && (
        <p className="text-sm font-medium text-destructive">
          {form.formState.errors.associatedAssets.message as string}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {assets.length > 0 ? (
          assets.map((asset) => (
            <div
              key={asset.assetId}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  id={asset.assetId}
                  className="mt-1 border-white/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  checked={effectiveSelectedAssets.includes(asset.assetId)}
                  onCheckedChange={(checked) =>
                    handleAssetChange(checked as boolean, asset.assetId)
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor={asset.assetId}
                    className="text-base font-semibold text-white cursor-pointer"
                  >
                    {asset.name}
                  </Label>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <Badge
                      variant="outline"
                      className="border-white/20 bg-white/5 text-white/80"
                    >
                      {asset.assetId}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary-foreground"
                    >
                      {asset.assetType}
                    </Badge>
                  </div>
                  {asset.description && (
                    <p className="mt-3 text-sm text-white/70 line-clamp-2">
                      {asset.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 rounded-2xl border border-dashed border-white/20 bg-white/5 py-6 text-center text-sm text-white/70">
            No assets available. Create assets before assigning risks.
          </p>
        )}
      </div>
    </div>
  );
}
