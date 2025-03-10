import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BlackholeNetworkComponent } from '../popup/blackhole-network/blackhole-network.component';
import { BlackholeMenuComponent } from '../popup/blackhole-menu/blackhole-menu.component';
import { ConnectWalletComponent } from '../popup/connect-wallet/connect-wallet.component';
import { WalletComponent } from '../popup/wallet/wallet.component';
import { PopupService } from '../../services/popup.service';
import { Subscription } from 'rxjs';
import { Component, ElementRef, Renderer2, EventEmitter, Input, Output, OnInit, OnDestroy, computed } from '@angular/core';
import { BlockchainConnectComponent } from "../blockchain-connect/blockchain-connect.component";
import { BlockchainStateService } from '../../services/blockchain-state.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  //@Input() isPopupVisible: boolean = false;
  //@Input() isNetworkPopupVisible: boolean = false;
  //@Input() selectedNetwork: string = 'ethereum';
  //@Input() selectedNetwork: { id: string; name: string; icon: string; } | null = null;
  gmCount: number | null = null;
  popupMessage: string = ''; // Сообщение для мини-попапа
  showPopup: boolean = false; // Управление отображением мини-попапа
  private readonly GM_COUNT_KEY = 'gmCount';
  private readonly LAST_GM_TIME_KEY = 'lastGmTime';
  showBlackholeMenu = false;
  showConnectWalletPopup = false;
  showWalletPopup = false;
  //walletName: string = 'Connect Wallet';
  walletName = computed(() => this.blockchainStateService.walletAddress() ?? 'Connect Wallet');
  private subscription: Subscription;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleNetwork = new EventEmitter<void>();

  // Добавляем свойства для анимации текста
  private menuItems: { element: HTMLElement, originalText: string }[] = [];
  private possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|';
  private glitchChars = '!@#$%^&*()_+{}:"<>?|\\';  // Символы для эффекта глитча
  private cyberChars = '01010101110010101010101110101010'; // Кибер-символы
  private animationFrames = 20; // Увеличиваем количество кадров для более плавной анимации
  private animationSpeed = 20; // Немного ускоряем анимацию
  private animationTimeouts: { [key: string]: number } = {};

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    public blockchainStateService: BlockchainStateService,
    public popupService: PopupService
  ) {
    this.subscription = this.popupService.activePopup$.subscribe(popupType => {
      this.showBlackholeMenu = false;
      this.showConnectWalletPopup = false;
      this.showWalletPopup = false;

      switch(popupType) {
        case 'blackholeMenu':
          this.showBlackholeMenu = true;
          break;
        case 'connectWallet':
          this.showConnectWalletPopup = true;
          break;
        case 'wallet':
          this.showWalletPopup = true;
          break;
      }
    });
  }

  selectedNetwork = computed(() => {
    const networks = this.blockchainStateService.network();
    return networks;
  });

  ngOnInit() {
    this.loadGmCount();

    this.loadGmCount();
    
    setTimeout(() => {
      this.initTextAnimation();
    }, 0);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    
    Object.values(this.animationTimeouts).forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
  }

  loadGmCount() {
    const savedCount = localStorage.getItem(this.GM_COUNT_KEY);
    const lastGmTime = localStorage.getItem(this.LAST_GM_TIME_KEY);

    if (savedCount && lastGmTime) {
      const now = new Date().getTime();
      const timeDiff = now - parseInt(lastGmTime);
      // Изменяем с 24 на 48 часов (48 * 60 * 60 * 1000 = 172800000 миллисекунд)
      if (timeDiff > 172800000) {
        // Прошло больше 48 часов - сбрасываем счетчик
        localStorage.removeItem(this.GM_COUNT_KEY);
        localStorage.removeItem(this.LAST_GM_TIME_KEY);
        this.gmCount = null;
      } else {
        this.gmCount = parseInt(savedCount);
      }
    }
  }

  togglePopup(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const currentPopup = this.popupService.getCurrentPopup();
    if (currentPopup === 'blackholeMenu') {
      this.popupService.closeAllPopups();
    } else {
      this.popupService.openPopup('blackholeMenu');
    }
  }

  get isNetworkPopupVisible(): boolean {
    return this.popupService.getCurrentPopup() === 'networkPopup';
  }

  toggleNetworkPopup(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const currentPopup = this.popupService.getCurrentPopup();
    if (currentPopup === 'networkPopup') {
      this.popupService.closeAllPopups();
    } else {
      this.popupService.openPopup('networkPopup');
    }
  }

  incrementGmCount() {
    const lastClickTime = localStorage.getItem('lastGmClick');
    const now = new Date();

    if (lastClickTime) {
      const lastClickDate = new Date(lastClickTime);
      const nextAllowedClick = new Date(lastClickDate);
      nextAllowedClick.setUTCDate(lastClickDate.getUTCDate() + 1);

      if (now < nextAllowedClick) {
        const timeLeft = this.calculateTimeLeft(nextAllowedClick, now);
        this.showPopupWithMessage(`Next GM in ${timeLeft}`);
        return;
      }
    }

    // Если можно кликнуть
    this.gmCount = (this.gmCount ?? 0) + 1;
    localStorage.setItem('lastGmClick', now.toISOString());
    this.triggerFireworks();
  }

  calculateTimeLeft(nextAllowed: Date, current: Date): string {
    const diff = nextAllowed.getTime() - current.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  showPopupWithMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.showPopup = false;
    }, 5000); // Показываем попап на 5 секунд
  }

  triggerFireworks() {
    const gmElement = this.elRef.nativeElement.querySelector('.gm');
    const container = this.elRef.nativeElement.querySelector('.fireworks-container');

    const gmRect = gmElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const centerX = gmRect.left + gmRect.width / 2 - containerRect.left; // Центр X
    const centerY = gmRect.top + gmRect.height / 2 - containerRect.top; // Центр Y

    for (let i = 0; i < 20; i++) {
      const spark = this.renderer.createElement('div');
      this.renderer.addClass(spark, 'spark');
      this.renderer.appendChild(container, spark);

      // Угол и дистанция
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 100 + 50;
      const duration = Math.random() * 800 + 500; // Длительность в миллисекундах

      // Вычисляем конечные координаты
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      // Устанавливаем начальную позицию
      this.renderer.setStyle(spark, 'background-color', ''); // Убедитесь, что нет фона
      this.renderer.setStyle(spark, 'background-image', 'url("/img/animation/ufo.png")');
      this.renderer.setStyle(spark, 'background-size', 'contain');
      this.renderer.setStyle(spark, 'border-radius', '0');
      this.renderer.setStyle(spark, 'box-shadow', 'none');

      // Начинаем анимацию
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // Прогресс от 0 до 1

        // Интерполяция координат
        const currentX = centerX + targetX * progress;
        const currentY = centerY + targetY * progress;

        // Обновляем позицию
        this.renderer.setStyle(spark, 'left', `${currentX}px`);
        this.renderer.setStyle(spark, 'top', `${currentY}px`);
        this.renderer.setStyle(spark, 'opacity', `${1 - progress}`); // Исчезновение

        if (progress < 1) {
          requestAnimationFrame(animate); // Продолжаем анимацию
        } else {
          // Удаляем искру после завершения
          this.renderer.removeChild(container, spark);
        }
      };

      requestAnimationFrame(animate);
    }
  }

  openConnectWalletPopup(): void {
    if (this.blockchainStateService.connected()) {
      this.popupService.openPopup('wallet');
    } else {
      this.popupService.openPopup('connectWallet');
    }
  }

  closeAllPopups(): void {
    this.popupService.closeAllPopups();
  }

  // Геттер для проверки состояния blackholeMenu
  get isPopupVisible(): boolean {
    return this.popupService.getCurrentPopup() === 'blackholeMenu';
  }

  openNetwork(): void {
    this.popupService.openPopup('network');
  }

  openSettings(): void {
    this.popupService.openPopup('settings');
  }

  // Инициализация анимации текста
  private initTextAnimation(): void {
    const menuLinks = this.elRef.nativeElement.querySelectorAll('nav a');
    
    menuLinks.forEach((link: HTMLElement) => {
      const originalText = link.textContent || '';
      this.menuItems.push({ element: link, originalText });
      
      // Добавляем обработчики событий для наведения мыши
      this.renderer.listen(link, 'mouseenter', () => {
        this.animateText(link, originalText);
      });
      
      this.renderer.listen(link, 'mouseleave', () => {
        // Останавливаем анимацию и возвращаем оригинальный текст
        link.textContent = originalText;
      });
    });
  }
  
  // Анимация "подбора букв"
  private animateText(element: HTMLElement, finalText: string): void {
    // Отменяем предыдущую анимацию, если она есть
    const elementId = element.getAttribute('data-animation-id') || Math.random().toString(36).substring(2, 9);
    element.setAttribute('data-animation-id', elementId);
    
    if (this.animationTimeouts[elementId]) {
      clearTimeout(this.animationTimeouts[elementId]);
    }
    
    let frame = 0;
    const totalFrames = this.animationFrames;
    
    // Создаем массив для отслеживания "глитч-эффекта" для каждой буквы
    const glitchStates = Array(finalText.length).fill(false);
    // Массив для отслеживания "подобранных" букв
    const resolvedChars = Array(finalText.length).fill(false);
    
    const animate = () => {
      if (frame >= totalFrames) {
        element.textContent = finalText;
        delete this.animationTimeouts[elementId];
        return;
      }
      
      let result = '';
      const progress = frame / totalFrames;
      
      // Определяем, сколько букв должно быть "подобрано" на текущем кадре
      const resolvedCount = Math.floor(finalText.length * Math.pow(progress, 0.8));
      
      // Обновляем состояние "подобранных" букв
      for (let i = 0; i < resolvedCount; i++) {
        if (!resolvedChars[i]) {
          resolvedChars[i] = true;
        }
      }
      
      // Случайно выбираем несколько букв для глитча
      if (frame % 3 === 0) {
        for (let i = 0; i < finalText.length; i++) {
          if (Math.random() < 0.1) {
            glitchStates[i] = !glitchStates[i];
          }
        }
      }
      
      for (let i = 0; i < finalText.length; i++) {
        // Если буква уже "подобрана"
        if (resolvedChars[i]) {
          // Но может быть с глитчем
          if (glitchStates[i] && frame < totalFrames * 0.9 && finalText[i] !== ' ') {
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
            result += finalText[i];
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
      
      this.animationTimeouts[elementId] = window.setTimeout(animate, this.animationSpeed);
    };
    
    animate();
  }
}
