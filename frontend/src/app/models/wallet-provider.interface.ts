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