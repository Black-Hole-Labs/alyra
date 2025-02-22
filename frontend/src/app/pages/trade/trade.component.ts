import { Component, Renderer2, ChangeDetectorRef, computed, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component'; // Импортируем SettingsComponent
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionRequestEVM, TransactionRequestSVM } from '../../models/wallet-provider.interface';
import { ethers, parseUnits, ZeroAddress } from 'ethers';
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
  loading = signal<boolean>(false);
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
  txData = signal<TransactionRequestEVM | TransactionRequestSVM | undefined> (undefined);
  
  firstToken = computed(() => {
    const tokens = this.blockchainStateService.filteredTokens();
    return tokens.length > 0 ? tokens[0] : undefined;
  });

  swapButtonValidation = computed(() =>
    this.txData() !== undefined
  );

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
  ) {
    effect(() => {
      if (this.allFieldsReady()) {
        this.getTxData();
      }
    });

    effect(
      () => {
        const tokens = this.blockchainStateService.filteredTokens();
        this.selectedToken.set(tokens.length > 0 ? tokens[0] : undefined);
        this.selectedBuyToken.set(tokens.length > 1 ? tokens[1] : undefined);
      },
      { allowSignalWrites: true }
    );
  }

  processInput(event: Event, isSell: boolean): void {
    this.txData.set(undefined);
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
      .replace(/[^0-9.,]/g, '') // Удаляем недопустимые символы
      .replace(/(,|\.){2,}/g, '') // Удаляем лишние точки или запятые
      .replace(/^(,|\.)/g, '') // Удаляем точку или запятую в начале
      .replace(/,/g, '.'); // Заменяем запятую на точку

    if (isSell) {
      // this.updateBuyAmount();
      // this.updateSellPriceUsd();
      clearTimeout(this.inputTimeout);

      this.inputTimeout = setTimeout(() => {
        this.sellAmount = inputElement.value;
        this.validatedSellAmount.set(inputElement.value);
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
    this.txData.set(undefined);
	
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
    this.txData.set(undefined);
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
    this.txData.set(undefined);
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
    this.loading.set(true);
    console.log("a");
    if(this.blockchainStateService.network() === "1151111081099710")
    {
      console.log("b");
      await this.svmSwap();
      console.log("c");
    }
    else
    {
      await this.evmSwap();
    }
    

    //todo check for status from lifi
    this.loading.set(false);
  }

  async svmSwap() {
    const txData = this.txData(); // Ожидаем тип TransactionRequestSVM
    if (!txData) {
      throw new Error("missing data transaction");
    }
    console.log("d");
    const provider = this.blockchainStateService.getCurrentProvider().provider;
  
    // Если требуется, здесь можно дополнительно подготовить транзакцию через @solana/web3.js.
    // Например, если txData.data содержит закодированные инструкции,
    // можно создать Transaction, установить recentBlockhash и feePayer.
    // Для простоты предполагаем, что provider.sendTx умеет работать с объектом txData напрямую.
    console.log("e");
    const txHash = await provider.sendTx(txData);
    console.log("z");
    console.log("SVM Swap транзакция отправлена:", txHash);
  }

  async evmSwap(){
    const provider = this.blockchainStateService.getCurrentProvider().provider;

    const signer = await provider.signer;

    const fromToken = this.selectedToken()!.contractAddress;
    if(fromToken === ethers.ZeroAddress){
      const txHash = await provider.sendTx(this.txData());
      return;
    }

    const erc20Contract = new ethers.Contract(
      fromToken,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)"
      ],
      signer
    );

    //const fromAddress = this.blockchainStateService.walletAddress()!;
    const fromTokenDecimals = this.selectedToken()!.decimals;
    const approveAmount = parseUnits(this.validatedSellAmount(), fromTokenDecimals)

    // const allowance = await erc20Contract["allowance"](fromAddress, this.txData()?.to);
    // console.log("allowance",allowance);

    const approveTx = await erc20Contract["approve"]((this.txData() as TransactionRequestEVM).to, approveAmount);
    
    console.log("a");

    await approveTx.wait();

    console.log("Approve успешно выполнен:", approveTx.hash);

    const txHash = await provider.sendTx(this.txData(), true);

    console.log("txHash",txHash);
    console.log("this.loading()",this.loading());
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
    
    console.log("fromAddress",fromAddress);
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
          if(this.blockchainStateService.network() === "1151111081099710")
          {
            this.txData.set(response.transactionRequest as TransactionRequestSVM);
          }
          else
          {
            this.txData.set(response.transactionRequest as TransactionRequestEVM);
          }
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
