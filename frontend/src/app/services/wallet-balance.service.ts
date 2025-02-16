import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class WalletBalanceService {
  private solanaRpcUrl = 'https://solana-rpc.publicnode.com'; // RPC для Solana
  private solanaConnection: Connection;

  constructor() {
    this.solanaConnection = new Connection(this.solanaRpcUrl, 'confirmed');
  }

  // Получение баланса EVM-кошелька (ETH + ERC20 токены)
  async getEvmBalance(walletAddress: string, providerUrl: string, tokenAddress?: string): Promise<string> {
    console.log(`getEvmBalance(). Wallet: ${walletAddress}, Provider: ${providerUrl}, Token address (can be null): ${tokenAddress}`);
    const provider = new ethers.JsonRpcProvider(providerUrl);
  
    if (tokenAddress) {
      // Получение баланса ERC-20 токена
      const abi = ["function balanceOf(address owner) view returns (uint256)"];
      const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
      const balance = await tokenContract["balanceOf"](walletAddress);
      return ethers.formatUnits(balance, 18);
    } else {
      // Получение баланса нативного ETH
      const balance = await provider.getBalance(walletAddress);
      const ret = ethers.formatEther(balance);
      console.log(`Return: ${ret}`);
      console.log(`Return: ${parseFloat(ret)}`);
      return ret;
    }
  }

  // Получение баланса Solana-кошелька (SOL + SPL токены)
  async getSolanaBalance(walletAddress: string, tokenMintAddress?: string): Promise<string> {
    console.log(`getSolanaBalance(). Wallet: ${walletAddress}, Provider: ${this.solanaRpcUrl}, Token address (can be null): ${tokenMintAddress}`);
    const publicKey = new PublicKey(walletAddress);

    if (tokenMintAddress) {
      // Получение баланса SPL токена
      const tokenAccounts = await this.solanaConnection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(tokenMintAddress)
      });

      if (tokenAccounts.value.length > 0) {
        return tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount.toString();
      } else {
        return '0';
      }
    } else {
      // Получение баланса нативного SOL
      const balance = await this.solanaConnection.getBalance(publicKey);
      return (balance / LAMPORTS_PER_SOL).toString(); // Преобразование из лампортов в SOL
    }
  }
}
