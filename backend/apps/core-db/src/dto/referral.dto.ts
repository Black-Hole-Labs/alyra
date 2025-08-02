import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export class CreateReferralDto {
  @IsString()
  @IsNotEmpty()
  referrerAddress: string;

  @IsNumber()
  @IsNotEmpty()
  chainId: number;
}

export class CreateReferralWithCodeDto {
  @IsString()
  @IsNotEmpty()
  referrerCode: string;

  @IsString()
  @IsNotEmpty()
  referrerAddress: string;

  @IsNumber()
  @IsNotEmpty()
  chainId: number;
}

export class JoinReferralDto {
  @IsString()
  @IsNotEmpty()
  referrerCode: string;

  @IsString()
  @IsNotEmpty()
  userAddress: string;

  @IsNumber()
  @IsNotEmpty()
  userChainId: number;
}

export class ReferralStatsDto {
  @IsNumber()
  id: number;

  @IsString()
  referrerCode: string;

  @IsString()
  referrerAddress: string;

  @IsString()
  referrerNetwork: string; // оставляем как строку для совместимости с API

  @IsNumber()
  totalVolume: number;

  @IsNumber()
  totalReferrals: number;

  @IsNumber()
  totalCommissions: number;

  @IsNumber()
  pendingCommissions: number;
}

export class ReferralEarningsDto {
  @IsNumber()
  referralId: number;

  @IsNumber()
  totalEarnings: number;

  @IsNumber()
  pendingEarnings: number;

  @IsNumber()
  claimedEarnings: number;
}

export class ReferralTransactionDto {
  @IsNumber()
  id: number;

  @IsString()
  transactionHash: string;

  @IsNumber()
  chainId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsNumber()
  amountUSD?: number;

  @IsOptional()
  @IsString()
  tokenAddress?: string;

  @IsOptional()
  @IsString()
  tokenSymbol?: string;

  @IsString()
  transactionType: string;

  @IsNumber()
  timestamp: number;

  @IsDateString()
  createdAt: string;
} 