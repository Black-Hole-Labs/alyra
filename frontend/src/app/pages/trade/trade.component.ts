import { Component, Renderer2, ChangeDetectorRef, computed, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component'; // Импортируем SettingsComponent
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { WalletBalanceService } from '../../services/wallet-balance.service';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TransactionRequestEVM, TransactionRequestSVM } from '../../models/wallet-provider.interface';
import { ethers, parseUnits, ZeroAddress } from 'ethers';
import { PopupService } from '../../services/popup.service';
import { SuccessNotificationComponent } from '../../components/notification/success-notification/success-notification.component';
import { FailedNotificationComponent } from '../../components/notification/failed-notification/failed-notification.component';
import { PendingNotificationComponent } from '../../components/notification/pending-notification/pending-notification.component';

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
  styleUrls: ['./trade.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    TokenChangePopupComponent,
    SettingsComponent,
    SuccessNotificationComponent,
    FailedNotificationComponent,
    PendingNotificationComponent
],
})
export class TradeComponent {
//[x: string]: any;
  sellAmount: string = ''; // Значение, которое пользователь вводит в поле продажи
  //validatedSellAmount: string = ''; 
  validatedSellAmount = signal<string>('');
  loading = signal<boolean>(false);

  buyAmount = signal<number | undefined>(undefined);
  price: number = 0.5637; // Цена обмена
  priceUsd: number = 921244; // Текущая стоимость в USD за единицу
  sellPriceUsd = signal<string>('');
  buyPriceUsd = signal<string>('');
  balance = signal<number>(0.0);
  balanceBuy = signal<number>(0.0);
  rotationCount: number = 0; // Счетчик для отслеживания вращений
	slippage: number = 0.005; //  // 0.005 is default for LIFI

  // showTokenPopup = false;
  // showTokenBuyPopup = false;
	//showSettingsPopup = false;
  selectedToken = signal<Token | undefined>(undefined);
  selectedBuyToken = signal<Token | undefined>(undefined);
  //showConnectWalletPopup: boolean = false;
  txData = signal<TransactionRequestEVM | TransactionRequestSVM | undefined> (undefined);

  walletTimer: any = null;
  findingRoutesTimer: any = null;

  showSuccessNotification = false;
  showFailedNotification = false;
  showPendingNotification = false;

  buttonState: 'swap' | 'finding' | 'approve' | 'wallet' | 'insufficient' = 'swap';
  
  firstToken = computed(() => {
    const tokens = this.blockchainStateService.filteredTokens();
    return tokens.length > 0 ? tokens[0] : undefined;
  });

  swapButtonValidation = computed(() =>
    this.txData() !== undefined
  );

  allFieldsReady = computed(() =>
    !!this.blockchainStateService.network() &&
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
    private walletBalanceService: WalletBalanceService,
    private transactionsService: TransactionsService,
    public popupService: PopupService
  ) {
      effect(() => 
      {
        if (this.allFieldsReady()) 
        {
          this.getTxData();
        }
      });

      effect(() => 
      {
        const isConnected = this.blockchainStateService.connected();
        const tokens = this.blockchainStateService.filteredTokens();
        
        const newSelectedToken = tokens.length > 0 ? tokens[0] : undefined;
        const newSelectedBuyToken = tokens.length > 1 ? tokens[1] : undefined;
    
        this.selectedToken.set(newSelectedToken);
        this.selectedBuyToken.set(newSelectedBuyToken);

        Promise.resolve().then(() =>
          {
            if (isConnected && this.selectedToken()) 
            {
                this.getBalanceForToken(this.selectedToken()!)
                    .then((balanceStr) => 
                    {
                        this.balance.set(Number(parseFloat(balanceStr).toFixed(6)));
                    })
                    .catch((error) => 
                    {
                        console.error('Error getting balance sell: ', error);
                        this.balance.set(0.0);
                    });
            }
    
            if (isConnected && this.selectedBuyToken()) 
            {
                this.getBalanceForToken(this.selectedBuyToken()!)
                    .then((balanceStr) => 
                    {
                        this.balanceBuy.set(Number(parseFloat(balanceStr).toFixed(6)));
                    })
                    .catch((error) => 
                    {
                        console.error('Error getting balance buy: ', error);
                        this.balanceBuy.set(0.0);
                    });
            }
        });
    }, { allowSignalWrites: true });
  }

  processInput(event: Event, isSell: boolean): void {
    this.txData.set(undefined);
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
      .replace(/[^0-9.,]/g, '') // Удаляем недопустимые символы
      .replace(/(,|\.){2,}/g, '') // Удаляем лишние точки или запятые
      .replace(/^(,|\.)/g, '') // Удаляем точку или запятую в начале
      .replace(/,/g, '.'); // Заменяем запятую на точку


    // if (Number(this.sellAmount) > this.balance) {
    //   this.buttonState = 'insufficient';
    //   // Очищаем таймеры, так как они нам не нужны в этом состоянии
    //   this.resetTimers();
    //   return;
    // } todo?

    if (isSell) {
      //this.updateBuyAmount();
      //this.updateSellPriceUsd();
      clearTimeout(this.inputTimeout);

      this.inputTimeout = setTimeout(() => {
        this.sellAmount = inputElement.value;
        this.validatedSellAmount.set(inputElement.value);
      }, 2000);
    }
    console.log("some data");
  }

  updateBuyAmount(value: number): void {
    if (!isNaN(value)) {
      this.buyAmount.set(Number((value).toFixed(6)));
    } else {
      this.buyAmount.set(0);
    }
  }

  updateSellPriceUsd(price: number): void {
    if (!isNaN(price)) {
      this.sellPriceUsd.set(`$${Number(price).toFixed(2)}`);
    } else {
      this.sellPriceUsd.set('');
    }
  }

  updateBuyPriceUsd(price: number): void {
    if (!isNaN(price)) {
      this.buyPriceUsd.set(`$${Number(price).toFixed(2)}`);
    } else {
      this.buyPriceUsd.set('');
    }
  }

  setMaxSellAmount(): void {
    this.sellAmount = this.balance.toString();
    //this.updateBuyAmount();
    //this.updateSellPriceUsd();
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

  openTokenPopup(): void {
    this.popupService.openPopup('tokenChangeSell');
  }

  closeTokenPopup(): void {
    this.popupService.closePopup('tokenChangeSell');
  }

  async onTokenSelected(token: Token): Promise<void> {
    this.txData.set(undefined);
    this.selectedToken.set(token);
    this.balance.set(Number((parseFloat(await this.getBalanceForToken(token))).toFixed(6)));
    // this.selectedToken = token.symbol;
    // this.selectedTokenImage = token.imageUrl;
    // this.selectedTokenAddress = token.contractAddress;
    // this.selectedTokendecimals = token.decimals;
    this.closeTokenPopup();
  }

  async getBalanceForToken(token: Token): Promise<any> {
    const walletAddress = this.blockchainStateService.getCurrentWalletAddress();
    if (!walletAddress)
    {
      console.error(`Failed to get wallet address`);
      return;
    }

    if(this.blockchainStateService.getCurrentNetwork()?.id === 1151111081099710) { // SVM
      if (token.symbol === "SOL") // change to adres
      {
        return this.walletBalanceService.getSolanaBalance(walletAddress);
      }
      else
      {
        return this.walletBalanceService.getSolanaBalance(walletAddress, token.contractAddress);
      }
    }
    else { // EVM
      try {
        const response = await fetch('/data/networks.json');
        if (!response.ok) {
          console.error('Failed to load networks');
        }
  
        const data = await response.json();
  
        const network = data.find((net: { id: number }) => net.id === this.blockchainStateService.getCurrentNetwork()?.id);
  
        if (!network) {
          console.error('Network not found');
        }
  
        if (token.symbol === "ETH") {
          const balance = await this.walletBalanceService.getEvmBalance(walletAddress, network.rpcUrls[0], Number(token.decimals));
          return balance;
        } else {
          return await this.walletBalanceService.getEvmBalance(walletAddress, network.rpcUrls[0], Number(token.decimals), token.contractAddress);
        }
      } catch (error) {
        console.error(`Error loading networks`);
        return "0";
      }
    }
    
  }

  // Методы управления попапом для buy
  openTokenBuyPopup(): void {
    this.popupService.openPopup('tokenChangeBuy');
  }

  closeTokenBuyPopup(): void {
    this.popupService.closePopup('tokenChangeBuy');
  }

  async onBuyTokenSelected(token: Token): Promise<void> {
    this.txData.set(undefined);
    this.selectedBuyToken.set(token);
    this.balanceBuy.set(Number(parseFloat(await this.getBalanceForToken(token)).toFixed(6)));
    // this.selectedBuyToken = token.symbol;
    // this.selectedBuyTokenImage = token.imageUrl;
    // this.selectedBuyTokenAddress = token.contractAddress;
    // this.selectedTokenBuydecimals = token.decimals;
    this.closeTokenBuyPopup();
    this.popupService.closeAllPopups();
  }

	get showSettingsPopup(): boolean {
    return this.popupService.getCurrentPopup() === 'settings';
  }

  toggleSettingsPopup(): void {
    if (this.showSettingsPopup) {
      this.popupService.closePopup('settings');
    } else {
      this.popupService.openPopup('settings');
    }
  }

	onSlippageSave(value: string): void {
    if (value === "Auto")
    {
      console.log("Slippate is Auto. Default value is 0.005 (0.5%)");
      this.slippage = 0.005;
    }
    else
    {
      const val = parseFloat(value.replace('%', ''));
      if (val > 49.9)
      {
          throw "Slippage is too high!";
      }
  
      this.slippage = val / 100;
      console.log(`Slippage set: ${this.slippage}; (${val}%)`);
    }

    //this.showSettingsPopup = false; // Закрываем popup после сохранения
  }

  async swap() {
    this.showPendingNotification = true;
    this.showSuccessNotification = false;
    this.showFailedNotification = false;
    this.cdr.detectChanges();
  
    
    let txHash: string;
    if (this.blockchainStateService.network()?.id === 1151111081099710) {
      txHash = await this.svmSwap();
    } else {
      txHash = await this.evmSwap();
    }
    
    const finalStatus = await this.transactionsService.pollStatus(txHash);
    
    this.showPendingNotification = false;
    if (finalStatus === 'DONE') {
      this.showSuccessNotification = true;
    } else {
      this.showFailedNotification = true;
    }
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showSuccessNotification = false;
      this.showFailedNotification = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  async svmSwap(): Promise<string> {
    const txData = this.txData(); 
    if (!txData) {
      throw new Error("missing data transaction");
    }
    const provider = this.blockchainStateService.getCurrentProvider().provider;
  
    const txHash = await provider.sendTx(txData);

    console.log("SVM Swap транзакция отправлена:", txHash);
    return txHash;
  }

  async evmSwap(): Promise<string>{
    const provider = this.blockchainStateService.getCurrentProvider().provider;

    const signer = await provider.signer;

    const fromToken = this.selectedToken()!.contractAddress;
    if(fromToken === ethers.ZeroAddress){
      const txHash = await provider.sendTx(this.txData());
      return txHash;
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

    this.showPendingNotification = false;

    console.log("Approve успешно выполнен:", approveTx.hash);

    this.buttonState = 'swap';

    this.showPendingNotification = true;

    const txHash = await provider.sendTx(this.txData(), true);


    console.log("txHash",txHash);
    console.log("this.loading()",this.loading());
    return txHash;
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

    const fromChain = this.blockchainStateService.network()!.id.toString();
    const toChain = this.blockchainStateService.network()!.id.toString();
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

    console.log("fromChain",fromChain);
  
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

    const slippageValue = this.slippage !== 0.005 ? this.slippage: undefined; // 0.005 is default for LIFI

    this.transactionsService.getQuote(fromChain, toChain, fromToken, toToken, adjustedFromAmount, fromAddress, slippageValue)
    .subscribe({
      next: (response: any) => {
        console.log('Quote received:', response);
        if (response.estimate && response.transactionRequest) 
        {
          console.log(`fromUSD: ${response.estimate.fromAmountUSD}; toUSD: ${response.estimate.toAmountUSD}`);
          this.updateSellPriceUsd(response.estimate.fromAmountUSD);
          this.updateBuyPriceUsd(response.estimate.toAmountUSD);
          const readableToAmount = Number(this.transactionsService.parseToAmount(response.estimate.toAmount, Number(toTokenDecimals)));
          console.log('readableToAmount:', readableToAmount);
          this.updateBuyAmount(readableToAmount);

          const gasPriceHex = response.transactionRequest.gasPrice;
          const gasLimitHex = response.transactionRequest.gasLimit;
          const gasToken = response.estimate.gasCosts?.[0]?.token;

          const gasPriceUSD = this.transactionsService.parseGasPriceUSD(gasPriceHex, gasLimitHex, gasToken);
          
          console.log('gasPriceUSD:', gasPriceUSD);
        }
        else 
        {
          console.error("Missing estimate or transactionRequest in response.");
        }

        if(response.transactionRequest.data)
        {
          if(this.blockchainStateService.network()?.id === 1151111081099710)
          {
            this.txData.set(response.transactionRequest as TransactionRequestSVM);
          }
          else
          {
            this.txData.set(response.transactionRequest as TransactionRequestEVM);            
            if(fromToken !== ethers.ZeroAddress){
              console.log("this.buttonState = 'approve'");
              this.buttonState = 'approve';
            }
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

  isSwapButtonActive(): boolean {
    return !!(this.sellAmount && Number(this.sellAmount) > 0);
  }

  isWalletConnected(): boolean {
    return this.blockchainStateService.connected();
  }

  openConnectWalletPopup(): void {
    if (!this.blockchainStateService.connected()) {
      this.popupService.openPopup('connectWallet');
    }
  }

  closeConnectWalletPopup(): void {
    this.popupService.closePopup('connectWallet');
  }

  

  // Геттер для проверки состояния попапа
  get showConnectWalletPopup(): boolean {
    return this.popupService.getCurrentPopup() === 'connectWallet';
  }

  resetTimers(): void {
    if (this.findingRoutesTimer) {
      clearTimeout(this.findingRoutesTimer);
    }
    if (this.walletTimer) {
      clearTimeout(this.walletTimer);
    }
  }

  // Обновляем методы закрытия
  closeSuccessNotification(): void {
    this.showSuccessNotification = false;
  }

  closeFailedNotification(): void {
    this.showFailedNotification = false;
  }

  // Добавьте метод закрытия для пендинга
  closePendingNotification(): void {
    this.showPendingNotification = false;
  }
}




//Egor example pendingNotification
// startFindingRoutesProcess(): void {
//   // Очищаем предыдущий таймер, если он существует
//   if (this.findingRoutesTimer) {
//     clearTimeout(this.findingRoutesTimer);
//   }
  
//   // Устанавливаем состояние "Finding Routes..."
//   this.buttonState = 'finding';
  
//   // Через 2 секунды меняем на "Approve"
//   this.findingRoutesTimer = setTimeout(() => {
//     this.buttonState = 'approve';
//     this.cdr.detectChanges(); // Обновляем представление
//   }, 2000);
// }

// // Обновляем метод для проверки активности кнопки
// isSwapButtonActive(): boolean {
//   const amount = Number(this.sellAmount);
//   return !!(
//     this.sellAmount && 
//     amount > 0 && 
//     amount <= this.balance && 
//     this.buttonState !== 'insufficient'
//   );
// }

// // Обновляем метод для свапа
// swap(): void {
//   if (this.buttonState === 'approve') {
//     console.log('Approving token...');
//     this.buttonState = 'wallet';
    
//     this.walletTimer = setTimeout(() => {
//       this.buttonState = 'swap';
//       this.cdr.detectChanges();
//     }, 2000);
//   } else if (this.buttonState === 'swap') {
//     console.log('Swap initiated with amount:', this.sellAmount);
    
//     // Сначала показываем только Pending
//     this.showPendingNotification = true;
//     this.showSuccessNotification = false;
//     this.showFailedNotification = false;
//     this.cdr.detectChanges();

//     // Через 3 секунды начинаем процесс закрытия
//     setTimeout(() => {
//       // Запускаем анимацию закрытия пендинга
//       const pendingNotification = document.querySelector('app-pending-notification .notification') as HTMLElement;
//       if (pendingNotification) {
//         pendingNotification.style.transform = 'translateX(100%)';
//         pendingNotification.style.opacity = '0';
//       }

//       // Ждем завершения анимации (300мс) перед скрытием и показом следующего уведомления
//       setTimeout(() => {
//         this.showPendingNotification = false;
        
//         // Переключаем между Success и Failed
//         if (this.isLastNotificationSuccess) {
//           this.showFailedNotification = true;
//         } else {
//           this.showSuccessNotification = true;
//         }
//         this.isLastNotificationSuccess = !this.isLastNotificationSuccess;
//         this.cdr.detectChanges();
//       }, 300);
//     }, 3000);
//   }