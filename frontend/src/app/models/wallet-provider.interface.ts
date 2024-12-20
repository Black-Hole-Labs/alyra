export interface WalletProvider {
    connect(): Promise<{ address: string; network: string }>;
    switchNetwork(network: string): Promise<void>;
    getNetwork(): Promise<string>;
    getAddress(): string;
}

export interface Network {
    id: string;
    name: string;
    rpcUrl: string;
    chainId: string;
    type: string; // Тип сети (ethereum, solana и т.д.)
    provider: string; // Провайдер, который поддерживает эту сеть (например, metamask, solflare)
}