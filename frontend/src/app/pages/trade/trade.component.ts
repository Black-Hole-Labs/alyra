import { Component, Renderer2, ChangeDetectorRef, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component'; // Импортируем SettingsComponent
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionRequest } from '../../models/wallet-provider.interface';
import { parseUnits } from 'ethers';

export interface Token {
  symbol: string;
  imageUrl: string;
  contractAddress: string;
  decimals: string;
}


@Component({
  selector: 'app-trade',
  standalone: true,
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css'],
  imports: [
    FormsModule,
    CommonModule,
    TokenChangePopupComponent,
    SettingsComponent, // Добавляем SettingsComponent в imports
  ],
})
export class TradeComponent {
  sellAmount: string = ''; // Значение, которое пользователь вводит в поле продажи
  //validatedSellAmount: string = ''; 
  validatedSellAmount = signal<string>('');
  buyAmount: string = ''; // Значение для поля покупки, рассчитывается автоматически
  price: number = 0.5637; // Цена обмена
  priceUsd: number = 921244; // Текущая стоимость в USD за единицу
  sellPriceUsd: string = ''; // Значение для отображения стоимости продажи в USD
  balance: number = 0.1465; // Баланс пользователя для продажи
  rotationCount: number = 0; // Счетчик для отслеживания вращений
	slippage: string = 'Auto'; // Значение для отображения Slippage

  // Управление попапами
  showTokenPopup = false; // Управляет отображением попапа для sell
  showTokenBuyPopup = false; // Управляет отображением попапа для buy
	showSettingsPopup = false; // Управляет отображением попапа для settings
  selectedToken = signal<Token | undefined>(undefined);
  selectedBuyToken = signal<Token | undefined>(undefined);
  //selectedToken = 'ETH'; // Текущий выбранный токен для sell
  //selectedBuyToken = 'USDT'; // Текущий выбранный токен для buy
  //selectedTokenImage = '/img/trade/eth.png'; // Изображение для sell
  //selectedBuyTokenImage = '/img/trade/usdt.png'; // Изображение для buy
  //selectedTokenAddress = '';
  //selectedBuyTokenAddress = '';
  //selectedTokenBuydecimals = '';
  //selectedTokendecimals = '';
  txData: TransactionRequest | undefined = undefined;

  allFieldsReady = computed(() =>
    !!this.blockchainStateService.network &&
    !!this.blockchainStateService.walletAddress() &&
    this.selectedToken() !== undefined &&
    this.selectedBuyToken() !== undefined &&
    this.validatedSellAmount().trim() !== ''
  );

  private inputTimeout: any;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private blockchainStateService: BlockchainStateService,
    private transactionsService: TransactionsService
  ) {}

  processInput(event: Event, isSell: boolean): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
      .replace(/[^0-9.,]/g, '') // Удаляем недопустимые символы
      .replace(/(,|\.){2,}/g, '') // Удаляем лишние точки или запятые
      .replace(/^(,|\.)/g, '') // Удаляем точку или запятую в начале
      .replace(/,/g, '.'); // Заменяем запятую на точку

    if (isSell) {
      this.sellAmount = inputElement.value;
      this.validatedSellAmount.set(inputElement.value);
      // this.updateBuyAmount();
      // this.updateSellPriceUsd();
      clearTimeout(this.inputTimeout);

      this.inputTimeout = setTimeout(() => {
        this.getTxData();
      }, 2000);
    }
    console.log("some data");
  }

  updateBuyAmount(): void {
    if (this.sellAmount) {
      const sellValue = parseFloat(this.sellAmount);
      if (!isNaN(sellValue)) {
        this.buyAmount = (sellValue * this.price).toFixed(4);
      } else {
        this.buyAmount = '';
      }
    } else {
      this.buyAmount = '';
    }
  }

  updateSellPriceUsd(): void {
    if (this.sellAmount) {
      const sellValue = parseFloat(this.sellAmount);
      if (!isNaN(sellValue)) {
        this.sellPriceUsd = `$${(sellValue * this.priceUsd).toFixed(2)}`;
      } else {
        this.sellPriceUsd = '';
      }
    } else {
      this.sellPriceUsd = '';
    }
  }

  setMaxSellAmount(): void {
    this.sellAmount = this.balance.toString();
    this.updateBuyAmount();
    this.updateSellPriceUsd();
  }

  rotateRefresh(): void {
    const refreshElement = document.querySelector('.refresh');
    if (refreshElement) {
      this.rotationCount += 1;
      this.renderer.setStyle(refreshElement, 'transform', `rotate(${this.rotationCount * -720}deg)`);
    }
  }

  // Управление анимацией
  onMouseDown(): void {
		console.log('Mouse down triggered');
		const changeButton = document.getElementById('change-button');
		if (changeButton && !changeButton.classList.contains('animate')) {
			this.renderer.addClass(changeButton, 'animate');
		}
	}
	
	onAnimationEnd(): void {
		console.log('Animation ended, swapping tokens...');
		const changeButton = document.getElementById('change-button');
		if (changeButton && changeButton.classList.contains('animate')) {
			this.renderer.removeClass(changeButton, 'animate');
			this.swapTokens();
		}
	}
	
	swapTokens(): void {
		console.log('Swapping tokens...');
		console.log('Before swap:', this.selectedToken, this.selectedBuyToken());
	
		const tempToken = this.selectedToken();
		this.selectedToken.set(this.selectedBuyToken());
		this.selectedBuyToken.set(tempToken);
	
		console.log('After swap:', this.selectedToken, this.selectedBuyToken);

    //this.getTxData();
	}
	
	

  // Методы управления попапом для sell
  openTokenPopup(): void {
    this.showTokenPopup = true;
  }

  closeTokenPopup(): void {
    this.showTokenPopup = false;
  }

  onTokenSelected(token: { symbol: string; imageUrl: string; contractAddress: string; decimals: string }): void {
    this.selectedToken.set(token);
    // this.selectedToken = token.symbol;
    // this.selectedTokenImage = token.imageUrl;
    // this.selectedTokenAddress = token.contractAddress;
    // this.selectedTokendecimals = token.decimals;
    this.closeTokenPopup();
  }

  // Методы управления попапом для buy
  openTokenBuyPopup(): void {
    this.showTokenBuyPopup = true;
  }

  closeTokenBuyPopup(): void {
    this.showTokenBuyPopup = false;
  }

  onBuyTokenSelected(token: { symbol: string; imageUrl: string; contractAddress: string; decimals: string }): void {
    this.selectedBuyToken.set(token);
    // this.selectedBuyToken = token.symbol;
    // this.selectedBuyTokenImage = token.imageUrl;
    // this.selectedBuyTokenAddress = token.contractAddress;
    // this.selectedTokenBuydecimals = token.decimals;
    this.closeTokenBuyPopup();
  }

	// Settings popup
	toggleSettingsPopup(): void {
		this.showSettingsPopup = !this.showSettingsPopup;
	}

	onSlippageSave(value: string): void {
    this.slippage = value;
    this.showSettingsPopup = false; // Закрываем popup после сохранения
  }

  async swap() {
    //this.loading = true;

    const provider = this.blockchainStateService.getCurrentProvider().provider;

    console.log("provider",provider);

    const txHash = provider.sendTx(this.txData);

    console.log("txHash",txHash);
    
  }

  test(){
    this.transactionsService.runTest().subscribe({
      next: (response) => {
        console.log('Quote:', response.quote);
        console.log('Simulation Result:', response.simulationResult);
      },
      error: (error) => {
        console.error('Ошибка запроса:', error);
      }
    });
  }

  getTxData() {
    const fromChain = this.blockchainStateService.network()!;
    const toChain = this.blockchainStateService.network()!;
    const fromAddress = this.blockchainStateService.walletAddress()!;
    //const fromTokenDecimals = this.selectedTokendecimals;
    const fromTokenDecimals = this.selectedToken()!.decimals;
    //const fromAmount = this.validatedSellAmount;
    const fromAmount = parseUnits(this.validatedSellAmount(), fromTokenDecimals);
    //const fromToken = this.selectedTokenAddress;
    const fromToken = this.selectedToken()!.contractAddress;
    const toToken = this.selectedBuyToken()!.contractAddress;
    const toTokenDecimals = this.selectedBuyToken()!.decimals;
    // const toToken = this.selectedBuyTokenAddress;
    // const toTokenDecimals = this.selectedTokenBuydecimals;

    const adjustedFromAmount = fromAmount.toString();
  
    if (!fromChain || !toChain || !fromAddress || !fromAmount || !fromToken || !toToken || !fromTokenDecimals) {
      console.log("fromChain",fromChain);
      console.log("toChain",toChain);
      console.log("fromAddress",fromAddress);
      console.log("fromAmount",fromAmount);
      console.log("fromToken",fromToken);
      console.log("toToken",toToken);
      console.log("fromTokenDecimals",fromTokenDecimals);
      
      console.log("adjusted From Amount",adjustedFromAmount);

      console.error('Missing required parameters');
      return;
    }
    //const adjustedFromAmount = '1000000000';
    this.transactionsService.getQuote(fromChain, toChain, fromToken, toToken, adjustedFromAmount, fromAddress)
    .subscribe({
      next: (response: any) => {
        console.log('Quote received:', response);
        if (response.estimate && response.transactionRequest) 
        {
          const readableToAmount = this.parseToAmount(response.estimate.toAmount, Number(toTokenDecimals));
        
          console.log('readableToAmount:', readableToAmount);

          const gasPriceHex = response.transactionRequest.gasPrice;
          const gasLimitHex = response.transactionRequest.gasLimit;
          const gasToken = response.estimate.gasCosts?.[0]?.token;

          const gasPriceUSD = this.parseGasPriceUSD(gasPriceHex, gasLimitHex, gasToken);
          
          console.log('gasPriceUSD:', gasPriceUSD);
        }
        else 
        {
          console.error("Missing estimate or transactionRequest in response.");
        }

        if(response.transactionRequest.data)
        {
          this.txData = response.transactionRequest;
        }
        
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.error('Custom error message:', error || 'Unknown error');
          console.error('Custom error message:', error.error?.message || 'Unknown error');
        } else {
          console.error('Unexpected error:', error);
        }
      },
      complete: () => {
        console.log('Quote request completed');
      }
    });

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
