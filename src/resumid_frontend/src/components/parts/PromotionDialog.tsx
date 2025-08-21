import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromotionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyPromotion: (promotionCode: string) => Promise<void>;
}

const validPromotionCodes = [
  { code: "WELCOME2024", tokens: 5, description: "Welcome bonus for new users" },
  { code: "SUMMER2024", tokens: 10, description: "Summer promotion" },
  { code: "LOYALTY2024", tokens: 3, description: "Loyalty reward" }
];

export default function PromotionDialog({ open, onOpenChange, onApplyPromotion }: PromotionDialogProps) {
  const [promotionCode, setPromotionCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    tokens?: number;
  } | null>(null);
  const { toast } = useToast();

  const validatePromotionCode = (code: string) => {
    const promotion = validPromotionCodes.find(p => p.code.toUpperCase() === code.toUpperCase());
    if (promotion) {
      return {
        isValid: true,
        message: `Valid promotion code! You'll get ${promotion.tokens} tokens.`,
        tokens: promotion.tokens
      };
    }
    return {
      isValid: false,
      message: "Invalid promotion code. Please try again."
    };
  };

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) return;

    const validation = validatePromotionCode(promotionCode);
    setValidationResult(validation);

    if (!validation.isValid) {
      toast({
        title: "Invalid Code",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onApplyPromotion(promotionCode);
      toast({
        title: "Promotion Applied!",
        description: `You've received ${validation.tokens} tokens!`,
      });
      onOpenChange(false);
      setPromotionCode("");
      setValidationResult(null);
    } catch (error) {
      toast({
        title: "Failed to Apply",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setPromotionCode(value);
    if (validationResult) {
      setValidationResult(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Apply Promotion
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promotionCode">Promotion Code</Label>
            <Input
              id="promotionCode"
              placeholder="Enter your promotion code"
              value={promotionCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="uppercase"
            />
          </div>

          {validationResult && (
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              validationResult.isValid 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {validationResult.isValid ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{validationResult.message}</span>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Available Promotion Codes</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {validPromotionCodes.map((promo) => (
                <div key={promo.code} className="flex justify-between">
                  <span className="font-mono">{promo.code}</span>
                  <span>+{promo.tokens} tokens</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyPromotion}
              disabled={!promotionCode.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                "Applying..."
              ) : (
                <>
                  <Gift className="w-4 h-4 mr-2" />
                  Apply Code
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

