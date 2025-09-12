import type { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';
import type { Observable } from 'rxjs';
import { interval, lastValueFrom, switchMap, takeWhile } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private apiUrl = environment.apiUrl;
  private apiBack = environment.apiBack;

  constructor(private http: HttpClient) {}

  swapTokens(
    walletAddress: string,
    amount: string,
    network: string,
    token: string,
  ): Observable<{ txHash: string }> {
    return this.http.post<{ txHash: string }>(`${this.apiUrl}/swap`, {
      walletAddress,
      amount,
      network,
      token,
    });
  }

  checkTransactionStatus(txHash: string): Observable<{ status: string }> {
    return interval(5000).pipe(
      switchMap(() => this.http.get<{ status: string }>(`${this.apiUrl}/tx-status/${txHash}`)),
      takeWhile((response) => response.status !== 'confirmed', true),
    );
  }

  runTest(): Observable<{ quote: any; simulationResult: any }> {
    return this.http.get<{ quote: any; simulationResult: any }>(
      `${this.apiUrl}/lifi-tenderly/test`,
      {},
    );
  }

  getQuote(
    fromChain: string,
    toChain: string,
    fromToken: string,
    toToken: string,
    fromAmount: string,
    fromAddress: string,
    slippage?: number,
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
    slippage?: number,
  ): Observable<{ quote: any }> {
    const params: any = {
      fromChain,
      toChain,
      fromToken,
      toToken,
      fromAmount,
      fromAddress,
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
    tradeType: 'EXACT_INPUT' | 'EXACT_OUTPUT' = 'EXACT_INPUT',
  ): Observable<any> {
    const params: any = {
      senderAddress,
      receiverAddress: receiverAddress ?? senderAddress,
      originChainId: Number(originChainId),
      destinationChainId: Number(destinationChainId),
      amount,
      originCurrency,
      destinationCurrency,
      tradeType,
    };

    return this.http.get<any>(`${this.apiBack}/v1/quotes`, { params });
  }

  public async pollStatus(
    txHash: string,
    onInitialLinks?: (sending: string, receiving: string) => void,
  ): Promise<any> {
    let result: any;

    do {
      try {
        result = await this.getStatus(txHash);

        if (result?.sending?.txLink || result?.receiving?.txLink) {
          onInitialLinks?.(result?.sending?.txLink || '', result?.receiving?.txLink || '');
        }

        await this.delay(1000);
      } catch {
        await this.delay(1000);
      }
    } while (!result || (result.status !== 'DONE' && result.status !== 'FAILED'));

    return result;
  }

  async getInitialStatus(txHash: string): Promise<any> {
    try {
      return await this.getStatus(txHash);
    } catch {
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
      } catch {
        // console.log('Error polling status:', error);
        await this.delay(1000);
      }
    } while (!result || (result.status !== 'DONE' && result.status !== 'FAILED'));

    return result;
  }

  private async getStatus(txHash: string): Promise<any> {
    try {
      const request = this.http.get('https://li.quest/v1/status', {
        params: { txHash },
      });
      return await lastValueFrom(request);
    } catch (error: any) {
      if (error?.error?.code === 1011 && error?.error?.message.includes('Not a valid txHash')) {
        throw new Error('txHash not yet valid');
      } else {
        throw error;
      }
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  parseToAmount(toAmount: string, decimals: number): string {
    return (Number(toAmount) / Math.pow(10, decimals)).toString();
  }

  toNonExponential(num: number, decimals: number = 18): string {
    if (!isFinite(num)) return '0';

    const [intPart, decPart = ''] =
      num.toString().split('e').length === 2
        ? Number(num).toFixed(30).split('.')
        : num.toString().split('.');

    const trimmedDec = decPart.slice(0, decimals);
    const result = trimmedDec ? `${intPart}.${trimmedDec}` : intPart;

    return result.includes('.') ? result.replace(/\.?0+$/, '') : result;
  }

  parseGasPriceUSD(
    gasPriceHex: string,
    gasLimitHex: string,
    token: { decimals: number; priceUSD: string },
  ): string {
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
    delayMs: number = 5000,
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

  /**
   * Poll Solana transaction status by signature.
   * Returns when tx is finalized (success) or failed, or when timeout occurs.
   *
   * @param signature - transaction signature (hash)
   * @param rpcUrl - working RPC url for the network
   * @param maxAttempts - how many attempts before giving up (default 60)
   * @param delayMs - ms between attempts (default 5000)
   */
  async pollTransactionReceiptSvm(
    signature: string,
    rpcUrl: string,
    maxAttempts: number = 60,
    delayMs: number = 5000,
  ): Promise<{
    success: boolean;
    signature: string;
    transaction?: any;
    status?: string;
    error?: string;
  }> {
    const connection = new Connection(rpcUrl, 'confirmed');
    let attempts = 0;

    if (!signature) {
      return { success: false, signature, error: 'Empty signature' };
    }

    try {
      do {
        attempts++;

        try {
          const statuses = await connection.getSignatureStatuses([signature]);
          const status = statuses?.value?.[0] ?? null;

          if (!status) {
            // console.log(`SVM: signature ${signature} not found yet (attempt ${attempts})`);
          } else {
            if (status.err) {
              // console.log(`SVM: signature ${signature} failed (attempt ${attempts}):`, status.err);
              return {
                success: false,
                signature,
                status: 'FAILED',
                error: JSON.stringify(status.err),
              };
            }

            if (status.confirmationStatus === 'finalized') {
              try {
                const tx = await connection.getTransaction(signature, {
                  commitment: 'finalized',
                  maxSupportedTransactionVersion: 0,
                });
                return { success: true, signature, transaction: tx, status: 'FINALIZED' };
              } catch (txErr: any) {
                const msg = txErr?.message ?? String(txErr);
                console.warn(
                  `SVM: getTransaction failed for finalized tx ${signature} (attempt ${attempts}):`,
                  msg,
                );

                if (msg.includes('maxSupportedTransactionVersion')) {
                  try {
                    const tx = await connection.getTransaction(signature, {
                      commitment: 'finalized',
                      maxSupportedTransactionVersion: 0,
                    });
                    return { success: true, signature, transaction: tx, status: 'FINALIZED' };
                  } catch {
                    console.warn(
                      'SVM: retry getTransaction with maxSupportedTransactionVersion failed — treating tx as FINALIZED.',
                    );
                    return { success: true, signature, status: 'FINALIZED' };
                  }
                }

                return { success: true, signature, status: 'FINALIZED' };
              }
            }

            // console.log(`SVM: signature ${signature} pending (attempt ${attempts}) - confirmationStatus=${status.confirmationStatus}, confirmations=${status.confirmations}`);
          }
        } catch (innerErr: any) {
          console.warn(
            `SVM: error checking signature status (attempt ${attempts}):`,
            innerErr?.message ?? innerErr,
          );
        }

        await this.delay(delayMs);
      } while (attempts < maxAttempts);

      return {
        success: false,
        signature,
        status: 'TIMEOUT',
        error: 'Timeout waiting for transaction confirmation',
      };
    } catch (err: any) {
      console.error('SVM: unexpected error polling transaction:', err);
      return { success: false, signature, error: err && err.message ? err.message : String(err) };
    }
  }
}
