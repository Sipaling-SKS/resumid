import { useState, useEffect } from 'react';
import { WalletData, WalletState, Transaction } from '@/types/wallet.types';

// Mock data - in real app this would come from API
const mockWalletData: WalletData = { 
  userName: "Agustina Puspita Sari",
  icpAddress: "1234567890123456789012345678901234567890",
  balance: 25,
  transactions: [
    {
      id: "1",
      type: "analyze",
      description: "Analyze CV",
      date: "2025-07-01",
      tokenChange: -1
    },
    {
      id: "2",
      type: "analyze",
      description: "Analyze CV",
      date: "2025-07-01",
      tokenChange: -1
    },
    {
      id: "3",
      type: "buy",
      description: "Buy Package",
      date: "2025-06-15",
      tokenChange: 15
    },
    {
      id: "4",
      type: "analyze",
      description: "Analyze CV",
      date: "2025-06-12",
      tokenChange: -1
    }
  ]
};

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isLoading: true,
    error: null,
    data: null
  });

  const [showBalance, setShowBalance] = useState(true);
  const TRIAL_KEY = 'resumid_has_claimed_trial';
  const WALLET_KEY = 'resumid_wallet_state_v1';
  const [hasClaimedTrial, setHasClaimedTrial] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem(TRIAL_KEY) === '1';
    } catch {
      return false;
    }
  });

  const canClaimTrial = () => !hasClaimedTrial;
  const markTrialClaimed = () => {
    try {
      if (typeof window !== 'undefined') localStorage.setItem(TRIAL_KEY, '1');
    } catch {}
    setHasClaimedTrial(true);
  };

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let dataToUse: WalletData = mockWalletData;
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem(WALLET_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as WalletData;
            if (parsed && typeof parsed.balance === 'number' && Array.isArray(parsed.transactions)) {
              dataToUse = parsed;
            }
          }
        }
      } catch {}

      setState({
        isLoading: false,
        error: null,
        data: dataToUse
      });
      try {
        if (typeof window !== 'undefined') localStorage.setItem(WALLET_KEY, JSON.stringify(dataToUse));
      } catch {}
    } catch (error) {
      setState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch wallet data',
        data: null
      });
    }
  };

  // Buy package
  const buyPackage = async (packageId: string, amount: number) => {
    try {
      // In real app, this would make an API call
      console.log('Buying package:', packageId, 'Amount:', amount);
      
      // Prevent multiple trial claims (FE guard)
      if (packageId === 'trial' && hasClaimedTrial) {
        throw new Error('Trial package has already been claimed.');
      }

      // Example backend validation (commented for FE-only):
      // const res = await fetch('/api/packages/buy', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ packageId, amount })
      // });
      // if (!res.ok) throw new Error('Backend rejected purchase');

      // Update local state and persist
      if (state.data) {
        const newData: WalletData = {
          ...state.data,
          balance: state.data.balance + amount,
          transactions: [
            {
              id: Date.now().toString(),
              type: 'buy',
              description: `Buy Package${packageId ? ` (${packageId})` : ''}`,
              date: new Date().toISOString(),
              tokenChange: amount
            },
            ...state.data.transactions
          ]
        };
        setState(prev => ({ ...prev, data: newData }));
        try { if (typeof window !== 'undefined') localStorage.setItem(WALLET_KEY, JSON.stringify(newData)); } catch {}
      }

      if (packageId === 'trial') {
        markTrialClaimed();
      }
    } catch (error) {
      console.error('Failed to buy package:', error);
      throw error;
    }
  };

  // Spend tokens (e.g., when analyzing a resume)
  const spendTokens = async (amount: number, description: string = 'Analyze CV') => {
    try {
      if (!state.data) return false;
      if (amount <= 0) return false;
      if (state.data.balance < amount) {
        // In real app, surface this to UI
        console.warn('Insufficient tokens');
        return false;
      }

      // In real app, this would make an API call / canister call
      // Example (commented for FE-only mode):
      // await fetch('/api/wallet/spend', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount, reason: description })
      // });
      const newData: WalletData = {
        ...state.data,
        balance: state.data.balance - amount,
        transactions: [
          {
            id: Date.now().toString(),
            type: 'analyze',
            description,
            date: new Date().toISOString(),
            tokenChange: -amount,
          },
          ...state.data.transactions,
        ],
      };
      setState(prev => ({ ...prev, data: newData }));
      try { if (typeof window !== 'undefined') localStorage.setItem(WALLET_KEY, JSON.stringify(newData)); } catch {}

      return true;
    } catch (error) {
      console.error('Failed to spend tokens:', error);
      return false;
    }
  };

  const hasSufficientTokens = (amount: number) => {
    return Boolean(state.data && state.data.balance >= amount);
  };

  // Apply promotion
  const applyPromotion = async (promotionCode: string) => {
    try {
      // In real app, this would make an API call
      console.log('Applying promotion:', promotionCode);
      
      // Update local state
      if (state.data) {
        const newData: WalletData = {
          ...state.data,
          balance: state.data.balance + 5, // Mock bonus
          transactions: [
            {
              id: Date.now().toString(),
              type: 'promo',
              description: 'Promotion Applied',
              date: new Date().toISOString(),
              tokenChange: 5
            },
            ...state.data.transactions
          ]
        };
        setState(prev => ({ ...prev, data: newData }));
        try { if (typeof window !== 'undefined') localStorage.setItem(WALLET_KEY, JSON.stringify(newData)); } catch {}
      }
    } catch (error) {
      console.error('Failed to apply promotion:', error);
      throw error;
    }
  };

  // Toggle balance visibility
  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  // Copy ICP address
  const copyICPAddress = async () => {
    if (state.data?.icpAddress) {
      try {
        await navigator.clipboard.writeText(state.data.icpAddress);
        return true;
      } catch (error) {
        console.error('Failed to copy address:', error);
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  return {
    ...state,
    showBalance,
    toggleBalanceVisibility,
    copyICPAddress,
    buyPackage,
    applyPromotion,
    spendTokens,
    hasSufficientTokens,
    hasClaimedTrial,
    canClaimTrial,
    refetch: fetchWalletData
  };
}


// import { useEffect, useState } from "react";
// import { backend } from "@/declarations/backend"; // sesuaikan nama canister BE kamu
// import { Principal } from "@dfinity/principal";

// type WalletData = {
//   userName: string;
//   icpAddress: string;
// };

// export function useWallet(principal: Principal | null) {
//   const [wallet, setWallet] = useState<WalletData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Ambil data dari BE berdasarkan principal
//   const fetchWallet = async (p: Principal) => {
//     try {
//       setLoading(true);
//       setError(null);

//       // contoh: asumsi kamu punya method di BE bernama `getUserWallet`
//       // yang return { userName: Text; icpAddress: Text }
//       const res = await backend.getUserWallet(p);

//       if (res) {
//         setWallet({
//           userName: res.userName,
//           icpAddress: res.icpAddress,
//         });
//       } else {
//         setError("Wallet not found");
//         setWallet(null);
//       }
//     } catch (err: any) {
//       console.error("Failed to fetch wallet:", err);
//       setError("Failed to fetch wallet");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (principal) {
//       fetchWallet(principal);
//     } else {
//       setWallet(null);
//     }
//   }, [principal]);

//   return { wallet, loading, error, refetch: () => principal && fetchWallet(principal) };
// }
