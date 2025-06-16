import {
  Component,
  Renderer2,
  ChangeDetectorRef,
  computed,
  signal,
  effect,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-selector.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { WalletBalanceService } from '../../services/wallet-balance.service';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  NetworkId,
  TransactionRequestEVM,
  TransactionRequestSVM,
  Network,
} from '../../models/wallet-provider.interface';
import { ethers, parseUnits } from 'ethers';
import { PopupService } from '../../services/popup.service';
import { SuccessNotificationComponent } from '../../components/notification/success-notification/success-notification.component';
import { FailedNotificationComponent } from '../../components/notification/failed-notification/failed-notification.component';
import { PendingNotificationComponent } from '../../components/notification/pending-notification/pending-notification.component';
import { PublicKey } from '@solana/web3.js';
import { TokenService } from '../../services/token.service';
import { MouseGradientService } from '../../services/mouse-gradient.service';

export interface Token {
  symbol: string;
  imageUrl: string;
  contractAddress: string;
  chainId: number;
  decimals: number;
}

@Component({
  selector: 'app-trade',
  standalone: true,
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss', './trade.component.adaptives.scss'],
  imports: [
    FormsModule,
    CommonModule,
    TokenChangePopupComponent,
    SettingsComponent,
    SuccessNotificationComponent,
    FailedNotificationComponent,
    PendingNotificationComponent,
  ],
})
export class TradeComponent implements AfterViewChecked {
  //[x: string]: any;
  sellAmount: string = '';
  //validatedSellAmount: string = '';
  sellAmountForInput = signal<string | undefined>(undefined);
  validatedSellAmount = signal<number>(0);
  loading = signal<boolean>(false);

  buyAmount = signal<string | undefined>(undefined);
  buyAmountForInput = signal<string | undefined>(undefined);
  price = signal<number>(0);
  priceUsd: number = 0;
  sellPriceUsd = signal<string>('');
  buyPriceUsd = signal<string>('');
  balance = signal<number>(0.0);
  balanceBuy = signal<number>(0.0);
  rotationCount: number = 0;
  slippage: number = 0.005; // 0.005 is default for LIFI
  gasPriceUSD: number | undefined;

  //showConnectWalletPopup: boolean = false;
  txData = signal<TransactionRequestEVM | TransactionRequestSVM | undefined>(undefined);

  walletTimer: any = null;
  findingRoutesTimer: any = null;

  showSuccessNotification = false;
  showFailedNotification = false;
  showPendingNotification = false;

  customAddress = signal<string>('');
  showCustomAddress: boolean = false;

  buttonState: 'swap' | 'finding' | 'approve' | 'wallet' | 'insufficient' | 'no-available-quotes' | 'wrong-address' | 'rate-limit' = 'swap';

  // firstToken = computed(() => {
  //   const tokens = this.blockchainStateService.tokens();
  //   return tokens.length > 0 ? tokens[0] : undefined;
  // });

  // swapButtonValidation = computed(() => this.txData() !== undefined);

  allFieldsReady = computed(
    () =>
      this.tokenService.selectedSellToken() !== undefined &&
      this.tokenService.selectedBuyToken() !== undefined &&
      this.validatedSellAmount() !== 0,
  );

  @ViewChild('buyAmountText') buyAmountTextElement: ElementRef | null = null;
  private buyAmountTextAnimated = false;

  private possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|';
  private glitchChars = '!@#$%^&*()_+{}:"<>?|\\';
  private cyberChars = '01010101110010101010101110101010';
  private animationFrames = 60;
  private animationSpeed = 35;
  private animationTimeouts: { [key: string]: number } = {};

  private debounceTimer: any;
  private throttleActive: boolean = false;
  private isProcessingInput = signal<boolean>(false);

  inputFontSize = signal<number>(48);

  private resizeObserver: any;

  private networkUpdateInterval: any;


  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    public blockchainStateService: BlockchainStateService,
    private walletBalanceService: WalletBalanceService,
    private transactionsService: TransactionsService,
    public popupService: PopupService,
    public tokenService: TokenService,
    private mouseGradientService: MouseGradientService,
  ) {
    this.inputFontSize.set(this.defaultFontSizeByScreenWidth());
    this.initializeNetworks();

    effect(
      () => {
        try {
          if (this.allFieldsReady() && !this.isProcessingInput()) {
            this.getTxData();
          }
          // else if (this.validatedSellAmount() == 0){
          //   console.log("Show price rate");
          //   this.loadInitialPriceRate();
          // }
        } catch (error) {
          // this.updateBuyAmount('0.0');
          // update gas = 0.0
          // console.log("error",error);
          this.buttonState = 'no-available-quotes';
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      async () => {
        const network = this.blockchainStateService.networkSell();

        const tokens = this.blockchainStateService.getTokensForNetwork(network!.id);

        const newSelectedToken = tokens.length > 0 ? tokens[0] : undefined;
        
        this.tokenService.setSelectedSellToken(newSelectedToken);
        //this.updateNetworksBasedOnTokens();

        if (newSelectedToken !== undefined && this.blockchainStateService.connected()) {
          const balanceStr = await this.walletBalanceService.getBalanceForToken(newSelectedToken);
          this.balance.set(Number(parseFloat(balanceStr)));
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      async () => {
        const network = this.blockchainStateService.networkBuy();

        const tokens = this.blockchainStateService.getTokensForNetwork(network!.id);

        let newSelectedBuyToken = tokens.length > 1 ? tokens[1] : undefined;

        // if (network !== undefined) {
        //   if (newSelectedBuyToken?.chainId !== this.tokenService.selectedSellToken()!.chainId) {
        //     newSelectedBuyToken = this.blockchainStateService.getTokensForNetwork(
        //       network!.id,
        //     )[0];
        //   }
        // }
        
        this.tokenService.setSelectedBuyToken(newSelectedBuyToken);
        //this.updateNetworksBasedOnTokens();

        if (newSelectedBuyToken !== undefined && this.blockchainStateService.connected()) {
          const balanceStr = await this.walletBalanceService.getBalanceForToken(newSelectedBuyToken);
          this.balanceBuy.set(Number(parseFloat(balanceStr)));
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const isConnected = this.blockchainStateService.connected();
        const buyNetwork = this.blockchainStateService.networkBuy();
        const sellNetwork = this.blockchainStateService.networkSell();
        if (isConnected && buyNetwork !== undefined && sellNetwork !== undefined) {
          if (
            (buyNetwork?.id == NetworkId.SOLANA_MAINNET || sellNetwork?.id == NetworkId.SOLANA_MAINNET) &&
            !(buyNetwork?.id == NetworkId.SOLANA_MAINNET && sellNetwork?.id == NetworkId.SOLANA_MAINNET)
          ) {
            this.showCustomAddress = true;
          } else {
            this.showCustomAddress = false;
            this.customAddress.set('');
          }
        } else {
          this.showCustomAddress = false;
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit() {
    this.resizeObserver = new ResizeObserver(() => {
      this.inputFontSize.set(this.defaultFontSizeByScreenWidth());
    });

    this.resizeObserver.observe(document.body);

    // this.startNetworkUpdateInterval();
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    // this.stopNetworkUpdateInterval();
  }

  handleKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    const cursorPos = inputElement.selectionStart ?? inputElement.value.length;

    const replaceKeys = [',', '.', '/', 'б', 'ю'];

    if (replaceKeys.includes(event.key)) {
      event.preventDefault();

      if (inputElement.value.includes('.')) return;

      inputElement.value = inputElement.value.slice(0, cursorPos) + '.' + inputElement.value.slice(cursorPos);

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
      this.isProcessingInput.update((value) => true);

      this.sellAmount = inputElement.value;
      this.validatedSellAmount.update((value) => Number(inputElement.value));

      this.adjustFontSize(inputElement);

      if (this.validatedSellAmount() > this.balance()) {
        this.buttonState = 'insufficient';
        // this.updateBuyAmount('0.0');
      } else {
        this.buttonState = 'swap';
      }

      if (!this.throttleActive) {
        this.throttleActive = true;

        this.debounceTimer = setTimeout(() => {
          this.isProcessingInput.update(() => false);
          this.throttleActive = false;
        }, 2000);
      }
    }
  }

  updateBuyAmount(value: string): void {
    const limited = this.limitDecimals(value, 6);
    const num = Number(limited);

    if (!isNaN(num)) {
      this.buyAmount.set(value);
      this.buyAmountForInput.set(limited);

      this.buyAmountTextAnimated = false;

      const sellInput = document.getElementById('number-input-sell') as HTMLInputElement;
      if (sellInput) {
        this.adjustFontSize(sellInput);
      }

      setTimeout(() => this.checkAndAnimateBuyText(), 0);
    } else {
      this.buyAmount.set('0');
      this.buyAmountForInput.set('0');
    }
  }

  updateSellAmount(value: string): void {
    const limited = this.limitDecimals(value, 6);
    const num = Number(limited);

    if (!isNaN(num)) {
      this.sellAmount = value;
      this.sellAmountForInput.set(limited);
    } else {
      this.sellAmount = '0';
      this.sellAmountForInput.set('0');
    }
    
    this.recalculateFontSize();
  }

  limitDecimals(value: string, maxDecimals: number): string {
    if (value.includes('.')) {
      const [intPart, decimalPart] = value.split('.');
      const trimmedDecimals = decimalPart.slice(0, maxDecimals);
      return `${intPart}.${trimmedDecimals}`;
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
    this.updateSellAmount(this.balance().toString());
    this.validatedSellAmount.update((value) => this.balance());
    if (Number(this.validatedSellAmount()) > this.balance()) {
      this.buttonState = 'insufficient';
    } else {
      this.buttonState = 'swap';
    }
  }

  rotateRefresh(): void {
    this.getTxData();
    
    const refreshElement = document.querySelector('.refresh');
    if (refreshElement) {
      this.rotationCount += 1;
      this.renderer.setStyle(refreshElement, 'transform', `rotate(${this.rotationCount * -720}deg)`);
    }
  }

  async swapTokens(): Promise<void> {
    if(this.blockchainStateService.connected()){
      const provider = this.blockchainStateService.getCurrentProvider().provider;
      try{
        await provider.switchNetwork(this.blockchainStateService.networkBuy()!);
        this.blockchainStateService.updateWalletAddress(provider.address);
      }
      catch (error) {
        this.blockchainStateService.disconnect();
      }
    }

    this.txData.update(() => undefined);
    this.buttonState = 'swap';

    const tempToken = this.tokenService.selectedSellToken();
    const tempBuyToken = this.tokenService.selectedBuyToken();
    const tempBalance = this.balance();
    const tempBalanceBuy = this.balanceBuy();
    const tempSellAmount = this.validatedSellAmount();
    const tempBuyAmount = this.buyAmountForInput();

    // this.selectedToken.set(tempBuyToken);
    this.tokenService.setSelectedBuyToken(tempToken);
    this.tokenService.setSelectedSellToken(tempBuyToken);

    this.balance.set(tempBalanceBuy);
    this.balanceBuy.set(tempBalance);

    if (tempBuyAmount && tempBuyAmount !== '0' && tempBuyAmount !== '0.0') {
      this.updateSellAmount(tempBuyAmount);
      this.validatedSellAmount.set(Number(tempBuyAmount));
    } else {
      this.updateSellAmount('0');
      this.validatedSellAmount.set(0);
    }

    if (tempSellAmount > 0) {
      this.updateBuyAmount(String(tempSellAmount));
    } else {
      this.updateBuyAmount('0');
    }

    const newSellNetwork = this.blockchainStateService.networkSell();
    if (newSellNetwork) {
      this.blockchainStateService.updateNetworkBackgroundIcons(newSellNetwork);
    }

    this.swapNetworks();

    this.cdr.detectChanges();

  }

  private swapNetworks(): void {
    try {
      const tmp = this.blockchainStateService.networkBuy();

      this.blockchainStateService.setNetworkBuy(this.blockchainStateService.networkSell()!);
      this.blockchainStateService.setNetworkSell(tmp!);
    } catch (error) {
      console.warn('Error swapping network IDs:', error);
    }
  }

  openTokenPopup(): void {
    this.popupService.openPopup('tokenChangeSell');
  }

  closeTokenPopup(): void {
    this.popupService.closePopup('tokenChangeSell');
  }

  async onSellTokenSelected(token: Token): Promise<void> {
    this.txData.set(undefined);
    this.tokenService.setSelectedSellToken(token);
    this.balance.set(Number(parseFloat(await this.walletBalanceService.getBalanceForToken(token))));
  }

  openTokenBuyPopup(): void {
    this.popupService.openPopup('tokenChangeBuy');
  }

  closeTokenBuyPopup(): void {
    this.popupService.closePopup('tokenChangeBuy');
  }

  async onBuyTokenSelected(token: Token): Promise<void> {
    this.txData.set(undefined);
    this.tokenService.setSelectedBuyToken(token);
    this.balanceBuy.set(Number(parseFloat(await this.walletBalanceService.getBalanceForToken(token)).toFixed(6)));
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
    if (value === 'Auto') {
      // console.log("Slippate is Auto. Default value is 0.005 (0.5%)");
      this.slippage = 0.005;
    } else {
      const val = parseFloat(value.replace('%', ''));
      if (val > 49.9) {
        throw 'Slippage is too high!';
      }

      this.slippage = val / 100;
      // console.log(`Slippage set: ${this.slippage}; (${val}%)`);
    }

    //this.showSettingsPopup = false;
  }

  async swap() {
    this.loading.set(true);

    this.buttonState = 'wallet';
    this.showPendingNotification = false;
    this.showSuccessNotification = false;
    this.showFailedNotification = false;
    this.cdr.detectChanges();

    let txHash: string = '';
    try {
      if (this.blockchainStateService.networkSell()?.id === NetworkId.SOLANA_MAINNET) {
        txHash = await this.svmSwap();
      } else {
        txHash = await this.evmSwap();
      }
    } catch (error: any) {
      this.showFailedNotification = true;

      this.loading.set(false);
      //// console.log(error);

      this.cdr.detectChanges();
      setTimeout(() => {
        this.showSuccessNotification = false;
        this.showFailedNotification = false;
        this.cdr.detectChanges();
      }, 5000);

      this.buttonState = 'swap';

      return;
    }

    const finalStatus = await this.transactionsService.pollStatus(txHash);

    this.showPendingNotification = false;
    if (finalStatus.status === 'DONE') {
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

    try {
      this.balance.set(
        Number(parseFloat(await this.walletBalanceService.getBalanceForToken(this.tokenService.selectedSellToken()!))),
      );
      this.balanceBuy.set(
        Number(parseFloat(await this.walletBalanceService.getBalanceForToken(this.tokenService.selectedBuyToken()!))),
      );
      this.walletBalanceService.invalidateBalanceCacheForToken(this.blockchainStateService.networkSell()!.id, this.tokenService.selectedSellToken()!.contractAddress);
      this.walletBalanceService.invalidateBalanceCacheForToken(this.blockchainStateService.networkBuy()!.id, this.tokenService.selectedBuyToken()!.contractAddress);
    } catch (error) {
      // console.log("error setting balance",error);
    }

    this.loading.set(false);
  }

  async svmSwap(): Promise<string> {
    const txData = this.txData();
    if (!txData) {
      throw new Error('missing data transaction');
    }
    const provider = this.blockchainStateService.getCurrentProvider().provider;

    const txHash = await provider.sendTx(txData);

    this.showPendingNotification = true;
    this.buttonState = 'swap';

    // console.log("SVM Swap транзакция отправлена:", txHash);
    return txHash.signature;
  }

  async evmSwap(): Promise<string> {
    const provider = this.blockchainStateService.getCurrentProvider().provider;
    await provider.switchNetwork(this.blockchainStateService.networkBuy()!);
    const signer = await provider.signer;

    const fromToken = this.tokenService.selectedSellToken()!.contractAddress;
    if (fromToken === ethers.ZeroAddress) {
      const txHash = await provider.sendTx(this.txData());
      this.showPendingNotification = true;
      this.buttonState = 'swap';
      return txHash;
    }

    const erc20Contract = new ethers.Contract(
      fromToken,
      [
        'function approve(address spender, uint256 amount) public returns (bool)',
        'function allowance(address owner, address spender) public view returns (uint256)',
      ],
      signer,
    );

    //const fromAddress = this.blockchainStateService.walletAddress()!;
    const fromTokenDecimals = this.tokenService.selectedSellToken()!.decimals;
    const amount = this.transactionsService.toNonExponential(this.validatedSellAmount());
    const approveAmount = parseUnits(amount, fromTokenDecimals);

    // const allowance = await erc20Contract["allowance"](fromAddress, this.txData()?.to);
    // // console.log("allowance",allowance);

    const approveTx = await erc20Contract['approve']((this.txData() as TransactionRequestEVM).to, approveAmount);

    // console.log("a");

    await approveTx.wait();

    // console.log("Approve успешно выполнен:", approveTx.hash);

    const txHash = await provider.sendTx(this.txData(), true);

    this.showPendingNotification = true;
    this.buttonState = 'swap';

    // console.log("txHash",txHash);
    return txHash;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  test() {
    this.transactionsService.runTest().subscribe({
      next: (response) => {
        // console.log('Quote:', response.quote);
        // console.log('Simulation Result:', response.simulationResult);
      },
      error: (error) => {
        console.error('Ошибка запроса:', error);
      },
    });
  }

  getTxData() {
    this.buttonState = 'finding';
    const fromChain = this.blockchainStateService.networkSell()!.id.toString();
    const toChain = this.blockchainStateService.networkBuy()!.id.toString();
    const fromTokenDecimals = this.tokenService.selectedSellToken()!.decimals;
    const formattedFromAmount = this.transactionsService.toNonExponential(this.validatedSellAmount());
    const fromAmount = parseUnits(formattedFromAmount, fromTokenDecimals);
    const fromToken = this.tokenService.selectedSellToken()!.contractAddress;
    const toToken = this.tokenService.selectedBuyToken()!.contractAddress;
    const toTokenDecimals = this.tokenService.selectedBuyToken()!.decimals;

    let fromAddress = '';
    let toAddress = (this.customAddress() !== '' && this.addressStatus === 'good') ? this.customAddress() : undefined; 

    const CONSTANT_ETH_ADDRESS = '0x1111111111111111111111111111111111111111';
    const CONSTANT_SOL_ADDRESS = '11111111111111111111111111111111';

    const fromChainType = this.blockchainStateService.networkSell()?.chainType;
    const toChainType = this.blockchainStateService.networkBuy()?.chainType;
    const walletConnected = !!this.blockchainStateService.walletAddress();

    if (!walletConnected) {
        if (fromChainType === 'EVM') {
            fromAddress = CONSTANT_ETH_ADDRESS;
        } else if (fromChainType === 'SVM') {
            fromAddress = CONSTANT_SOL_ADDRESS;
        }

        if (!toAddress) {
            if (toChainType === 'EVM') {
                toAddress = CONSTANT_ETH_ADDRESS;
            } else if (toChainType === 'SVM') {
                toAddress = CONSTANT_SOL_ADDRESS;
            }
        }
    } else {
        fromAddress = this.blockchainStateService.walletAddress()!;

        // ---- ДОБАВЬ ВОТ ЭТОТ КУСОК ----
        // Если типы сетей разные
        if (fromChainType !== toChainType && !(toAddress && toAddress !== '')) {
            // всегда используем константный адрес в toAddress
            if (toChainType === 'EVM') {
                toAddress = CONSTANT_ETH_ADDRESS;
            } else if (toChainType === 'SVM') {
                toAddress = CONSTANT_SOL_ADDRESS;
            }
        } else {
            // как раньше - если кастомный введён и валиден, подставляем его
            if (this.customAddress() !== '' && this.addressStatus === 'good') {
                toAddress = this.customAddress();
            } else {
                toAddress = undefined;
            }
        }
    }

    const adjustedFromAmount = fromAmount.toString();

    // console.log("fromChain",fromChain);

    if (!fromChain || !toChain || !fromAddress || !fromAmount || !fromToken || !toToken || !fromTokenDecimals) {
      // console.log("fromChain",fromChain);
      // console.log("toChain",toChain);
      // console.log("fromAddress",fromAddress);
      // console.log("fromAmount",fromAmount);
      // console.log("fromToken",fromToken);
      // console.log("toToken",toToken);
      // console.log("fromTokenDecimals",fromTokenDecimals);

      // console.log("adjusted From Amount",adjustedFromAmount);

      console.error('Missing required parameters');
      return;
    }

    // console.log("fromAddress",fromAddress);

    const slippageValue = this.slippage !== 0.005 ? this.slippage : undefined; // 0.005 is default for LIFI

    const mustHaveCustomAddress = (
      walletConnected &&
      fromChainType !== toChainType &&
      !(this.customAddress() !== '' && this.addressStatus === 'good')
    );

    this.transactionsService
      .getQuoteBridge(fromChain, toChain, fromToken, toToken, adjustedFromAmount, fromAddress, toAddress, slippageValue)
      .subscribe({
        next: (response: any) => {
          // console.log('Quote received:', response);
          if (response.estimate && response.transactionRequest) {
            // console.log(`fromUSD: ${response.estimate.fromAmountUSD}; toUSD: ${response.estimate.toAmountUSD}`);
            this.updateSellPriceUsd(response.estimate.fromAmountUSD);
            this.updateBuyPriceUsd(response.estimate.toAmountUSD);

            const toAmountNumber = Number(
              this.transactionsService.parseToAmount(response.estimate.toAmount, toTokenDecimals),
            );
            const readableToAmount = toAmountNumber.toFixed(toTokenDecimals).replace(/\.?0+$/, '');
            // console.log('readableToAmount:', readableToAmount);
            this.updateBuyAmount(readableToAmount);

            // if(this.blockchainStateService.networkSell()!.id == NetworkId.SOLANA_MAINNET) // SVM
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

            // console.log('gasPriceUSD:', this.gasPriceUSD);

            const fromDecimal = parseFloat(
              this.transactionsService.parseToAmount(response.estimate.fromAmount, fromTokenDecimals),
            );
            const toDecimal = parseFloat(
              this.transactionsService.parseToAmount(response.estimate.toAmount, toTokenDecimals),
            );

            if (fromDecimal > 0) {
              const ratio = toDecimal / fromDecimal;
              this.price.set(Number(ratio.toFixed(3)));

              const ratioUsd = Number(response.estimate.toAmountUSD) / fromDecimal;
              this.priceUsd = Number(ratioUsd.toFixed(3));
            }
          } else {
            console.error('Missing estimate or transactionRequest in response.');
          }

          if (response.transactionRequest.data) {
            if (this.blockchainStateService.networkSell()?.id === NetworkId.SOLANA_MAINNET) {
              this.txData.set(response.transactionRequest as TransactionRequestSVM);
              this.buttonState = 'swap';
            } else {
              this.txData.set(response.transactionRequest as TransactionRequestEVM);
              this.buttonState = 'swap';
              if (fromToken !== ethers.ZeroAddress) {
                // console.log("this.buttonState = 'approve'");
                this.buttonState = 'approve';
              }
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          if (
            error.error.message === 'No available quotes for the requested transfer' ||
            error.error.statusCode === 422
          )
          {
            this.buttonState = 'no-available-quotes';
          }
          else if(error.error.message.includes("Invalid toAddress") || error.error.message.includes("Invalid fromAddress"))
          {
            this.buttonState = 'wrong-address';
          }
          else if(error.error.statusCode === 429 || error.error.message.includes("Rate limit exceeded")){
            this.buttonState = 'rate-limit';
          }
          else if (error.status === 404)
          {
            console.error('Custom error message:', error || 'Unknown error');
            console.error('Custom error message:', error.error?.message || 'Unknown error');
          }
          else
          {
            console.error('Unexpected error:', error);
          }
        },
        complete: () => {
          // console.log('Quote request completed');
          if (mustHaveCustomAddress) {
            this.buttonState = 'wrong-address';
            return;
          }
          if (!this.blockchainStateService.walletAddress()) {
            this.buttonState = 'insufficient';
          } else if (this.validatedSellAmount() > this.balance()) {
            this.buttonState = 'insufficient';
            return;
          }
        },
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

  get showConnectWalletPopup(): boolean {
    return this.popupService.getCurrentPopup() === 'connectWallet';
  }

  closeSuccessNotification(): void {
    this.showSuccessNotification = false;
  }

  closeFailedNotification(): void {
    this.showFailedNotification = false;
  }

  closePendingNotification(): void {
    this.showPendingNotification = false;
  }

  truncateTo6Decimals(value: number): number {
    return Math.trunc(value * 1e6) / 1e6;
  }

  /**
   * Animates text
   * @param element HTML element for animation
   * @param finalText result
   * @param elementId unique id of element
   */
  animateText(element: HTMLElement, finalText: string, elementId: string): void {
    const originalText = finalText;

    if (this.animationTimeouts[elementId]) {
      window.clearTimeout(this.animationTimeouts[elementId]);
      delete this.animationTimeouts[elementId];
    }

    let frame = 0;
    const totalFrames = this.animationFrames;

    const glitchStates = Array(finalText.length).fill(false);
    const resolvedChars = Array(finalText.length).fill(false);

    const animate = () => {
      if (frame >= totalFrames) {
        element.textContent = originalText;
        delete this.animationTimeouts[elementId];
        return;
      }

      let result = '';
      const progress = frame / totalFrames;

      const easedProgress = Math.pow(progress, 0.6);

      const resolvedCount = Math.floor(finalText.length * easedProgress);

      for (let i = 0; i < resolvedCount; i++) {
        if (!resolvedChars[i]) {
          resolvedChars[i] = true;
        }
      }

      if (frame % 2 === 0) {
        const glitchProbability = 0.05 + progress * 0.1;
        for (let i = 0; i < finalText.length; i++) {
          if (Math.random() < glitchProbability) {
            glitchStates[i] = !glitchStates[i];
          }
        }
      }

      for (let i = 0; i < finalText.length; i++) {
        if (resolvedChars[i]) {
          if (glitchStates[i] && frame < totalFrames * 0.95 && finalText[i] !== ' ') {
            if (Math.random() < 0.3) {
              const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
              result += this.cyberChars[cyberIndex];
            } else {
              const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
              result += this.glitchChars[glitchIndex];
            }
          } else {
            if (progress > 0.9) {
              result += finalText[i];
            } else {
              result += finalText[i];
            }
          }
        } else {
          if (finalText[i] === ' ') {
            result += ' ';
          } else {
            const rand = Math.random();
            if (rand < 0.2) {
              const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
              result += this.glitchChars[glitchIndex];
            } else if (rand < 0.4) {
              const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
              result += this.cyberChars[cyberIndex];
            } else {
              const randomIndex = Math.floor(Math.random() * this.possibleChars.length);
              result += this.possibleChars[randomIndex];
            }
          }
        }
      }

      element.textContent = result;
      frame++;

      let currentSpeed = this.animationSpeed;
      if (progress < 0.3) {
        currentSpeed = this.animationSpeed * 0.8;
      } else if (progress > 0.7) {
        currentSpeed = this.animationSpeed * 0.7;
      } else {
        currentSpeed = this.animationSpeed * 1.2;
      }

      this.animationTimeouts[elementId] = window.setTimeout(animate, currentSpeed);
    };

    animate();
  }

  private checkAndAnimateBuyText() {
    if (
      this.buyAmountTextElement &&
      !this.buyAmountTextAnimated &&
      this.tokenService.selectedBuyToken()?.symbol &&
      this.validatedSellAmount() > 0 &&
      this.buyAmountForInput()
    ) {
      const finalText = `${this.buyAmountForInput()}`;
      this.animateText(this.buyAmountTextElement.nativeElement, finalText, 'buyAmountText');
      this.buyAmountTextAnimated = true;
    }
  }

  ngAfterViewChecked() {
    this.checkAndAnimateBuyText();
  }

  recalculateFontSize(): void {
    const sellTextLength = this.sellAmountForInput()?.length || 0;
    const buyTextLength = this.buyAmountForInput()?.length || 0;
    const maxTextLength = Math.max(sellTextLength, buyTextLength);
    this.calculateFontSizeForLength(maxTextLength);
  }

  adjustFontSize(inputElement: HTMLInputElement): void {
    const sellTextLength = inputElement.value.length;
    const buyTextLength = this.buyAmountForInput()?.length || 0;
    const maxTextLength = Math.max(sellTextLength, buyTextLength);
    this.calculateFontSizeForLength(maxTextLength);
  }

  private calculateFontSizeForLength(maxTextLength: number): void {
    const width = window.innerWidth;

    if (width >= 1601 && width <= 1920) {
      // 1601-1920px
      if (maxTextLength > 15) {
        this.inputFontSize.set(18);
      } else if (maxTextLength > 12) {
        this.inputFontSize.set(22);
      } else if (maxTextLength > 10) {
        this.inputFontSize.set(26);
      } else if (maxTextLength > 8) {
        this.inputFontSize.set(30);
      } else {
        this.inputFontSize.set(36);
      }
    } else if (width >= 1171 && width <= 1600) {
      // 1171-1600px
      if (maxTextLength > 15) {
        this.inputFontSize.set(18);
      } else if (maxTextLength > 12) {
        this.inputFontSize.set(22);
      } else if (maxTextLength > 10) {
        this.inputFontSize.set(26);
      } else if (maxTextLength > 8) {
        this.inputFontSize.set(30);
      } else {
        this.inputFontSize.set(36);
      }
    } else if (width >= 971 && width <= 1170) {
      // 971-1170px
      if (maxTextLength > 15) {
        this.inputFontSize.set(13);
      } else if (maxTextLength > 12) {
        this.inputFontSize.set(16);
      } else if (maxTextLength > 10) {
        this.inputFontSize.set(20);
      } else if (maxTextLength > 8) {
        this.inputFontSize.set(22);
      } else {
        this.inputFontSize.set(26);
      }
    } else if (width >= 480 && width <= 970) {
      // 480-970px
      if (maxTextLength > 15) {
        this.inputFontSize.set(18);
      } else if (maxTextLength > 12) {
        this.inputFontSize.set(22);
      } else if (maxTextLength > 10) {
        this.inputFontSize.set(26);
      } else if (maxTextLength > 8) {
        this.inputFontSize.set(30);
      } else {
        this.inputFontSize.set(36);
      }
    } else if (width >= 360 && width <= 479) {
      // 360-479px
      if (maxTextLength > 15) {
        this.inputFontSize.set(18);
      } else if (maxTextLength > 12) {
        this.inputFontSize.set(22);
      } else if (maxTextLength > 10) {
        this.inputFontSize.set(26);
      } else if (maxTextLength > 8) {
        this.inputFontSize.set(30);
      } else {
        this.inputFontSize.set(36);
      }
    } else {
      // default
      if (maxTextLength > 15) {
        this.inputFontSize.set(24);
      } else if (maxTextLength > 12) {
        this.inputFontSize.set(28);
      } else if (maxTextLength > 10) {
        this.inputFontSize.set(32);
      } else if (maxTextLength > 8) {
        this.inputFontSize.set(38);
      } else {
        this.inputFontSize.set(48);
      }
    }
  }

  resetFontSize(): void {
    this.inputFontSize.set(this.defaultFontSizeByScreenWidth());
  }

  private defaultFontSizeByScreenWidth(): number {
    const width = window.innerWidth;

    if (width >= 1601 && width <= 1920) {
      return 36; // 1601-1920px
    } else if (width >= 1171 && width <= 1600) {
      return 36; // 1171-1600px
    } else if (width >= 971 && width <= 1170) {
      return 26; // 971-1170px
    } else if (width >= 480 && width <= 970) {
      return 36; // 480-970px
    } else if (width >= 360 && width <= 479) {
      return 36; // 360-479px
    } else {
      return 48; // default
    }
  }

  validateAddress(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.blockchainStateService.setCustomAddress(input.value);
    this.customAddress.set(input.value);
  }

  toggleCustomAddress(): void {
    this.showCustomAddress = !this.showCustomAddress;
  }

  get addressStatus(): 'none' | 'good' | 'bad' {
    const addr = this.customAddress();
    if (!addr) {
      return 'none';
    }

    return this.isValidWalletAddress(addr, this.blockchainStateService.networkBuy()!.chainType) ? 'good' : 'bad';
  }

  private isValidWalletAddress(address: string, chainType: string): boolean {
    if (chainType === 'EVM') {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } else {
      try {
        new PublicKey(address);
        return true;
      } catch {
        return false;
      }
    }
  }

  private initializeNetworks(): void {
    const allNetworks = this.blockchainStateService.allNetworks();

    if (this.blockchainStateService.networkSell() === undefined) {    
      const sellToken = this.tokenService.selectedSellToken();
      if (sellToken) {
        const tokenNetwork = allNetworks.find((n) => n.id === sellToken.chainId);
        this.blockchainStateService.setNetworkSell(tokenNetwork!);
      }
    }

    if (this.blockchainStateService.networkBuy() === undefined) {
      const buyToken = this.tokenService.selectedBuyToken();
      if (buyToken) {
        const tokenNetwork = allNetworks.find((n) => n.id === buyToken.chainId);
        this.blockchainStateService.setNetworkBuy(tokenNetwork!);
      }
    }
  }

  // private updateNetworks(): void {
  //   console.log("updateNetworks");
  //   const allNetworks = this.blockchainStateService.allNetworks();

  //   if (this.blockchainStateService.networkSell() === undefined) {
  //     const sellToken = this.tokenService.selectedSellToken();
  //     if (sellToken) {
  //       const tokenNetwork = allNetworks.find((n) => n.id === sellToken.chainId);
  //       const networkToSet = tokenNetwork || this.blockchainStateService.networkSell() || undefined;
  //       if (networkToSet && networkToSet.id !== this.blockchainStateService.networkSell()?.id) {
  //         this.blockchainStateService.setNetworkSell(networkToSet);
  //       }
  //     }
  //   }

  //   if (this.blockchainStateService.networkBuy() === undefined) {
  //     const buyToken = this.tokenService.selectedBuyToken();
  //     if (buyToken) {
  //       const tokenNetwork = allNetworks.find((n) => n.id === buyToken.chainId);
  //       const networkToSet = tokenNetwork || this.blockchainStateService.networkSell() || undefined;
  //       if (networkToSet && networkToSet.id !== this.blockchainStateService.networkBuy()?.id) {
  //         this.blockchainStateService.setNetworkBuy(networkToSet);
  //       }
  //     }
  //   }
  // }

  // private startNetworkUpdateInterval(): void {
  //   this.networkUpdateInterval = setInterval(() => {
  //     this.updateNetworks();
  //   }, 500);
  // }

  // private stopNetworkUpdateInterval(): void {
  //   if (this.networkUpdateInterval) {
  //     clearInterval(this.networkUpdateInterval);
  //     this.networkUpdateInterval = null;
  //   }
  // }

  // private updateNetworksBasedOnTokens(): void {
  //   this.updateNetworks();
  // }

  // loadInitialPriceRate() {
  //   const fromChain = this.blockchainStateService.networkSell()!.id.toString();
  //   const toChain = this.blockchainStateService.networkBuy()!.id.toString();
  //   const toTokenDecimals = this.tokenService.selectedBuyToken()!.decimals;
  //   const fromTokenDecimals = this.tokenService.selectedSellToken()!.decimals;
  //   const fromAmount = parseUnits("1", fromTokenDecimals);
  //   const fromToken = this.tokenService.selectedSellToken()!.contractAddress;
  //   const toToken = this.tokenService.selectedBuyToken()!.contractAddress;

  //   let fromAddress = '';
  //   let toAddress = (this.customAddress() !== '' && this.addressStatus === 'good') ? this.customAddress() : undefined; 

  //   const CONSTANT_ETH_ADDRESS = '0x1111111111111111111111111111111111111111';
  //   const CONSTANT_SOL_ADDRESS = '11111111111111111111111111111111';

  //   const fromChainType = this.blockchainStateService.networkSell()?.chainType;
  //   const toChainType = this.blockchainStateService.networkBuy()?.chainType;
  //   const walletConnected = !!this.blockchainStateService.walletAddress();

  //   if (!walletConnected) {
  //       if (fromChainType === 'EVM') {
  //           fromAddress = CONSTANT_ETH_ADDRESS;
  //       } else if (fromChainType === 'SVM') {
  //           fromAddress = CONSTANT_SOL_ADDRESS;
  //       }

  //       if (!toAddress) {
  //           if (toChainType === 'EVM') {
  //               toAddress = CONSTANT_ETH_ADDRESS;
  //           } else if (toChainType === 'SVM') {
  //               toAddress = CONSTANT_SOL_ADDRESS;
  //           }
  //       }
  //   } else {
  //       fromAddress = this.blockchainStateService.walletAddress()!;

  //       if (fromChainType !== toChainType && !(toAddress && toAddress !== '')) {
  //           if (toChainType === 'EVM') {
  //               toAddress = CONSTANT_ETH_ADDRESS;
  //           } else if (toChainType === 'SVM') {
  //               toAddress = CONSTANT_SOL_ADDRESS;
  //           }
  //       } else {
  //           if (this.customAddress() !== '' && this.addressStatus === 'good') {
  //               toAddress = this.customAddress();
  //           } else {
  //               toAddress = undefined;
  //           }
  //       }
  //   }

  //   this.transactionsService
  //     .getQuoteBridge(fromChain, toChain, fromToken, toToken, fromAmount.toString(), fromAddress, toAddress)
  //     .subscribe({
  //       next: (response: any) => {
  //         if (response.estimate) {
  //           const toAmountNumber = Number(
  //             this.transactionsService.parseToAmount(response.estimate.toAmount, toTokenDecimals),
  //           );

  //           const fromDecimal = parseFloat(
  //             this.transactionsService.parseToAmount(response.estimate.fromAmount, fromTokenDecimals),
  //           );

  //           if (fromDecimal > 0) {
  //             const ratio = toAmountNumber / fromDecimal;
  //             this.price.set(Number(ratio.toFixed(3)));

  //             const ratioUsd = Number(response.estimate.toAmountUSD) / fromDecimal;
  //             this.priceUsd = Number(ratioUsd.toFixed(3));
  //           }
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Error loading initial price rate', err);
  //       }
  //   });
  // }

  onTradeMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

}
