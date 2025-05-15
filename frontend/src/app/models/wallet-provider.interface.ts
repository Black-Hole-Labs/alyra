export interface WalletProvider {
  connect(): Promise<{ address: string; network: string }>;
  switchNetwork(network: any): Promise<void>;
  getNetwork(): Promise<string>;
  getAddress(): string;
  isAvailable(): boolean;
}

export interface Network {
  id: number;
  name: string;
  rpcUrls: string;
  logoURI?: string;
  idHex?:string;
  chainType: string; // Тип сети (EVM, SVM)
  explorerUrl: string;
}

export interface TransactionRequestEVM {
  value: string; // Значение транзакции в HEX
  to: string; // Адрес получателя
  data: string; // Данные транзакции (payload)
  chainId: number; // ID блокчейна (например, 1 для Ethereum Mainnet)
  gasPrice: string; // Цена газа в HEX
  gasLimit: string; // Лимит газа в HEX
  from: string; // Адрес отправителя
}

export interface TransactionRequestSVM {
  data: string; 
}

export interface Wallets {
  id: string;
  name: string;
  type: string;
  cssClass: string;
  installUrl?: string;
  iconUrl: string;
  status?: string;
}

export enum ProviderType {
  EVM = 'EVM',
  SVM = 'SVM',
  MULTICHAIN = 'multichain'
}

export enum NetworkId
{
  ETHEREUM_MAINNET = 1,
  SOLANA_MAINNET = 1151111081099710,
}