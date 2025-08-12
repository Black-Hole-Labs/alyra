import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, lastValueFrom, Observable, switchMap, takeWhile } from 'rxjs';
import { ethers } from 'ethers';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
  ) 
  {

  }

  swapTokens(walletAddress: string, amount: string, network: string, token: string): Observable<{ txHash: string }> {
    return this.http.post<{ txHash: string }>(`${this.apiUrl}/swap`, {
      walletAddress,
      amount,
      network,
      token
    });
  }

  checkTransactionStatus(txHash: string): Observable<{ status: string }> {
    return interval(5000).pipe(
      switchMap(() => this.http.get<{ status: string }>(`${this.apiUrl}/tx-status/${txHash}`)),
      takeWhile(response => response.status !== 'confirmed', true)
    );
  }

  runTest(): Observable<{ quote: any; simulationResult: any }> {
    return this.http.get<{quote: any; simulationResult: any}>(`${this.apiUrl}/lifi-tenderly/test`, {
    });
  }

  getQuote(
    fromChain: string,
    toChain: string,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress: string,
    slippage?: number
  ): Observable<{ quote: any }> {
    const params: any = {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      fromAddress,
    };

    if (slippage) {
      params.slippage = slippage;
    }
  
    return this.http.get<{ quote: any }>(`${this.apiUrl}/lifi/quote`, { params }); //todo rename?
  }

  getQuoteBridge(
    fromChain: string,
    toChain: string,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress: string,
    toAddress?: string,
    slippage?: number
  ): Observable<{ quote: any }> {
    const params: any = {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      fromAddress
    };
  
    if (toAddress) {
      params.toAddress = toAddress;
    }

    if (slippage) {
      params.slippage = slippage;
    }
  
    return this.http.get<{ quote: any }>(`${this.apiUrl}/lifi/quote-bridge`, { params });
  }

  getV1(
    originChainId: string | number,
    destinationChainId: string | number,
    originCurrency: string,
    destinationCurrency: string,
    amount: string,
    senderAddress: string,
    receiverAddress?: string,
    tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT' = 'EXACT_INPUT'
  ): Observable<any> {
    const params: any = {
      senderAddress,
      receiverAddress: receiverAddress ?? senderAddress,
      originChainId: Number(originChainId),
      destinationChainId: Number(destinationChainId),
      amount,
      originCurrency,
      destinationCurrency,
      tradeType
    };

    return this.http.get<any>(`${this.apiUrl}/v1/quotes`, { params });
  }

  public async pollStatus(
    txHash: string,
    onInitialLinks?: (sending: string, receiving: string) => void
  ): Promise<any> {
    let result: any;
    
    do {
      try {
        result = await this.getStatus(txHash);
        
        if (result?.sending?.txLink || result?.receiving?.txLink) {
          onInitialLinks?.(
            result?.sending?.txLink || '',
            result?.receiving?.txLink || ''
          );
        }
        
        await this.delay(1000);
      } catch (error) {
        await this.delay(1000);
      }
    } while (!result || (result.status !== 'DONE' && result.status !== 'FAILED'));
    
    return result;
  }

  async getInitialStatus(txHash: string): Promise<any> {
    try {
      return await this.getStatus(txHash);
    } catch (error) {
      // console.log('Error fetching initial status:', error);
      return {};
    }
  }
  
  async waitForCompletion(txHash: string): Promise<any> {
    let result: any;
    
    do {
      try {
        result = await this.getStatus(txHash);
        await this.delay(1000);
      } catch (error) {
        // console.log('Error polling status:', error);
        await this.delay(1000);
      }
    } while (!result || (result.status !== 'DONE' && result.status !== 'FAILED'));
    
    return result;
  }
  
  private async getStatus(txHash: string): Promise<any> {
    try {
      const request = this.http.get('https://li.quest/v1/status', {
        params: { txHash }
      });
      return await lastValueFrom(request);
    } catch (error: any) {
      if (error?.error?.code === 1011 && error?.error?.message.includes("Not a valid txHash")) {
        throw new Error('txHash not yet valid');
      } else {
        throw error;
      }
    }
  }  

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  parseToAmount(toAmount: string, decimals: number): string {
    return (Number(toAmount) / Math.pow(10, decimals)).toString();
  }

  toNonExponential(num: number, decimals: number = 18): string {
    if (!isFinite(num)) return '0';
  
    const [intPart, decPart = ''] = num.toString().split('e').length === 2
      ? Number(num).toFixed(30).split('.')
      : num.toString().split('.');
  
    const trimmedDec = decPart.slice(0, decimals);
    const result = trimmedDec ? `${intPart}.${trimmedDec}` : intPart;
  
    return result.includes('.') ? result.replace(/\.?0+$/, '') : result;
  }
  

  parseGasPriceUSD(gasPriceHex: string, gasLimitHex: string, token: { decimals: number; priceUSD: string }): string {
    const gasPriceWei = parseInt(gasPriceHex, 16);
    const gasLimit = parseInt(gasLimitHex, 16);
  
    const gasCostWei = gasPriceWei * gasLimit;
  
    const gasCostInToken = gasCostWei / Math.pow(10, token.decimals);
  
    const gasCostUSD = gasCostInToken * parseFloat(token.priceUSD);
  
    return gasCostUSD.toFixed(2);
  }

  /**
   * Пуллинг статуса транзакции через receipt
   * @param txHash - хеш транзакции
   * @param rpcUrl - RPC URL для сети
   * @param maxAttempts - максимальное количество попыток (по умолчанию 60)
   * @param delayMs - задержка между попытками в миллисекундах (по умолчанию 5000)
   * @returns Promise с результатом: { success: boolean, receipt?: any, error?: string }
   */
  async pollTransactionReceipt(
    txHash: string, 
    rpcUrl: string, 
    maxAttempts: number = 60, 
    delayMs: number = 5000
  ): Promise<{ success: boolean; receipt?: any; error?: string }> {
    try {
      let receipt = null;
      let attempts = 0;
      
      const ethersProvider = new ethers.JsonRpcProvider(rpcUrl);
      
      do {
        await this.delay(delayMs);
        attempts++;
        
        try {
          receipt = await ethersProvider.getTransactionReceipt(txHash);
          console.log(`Attempt ${attempts}: Receipt received:`, receipt ? 'Yes' : 'No');
          if (receipt) {
            console.log(`Attempt ${attempts}: Receipt status:`, receipt.status);
          }
        } catch (error) {
          console.log(`Attempt ${attempts}: Transaction not yet mined, retrying... Error:`, error);
        }
      } while (!receipt && attempts < maxAttempts);
      
      if (receipt) {
        console.log('Final receipt:', receipt);
        const status = receipt.status;
        if (status === 1) {
          return { success: true, receipt };
        } else {
          return { success: false, receipt, error: 'Transaction failed' };
        }
      } else {
        return { success: false, error: 'Transaction timeout - please check your wallet' };
      }
    } catch (error) {
      console.error('Error polling transaction status:', error);
      return { success: false, error: 'Error checking transaction status' };
    }
  }
}
