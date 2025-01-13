interface EthereumProvider {
  targetProvider?: any;
  providers?: any;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  isMetaMask?: boolean; // MetaMask
  isTrustWallet?: boolean; // Trust Wallet
}

interface Window {
  ethereum?: EthereumProvider;
  trustwallet?: any;
  solana?: any;
  solflare?: any;
  magicEden?: any;
  backpack?: any;
}
