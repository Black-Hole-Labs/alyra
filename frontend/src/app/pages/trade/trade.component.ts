import { Component, Renderer2, ChangeDetectorRef, computed, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component';
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
  styleUrls: [
    './trade.component.scss',
    './trade.component.adaptives.scss'
  ],
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
  sellAmountForInput= signal<string | undefined>(undefined);
  validatedSellAmount = signal<number>(0);
  loading = signal<boolean>(false);
  
  buyAmount = signal<string | undefined>(undefined);
  buyAmountForInput = signal<string | undefined>(undefined);
  price: number = 0; // Цена обмена
  priceUsd: number = 0; // Текущая стоимость в USD за единицу
  sellPriceUsd = signal<string>('');
  buyPriceUsd = signal<string>('');
  balance = signal<number>(0.0);
  balanceBuy = signal<number>(0.0);
  rotationCount: number = 0; // Счетчик для отслеживания вращений
	slippage: number = 0.005; //  // 0.005 is default for LIFI
  gasPriceUSD: number | undefined;

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

  buttonState: 'swap' | 'finding' | 'approve' | 'wallet' | 'insufficient' | 'no-available-quotes' = 'swap';
  
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
    this.validatedSellAmount() !== 0 &&
    this.buttonState === "swap"
  );

  private inputTimeout: any;

  private previousWalletName: string | null = '';
  private tokensLoaded = false;

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

      effect(() => {
        const tokens = this.blockchainStateService.filteredTokens();
      
        Promise.resolve().then(() => {
          const newSelectedToken = tokens.length > 0 ? tokens[0] : undefined;
          const newSelectedBuyToken = tokens.length > 1 ? tokens[1] : undefined;
      
          this.selectedToken.set(newSelectedToken);
          this.selectedBuyToken.set(newSelectedBuyToken);
      
          if (this.selectedToken()) {
            this.getBalanceForToken(this.selectedToken()!)
              .then((balanceStr) => {
                this.balance.set(Number(parseFloat(balanceStr)));
              })
              .catch((error) => {
                console.error('Error getting balance sell: ', error);
                this.balance.set(0.0);
              });
          }
      
          if (this.selectedBuyToken()) {
            this.getBalanceForToken(this.selectedBuyToken()!)
              .then((balanceStr) => {
                this.balanceBuy.set(Number(parseFloat(balanceStr)));
              })
              .catch((error) => {
                console.error('Error getting balance buy: ', error);
                this.balanceBuy.set(0.0);
              });
          }
        });
      }, { allowSignalWrites: true });
  }

  
  handleKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const cursorPos = inputElement.selectionStart ?? inputElement.value.length;

    const replaceKeys = [',', '.', '/', 'б', 'ю']; 

    if (replaceKeys.includes(event.key)) {
      event.preventDefault(); 

      if (inputElement.value.includes('.')) return;

      inputElement.value =
        inputElement.value.slice(0, cursorPos) + '.' + inputElement.value.slice(cursorPos);

      setTimeout(() => inputElement.setSelectionRange(cursorPos + 1, cursorPos + 1), 0);
    }
  }

  processInput(event: Event, isSell: boolean): void {
    this.txData.set(undefined);
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
    .replace(/[^0-9.]/g, '')
    .replace(/\.+/g, '.') 
    .replace(/^(\.)/g, '');

    if (isSell) {
      //this.updateBuyAmount();
      //this.updateSellPriceUsd();
      clearTimeout(this.inputTimeout);

      this.inputTimeout = setTimeout(() => {
        this.sellAmount = inputElement.value;
        this.validatedSellAmount.update(value => (Number(inputElement.value)));
        if (this.validatedSellAmount() > this.balance()) {
          this.buttonState = 'insufficient';
          this.updateBuyAmount('0.0');
        }
        else
        {
          this.buttonState = 'swap';
        }
      }, 2000);
    }

    console.log("some data");
  }

  updateBuyAmount(value: string): void {
    const limited = this.limitDecimals(value, 6);
    const num = Number(limited.replace('…', ''));
  
    if (!isNaN(num)) {
      this.buyAmount.set(value); 
      this.buyAmountForInput.set(limited);
    } else {
      this.buyAmount.set('0');
      this.buyAmountForInput.set('0');
    }
  }

  updateSellAmount(value: string): void {
    const limited = this.limitDecimals(value, 6);
    const num = Number(limited.replace('…', ''));
  
    if (!isNaN(num)) {
      this.sellAmount = value; 
      this.sellAmountForInput.set(limited);
    } else {
      this.sellAmount = '0';
      this.sellAmountForInput.set('0');
    }
  }
  
  limitDecimals(value: string, maxDecimals: number): string {
    if (value.includes('.')) {
      const [intPart, decimalPart] = value.split('.');
      const trimmedDecimals = decimalPart.slice(0, maxDecimals);
      const hasMore = decimalPart.length > maxDecimals;
  
      const result = `${intPart}.${trimmedDecimals}`;
      return hasMore ? result + '…' : result;
    }
    return value;
  }
  

  updateSellPriceUsd(price: number): void {
    if (!isNaN(price)) {
      this.sellPriceUsd.set(`$${Number(price).toFixed(3)}`);
    } else {
      this.sellPriceUsd.set('');
    }
  }

  updateBuyPriceUsd(price: number): void {
    if (!isNaN(price)) {
      this.buyPriceUsd.set(`$${Number(price).toFixed(3)}`);
    } else {
      this.buyPriceUsd.set('');
    }
  }

  setMaxSellAmount(): void {
    //this.sellAmount = this.balance().toString();
    this.updateSellAmount(this.balance().toString());
    this.validatedSellAmount.update(value => this.balance());
    if (Number(this.validatedSellAmount()) > this.balance()) {
      this.buttonState = 'insufficient';
      this.updateBuyAmount('0.0');
    }
    else
    {
      this.buttonState = 'swap';
    }
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

  // // Управление анимацией
  // onMouseDown(): void {
	// 	console.log('Mouse down triggered');
	// 	const changeButton = document.getElementById('change-button');
	// 	if (changeButton && !changeButton.classList.contains('animate')) {
	// 		this.renderer.addClass(changeButton, 'animate');
	// 	}
	// }
	
	// onAnimationEnd(): void {
	// 	console.log('Animation ended, swapping tokens...');
	// 	const changeButton = document.getElementById('change-button');
	// 	if (changeButton && changeButton.classList.contains('animate')) {
	// 		this.renderer.removeClass(changeButton, 'animate');
	// 		this.swapTokens();
	// 	}
	// }
	
	swapTokens(): void {
    this.txData.set(undefined);
	
		const tempToken = this.selectedToken();
		this.selectedToken.set(this.selectedBuyToken());
		this.selectedBuyToken.set(tempToken);

    const tempBalance = this.balance(); 
    this.balance.set(this.balanceBuy());
    this.balanceBuy.set(tempBalance);

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
    this.balance.set(Number((parseFloat(await this.getBalanceForToken(token)))));
    // this.selectedToken = token.symbol;
    // this.selectedTokenImage = token.imageUrl;
    // this.selectedTokenAddress = token.contractAddress;
    // this.selectedTokendecimals = token.decimals;
    this.closeTokenPopup();
  }

  async getBalanceForToken(token: Token): Promise<string> {
    const walletAddress = this.blockchainStateService.getCurrentWalletAddress();
    if (!walletAddress) {
      console.error(`Failed to get wallet address`);
      return "0";
    }
  
    const currentNetwork = this.blockchainStateService.getCurrentNetwork();
    if (!currentNetwork) {
      console.error('Current network not found');
      return "0";
    }
  
    if (currentNetwork.id === 1151111081099710) { // SVM
      if (token.symbol === "SOL") {
        return this.walletBalanceService.getSolanaBalance(walletAddress);
      } else {
        return this.walletBalanceService.getSolanaBalance(walletAddress, token.contractAddress);
      }
    } else { // EVM
      if (token.symbol === "ETH") {
        const balance = await this.walletBalanceService.getEvmBalance(walletAddress, currentNetwork.rpcUrls[0], Number(token.decimals));
        return balance;
      } else {
        return await this.walletBalanceService.getEvmBalance(walletAddress, currentNetwork.rpcUrls[0], Number(token.decimals), token.contractAddress);
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
    this.loading.set(true);

    this.buttonState = 'wallet';
    this.showPendingNotification = false;
    this.showSuccessNotification = false;
    this.showFailedNotification = false;
    this.cdr.detectChanges();
  
    let txHash: string = "";
    try
    {
      if (this.blockchainStateService.network()?.id === 1151111081099710) 
      {
        txHash = await this.svmSwap();
      } 
      else 
      {
        txHash = await this.evmSwap();
      }
    }
    catch (error:any)
    {
      this.showFailedNotification = true;
      
      this.loading.set(false);
      //console.log(error);

      this.cdr.detectChanges();
      setTimeout(() => {
        this.showSuccessNotification = false;
        this.showFailedNotification = false;
        this.cdr.detectChanges();
      }, 5000);

      this.buttonState = 'swap';

      return;
    }

    await this.sleep(1000);
    
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
    
    try
    {
      this.balance.set(Number((parseFloat(await this.getBalanceForToken(this.selectedToken()!)))));
      this.balanceBuy.set(Number((parseFloat(await this.getBalanceForToken(this.selectedBuyToken()!)))));
    }
    catch (error) 
    {
      console.log("error setting balance",error);
    }

    this.loading.set(false);
  }

  async svmSwap(): Promise<string> {
    const txData = this.txData(); 
    if (!txData) {
      throw new Error("missing data transaction");
    }
    const provider = this.blockchainStateService.getCurrentProvider().provider;
  
    const txHash = await provider.sendTx(txData);
    
    this.showPendingNotification = true;
    this.buttonState = 'swap';

    console.log("SVM Swap транзакция отправлена:", txHash);
    return txHash.signature;
  }

  async evmSwap(): Promise<string>{
    const provider = this.blockchainStateService.getCurrentProvider().provider;

    const signer = await provider.signer;

    const fromToken = this.selectedToken()!.contractAddress;
    if(fromToken === ethers.ZeroAddress){
      const txHash = await provider.sendTx(this.txData());
      this.showPendingNotification = true;
      this.buttonState = 'swap';
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
    const approveAmount = parseUnits(this.validatedSellAmount().toString(), fromTokenDecimals)

    // const allowance = await erc20Contract["allowance"](fromAddress, this.txData()?.to);
    // console.log("allowance",allowance);

    const approveTx = await erc20Contract["approve"]((this.txData() as TransactionRequestEVM).to, approveAmount);
    
    console.log("a");

    await approveTx.wait();

    console.log("Approve успешно выполнен:", approveTx.hash);

    const txHash = await provider.sendTx(this.txData(), true);
    
    this.showPendingNotification = true;
    this.buttonState = 'swap';

    console.log("txHash",txHash);
    return txHash;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    this.buttonState = 'finding';
    const fromChain = this.blockchainStateService.network()!.id.toString();
    const toChain = this.blockchainStateService.network()!.id.toString();
    const fromAddress = this.blockchainStateService.walletAddress()!;
    //const fromTokenDecimals = this.selectedTokendecimals;
    const fromTokenDecimals = this.selectedToken()!.decimals;
    //const fromAmount = this.validatedSellAmount;
    const formattedFromAmount = this.transactionsService.toNonExponential(this.validatedSellAmount());
    const fromAmount = parseUnits(formattedFromAmount, fromTokenDecimals);
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

          const toAmountNumber = Number(this.transactionsService.parseToAmount(response.estimate.toAmount, Number(toTokenDecimals)));
          const readableToAmount = toAmountNumber.toFixed(Number(toTokenDecimals)).replace(/\.?0+$/, '');
          console.log('readableToAmount:', readableToAmount);
          this.updateBuyAmount(readableToAmount);
          
          // if(this.blockchainStateService.network()!.id == 1151111081099710) // SVM
          // {
          //   gasPriceUSD = response.estimate.gasCosts?.[0]?.amountUSD;
          // }
          // else // EVM
          // {
          //   const gasPriceHex = response.transactionRequest.gasPrice;
          //   const gasLimitHex = response.transactionRequest.gasLimit;
          //   const gasToken = response.estimate.gasCosts?.[0]?.token;
          //   gasPriceUSD = this.transactionsService.parseGasPriceUSD(gasPriceHex, gasLimitHex, gasToken);
          // }

          const gasPriceUSD = response.estimate.gasCosts?.[0]?.amountUSD;

          this.gasPriceUSD = Number(gasPriceUSD);
          
          console.log('gasPriceUSD:', this.gasPriceUSD);

          const fromDecimal = parseFloat(
            this.transactionsService.parseToAmount(response.estimate.fromAmount, Number(fromTokenDecimals))
          );
          const toDecimal = parseFloat(
            this.transactionsService.parseToAmount(response.estimate.toAmount, Number(toTokenDecimals))
          );

          if (fromDecimal > 0)
          {
            const ratio = toDecimal / fromDecimal;
            this.price = Number(ratio.toFixed(3));

            const ratioUsd = Number(response.estimate.toAmountUSD) / fromDecimal;
            this.priceUsd = Number(ratioUsd.toFixed(3));
          }
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
            this.buttonState = 'swap';  
          }
          else
          {
            this.txData.set(response.transactionRequest as TransactionRequestEVM);
            this.buttonState = 'swap';
            if(fromToken !== ethers.ZeroAddress){
              console.log("this.buttonState = 'approve'");
              this.buttonState = 'approve';
            }
          }
        }
        
      },
      error: (error: HttpErrorResponse) => {
        if(error.error.message === 'No available quotes for the requested transfer'){
          this.buttonState = 'no-available-quotes';
        }
        else if (error.status === 404) {
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

  truncateTo6Decimals(value: number): number {
    return Math.trunc(value * 1e6) / 1e6;
  }
}

