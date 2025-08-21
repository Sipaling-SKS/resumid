import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, CreditCard } from "lucide-react";

interface Package {
  id: string;
  name: string;
  tokens: number;
  price: number;
  description: string;
}

interface BuyPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuyPackage: (packageId: string, amount: number) => Promise<void>;
}

const availablePackages: Package[] = [
  {
    id: "basic",
    name: "Basic Package",
    tokens: 10,
    price: 5,
    description: "10 tokens for basic resume analysis"
  },
  {
    id: "standard",
    name: "Standard Package",
    tokens: 25,
    price: 10,
    description: "25 tokens for standard resume analysis"
  },
  {
    id: "premium",
    name: "Premium Package",
    tokens: 50,
    price: 18,
    description: "50 tokens for premium resume analysis"
  }
];

export default function BuyPackageDialog({ open, onOpenChange, onBuyPackage }: BuyPackageDialogProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyPackage = async () => {
    if (!selectedPackage) return;

    const pkg = availablePackages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    setIsLoading(true);
    try {
      await onBuyPackage(pkg.id, pkg.tokens);
      onOpenChange(false);
      setSelectedPackage("");
    } catch (error) {
      console.error('Failed to buy package:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Buy Package
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="package">Select Package</Label>
            <Select value={selectedPackage} onValueChange={setSelectedPackage}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a package" />
              </SelectTrigger>
              <SelectContent>
                {availablePackages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{pkg.name}</span>
                      <span className="text-sm text-gray-500">
                        ${pkg.price} - {pkg.tokens} tokens
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPackage && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Package Details</h4>
              {(() => {
                const pkg = availablePackages.find(p => p.id === selectedPackage);
                if (!pkg) return null;
                
                return (
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {pkg.name}</p>
                    <p><strong>Tokens:</strong> {pkg.tokens}</p>
                    <p><strong>Price:</strong> ${pkg.price}</p>
                    <p><strong>Description:</strong> {pkg.description}</p>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuyPackage}
              disabled={!selectedPackage || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

