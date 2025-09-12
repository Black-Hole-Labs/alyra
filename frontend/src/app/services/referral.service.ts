import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { environment } from '../../environments/environment';

export interface ReferralInfo {
  id: number;
  referrerCode: string;
  referrerAddress: string;
  chainId: number;
  createdAt: string;
}

export interface UserReferralInfo {
  id: number;
  referralId: number;
  userAddress: string;
  userChainId: number;
  joinedAt: string;
}

export interface ReferralStats {
  id: number;
  totalVolume: number;
  totalVolumeReferred: number;
  totalReferrals: number;
  totalCommissions: number;
  pendingCommissions: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private readonly API_BASE_URL = environment.apiUrl || 'http://localhost:3000';

  // Флаги для предотвращения повторных запросов
  private isGettingStats = false;
  private lastStatsRequest: { code: string; timestamp: number } | null = null;
  private readonly STATS_CACHE_DURATION = 5000; // 5 секунд кэширования

  // Сигналы
  readonly referralInfo = signal<ReferralInfo | null>(null);
  readonly isReferral = signal<boolean>(false);
  readonly hasJoined = signal<boolean>(false);
  readonly referralStats = signal<ReferralStats | null>(null);

  constructor(private http: HttpClient) {
    this.clearReferralCodeFromStorage();
  }

  // Сохранение реферального кода в localStorage
  private saveReferralCodeToStorage(code: string): void {
    localStorage.setItem('referralCode', code);
  }

  // Очистка реферального кода из localStorage
  private clearReferralCodeFromStorage(): void {
    localStorage.removeItem('referralCode');
  }

  // Получение реферального кода из URL
  getReferralCodeFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref') || urlParams.get('referral');
  }

  // Установка реферального кода из URL
  setReferralCodeFromUrl(): void {
    const codeFromUrl = this.getReferralCodeFromUrl();
    if (codeFromUrl) {
      this.saveReferralCodeToStorage(codeFromUrl);
    }
  }

  // Получение реферального кода из localStorage
  getReferralCodeFromStorage(): string | null {
    return localStorage.getItem('referralCode');
  }

  // Регистрация реферала (создание интегратора)
  async registerReferral(address: string, chainId: number): Promise<ReferralInfo> {
    try {
      const response = await this.http.post<ReferralInfo>(`${this.API_BASE_URL}/referral/register`, {
        referrerAddress: address,
        chainId: chainId
      }).toPromise();
      
      if (response) {
        this.referralInfo.set(response);
        this.isReferral.set(true);
        // Сохраняем код в localStorage для будущего использования
        this.saveReferralCodeToStorage(response.referrerCode);
        return response;
      }
      throw new Error('Failed to register referral');
    } catch (error) {
      console.error('Error registering referral:', error);
      throw error;
    }
  }

  // Регистрация реферала с существующим кодом
  async registerReferralWithCode(code: string, address: string, chainId: number): Promise<ReferralInfo> {
    try {
      const response = await this.http.post<ReferralInfo>(`${this.API_BASE_URL}/referral/register-with-code`, {
        referrerCode: code,
        referrerAddress: address,
        chainId: chainId
      }).toPromise();
      
      if (response) {
        this.referralInfo.set(response);
        this.isReferral.set(true);
        // Сохраняем код в localStorage для будущего использования
        this.saveReferralCodeToStorage(response.referrerCode);
        return response;
      }
      throw new Error('Failed to register referral with code');
    } catch (error) {
      console.error('Error registering referral with code:', error);
      throw error;
    }
  }

  // Получение информации о реферале
  async getReferralInfo(address: string, chainId: number): Promise<ReferralInfo | null> {
    try {
      const response = await this.http.get<ReferralInfo>(`${this.API_BASE_URL}/referral/info/${address}?chainId=${chainId}`).toPromise();
      if (response) {
        this.referralInfo.set(response);
        this.isReferral.set(true);
        // Сохраняем код в localStorage для будущего использования
        this.saveReferralCodeToStorage(response.referrerCode);
        return response;
      }
      return null;
    } catch (error) {
      console.error('Error getting referral info:', error);
      return null;
    }
  }

  // Присоединение пользователя к рефералу
  async joinReferral(userAddress: string, userChainId: number): Promise<UserReferralInfo> {
    const referralCode = this.getReferralCodeFromUrl();
    if (!referralCode) {
      throw new Error('No referral code in URL');
    }

    try {
      const response = await this.http.post<UserReferralInfo>(`${this.API_BASE_URL}/referral/join`, {
        referrerCode: referralCode,
        userAddress,
        userChainId
      }).toPromise();
      
      if (response) {
        this.hasJoined.set(true);
        return response;
      }
      throw new Error('Failed to join referral');
    } catch (error) {
      console.error('Error joining referral:', error);
      throw error;
    }
  }

  // Проверка, является ли адрес рефералом
  // async checkReferral(address: string, network: string): Promise<boolean> {
  //   try {
  //     const response = await this.http.get<{ isReferral: boolean }>(`${this.API_BASE_URL}/referral/check/${address}?network=${network}`).toPromise();
  //     if (response) {
  //       this.isReferral.set(response.isReferral);
  //       return response.isReferral;
  //     }
  //     return false;
  //   } catch (error) {
  //     console.error('Error checking referral:', error);
  //     return false;
  //   }
  // }

  // Получение статистики реферала по коду (все сети)
  async getReferralStatsByCode(code: string): Promise<ReferralStats | null> {
    // Проверяем, не выполняется ли уже запрос
    if (this.isGettingStats) {
      console.log('[ReferralService.getReferralStatsByCode] Request already in progress, skipping...');
      return this.referralStats();
    }

    // Проверяем кэш - если недавно запрашивали тот же код, возвращаем кэшированный результат
    if (this.lastStatsRequest && 
        this.lastStatsRequest.code === code && 
        Date.now() - this.lastStatsRequest.timestamp < this.STATS_CACHE_DURATION) {
      console.log('[ReferralService.getReferralStatsByCode] Using cached stats for code:', code);
      return this.referralStats();
    }

    this.isGettingStats = true;
    this.lastStatsRequest = { code, timestamp: Date.now() };

    try {
      console.log('[ReferralService.getReferralStatsByCode] Calling with code:', code);
      const response = await this.http.get<ReferralStats>(`${this.API_BASE_URL}/referral/stats-by-code/${code}`).toPromise();
      if (response) {
        this.referralStats.set(response);
        return response;
      }
      return null;
    } catch (error) {
      console.error('Error getting referral stats by code:', error);
      return null;
    } finally {
      this.isGettingStats = false;
    }
  }

  // Принудительное получение статистики реферала (игнорирует кэш)
  async forceGetReferralStatsByCode(code: string): Promise<ReferralStats | null> {
    this.lastStatsRequest = null; // Сбрасываем кэш
    return this.getReferralStatsByCode(code);
  }

  // Очистка данных при отключении кошелька
  clearReferralData(): void {
    this.referralInfo.set(null);
    this.isReferral.set(false);
    this.hasJoined.set(false);
    this.referralStats.set(null);
    // НЕ очищаем referralCode из localStorage, чтобы он сохранился при переподключении
  }

  // Получение реферальной ссылки
  getReferralLink(): string {
    if (!this.referralInfo()) {
      return window.location.origin;
    }
    
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('ref', this.referralInfo()!.referrerCode);
    return currentUrl.toString();
  }

  // Копирование реферальной ссылки в буфер обмена
  async copyReferralLink(): Promise<boolean> {
    try {
      const link = this.getReferralLink();
      await navigator.clipboard.writeText(link);
      return true;
    } catch (error) {
      console.error('Error copying referral link:', error);
      return false;
    }
  }
} 