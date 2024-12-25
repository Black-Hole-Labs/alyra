import { Component, Renderer2, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenChangePopupComponent } from '../../components/popup/token-change/token-change.component';
import { SettingsComponent } from '../../components/popup/settings/settings.component'; // Импортируем SettingsComponent

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
  selectedToken = 'ETH'; // Текущий выбранный токен для sell
  selectedBuyToken = 'USDT'; // Текущий выбранный токен для buy
  selectedTokenImage = '/img/trade/eth.png'; // Изображение для sell
  selectedBuyTokenImage = '/img/trade/usdt.png'; // Изображение для buy

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  processInput(event: Event, isSell: boolean): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value
      .replace(/[^0-9.,]/g, '') // Удаляем недопустимые символы
      .replace(/(,|\.){2,}/g, '') // Удаляем лишние точки или запятые
      .replace(/^(,|\.)/g, '') // Удаляем точку или запятую в начале
      .replace(/,/g, '.'); // Заменяем запятую на точку

    if (isSell) {
      this.sellAmount = inputElement.value;
      this.updateBuyAmount();
      this.updateSellPriceUsd();
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
    this.showTokenPopup = true;
  }

  closeTokenPopup(): void {
    this.showTokenPopup = false;
  }

  onTokenSelected(token: { symbol: string; imageUrl: string }): void {
    this.selectedToken = token.symbol;
    this.selectedTokenImage = token.imageUrl;
    this.closeTokenPopup();
  }

  // Методы управления попапом для buy
  openTokenBuyPopup(): void {
    this.showTokenBuyPopup = true;
  }

  closeTokenBuyPopup(): void {
    this.showTokenBuyPopup = false;
  }

  onBuyTokenSelected(token: { symbol: string; imageUrl: string }): void {
    this.selectedBuyToken = token.symbol;
    this.selectedBuyTokenImage = token.imageUrl;
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
}
