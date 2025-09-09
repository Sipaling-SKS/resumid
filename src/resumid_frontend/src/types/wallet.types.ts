export interface WalletData {
  userName: string;
  icpAddress: string;
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'analyze' | 'buy' | 'promo';
  description: string;
  date: string;
  tokenChange: number;
  icon?: React.ReactNode;
}

export interface WalletState {
  isLoading: boolean;
  error: string | null;
  data: WalletData | null;
}

export interface BuyPackageRequest {
  packageId: string;
  amount: number;
}

export interface PromotionRequest {
  promotionCode: string;
}

