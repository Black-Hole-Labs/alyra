import { Component, OnInit, OnDestroy, Renderer2, signal, effect, computed, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, AfterViewChecked  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkChangeFromPopupComponent } from '../../components/popup/network-change-from/network-change-from.component';
import { NetworkChangeToPopupComponent } from '../../components/popup/network-change-to/network-change-to.component';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { Subscription } from 'rxjs';
import { BridgeTxComponent } from '../../components/popup/bridge-tx/bridge-tx.component';
import { ConnectWalletComponent } from '../../components/popup/connect-wallet/connect-wallet.component';
import { Network, TransactionRequestEVM, TransactionRequestSVM } from '../../models/wallet-provider.interface';
import { Token } from '../trade/trade.component';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { WalletBalanceService } from '../../services/wallet-balance.service';
import { PopupService } from '../../services/popup.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SettingsBridgeComponent } from '../../components/popup/settings-bridge/settings-bridge.component';
import { ethers, parseUnits } from 'ethers';
import { TransactionsService } from '../../services/transactions.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-bridge',
  standalone: true,
  templateUrl: './bridge.component.html',
  styleUrls: ['./bridge.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NetworkChangeFromPopupComponent,
    NetworkChangeToPopupComponent,
    TokenChangePopupComponent,
    BridgeTxComponent,
    SettingsBridgeComponent
],
  animations: [
    trigger('receiveAnimation', [
      transition(':enter', [
        style({ 
          height: '0',
          opacity: 0,
          transform: 'translateY(-20px)',
          margin: '0',
          padding: '0'
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          height: '*',
          opacity: 1,
          transform: 'translateY(0)',
          margin: '*',
          padding: '*'
        }))
      ]),
      transition(':leave', [
        style({ 
          height: '*',
          opacity: 1,
          transform: 'translateY(0)',
          margin: '*',
          padding: '*'
        }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ 
          height: '0',
          opacity: 0,
          transform: 'translateY(-20px)',
          margin: '0',
          padding: '0'
        }))
      ])
    ]),
    trigger('customAddressAnimation', [
      transition(':enter', [
        style({ 
          opacity: 0, 
          transform: 'translateY(-20px)',
          maxHeight: '0',
          marginTop: '0'
        }),
        animate('300ms ease-in-out', style({ 
          opacity: 1, 
          transform: 'translateY(0)',
          maxHeight: '61px',
          marginTop: '20px'
        }))
      ]),
      transition(':leave', [
        style({ 
          opacity: 1, 
          transform: 'translateY(0)',
          maxHeight: '61px',
          marginTop: '20px'
        }),
        animate('300ms ease-in-out', style({ 
          opacity: 0, 
          transform: 'translateY(-20px)',
          maxHeight: '0',
          marginTop: '0'
        }))
      ])
    ])
  ]
})
export class BridgeComponent implements OnInit, OnDestroy {
  private networkSubscription!: Subscription;
  feesVisible: boolean = false;
  isNetworkChosen: boolean = false;
  showTokenChangePopup: boolean = false;
  showBridgeTxPopup = false;
  showConnectWalletPopup: boolean = false;
	customAddress = signal<string>('');
  showCustomAddress: boolean = false;

  findingRoutesTimer: any = null;
  //walletTimer: any = null;
  private _buttonState: 'bridge' | 'finding' | 'approve' | 'wallet' = 'bridge';

  // Свойства для анимации текста
  private possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|';
  private glitchChars = '!@#$%^&*()_+{}:"<>?|\\';
  private cyberChars = '01010101110010101010101110101010';
  private animationFrames = 60;
  private animationSpeed = 35;
  private animationTimeouts: { [key: string]: number } = {};

  @ViewChild('receiveText') receiveTextElement: ElementRef | null = null;
  private receiveTextAnimated = false;

  txData = signal<TransactionRequestEVM | TransactionRequestSVM | undefined> (undefined);
  private inputTimeout: any;
  sellAmount: string = '';
  buyAmount: string = '';
  validatedSellAmount = signal<string>('');

  selectedToken = signal<Token | undefined>(undefined);
  selectedBuyToken = signal<Token | undefined>(undefined);

  selectedNetwork = signal<Network | undefined>(undefined);
  selectedBuyNetwork = signal<Network | undefined>(undefined);

  balance = signal<number>(0.0);
  balanceBuy = signal<number>(0.0);
  
  networkTokens = new Map<number, Token[]>();
  slippage: number = 0.005; //  // 0.005 is default for LIFI

  bridgeTxHash: string = '';

  constructor(
    private renderer: Renderer2,
    private blockchainStateService: BlockchainStateService,
    private walletBalanceService: WalletBalanceService,
    public popupService: PopupService,
    private transactionsService: TransactionsService,
    private cdr: ChangeDetectorRef
  ) {

    effect(() => {
      if (this.isBridgeButtonActive()) {
        this.setButtonState('finding');
        this.getTxData();
      }
    });

    // effect(() => {
    //     if (this.blockchainStateService.connected() && this.selectedToken()) {
    //       this.getBalanceForToken(this.selectedToken()!)
    //       .then((balanceStr) => {
    //         this.balance.set(parseFloat(balanceStr));
    //       })
    //       .catch((error) => {
    //         console.error('Ошибка получения баланса', error);
    //         this.balance.set(0.0);
    //       });
    //     }
    //   },
    //   { allowSignalWrites: true }
    // );

    // effect(() => {
    //     if (this.blockchainStateService.connected() && this.selectedBuyToken()) {
    //       this.getBalanceForToken(this.selectedBuyToken()!)
    //       .then((balanceStr) => {
    //         this.balanceBuy.set(parseFloat(balanceStr));
    //       })
    //       .catch((error) => {
    //         console.error('Ошибка получения баланса', error);
    //         this.balanceBuy.set(0.0);
    //       });
    //     }
    //   },
    //   { allowSignalWrites: true }
    // );

    effect(() => {
        const tokens = this.blockchainStateService.filteredTokens();
        this.selectedToken.set(tokens.length > 0 ? tokens[0] : undefined);
        this.selectedBuyToken.set(tokens.length > 1 ? tokens[1] : undefined);
      },
      { allowSignalWrites: true }
    );

    effect(() => {
        const networks = this.blockchainStateService.networks();
        this.selectedNetwork.set(networks.length > 0 ? networks[0] : undefined);
        this.selectedBuyNetwork.set(networks.length > 1 ? networks[1] : undefined);
      },
      { allowSignalWrites: true }
    );

    effect(() => {
        const network = this.selectedNetwork();
        if (network) {
            if (!this.networkTokens.has(network.id)) {
                this.blockchainStateService.fetchTokensForNetwork(network.id).then((tokens) => {
                    this.networkTokens.set(network.id, tokens);
                    this.selectedToken.set(tokens.length > 0 ? tokens[0] : undefined);
                });
            } else {
                const tokens = this.networkTokens.get(network.id) || [];
                this.selectedToken.set(tokens.length > 0 ? tokens[0] : undefined);
            }
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
        const network = this.selectedBuyNetwork();
        if (network) {
            if (!this.networkTokens.has(network.id)) {
                this.blockchainStateService.fetchTokensForNetwork(network.id).then((tokens) => {
                    this.networkTokens.set(network.id, tokens);
                    this.selectedBuyToken.set(tokens.length > 0 ? tokens[0] : undefined);
                });
            } else {
                const tokens = this.networkTokens.get(network.id) || [];
                this.selectedBuyToken.set(tokens.length > 0 ? tokens[0] : undefined);
            }
        }
      },
      { allowSignalWrites: true }
    );

  }

  // async getBalanceForToken(token: Token): Promise<any> {
  //   const walletAddress = this.blockchainStateService.getCurrentWalletAddress();
  //   if (!walletAddress)
  //   {
  //     console.error(`Failed to get wallet address`);
  //     return;
  //   }

  //   if(this.blockchainStateService.getCurrentNetwork()?.chainId === "1151111081099710") { // SVM
  //     if (token.symbol === "SOL") // change to adres
  //     {
  //       return this.walletBalanceService.getSolanaBalance(walletAddress);
  //     }
  //     else
  //     {
  //       return this.walletBalanceService.getSolanaBalance(walletAddress, token.contractAddress);
  //     }
  //   }
  //   else { // EVM
  //     try {
  //       const response = await fetch('/data/networks.json');
  //       if (!response.ok) {
  //         console.error('Failed to load networks');
  //       }
  
  //       const data = await response.json();
  
  //       const network = data.find((net: { id: number }) => net.id === this.blockchainStateService.getCurrentNetwork()?.id);
  
  //       if (!network) {
  //         console.error('Network not found');
  //       }
  
  //       if (token.symbol === "ETH") {
  //         const balance = await this.walletBalanceService.getEvmBalance(walletAddress, network.rpcUrls[0], Number(token.decimals));
  //         return balance;
  //       } else {
  //         return await this.walletBalanceService.getEvmBalance(walletAddress, network.rpcUrls[0], Number(token.decimals), token.contractAddress);
  //       }
  //     } catch (error) {
  //       console.error(`Error loading networks`);
  //       return "0";
  //     }
  //   }
    
  // }

  getTokensForNetwork(): Token[] | undefined {
    const chainId = this.selectedNetwork()?.id;
    return chainId ? this.networkTokens.get((chainId)) : undefined;
  }

  getTokensForNetworkBuy(): Token[] | undefined {
    const chainId = this.selectedBuyNetwork()?.id;
    return chainId ? this.networkTokens.get((chainId)) : undefined;
  }

  getTxData() {
    const fromChain = (this.selectedNetwork()?.id)?.toString();
    const toChain = (this.selectedBuyNetwork()?.id)?.toString();
    console.log("this.selectedNetwork()?",this.selectedNetwork());
    console.log("this.selectedNetwork()?",this.selectedBuyNetwork());

    //const fromChain = this.blockchainStateService.network()!.id.toString();
    //const toChain = this.blockchainStateService.network()!.id.toString();
    const fromAddress = this.blockchainStateService.walletAddress()!;
    const fromTokenDecimals = this.selectedToken()!.decimals;
    const fromAmount = parseUnits(this.validatedSellAmount(), fromTokenDecimals);
    const fromToken = this.selectedToken()!.contractAddress;
    const toToken = this.selectedBuyToken()!.contractAddress;
    const toTokenDecimals = this.selectedBuyToken()!.decimals;
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
      this.setButtonState('bridge');
      return;
    }
    
    console.log("fromAddress",fromAddress);
    const toAddress = this.customAddress() !== '' ? this.customAddress() : undefined;
    const slippageValue = this.slippage !== 0.005 ? this.slippage: undefined; // 0.005 is default for LIFI

    this.transactionsService.getQuoteBridge(
      fromChain, toChain, fromToken, toToken, adjustedFromAmount, fromAddress, toAddress, slippageValue)
    .subscribe({
      next: (response: any) => {
        console.log('Quote received:', response);
        if (response.estimate && response.transactionRequest) 
        {
          const readableToAmount = this.transactionsService.parseToAmount(response.estimate.toAmount, Number(toTokenDecimals));
        
          console.log('readableToAmount:', readableToAmount);

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
              this.setButtonState('approve');
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
        this.setButtonState('bridge');
        console.log('Quote request completed');
      }
    });

  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
    //this.resetTimers();
  }

  ngAfterViewChecked() {
    // Проверяем, нужно ли анимировать текст
    this.checkAndAnimateReceiveText();
  }

  // get formattedNetworks() {
  //   return this.networks.map(network => ({
  //     name: network.name,
  //     imageUrl: network.icon
  //   }));
  // }

  toggleFeesVisibility(): void {
    this.feesVisible = !this.feesVisible;
    this.isNetworkChosen = !this.isNetworkChosen;
  }

  selectNetwork(networkId: string) {
    console.log(`Selected network: ${networkId}`);
    // Handle the selected network
  }
  closeNetworkChangeFromPopup(): void {
    this.popupService.closePopup('networkChangeFrom');
  }

  async onNetworkSelected(event: Network ): Promise<void> {
    this.selectedNetwork.set(event);
    requestAnimationFrame(() => {
      this.popupService.closeAllPopups();
    });
    this.receiveTextAnimated = false;
  }

  async onNetworkToSelected(event: Network): Promise<void> {
    this.selectedBuyNetwork.set(event);
    requestAnimationFrame(() => {
      this.popupService.closeAllPopups();
    });
    this.receiveTextAnimated = false;
  }

  async onTokenSelected(token: Token): Promise<void> {
    this.selectedToken.set(token);
    this.receiveTextAnimated = false;
  }

  async onTokenBuySelected(token: Token): Promise<void> {
    this.selectedBuyToken.set(token);
    this.receiveTextAnimated = false;
  }

	processInput(event: Event, isSell: boolean): void {
    this.txData.set(undefined);
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
      .replace(/[^0-9.,]/g, '')
      .replace(/(,|\.){2,}/g, '')
      .replace(/^(,|\.)/g, '')
      .replace(/,/g, '.');

    if (isSell) {
      clearTimeout(this.inputTimeout);

      this.inputTimeout = setTimeout(() => {
        this.sellAmount = inputElement.value;
        this.validatedSellAmount.set(inputElement.value);
      }, 2000);
    }
    console.log("some data");
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
    console.log('Animation ended, swapping networks...');
    const changeButton = document.getElementById('change-button');
    if (changeButton && changeButton.classList.contains('animate')) {
      this.renderer.removeClass(changeButton, 'animate');
      this.swapNetworks();
    }
  }
  
  swapNetworks(): void {
    console.log('Swapping networks...');
    this.txData.set(undefined);

    const tempNetwork = this.selectedNetwork();
		const tempToken = this.selectedToken();
    
		this.selectedToken.set(this.selectedBuyToken());
		this.selectedBuyToken.set(tempToken);
    
		this.selectedNetwork.set(this.selectedBuyNetwork());
		this.selectedBuyNetwork.set(tempNetwork);

    this.receiveTextAnimated = false;
  }

  openBridgeTxPopup(): void {
    // Скрываем контент с комиссиями при открытии попапа
    this.feesVisible = false;
    this.isNetworkChosen = false;
    this.showBridgeTxPopup = true;
    this.popupService.openPopup('bridgeTx');
  }

  closeBridgeTxPopup(): void {
    this.popupService.closePopup('bridgeTx');
  }

  //?
  isBridgeButtonActive = computed(() =>
      !!this.blockchainStateService.network() &&
      !!this.blockchainStateService.walletAddress() &&
      this.selectedToken() !== undefined &&
      this.selectedNetwork() !== undefined &&
      this.selectedBuyNetwork() !== undefined &&
      this.selectedBuyToken() !== undefined &&
      this.validatedSellAmount().trim() !== ''
    );

  isWalletConnected(): boolean {
    return this.blockchainStateService.connected();
  }

  setMaxSellAmount(): void {
    this.sellAmount = this.balance.toString();
    //this.updateBuyAmount(); todo
    //this.updateSellPriceUsd();
  }

  openConnectWalletPopup(): void {
    if (!this.blockchainStateService.connected()) {
      this.popupService.openPopup('connectWallet');
    }
  }

  closeConnectWalletPopup(): void {
    this.showConnectWalletPopup = false;
  }

  validateAddress(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.customAddress.set(input.value);
  }

  get addressStatus(): 'none' | 'good' | 'bad' {
    if (!this.customAddress()) {
      return 'none';
    }
    // Для примера используем простую проверку длины
    // В реальном приложении здесь должна быть более сложная валидация адреса
    return this.customAddress().length > 2 ? 'good' : 'bad';
  }

  toggleCustomAddress(): void {
    console.log('toggleCustomAddress called, current state:', this.showCustomAddress);
    
    if (this.showCustomAddress) {
      // Если инпут открыт, просто закрываем его
      this.showCustomAddress = false;
      console.log('Closing input');
    } else {
      // Если инпут закрыт, открываем его
      this.showCustomAddress = true;
      console.log('Opening input');
    }
    
    // Сбрасываем флаг анимации при переключении пользовательского адреса
    this.receiveTextAnimated = false;
  }

  // Нам больше не нужен метод onAnimationDone, так как Angular анимации
  // автоматически обрабатывают появление и исчезновение элементов
  // Можно удалить или оставить пустым для логирования
  onAnimationDone(event: any) {
    console.log('Animation done, event:', event);
  }

  // Новый метод для управления состоянием кнопки
  // startFindingRoutesProcess(): void {
  //   this.resetTimers();
    
  //   if (this.showCustomAddress && this.addressStatus === 'bad') {
  //     return;
  //   }
    
  //   this.setButtonState('finding');
    
  //   this.findingRoutesTimer = setTimeout(() => {
  //     this.setButtonState('approve');
  //     if (this.cdr) {
  //       this.cdr.detectChanges();
  //     }
  //   }, 2000);
  // }
  
  // Метод для обработки нажатия на кнопку
  async handleButtonClick(): Promise<void> {
    let txHash: string;
    if(this.blockchainStateService.network()?.id === 1151111081099710)
    {
      txHash = await this.svmSwap();
    }
    else
    {
      txHash = await this.evmSwap();
    }

    this.bridgeTxHash = txHash;
    this.openBridgeTxPopup();
    
    this.setButtonState('bridge');
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

    this.setButtonState('approve');

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

    this.setButtonState('bridge');
    this.buttonState === 'bridge'

    console.log("txHash",txHash);
    // console.log("this.loading()",this.loading()); 
    return txHash;
  }
  
  // Метод для сброса таймеров
  // resetTimers(): void {
  //   if (this.findingRoutesTimer) {
  //     clearTimeout(this.findingRoutesTimer);
  //     this.findingRoutesTimer = null;
  //   }
  //   if (this.walletTimer) {
  //     clearTimeout(this.walletTimer);
  //     this.walletTimer = null;
  //   }
  // }
  
  // Метод для сброса состояния кнопки
  resetButtonState(): void {
    //this.resetTimers();
    this.setButtonState('bridge');
  }

  openNetworkChangeFromPopup(): void {
    console.log('Opening networkChangeFrom popup');
    this.popupService.openPopup('networkChangeFrom');
  }

  openNetworkChangeToPopup(): void {
    console.log('Opening networkChangeTo popup');
    this.popupService.openPopup('networkChangeTo');
  }

  get buttonState(): 'bridge' | 'finding' | 'approve' | 'wallet' | 'wrong-address' {
    //console.log("uncoment, auto load fix???"); todo

    if (this.showCustomAddress && this.addressStatus === 'bad') {
      return 'wrong-address';
    }
    return this._buttonState;
  }
  
  // Добавляем сеттер для изменения состояния
  private setButtonState(state: 'bridge' | 'finding' | 'approve' | 'wallet'): void {
    if (this._buttonState !== state) {
      this._buttonState = state;
      // Сбрасываем флаг анимации, чтобы текст анимировался заново при изменении состояния
      this.receiveTextAnimated = false;
    }
  }

  /**
   * Анимирует текст с эффектом "подбора символов"
   * @param element Элемент, в котором нужно анимировать текст
   * @param finalText Конечный текст
   * @param elementId Уникальный идентификатор элемента
   */
  animateText(element: HTMLElement, finalText: string, elementId: string): void {
    // Сохраняем оригинальный текст для гарантированного отображения в конце
    const originalText = finalText;
    
    // Очищаем предыдущую анимацию, если она есть
    if (this.animationTimeouts[elementId]) {
      window.clearTimeout(this.animationTimeouts[elementId]);
      delete this.animationTimeouts[elementId];
    }
    
    let frame = 0;
    const totalFrames = this.animationFrames;
    
    // Создаем массив для отслеживания "глитч-эффекта" для каждой буквы
    const glitchStates = Array(finalText.length).fill(false);
    // Массив для отслеживания "подобранных" букв
    const resolvedChars = Array(finalText.length).fill(false);
    
    const animate = () => {
      if (frame >= totalFrames) {
        // Гарантируем, что в конце анимации отображается оригинальный текст
        element.textContent = originalText;
        delete this.animationTimeouts[elementId];
        return;
      }
      
      let result = '';
      const progress = frame / totalFrames;
      
      // Изменяем кривую прогресса для более медленного начала и быстрого завершения
      // Используем кубическую функцию для более плавного эффекта
      const easedProgress = Math.pow(progress, 0.6);
      
      // Определяем, сколько букв должно быть "подобрано" на текущем кадре
      // Используем нелинейную функцию для более интересного визуального эффекта
      const resolvedCount = Math.floor(finalText.length * easedProgress);
      
      // Обновляем состояние "подобранных" букв
      for (let i = 0; i < resolvedCount; i++) {
        if (!resolvedChars[i]) {
          resolvedChars[i] = true;
        }
      }
      
      // Случайно выбираем несколько букв для глитча
      // Уменьшаем частоту глитчей в начале и увеличиваем к концу
      if (frame % 2 === 0) {
        const glitchProbability = 0.05 + (progress * 0.1);
        for (let i = 0; i < finalText.length; i++) {
          if (Math.random() < glitchProbability) {
            glitchStates[i] = !glitchStates[i];
          }
        }
      }
      
      for (let i = 0; i < finalText.length; i++) {
        // Если буква уже "подобрана"
        if (resolvedChars[i]) {
          // Но может быть с глитчем
          if (glitchStates[i] && frame < totalFrames * 0.95 && finalText[i] !== ' ') {
            // Применяем глитч-эффект к уже подобранной букве
            if (Math.random() < 0.3) {
              // Используем кибер-символы для более футуристического вида
              const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
              result += this.cyberChars[cyberIndex];
            } else {
              const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
              result += this.glitchChars[glitchIndex];
            }
          } else {
            // Если это последние 10% анимации, всегда показываем правильную букву
            if (progress > 0.9) {
              result += finalText[i];
            } else {
              result += finalText[i];
            }
          }
        } else {
          // Буква еще не "подобрана"
          if (finalText[i] === ' ') {
            // Пробелы оставляем как есть для лучшей читаемости
            result += ' ';
          } else {
            // Для букв выбираем случайный символ
            // С вероятностью используем символы глитча или кибер-символы
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
      
      // Динамически регулируем скорость анимации - быстрее в начале, медленнее в середине, быстрее к концу
      let currentSpeed = this.animationSpeed;
      if (progress < 0.3) {
        currentSpeed = this.animationSpeed * 0.8; // Быстрее в начале
      } else if (progress > 0.7) {
        currentSpeed = this.animationSpeed * 0.7; // Быстрее к концу
      } else {
        currentSpeed = this.animationSpeed * 1.2; // Медленнее в середине
      }
      
      this.animationTimeouts[elementId] = window.setTimeout(animate, currentSpeed);
    };
    
    animate();
  }

  // Метод для проверки и запуска анимации текста
  private checkAndAnimateReceiveText() {
    if (this.receiveTextElement && !this.receiveTextAnimated && this.selectedBuyToken()!.symbol) {
      // Добавляем информацию о времени в секундах (например, 30 секунд)
      const finalText = `${this.validatedSellAmount()} ${this.selectedBuyToken()!.symbol} in 30 sec`;
      this.animateText(this.receiveTextElement.nativeElement, finalText, 'receiveText');
      this.receiveTextAnimated = true;
    }
  }

  // Settings popup
  get showSettingsBridgePopup(): boolean {
    return this.popupService.getCurrentPopup() === 'settingsBridge';
  }

  toggleSettingsBridgePopup(): void {
    if (this.showSettingsBridgePopup) {
      this.popupService.closePopup('settingsBridge');
    } else {
      this.popupService.openPopup('settingsBridge');
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
    // Не закрываем попап здесь, так как это уже происходит в компоненте settings-bridge
  }
}
