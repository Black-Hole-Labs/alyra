import { Injectable, signal } from '@angular/core';
import { ethers } from 'ethers';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Token } from '../pages/trade/trade.component';
import { BlockchainStateService } from './blockchain-state.service';
import { NetworkId } from '../models/wallet-provider.interface';

@Injectable({
  providedIn: 'root'
})
export class WalletBalanceService {
  private solanaRpcUrl: string;
  private solanaConnection: Connection;

  nativeSolBalance = signal<string>('0');
  nativeEthBalance = signal<string>('0');

  constructor(private blockchainStateService: BlockchainStateService) {
    this.solanaRpcUrl = this.blockchainStateService.allNetworks().find((network: { id: number; }) => network.id === NetworkId.SOLANA_MAINNET)?.rpcUrls[0] 
                        || "https://solana-rpc.publicnode.com";;
    this.solanaConnection = new Connection(this.solanaRpcUrl, 'confirmed');
  }

  async getEvmBalance(walletAddress: string, providerUrl: string, decimals: number,  tokenAddress?: string | null): Promise<string> {
    // // console.log(`getEvmBalance(). Wallet: ${walletAddress}, Provider: ${providerUrl}, Token address (can be null): ${tokenAddress}`);
  
    const provider = new ethers.JsonRpcProvider(providerUrl);
  
    if (tokenAddress && tokenAddress !== "0x0000000000000000000000000000000000000000" && tokenAddress !== "0") {
      const abi = ["function balanceOf(address owner) view returns (uint256)"];
      const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
      const balance = await tokenContract["balanceOf"](walletAddress);
      // console.log(`Token Balance: `, ethers.formatUnits(balance, decimals));
      return ethers.formatUnits(balance, decimals);
    } else {
      const balance = await provider.getBalance(walletAddress);
      const ret = ethers.formatEther(balance);
      // console.log(`Native Token Balance: `, ret);
      return ret;
    }
  }
  

  async getSolanaBalance(walletAddress: string, tokenMintAddress?: string): Promise<string> {
    // // console.log(`getSolanaBalance(). Wallet: ${walletAddress}, Provider: ${this.solanaRpcUrl}, Token address (can be null): ${tokenMintAddress}`);
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
      // console.log(`Native SOL Balance: `, (balance / LAMPORTS_PER_SOL));
      return (balance / LAMPORTS_PER_SOL).toString();
    }
  }

  async getBalanceForToken(token: Token): Promise<string> {
      let walletAddress = this.blockchainStateService.getCurrentWalletAddress();
      
      if(token.chainId !== this.blockchainStateService.network()?.id){
        if(this.blockchainStateService.customAddress() !== ""){
          walletAddress = this.blockchainStateService.customAddress();
        }
        else{
          return "0";
        }
      }
      
      if (!walletAddress) {
        console.error(`Failed to get wallet address`);
        return "0";
      }
    
      const network = this.blockchainStateService.allNetworks().find(n => n.id === token.chainId);
      if (!network) {
        console.error('Network not found: ', token.chainId);
        return "0";
      }

      if (token.chainId === NetworkId.SOLANA_MAINNET) { // SVM
        if (token.symbol === "SOL") {
          const solBalance = await this.getSolanaBalance(walletAddress);
          this.nativeSolBalance.set(solBalance);
          return solBalance;
        } else {
          return this.getSolanaBalance(walletAddress, token.contractAddress);
        }
      } else { // EVM
        if (token.symbol === "ETH") {
          const ethBalance = await this.getEvmBalance(walletAddress, network.rpcUrls[0], Number(token.decimals));
          this.nativeEthBalance.set(ethBalance);
          return ethBalance;
        } else {
          return await this.getEvmBalance(walletAddress, network.rpcUrls[0], Number(token.decimals), token.contractAddress);
        }
      }
    }
}
