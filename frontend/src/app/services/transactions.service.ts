import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, interval, Observable, switchMap, takeWhile } from 'rxjs';

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
    fromAddress: string
  ): Observable<{ quote: any }> {
    const params = {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      fromAddress,
    };
  
    return this.http.get<{ quote: any }>(`${this.apiUrl}/lifi/quote`, { params });
  }
}
