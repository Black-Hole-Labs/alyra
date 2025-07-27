// Интерфейсы для LI.FI API v2
export interface LifiTransfer {
  id: string;
  status: string;
  sending: {
    txHash: string;
    amount: string;
    amountUSD: string;
    token: {
      address: string;
      chainId: number;
      symbol: string;
      decimals: number;
    };
    chainId: number;
    timestamp: number;
  };
  receiving: {
    txHash: string;
    amount: string;
    amountUSD: string;
    token: {
      address: string;
      chainId: number;
      symbol: string;
      decimals: number;
    };
    chainId: number;
    timestamp: number;
  };
  fromAddress: string;
  toAddress: string;
}

export interface LifiResponse {
  data: LifiTransfer[];
  hasNext: boolean;
  hasPrevious: boolean;
  next?: string;
  previous?: string;
}

// Интерфейсы для событий Claim
export interface ClaimEvent {
  operator: string;
  asset: string;
  amount: string;
  context: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: number;
}

// Интерфейсы для стейкинга
export interface IDepositEntity {
  amount: number;
  wallet: string;
  timestamp: number;
  txHash: string;
  blockNumber: number;
  stakingId: number;
  withdrawalId: number | null;
}

export interface IWithdrawalEntity {
  amount: number;
  wallet: string;
  timestamp: number;
  txHash: string;
  blockNumber: number;
  stakingId: number;
}

// Интерфейсы для ревардов
export interface IRewardPoolEntity {
  id: number;
  name: string;
  amount: number;
  percentagePerPeriod: number;
  period: number;
  claimerAddress: string;
  poolSource: string;
  rewardTokenId: number;
  createdAt: Date;
  updatedAt: Date;
} 