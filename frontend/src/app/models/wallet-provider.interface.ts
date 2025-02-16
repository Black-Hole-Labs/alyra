export interface WalletProvider {
    connect(): Promise<{ address: string; network: string }>;
    switchNetwork(network: any): Promise<void>;
    getNetwork(): Promise<string>;
    getAddress(): string;
}

export interface Network {
    id: string;
    name: string;
    rpcUrls: string;
    chainId: string;
    chainType: string; // Тип сети (EVM, SVM)
}

export interface TransactionRequest {
    value: string; // Значение транзакции в HEX
    to: string; // Адрес получателя
    data: string; // Данные транзакции (payload)
    chainId: number; // ID блокчейна (например, 1 для Ethereum Mainnet)
    gasPrice: string; // Цена газа в HEX
    gasLimit: string; // Лимит газа в HEX
    from: string; // Адрес отправителя
  }