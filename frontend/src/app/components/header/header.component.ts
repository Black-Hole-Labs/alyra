import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, EventEmitter, Input, Output } from '@angular/core';
import { BlockchainConnectComponent } from "../blockchain-connect/blockchain-connect.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, BlockchainConnectComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() isPopupVisible: boolean = false;
  @Input() isNetworkPopupVisible: boolean = false;
  @Input() selectedNetwork: string = 'ethereum';
  gmCount: number | null = null;
  popupMessage: string = ''; // Сообщение для мини-попапа
  showPopup: boolean = false; // Управление отображением мини-попапа

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() toggleNetwork = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  togglePopup() {
    this.toggleMenu.emit();
  }

  toggleNetworkPopup() {
    this.toggleNetwork.emit();
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
      this.renderer.setStyle(spark, 'background-image', 'url("/img/animation/fire.png")');
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
}
