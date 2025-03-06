import { Component, OnInit, OnDestroy, Renderer2, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../services/network.service';
import { NetworkChangeFromPopupComponent } from '../../components/popup/network-change-from/network-change-from.component';
import { NetworkChangeToPopupComponent } from '../../components/popup/network-change-to/network-change-to.component';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { Subscription } from 'rxjs';
import { BridgeTxComponent } from '../../components/popup/bridge-tx/bridge-tx.component';
import { WalletService } from '../../services/wallet.service';
import { ConnectWalletComponent } from '../../components/popup/connect-wallet/connect-wallet.component';
import { Network, TransactionRequestEVM, TransactionRequestSVM } from '../../models/wallet-provider.interface';
import { Token } from '../trade/trade.component';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { WalletBalanceService } from '../../services/wallet-balance.service';

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
    ConnectWalletComponent
  ]
})
export class BridgeComponent implements OnInit, OnDestroy {
  private networkSubscription!: Subscription;
  feesVisible: boolean = false;
  isNetworkChosen: boolean = false;
  //networks: { id: string; name: string; icon: string; }[] = [];
  openNetworkChangeFromPopup: boolean = false;
  showNetworkChangeFromPopup: boolean = false;
  showNetworkChangeToPopup: boolean = false;
  showTokenChangePopup: boolean = false;
  //selectedNetworkTo: string = 'Abstract';
  //selectedNetworkToImage: string = '/img/header/network-menu/Abstract.png';

  showBridgeTxPopup = false;
  showConnectWalletPopup: boolean = false;
	customAddress = signal<string>('');
  showCustomAddress: boolean = false;

  txData = signal<TransactionRequestEVM | TransactionRequestSVM | undefined> (undefined);
  private inputTimeout: any;
  sellAmount: string = '';
  validatedSellAmount = signal<string>('');

  selectedToken = signal<Token | undefined>(undefined);
  selectedBuyToken = signal<Token | undefined>(undefined);

  selectedNetwork = signal<Network | undefined>(undefined);
  selectedBuyNetwork = signal<Network | undefined>(undefined);
  //selectedNetwork: string = '';

  balance = signal<number>(0.0);
  balanceBuy = signal<number>(0.0);

  constructor(
    // private networkService: NetworkService,
    // private walletService: WalletService,
    private renderer: Renderer2,
    private blockchainStateService: BlockchainStateService,
    private walletBalanceService: WalletBalanceService,
  ) {
    // this.networks = this.networkService.getNetworks();
		// const abstractNetwork = this.networkService.getNetworks()
    //   .find(network => network.id === 'abstract');

    // if (abstractNetwork) {
    //   this.selectedNetworkTo = abstractNetwork.name;
    //   this.selectedNetworkToImage = abstractNetwork.icon;
    // }

    effect(() => {
        if (this.blockchainStateService.connected() && this.selectedToken()) {
          this.getBalanceForToken(this.selectedToken()!)
          .then((balanceStr) => {
            this.balance.set(parseFloat(balanceStr));
          })
          .catch((error) => {
            console.error('Ошибка получения баланса', error);
            this.balance.set(0.0);
          });
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
        if (this.blockchainStateService.connected() && this.selectedBuyToken()) {
          this.getBalanceForToken(this.selectedBuyToken()!)
          .then((balanceStr) => {
            this.balanceBuy.set(parseFloat(balanceStr));
          })
          .catch((error) => {
            console.error('Ошибка получения баланса', error);
            this.balanceBuy.set(0.0);
          });
        }
      },
      { allowSignalWrites: true }
    );

    effect(() => {
        const tokens = this.blockchainStateService.filteredTokens();
        this.selectedToken.set(tokens.length > 0 ? tokens[0] : undefined);
        this.selectedBuyToken.set(tokens.length > 1 ? tokens[1] : undefined);
      },
      { allowSignalWrites: true }
    );

    effect(() => {
        const tokens = this.blockchainStateService.networks();
        this.selectedNetwork.set(tokens.length > 0 ? tokens[0] : undefined);
        this.selectedBuyNetwork.set(tokens.length > 1 ? tokens[1] : undefined);
      },
      { allowSignalWrites: true }
    );
  }

  async getBalanceForToken(token: Token): Promise<any> {
    const walletAddress = this.blockchainStateService.getCurrentWalletAddress();
    if (!walletAddress)
    {
      console.error(`Failed to get wallet address`);
      return;
    }

    if(this.blockchainStateService.getCurrentNetworkId()?.chainId === "1151111081099710") { // SVM
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
  
        const network = data.find((net: { id: number }) => net.id === this.blockchainStateService.getCurrentNetworkId()?.id);
  
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

  ngOnInit() {
    
  }

  ngOnDestroy() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }


  toggleFeesVisibility(): void {
    this.feesVisible = !this.feesVisible;
    this.isNetworkChosen = !this.isNetworkChosen;
  }

  selectNetwork(networkId: string) {
    console.log(`Selected network: ${networkId}`);
    // Handle the selected network
  }

  closeNetworkChangeFromPopup(): void {
    this.showNetworkChangeFromPopup = false;
  }

  async onNetworkSelected(event: Network ): Promise<void> {
    this.selectedNetwork.set(event);
    this.closeNetworkChangeFromPopup();
  }

  closeNetworkChangeToPopup(): void {
    this.showNetworkChangeToPopup = false;
  }

  async onNetworkToSelected(event: Network): Promise<void> {
    this.selectedBuyNetwork.set(event);
    this.closeNetworkChangeToPopup();
  }

  closeTokenChangePopup(): void {
    this.showTokenChangePopup = false;
  }

  async onTokenSelected(token: Token): Promise<void> {
    this.selectedToken.set(token);
    this.closeTokenChangePopup();
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
    
    console.log('After swap:', this.selectedNetwork(), this.selectedBuyNetwork());
		console.log('After swap:', this.selectedToken, this.selectedBuyToken);
  }

  openBridgeTxPopup(): void {
    // Скрываем контент с комиссиями при открытии попапа
    this.feesVisible = false;
    this.isNetworkChosen = false;
    this.showBridgeTxPopup = true;
  }

  closeBridgeTxPopup(): void {
    this.showBridgeTxPopup = false;
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
    this.showConnectWalletPopup = true;
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
    return this.customAddress().length <= 2 ? 'good' : 'bad';
  }

  toggleCustomAddress(): void {
    this.showCustomAddress = !this.showCustomAddress;
  }
}
