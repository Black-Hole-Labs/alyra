import { IsString, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateRewardTransactionDto {
  @IsString()
  transactionHash: string;

  @IsString()
  network: string;

  @IsString()
  wallet: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  tokenAddress?: string;

  @IsOptional()
  @IsString()
  tokenSymbol?: string;

  @IsString()
  transactionType: string;

  @IsOptional()
  @IsNumber()
  blockNumber?: number;

  @IsDateString()
  timestamp: string;
}

export class ClaimRewardDto {
  @IsString()
  claimHash: string;
}

export class RewardResponseDto {
  id: number;
  wallet: string;
  rewardPoolId: number;
  amount: number;
  expiration?: Date;
  expired: boolean;
  claimed: boolean;
  claimHash?: string;
  claimTimestamp?: Date;
  createdAt: Date;
  updatedAt: Date;
  rewardPool?: {
    id: number;
    name: string;
    claimerAddress: string;
    rewardToken?: {
      id: number;
      symbol: string;
      name: string;
      address: string;
      decimals: number;
      chainId: number;
    };
  };
}

export class RewardPoolResponseDto {
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
  rewardToken?: {
    id: number;
    symbol: string;
    name: string;
    address: string;
    decimals: number;
    chainId: number;
  };
} 