import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, MoveUpRight, TicketPercent, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router";

interface WalletCardProps {
  userName: string;
  icpAddress: string;
  balance: number;
  onBuyPackage: () => void;
  onPromotion: () => void;
}

export default function WalletCard({
  userName,
  icpAddress,
  balance,
  onBuyPackage,
  onPromotion
}: WalletCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(icpAddress);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "ICP address has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  const handleBuyPackage = () => {
    navigate("/");
    // Scroll to pricing section after navigation
    setTimeout(() => {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Card className="bg-gradient-to-r from-[#2567FF] to-[#1542AA] text-white border-0 shadow-lg">
      <CardContent className="p-4 sm:p-6">
        {/* User Information */}
        <div className="mb-4 sm:mb-6">
          <h3 className="font-inter text-lg sm:text-xl font-semibold mb-2">{userName}</h3>
          <div className="flex items-center gap-2">
            <span className="font-inter text-blue-100 text-xs sm:text-sm truncate">ICP Address: {icpAddress}</span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-auto flex-shrink-0"
              onClick={handleCopyAddress}
            >
              {copied ? (
                <CheckCircle size={16} className="text-green-300" />
              ) : (
                <Copy size={16} />
              )}
            </Button>
          </div>
        </div>

        {/* Total Tokens */}
        <div className="mb-4 sm:mb-6">
          <span className="font-inter text-blue-100 text-sm sm:text-sm">Total Token</span>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <span className="font-inter text-2xl sm:text-3xl font-bold">
              {showBalance ? balance : "••••"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-auto"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
          
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full h-14 w-14 sm:h-16 sm:w-16 p-0 min-w-0 flex-shrink-0 flex items-center justify-center"
              style={{ aspectRatio: '1/1' }}
              onClick={handleBuyPackage}
            >
              <MoveUpRight size={40} className="sm:w-6 sm:h-6" />
            </Button>
            <span className="font-inter text-xs text-white text-center">Buy Package</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full h-14 w-14 sm:h-16 sm:w-16 p-0 min-w-0 flex-shrink-0 flex items-center justify-center"
              style={{ aspectRatio: '1/1' }}
              onClick={() => {
                toast({
                  title: "Feature Under Development",
                  description: "This feature is still under development",
                });
              }}
            >
              <TicketPercent size={40} className="sm:w-6 sm:h-6" />
            </Button>
            <span className="font-inter text-xs text-white text-center">Promotion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

