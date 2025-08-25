import React, { useState } from "react";
import { Wallet as WalletIcon, Copy, CheckCircle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import WalletCard from "@/components/parts/WalletCard";
// import { Card, CardContent } from "@/components/ui/card";
import TransactionHistory from "@/components/parts/TransactionHistory";
import BuyPackageDialog from "@/components/parts/BuyPackageDialog";
import PromotionDialog from "@/components/parts/PromotionDialog";
import SkeletonWallet from "@/components/parts/skeleton/SkeletonWallet";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { TokenEntry, UserData } from "../../../../declarations/resumid_backend/resumid_backend.did";

export default function Wallet() {
  const {
    isLoading,
    error,
    // buyPackage,
    // applyPromotion,
  } = useWallet();

  const { userData, resumidActor } = useAuth();

  const [buyPackageOpen, setBuyPackageOpen] = useState(false);
  const [promotionOpen, setPromotionOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fetchTokenEntries = async () => {
    if (!resumidActor) return null;
    const result: TokenEntry[] = await resumidActor.getUserTokenEntries();

    return result;
  }
  const fetchUserDetail = async () => {
    if (!resumidActor) return null;
    const result = await resumidActor.getUserById();
    console.log(result);
    return result;
  }

  const { data: tokenEntries, isLoading: loadingTokenEntries, error: tokenEntriesError } = useQuery({
    queryKey: ['token-entries', userData.name],
    queryFn: () => fetchTokenEntries()
  })

  const { data: userInfo, isLoading: loadingUserInfo, error: errorUserInfo } = useQuery({
    queryKey: ['user-info', userData.name],
    queryFn: () => fetchUserDetail()
  })

  const handleBuyPackage = async (packageId: string, amount: number) => {
    // try {
    //   await buyPackage(packageId, amount);
    // } catch (error) {
    //   console.error("Failed to buy package:", error);
    // }
  };

  const handlePromotion = async (promotionCode: string) => {
    // try {
    //   await applyPromotion(promotionCode);
    // } catch (error) {
    //   console.error("Failed to apply promotion:", error);
    // }
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
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

  const handleViewAllHistory = () => {
    console.log("Navigate to full history page");
  };

  if (loadingUserInfo || loadingTokenEntries) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <WalletIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="font-inter text-2xl sm:text-3xl font-bold text-gray-900">My Wallet</h1>
            </div>
            <p className="font-inter text-sm sm:text-base text-gray-600">Manage your ICP balance and transactions</p>
          </div>
          <SkeletonWallet />
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <WalletIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              <h1 className="font-inter text-2xl sm:text-3xl font-bold text-gray-900">My Wallet</h1>
            </div>
            <p className="font-inter text-sm sm:text-base text-gray-600">Manage your ICP balance and transactions</p>
          </div>
          <div className="text-center py-8 sm:py-12">
            <p className="font-inter text-sm sm:text-base text-red-600 mb-4">
              {error || "Failed to load wallet data"}
            </p>
            <button
              // onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <WalletIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="font-inter text-2xl sm:text-3xl font-bold text-gray-900">My Wallet</h1>
          </div>
          <p className="font-inter text-sm sm:text-base text-gray-600">Manage your ICP balance and transactions</p>
        </div>

        {/* Wallet Card */}
        <div className="mb-6 sm:mb-8">
          <WalletCard
            userName={userInfo && "ok" in userInfo ? userInfo.ok.name : ""}
            icpAddress={userInfo && "ok" in userInfo ? userInfo.ok.depositAddr : ""}
            balance={userInfo && "ok" in userInfo ? Number(userInfo.ok.token) : 0}
            onBuyPackage={() => setBuyPackageOpen(true)}
            onPromotion={() => setPromotionOpen(true)}
          />
        </div>

        {/* Transaction History */}
        <div className="mb-6 sm:mb-8">
          <TransactionHistory
            transactions={tokenEntries ?? []}
            onViewAll={handleViewAllHistory}
          />
        </div>

        {/* Dialogs */}
        <BuyPackageDialog
          open={buyPackageOpen}
          onOpenChange={setBuyPackageOpen}
          onBuyPackage={handleBuyPackage}
        />

        <PromotionDialog
          open={promotionOpen}
          onOpenChange={setPromotionOpen}
          onApplyPromotion={handlePromotion}
        />
      </div>
    </div>
  );
}
