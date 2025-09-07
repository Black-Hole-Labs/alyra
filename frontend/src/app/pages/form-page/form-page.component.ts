import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { RouterModule } from '@angular/router';
import { PopupService } from '../../services/popup.service';
import { StarAnimationService, Star } from '../../services/star-animation.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './form-page.component.html',
  styleUrls: ['./form-page.component.scss',
		'./form-page.component.adaptives.scss'
	]
})
export class FormPageComponent implements OnInit, OnDestroy {
	stars$: Observable<Star[]>;
	emailControl = new FormControl('', [Validators.required, this.customEmailValidator]);
	isSubmitted = false;
	isPopupVisible = false;
	
	// Variables for glitch animation
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
		private emailService: EmailService,
		private popupService: PopupService
	) {
		this.stars$ = this.starAnimationService.stars;
		
		this.popupService.activePopup$.subscribe((popupType) => {
			this.isPopupVisible = popupType === 'blackholeMenu';
		});
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
			setTimeout(() => {
				this.animateTitle(titleElement as HTMLElement);
			}, 500);
			
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
			
			const currentCharIndex = Math.floor(finalText.length * progress);

			for (let i = 0; i < finalText.length; i++) {
				if (i < currentCharIndex) {
					result += finalText[i];
					resolvedChars[i] = true;
				} else if (i === currentCharIndex) {
					if (finalText[i] === ' ') {
						result += ' ';
						resolvedChars[i] = true;
					} else {
						const showCorrect = Math.random() < 0.7;
						
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
			const response = await firstValueFrom(this.emailService.sendEmail(this.emailControl.value));
			localStorage.setItem('blackhole-email-submitted', 'true');
		} catch (err: any) {
			if (err.status == 201)
			{
				localStorage.setItem('blackhole-email-submitted', 'true');
			}
			else
			{
				this.isSubmitted = false;
				throw err;
			}
		}
  	}

	get isEmailValid() {
		return this.emailControl.valid && this.emailControl.value && this.emailControl.value.trim() !== '';
	}

	private customEmailValidator(control: AbstractControl): ValidationErrors | null {
		const email = control.value;
		
		if (!email) {
			return null;
		}

		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		
		if (!emailRegex.test(email)) {
			return { invalidEmail: true };
		}

		const latinOnlyRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
		
		if (!latinOnlyRegex.test(email)) {
			return { invalidEmail: true };
		}

		const parts = email.split('@');
		if (parts.length !== 2) {
			return { invalidEmail: true };
		}

		const [localPart, domain] = parts;
		
		if (localPart.length === 0 || localPart.startsWith('.') || localPart.endsWith('.') || localPart.includes('..')) {
			return { invalidEmail: true };
		}

		const domainParts = domain.split('.');
		if (domainParts.length < 2) {
			return { invalidEmail: true };
		}

		for (const part of domainParts) {
			if (part.length === 0) {
				return { invalidEmail: true };
			}
		}

		const tld = domainParts[domainParts.length - 1];
		const tldRegex = /^[a-zA-Z]{2,}$/;
		
		if (!tldRegex.test(tld)) {
			return { invalidEmail: true };
		}

		return null;
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
} 