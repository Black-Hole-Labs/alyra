import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { StarAnimationService, Star } from '../../services/star-animation.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss',
		'./form-page.component.adaptives.scss'
	]
})
export class FormPageComponent implements OnInit, OnDestroy {
	stars$: Observable<Star[]>;
	emailControl = new FormControl('', [Validators.required, Validators.email]);
	isSubmitted = false;
	
	// Переменные для глитч-анимации
	private possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	private glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	private cyberChars = '0123456789';
	private animationFrames = 80;
	private animationSpeed = 25;
	private animationTimeout: number | null = null;
	private originalTitle = 'Blackhole PRO';

	constructor(
		public themeService: ThemeService,
		private starAnimationService: StarAnimationService,
		private emailService: EmailService
	) {
		this.stars$ = this.starAnimationService.stars;
	}

	ngOnInit() {
		document.documentElement.classList.add('form-page');
		this.starAnimationService.initializeStars();
		this.initTitleAnimation();
		
		const emailSubmitted = localStorage.getItem('blackhole-email-submitted');
		if (emailSubmitted === 'true') {
			this.isSubmitted = true;
		}
		
		(window as any).setStarAnimation = (mode: 'high' | 'medium' | 'low' | 'disabled') => {
			this.starAnimationService.setPerformanceMode(mode);
		};
		
		(window as any).getStarAnimation = () => {
			return this.starAnimationService.getPerformanceMode();
		};
	}

	ngOnDestroy() {
		document.documentElement.classList.remove('form-page');
		
		if (this.animationTimeout) {
			clearTimeout(this.animationTimeout);
		}
		
		delete (window as any).setStarAnimation;
		delete (window as any).getStarAnimation;
	}

	private initTitleAnimation() {
		const titleElement = document.querySelector('h1');
		if (titleElement) {
			// Запускаем анимацию сразу при загрузке страницы
			setTimeout(() => {
				this.animateTitle(titleElement as HTMLElement);
			}, 500); // Небольшая задержка для лучшего эффекта
			
			titleElement.addEventListener('mouseenter', () => {
				this.animateTitle(titleElement as HTMLElement);
			});
		}
	}

	private animateTitle(element: HTMLElement) {
		if (this.animationTimeout) {
			clearTimeout(this.animationTimeout);
		}

		let frame = 0;
		const finalText = this.originalTitle;
		const resolvedChars = Array(finalText.length).fill(false);

		const animate = () => {
			if (frame >= this.animationFrames) {
				element.textContent = finalText;
				this.animationTimeout = null;
				return;
			}

			let result = '';
			const progress = frame / this.animationFrames;
			
			// Каждая буква подбирается по очереди
			const currentCharIndex = Math.floor(finalText.length * progress);

			for (let i = 0; i < finalText.length; i++) {
				if (i < currentCharIndex) {
					// Уже подобранные символы - статичные
					result += finalText[i];
					resolvedChars[i] = true;
				} else if (i === currentCharIndex) {
					// Текущий подбираемый символ
					if (finalText[i] === ' ') {
						result += ' ';
						resolvedChars[i] = true;
					} else {
						// Добавляем высокую вероятность показать правильный символ для эффекта "подбора"
						const showCorrect = Math.random() < 0.7; // Высокая вероятность для текущего символа
						
						if (showCorrect) {
							result += finalText[i];
						} else {
							const rand = Math.random();
							if (rand < 0.4) {
								const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
								result += this.glitchChars[glitchIndex];
							} else if (rand < 0.7) {
								const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
								result += this.cyberChars[cyberIndex];
							} else {
								const randomIndex = Math.floor(Math.random() * this.possibleChars.length);
								result += this.possibleChars[randomIndex];
							}
						}
					}
				} else {
					// Еще не дошли до этого символа - постоянно крутим случайные символы
					if (finalText[i] === ' ') {
						result += ' ';
					} else {
						const rand = Math.random();
						if (rand < 0.3) {
							const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
							result += this.glitchChars[glitchIndex];
						} else if (rand < 0.6) {
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

			this.animationTimeout = window.setTimeout(animate, this.animationSpeed);
		};

		animate();
	}

	onMouseMove(event: MouseEvent, element: EventTarget | null) {
		if (!element) return;
		const rect = (element as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		
		const gradientX = (x / rect.width) * 100;
		const gradientY = (y / rect.height) * 100;
		
		(element as HTMLElement).style.setProperty('--gradient-x', `${gradientX}%`);
		(element as HTMLElement).style.setProperty('--gradient-y', `${gradientY}%`);
	}

	onMouseLeave(element: EventTarget | null) {
		if (!element) return;
		(element as HTMLElement).style.removeProperty('--gradient-x');
		(element as HTMLElement).style.removeProperty('--gradient-y');
	}

	toggleTheme() {
		this.themeService.toggleTheme();
	}

	trackByStar(index: number, star: Star): number {
		return star.id;
	}

	onMouseMoveGlobal(event: MouseEvent) {
		this.starAnimationService.onMouseMove(event);
	}

	async onApplyClick() {
		if (!this.emailControl.valid || !this.emailControl.value) {
			return;
		}

		this.isSubmitted = true;

		try {
			const response = await firstValueFrom(
				this.emailService.sendEmail(this.emailControl.value)
			);
			localStorage.setItem('blackhole-email-submitted', 'true');
		} catch (err) {
			this.isSubmitted = false;
		}
  	}

	get isEmailValid() {
		return this.emailControl.valid && this.emailControl.value && this.emailControl.value.trim() !== '';
	}
} 