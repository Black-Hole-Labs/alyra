import { Component, OnInit, OnDestroy, Renderer2, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NetworkService } from '../../services/network.service';
import { NetworkChangeFromPopupComponent } from '../../components/popup/network-change-from/network-change-from.component';
import { NetworkChangeToPopupComponent } from '../../components/popup/network-change-to/network-change-to.component';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { Subscription } from 'rxjs';
import { BridgeTxComponent } from '../../components/popup/bridge-tx/bridge-tx.component';
import { WalletService } from '../../services/wallet.service';
import { PopupService } from '../../services/popup.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TokenChangeBuyComponent } from '../../components/popup/token-change-buy/token-change-buy.component';

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
    TokenChangeBuyComponent,
    BridgeTxComponent
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
export class BridgeComponent implements OnInit, OnDestroy, AfterViewChecked {
  private networkSubscription!: Subscription;
  feesVisible: boolean = false;
  isNetworkChosen: boolean = false;
  networks: { id: string; name: string; icon: string; }[] = [];
  selectedNetworkImage: string = '';
  selectedNetwork: string = '';
  selectedNetworkTo: string = 'Abstract';
  selectedNetworkToImage: string = '/img/header/network-menu/Abstract.png';
  selectedToken: any = {
    symbol: 'ETH',
    imageUrl: '/img/trade/eth.png'
  };
  selectedReceiveToken: any = {
    symbol: 'ETH',
    imageUrl: '/img/trade/eth.png'
  };
  showBridgeTxPopup = false;
  inputAmount: string = '';
  customAddress: string = '';
  showCustomAddress: boolean = false;
  findingRoutesTimer: any = null;
  walletTimer: any = null;
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

  constructor(
    private networkService: NetworkService,
    private walletService: WalletService,
    private renderer: Renderer2,
    public popupService: PopupService,
    private cdr: ChangeDetectorRef
  ) {
    this.networks = this.networkService.getNetworks();
		const abstractNetwork = this.networkService.getNetworks()
      .find(network => network.id === 'abstract');

    if (abstractNetwork) {
      this.selectedNetworkTo = abstractNetwork.name;
      this.selectedNetworkToImage = abstractNetwork.icon;
    }
  }

  ngOnInit() {
    // Подписываемся на изменения выбранной сети
    this.networkSubscription = this.networkService.selectedNetwork$.subscribe(network => {
      if (network) {
        // Обновляем сеть "From" при изменении сети в хедере
        this.selectedNetwork = network.name;
        this.selectedNetworkImage = network.icon;
        console.log('Network updated from header:', network); // для отладки
      }
    });

    // Получаем текущую выбранную сеть при инициализации
    const currentNetwork = this.networkService.getSelectedNetwork();
    if (currentNetwork) {
      this.selectedNetwork = currentNetwork.name;
      this.selectedNetworkImage = currentNetwork.icon;
    }

    // Если у вас есть сервис с токенами, можно получить первый токен из него
    // this.selectedToken = this.tokenService.getDefaultToken();
    
    // Или установить напрямую
    this.selectedToken = {
      symbol: 'ETH',
      imageUrl: '/img/trade/eth.png',
      // другие необходимые свойства токена
    };

    // Если по какой-то причине сеть не была установлена в конструкторе
    if (!this.selectedNetworkTo) {
      const abstractNetwork = this.networkService.getNetworks()
        .find(network => network.id === 'abstract');

      if (abstractNetwork) {
        this.selectedNetworkTo = abstractNetwork.name;
        this.selectedNetworkToImage = abstractNetwork.icon;
      }
    }
  }

  ngOnDestroy() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
    this.resetTimers();
  }

  ngAfterViewChecked() {
    // Проверяем, нужно ли анимировать текст
    this.checkAndAnimateReceiveText();
  }

  get formattedNetworks() {
    return this.networks.map(network => ({
      name: network.name,
      imageUrl: network.icon
    }));
  }

  toggleFeesVisibility(): void {
    this.feesVisible = !this.feesVisible;
    this.isNetworkChosen = !this.isNetworkChosen;
  }

  selectNetwork(networkId: string) {
    console.log(`Selected network: ${networkId}`);
    // Handle the selected network
  }

  openNetworkChangeFromPopup(): void {
    console.log('Opening networkChangeFrom popup');
    this.popupService.openPopup('networkChangeFrom');
  }

  closeNetworkChangeFromPopup(): void {
    this.popupService.closePopup('networkChangeFrom');
  }

  onNetworkSelected(event: { name: string; imageUrl: string }): void {
    console.log('Bridge: onNetworkSelected called', event);
    this.selectedNetwork = event.name;
    this.selectedNetworkImage = event.imageUrl;
    // Добавим задержку перед закрытием
    requestAnimationFrame(() => {
      this.popupService.closeAllPopups();
    });
    this.receiveTextAnimated = false;
  }

  openNetworkChangeToPopup(): void {
    console.log('Opening networkChangeTo popup');
    this.popupService.openPopup('networkChangeTo');
  }

  closeNetworkChangeToPopup(): void {
    this.popupService.closePopup('networkChangeTo');
  }

  onNetworkToSelected(event: { name: string; imageUrl: string }): void {
    console.log('Bridge: onNetworkToSelected called', event);
    this.selectedNetworkTo = event.name;
    this.selectedNetworkToImage = event.imageUrl;
    // Добавим задержку перед закрытием
    requestAnimationFrame(() => {
      this.popupService.closeAllPopups();
    });
    this.receiveTextAnimated = false;
  }

  closeTokenChangePopup(): void {
    // showTokenChangePopup = false;
  }

  onTokenSelected(token: { symbol: string; imageUrl: string }): void {
    this.selectedToken = token;
    this.closeTokenChangePopup();
    this.receiveTextAnimated = false;
  }

  onReceiveTokenSelected(token: { symbol: string; imageUrl: string }): void {
    this.selectedReceiveToken = token;
    this.closeTokenChangePopup();
    this.receiveTextAnimated = false;
  }

	processInput(event: Event, isAmount: boolean): void {
    const input = event.target as HTMLInputElement;
    if (isAmount) {
      let value = input.value;
      
      // Заменяем запятые на точки
      value = value.replace(/,/g, '.');
      
      // Если ввод начинается с точки, добавляем 0 перед ней
      if (value.startsWith('.')) {
        value = '0' + value;
      }
      
      // Удаляем все символы, кроме цифр и точки
      value = value.replace(/[^0-9.]/g, '');
      
      // Удаляем лишние точки, оставляя только первую
      const firstDotIndex = value.indexOf('.');
      if (firstDotIndex !== -1) {
        value = value.slice(0, firstDotIndex + 1) + 
              value.slice(firstDotIndex + 1).replace(/\./g, '');
      }
      
      this.inputAmount = value;
      input.value = value;
      
      // Если значение не пустое, запускаем процесс поиска маршрутов
      if (value && Number(value) > 0) {
        this.startFindingRoutesProcess();
      } else {
        // Если значение пустое, сбрасываем состояние кнопки
        this.resetButtonState();
        // Закрываем кастом валлет, если он открыт
        if (this.showCustomAddress) {
          this.showCustomAddress = false;
        }
      }
    }
    this.receiveTextAnimated = false;
  }

  restrictInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', '.', ','];
    
    // Разрешаем цифры и некоторые управляющие клавиши
    if (
      (event.key >= '0' && event.key <= '9') || 
      allowedKeys.includes(event.key)
    ) {
      return; // Разрешённый ввод
    }
    
    // Блокируем остальные символы
    event.preventDefault();
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
    console.log('Swapping networks and tokens...');
    
    // Сохраняем временные значения для сетей
    const tempNetwork = this.selectedNetwork;
    const tempNetworkImage = this.selectedNetworkImage;
    
    // Меняем местами сети
    this.selectedNetwork = this.selectedNetworkTo;
    this.selectedNetworkImage = this.selectedNetworkToImage;
    this.selectedNetworkTo = tempNetwork;
    this.selectedNetworkToImage = tempNetworkImage;
    
    // Сохраняем временные значения для токенов
    const tempToken = this.selectedToken;
    
    // Меняем местами токены
    this.selectedToken = this.selectedReceiveToken;
    this.selectedReceiveToken = tempToken;
    
    console.log('After swap:', {
      fromNetwork: this.selectedNetwork,
      toNetwork: this.selectedNetworkTo,
      fromToken: this.selectedToken.symbol,
      toToken: this.selectedReceiveToken.symbol
    });
    
    // Сбрасываем флаг анимации при смене сетей
    this.receiveTextAnimated = false;
  }

  openBridgeTxPopup(): void {
    // Скрываем контент с комиссиями при открытии попапа
    this.feesVisible = false;
    this.isNetworkChosen = false;
    this.popupService.openPopup('bridgeTx');
  }

  closeBridgeTxPopup(): void {
    this.popupService.closePopup('bridgeTx');
  }

  // Метод для проверки всех условий
  isBridgeButtonActive(): boolean {
    return !!(
      this.selectedNetwork && 
      this.selectedNetworkTo && 
      this.selectedToken?.symbol && 
      this.inputAmount && 
      Number(this.inputAmount) > 0
    );
  }

  isWalletConnected(): boolean {
    return this.walletService.isConnected();
  }

  openConnectWalletPopup(): void {
    if (!this.walletService.isConnected()) {
      this.popupService.openPopup('connectWallet');
    }
  }

  validateAddress(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.customAddress = input.value;
  }

  get addressStatus(): 'none' | 'good' | 'bad' {
    if (!this.customAddress) {
      return 'none';
    }
    // Для примера используем простую проверку длины
    // В реальном приложении здесь должна быть более сложная валидация адреса
    return this.customAddress.length > 2 ? 'good' : 'bad';
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
  startFindingRoutesProcess(): void {
    this.resetTimers();
    
    if (this.showCustomAddress && this.addressStatus === 'bad') {
      return;
    }
    
    this.setButtonState('finding');
    
    this.findingRoutesTimer = setTimeout(() => {
      this.setButtonState('approve');
      if (this.cdr) {
        this.cdr.detectChanges();
      }
    }, 2000);
  }
  
  // Метод для обработки нажатия на кнопку
  handleButtonClick(): void {
    if (this.buttonState === 'approve') {
      this.setButtonState('wallet');
      
      this.walletTimer = setTimeout(() => {
        this.setButtonState('bridge');
        if (this.cdr) {
          this.cdr.detectChanges();
        }
      }, 2000);
    } else if (this.buttonState === 'bridge') {
      this.openBridgeTxPopup();
    }
  }
  
  // Метод для сброса таймеров
  resetTimers(): void {
    if (this.findingRoutesTimer) {
      clearTimeout(this.findingRoutesTimer);
      this.findingRoutesTimer = null;
    }
    if (this.walletTimer) {
      clearTimeout(this.walletTimer);
      this.walletTimer = null;
    }
  }
  
  // Метод для сброса состояния кнопки
  resetButtonState(): void {
    this.resetTimers();
    this.setButtonState('bridge');
  }

  get buttonState(): 'bridge' | 'finding' | 'approve' | 'wallet' | 'wrong-address' {
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
    if (this.receiveTextElement && !this.receiveTextAnimated && this.isBridgeButtonActive()) {
      const element = this.receiveTextElement.nativeElement;
      
      // Формируем текст вручную, чтобы гарантировать правильное содержимое
      const formattedText = `${this.inputAmount} ${this.selectedReceiveToken.symbol} in ~2 seconds`;
      
      if (formattedText) {
        this.receiveTextAnimated = true;
        
        // Устанавливаем начальное содержимое элемента
        element.textContent = formattedText;
        
        // Запускаем анимацию с правильным текстом
        this.animateText(element, formattedText, 'receiveText');
      }
    }
  }
}