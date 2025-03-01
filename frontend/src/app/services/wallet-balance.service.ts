import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

@Injectable({
  providedIn: 'root'
})
export class WalletBalanceService {
  private solanaRpcUrl = 'https://solana-rpc.publicnode.com';
  private solanaConnection: Connection;

  constructor() {
    this.solanaConnection = new Connection(this.solanaRpcUrl, 'confirmed');
  }

  async getEvmBalance(walletAddress: string, providerUrl: string, decimals: number,  tokenAddress?: string | null): Promise<string> {
    // console.log(`getEvmBalance(). Wallet: ${walletAddress}, Provider: ${providerUrl}, Token address (can be null): ${tokenAddress}`);
  
    const provider = new ethers.JsonRpcProvider(providerUrl);
  
    if (tokenAddress && tokenAddress !== "0x0000000000000000000000000000000000000000" && tokenAddress !== "0") {
      const abi = ["function balanceOf(address owner) view returns (uint256)"];
      const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
      const balance = await tokenContract["balanceOf"](walletAddress);
      console.log(`Token Balance: `, ethers.formatUnits(balance, decimals));
      return ethers.formatUnits(balance, decimals);
    } else {
      const balance = await provider.getBalance(walletAddress);
      const ret = ethers.formatEther(balance);
      console.log(`Native Token Balance: `, ret);
      return ret;
    }
  }
  

  async getSolanaBalance(walletAddress: string, tokenMintAddress?: string): Promise<string> {
    // console.log(`getSolanaBalance(). Wallet: ${walletAddress}, Provider: ${this.solanaRpcUrl}, Token address (can be null): ${tokenMintAddress}`);
    const publicKey = new PublicKey(walletAddress);

    if (tokenMintAddress) {
      const tokenAccounts = await this.solanaConnection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(tokenMintAddress)
      });

      if (tokenAccounts.value.length > 0) {
        return tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount.toString();
      } else {
        return '0';
      }
    } else {
      const balance = await this.solanaConnection.getBalance(publicKey);
      console.log(`Native SOL Balance: `, (balance / LAMPORTS_PER_SOL));
      return (balance / LAMPORTS_PER_SOL).toString();
    }
  }
}
