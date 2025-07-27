import { ethers } from 'ethers';
import { DEFAULT_RPC_ENDPOINTS } from './constants';

// Получение провайдера для конкретной сети
export function getRpcProvider(chainId: number, customRpc?: string): ethers.Provider {
  const rpcUrl = customRpc || DEFAULT_RPC_ENDPOINTS[chainId];
  if (!rpcUrl) {
    throw new Error(`No RPC endpoint found for chain ID ${chainId}`);
  }
  return new ethers.JsonRpcProvider(rpcUrl);
}

// Получение всех провайдеров
export function getAllRpcProviders(customRpcs?: { [chainId: number]: string }): { [chainId: number]: ethers.Provider } {
  const providers: { [chainId: number]: ethers.Provider } = {};
  
  Object.keys(DEFAULT_RPC_ENDPOINTS).forEach(chainIdStr => {
    const chainId = parseInt(chainIdStr);
    try {
      providers[chainId] = getRpcProvider(chainId, customRpcs?.[chainId]);
    } catch (error) {
      console.warn(`Failed to initialize provider for chain ${chainId}:`, error);
    }
  });
  
  return providers;
}

// Парсинг контекста из события Claim
export function parseClaimContext(context: string): { rewardId?: number; [key: string]: any } {
  try {
    // Пытаемся декодировать контекст как JSON
    const decoded = ethers.toUtf8String(context);
    const parsed = JSON.parse(decoded);
    return parsed;
  } catch (error) {
    // Если не JSON, пытаемся извлечь rewardId из hex
    try {
      const decoded = ethers.toUtf8String(context);
      const match = decoded.match(/rewardId[:\s]*(\d+)/i);
      if (match) {
        return { rewardId: parseInt(match[1]) };
      }
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
    
    return {};
  }
}

// Форматирование суммы с учетом decimals
export function formatTokenAmount(amount: string, decimals: number): number {
  return parseFloat(amount) / Math.pow(10, decimals);
}

// Получение timestamp из блока
export function getBlockTimestamp(block: ethers.Block): number {
  return block.timestamp * 1000; // Конвертируем в миллисекунды
} 