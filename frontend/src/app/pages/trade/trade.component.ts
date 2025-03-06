import { Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { TokenChangeBuyComponent } from '../../components/popup/token-change-buy/token-change-buy.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component'; // Импортируем SettingsComponent
import { WalletService } from '../../services/wallet.service';
import { PopupService } from '../../services/popup.service';
import { SuccessNotificationComponent } from '../../components/notification/success-notification/success-notification.component';
import { FailedNotificationComponent } from '../../components/notification/failed-notification/failed-notification.component';
import { PendingNotificationComponent } from '../../components/notification/pending-notification/pending-notification.component';

@Component({
  selector: 'app-trade',
  standalone: true,
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    TokenChangePopupComponent,
    TokenChangeBuyComponent,
    SettingsComponent, // Добавляем SettingsComponent в imports
    SuccessNotificationComponent,
    FailedNotificationComponent,
    PendingNotificationComponent,
  ],
})
export class TradeComponent {
  sellAmount: string = ''; // Значение, которое пользователь вводит в поле продажи
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
  selectedToken = 'ETH'; // Текущий выбранный токен для sell
  selectedBuyToken = 'USDT'; // Текущий выбранный токен для buy
  selectedTokenImage = '/img/trade/eth.png'; // Изображение для sell
  selectedBuyTokenImage = '/img/trade/usdt.png'; // Изображение для buy

  // Добавляем новые свойства для управления состоянием кнопки
  buttonState: 'swap' | 'finding' | 'approve' | 'wallet' | 'insufficient' = 'swap';
  findingRoutesTimer: any = null;
  walletTimer: any = null;

  // Добавьте новое свойство
  showSuccessNotification = false;
  showFailedNotification = false;
  showPendingNotification = false;
  private isLastNotificationSuccess = false; // для отслеживания последнего состояния

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private walletService: WalletService,
    public popupService: PopupService
  ) {}

  processInput(event: Event, isSellInput: boolean): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Проверка на корректность ввода
    if (value === '' || isNaN(Number(value))) {
      if (isSellInput) {
        this.sellAmount = '';
        this.buyAmount = '';
      } else {
        this.buyAmount = '';
        this.sellAmount = '';
      }
      this.sellPriceUsd = '';
      this.buttonState = 'swap'; // Сбрасываем состояние кнопки
      
      // Очищаем оба таймера
      if (this.findingRoutesTimer) {
        clearTimeout(this.findingRoutesTimer);
      }
      if (this.walletTimer) {
        clearTimeout(this.walletTimer);
      }
      return;
    }

    if (isSellInput) {
      // Конвертация из sell в buy
      this.sellAmount = value;
      this.buyAmount = (Number(value) * this.price).toString();
    } else {
      // Конвертация из buy в sell
      this.buyAmount = value;
      this.sellAmount = (Number(value) / this.price).toString();
    }

    this.updateSellPriceUsd();
    
    // Проверяем баланс перед запуском процесса поиска маршрутов
    if (Number(this.sellAmount) > this.balance) {
      this.buttonState = 'insufficient';
      // Очищаем таймеры, так как они нам не нужны в этом состоянии
      this.resetTimers();
      return;
    }
    
    // Запускаем таймер для изменения состояния кнопки только если сумма в пределах баланса
    if (Number(this.sellAmount) > 0 && Number(this.sellAmount) <= this.balance) {
      this.startFindingRoutesProcess();
    }
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
    
    // Добавляем запуск процесса изменения состояний кнопки
    if (this.balance > 0) {
      this.startFindingRoutesProcess();
    }
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
		console.log('Before swap:', this.selectedToken, this.selectedBuyToken);
	
		// Меняем местами токены и изображения
		const tempToken = this.selectedToken;
		const tempTokenImage = this.selectedTokenImage;
		this.selectedToken = this.selectedBuyToken;
		this.selectedTokenImage = this.selectedBuyTokenImage;
		this.selectedBuyToken = tempToken;
		this.selectedBuyTokenImage = tempTokenImage;
	
		// Меняем местами значения sell и buy
		const tempAmount = this.sellAmount;
		this.sellAmount = this.buyAmount;
		this.buyAmount = tempAmount;
	
		console.log('After swap:', this.selectedToken, this.selectedBuyToken);
	}
	
	

  // Методы управления попапом для sell
  openTokenPopup(): void {
    this.popupService.openPopup('tokenChangeSell');
  }

  closeTokenPopup(): void {
    this.popupService.closePopup('tokenChangeSell');
  }

  onTokenSelected(token: { symbol: string; imageUrl: string }): void {
    this.selectedToken = token.symbol;
    this.selectedTokenImage = token.imageUrl;
    this.popupService.closeAllPopups();
  }

  // Методы управления попапом для buy
  openTokenBuyPopup(): void {
    this.popupService.openPopup('tokenChangeBuy');
  }

  closeTokenBuyPopup(): void {
    this.popupService.closePopup('tokenChangeBuy');
  }

  onBuyTokenSelected(token: { symbol: string; imageUrl: string }): void {
    this.selectedBuyToken = token.symbol;
    this.selectedBuyTokenImage = token.imageUrl;
    this.popupService.closeAllPopups();
  }

	// Settings popup
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
		this.slippage = value;
  }

  // Новый метод для управления состоянием кнопки
  startFindingRoutesProcess(): void {
    // Очищаем предыдущий таймер, если он существует
    if (this.findingRoutesTimer) {
      clearTimeout(this.findingRoutesTimer);
    }
    
    // Устанавливаем состояние "Finding Routes..."
    this.buttonState = 'finding';
    
    // Через 2 секунды меняем на "Approve"
    this.findingRoutesTimer = setTimeout(() => {
      this.buttonState = 'approve';
      this.cdr.detectChanges(); // Обновляем представление
    }, 2000);
  }

  // Обновляем метод для проверки активности кнопки
  isSwapButtonActive(): boolean {
    const amount = Number(this.sellAmount);
    return !!(
      this.sellAmount && 
      amount > 0 && 
      amount <= this.balance && 
      this.buttonState !== 'insufficient'
    );
  }

  // Обновляем метод для свапа
  swap(): void {
    if (this.buttonState === 'approve') {
      console.log('Approving token...');
      this.buttonState = 'wallet';
      
      this.walletTimer = setTimeout(() => {
        this.buttonState = 'swap';
        this.cdr.detectChanges();
      }, 2000);
    } else if (this.buttonState === 'swap') {
      console.log('Swap initiated with amount:', this.sellAmount);
      
      // Сначала показываем только Pending
      this.showPendingNotification = true;
      this.showSuccessNotification = false;
      this.showFailedNotification = false;
      this.cdr.detectChanges();

      // Через 3 секунды начинаем процесс закрытия
      setTimeout(() => {
        // Запускаем анимацию закрытия пендинга
        const pendingNotification = document.querySelector('app-pending-notification .notification') as HTMLElement;
        if (pendingNotification) {
          pendingNotification.style.transform = 'translateX(100%)';
          pendingNotification.style.opacity = '0';
        }

        // Ждем завершения анимации (300мс) перед скрытием и показом следующего уведомления
        setTimeout(() => {
          this.showPendingNotification = false;
          
          // Переключаем между Success и Failed
          if (this.isLastNotificationSuccess) {
            this.showFailedNotification = true;
          } else {
            this.showSuccessNotification = true;
          }
          this.isLastNotificationSuccess = !this.isLastNotificationSuccess;
          this.cdr.detectChanges();
        }, 300);
      }, 3000);
    }
  }

  isWalletConnected(): boolean {
    return this.walletService.isConnected();
  }

  openConnectWalletPopup(): void {
    if (!this.walletService.isConnected()) {
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
