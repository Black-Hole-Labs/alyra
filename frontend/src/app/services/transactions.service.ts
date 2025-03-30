import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { interval, lastValueFrom, Observable, switchMap, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private apiUrl = 'http://localhost:3000';

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

  public async pollStatus(txHash: string): Promise<'DONE' | 'FAILED'> {
    let result: any;
    do {
      result = await this.getStatus(txHash);
      await this.delay(1000);
    } while (result.status !== 'DONE' && result.status !== 'FAILED');

    console.log(`Transfer completed with state ${result.status}`);
    return result.status;
  }

  private async getStatus(txHash: string): Promise<any> {
    const request = this.http.get('https://li.quest/v1/status', {
      params: { txHash }
    });
    return await lastValueFrom(request);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  parseToAmount(toAmount: string, decimals: number): string {
    return (Number(toAmount) / Math.pow(10, decimals)).toFixed(6);
  }

  parseGasPriceUSD(gasPriceHex: string, gasLimitHex: string, token: { decimals: number; priceUSD: string }): string {
    // Конвертируем gasPrice и gasLimit из hex в десятичное число
    const gasPriceWei = parseInt(gasPriceHex, 16);
    const gasLimit = parseInt(gasLimitHex, 16);
  
    // Рассчитываем общую стоимость газа в Wei
    const gasCostWei = gasPriceWei * gasLimit;
  
    // Переводим Wei в токены, используя decimals токена
    const gasCostInToken = gasCostWei / Math.pow(10, token.decimals);
  
    // Умножаем на цену токена в USD
    const gasCostUSD = gasCostInToken * parseFloat(token.priceUSD);
  
    // Форматируем результат
    return gasCostUSD.toFixed(2); // Округляем до 2 знаков после запятой
  }
}
