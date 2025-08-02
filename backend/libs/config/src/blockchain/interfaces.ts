// Интерфейсы для LI.FI API v2
export interface LifiToken {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

export interface LifiGasToken {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
}

export interface LifiTransactionData {
  txHash: string;
  txLink: string;
  token: LifiToken;
  chainId: number;
  gasPrice: string;
  gasUsed: string;
  gasToken: LifiGasToken;
  gasAmount: string;
  gasAmountUSD: string;
  amountUSD: string;
  value: string;
  amount: string;
  timestamp: number;
  includedSteps?: any[];
}

export interface LifiTransfer {
  transactionId: string; // Это правильное поле для ID транзакции
  status: string;
  substatus: string;
  substatusMessage: string;
  sending: LifiTransactionData;
  receiving: LifiTransactionData;
  lifiExplorerLink: string;
  fromAddress: string;
  toAddress: string;
  bridgeExplorerLink: string;
  tool: string;
  metadata: {
    integrator: string;
  };
  feeCosts: any[];
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