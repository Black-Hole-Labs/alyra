export interface IReferralStats {
  id: number;
  referrerCode: string;
  referrerAddress: string;
  chainId: number;
  totalVolume: number;
  totalReferrals: number;
  totalVolumeReferred: number;
  totalCommissions: number;
  pendingCommissions: number;
  rewardPercentage: number;
}

export interface IReferralEarnings {
  referralId: number;
  totalEarnings: number;
  pendingEarnings: number;
  claimedEarnings: number;
  transactions: IReferralTransactionSummary[];
}

export interface IReferralSummary {
  referralId: number;
  referrerCode: string;
  referrerAddress: string;
  chainId: number;
  totalReferrals: number;
  totalVolume: number;
  totalCommissions: number;
  lastActivity: Date;
}

export interface IReferralTransactionSummary {
  transactionId: number;
  transactionHash: string;
  chainId: number;
  amount: number;
  amountUSD?: number;
  tokenSymbol: string;
  transactionType: string;
  timestamp: number;
  commission: number;
  userAddress: string;
  userChainId: number;
} 