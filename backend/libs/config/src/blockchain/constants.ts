// Константы для работы с блокчейном
export const CHAIN_ID_TO_NETWORK: { [key: number]: string } = {
  1: 'ethereum',
  137: 'polygon',
  56: 'bsc',
  42161: 'arbitrum',
  10: 'optimism',
  8453: 'base',
  43114: 'avalanche',
  250: 'fantom',
  100: 'gnosis',
  1101: 'polygon-zkevm',
  324: 'zksync-era',
  59144: 'linea',
  7777777: 'zora',
  534352: 'scroll',
  81457: 'blast',
  84532: 'base-sepolia',
  11155111: 'sepolia',
  80001: 'mumbai',
  97: 'bsc-testnet',
  421614: 'arbitrum-sepolia',
  11155420: 'optimism-sepolia',
  1151111081099710: 'solana',
};

export const DEFAULT_RPC_ENDPOINTS: { [key: number]: string } = {
  1: 'https://eth.llamarpc.com',
  137: 'https://polygon.llamarpc.com',
  56: 'https://bsc.llamarpc.com',
  42161: 'https://arbitrum.llamarpc.com',
  10: 'https://optimism.llamarpc.com',
  8453: 'https://base.llamarpc.com',
  43114: 'https://avalanche.llamarpc.com',
  250: 'https://fantom.llamarpc.com',
  100: 'https://gnosis.llamarpc.com',
  1101: 'https://polygon-zkevm.llamarpc.com',
  324: 'https://zksync.llamarpc.com',
  59144: 'https://linea.llamarpc.com',
  7777777: 'https://zora.llamarpc.com',
  534352: 'https://scroll.llamarpc.com',
  81457: 'https://blast.llamarpc.com',
  11155111: 'https://eth-sepolia.llamarpc.com',
  80001: 'https://polygon-mumbai.llamarpc.com',
  97: 'https://bsc-testnet.llamarpc.com',
  421614: 'https://arbitrum-sepolia.llamarpc.com',
  11155420: 'https://optimism-sepolia.llamarpc.com',
};

// ABI для контрактов
export const ERC20_CLAIMER_ABI = [
  'event Claim(address indexed operator, address indexed asset, uint256 amount, bytes context)',
];

export const ERC20_TOKEN_ABI = [
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address sender, address recipient, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint amount)',
  'event Approval(address indexed owner, address indexed spender, uint amount)',
];

export const STAKING_CONTACT_V2_ABI = [
  'event Deposit(address indexed receiver, uint256 amount)',
  'event Withdrawal(address indexed receiver, uint256 amount)',
  'function deposit(uint256 amount) external',
  'function withdraw(uint256 amount) external',
  'function balanceOf(address account) external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
];

// Fees
export const BLACKHOLE_FEE_PERCENTAGE = 0.0015; // 0.15%
export const LIFI_FEE_PERCENTAGE = 0.0025; // 0.25%
export const REWARD_FEE_PERCENTAGE = 0.4; // 40% from Alyra's fee