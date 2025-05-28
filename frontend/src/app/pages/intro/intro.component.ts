import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PopupService } from '../../services/popup.service';
import { Title } from '@angular/platform-browser';
import { BlockchainStateService } from '../../services/blockchain-state.service';
import { TypingAnimationService } from '../../services/typing-animation.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	]
})
export class IntroComponent implements OnInit, AfterViewInit {
  @ViewChild('subtitleLine1') subtitleLine1!: ElementRef;
  @ViewChild('tokenImg') tokenImg!: ElementRef;
  
  chainsCount = 0;
  bridgesCount = 0;
  dexsCount = 0;
  
  private readonly BRIDGES_TARGET = 17;
  private readonly DEXS_TARGET = 12;
  private readonly ANIMATION_DURATION = 2000;
  private readonly DELAY_BETWEEN = 200;

  constructor(
    private router: Router,
    private popupService: PopupService,
    private titleService: Title,
    private blockchainStateService: BlockchainStateService,
    private typingAnimationService: TypingAnimationService
  ) {}

  ngOnInit() {
    this.popupService.closeAllPopups();
    this.titleService.setTitle('Blackhole Labs');
    setTimeout(() => this.startCountAnimation(), 500);
  }

  ngAfterViewInit() {
    this.startTypingAnimation();
    this.setTokenBorderColor();
  }

  private async startTypingAnimation() {
    const subtitleText = 'Smarter routing. Safer transactions. Unified experience.';

    await this.typingAnimationService.typeText(
      this.subtitleLine1.nativeElement,
      subtitleText,
      {
        delay: 35,
        cursor: true,
        cursorChar: '|'
      }
    );
  }

  private easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
  }

  private startCountAnimation() {
    const startTime = performance.now();
    const chainsTarget = this.blockchainStateService.networks().length;
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      
      const chainsProgress = Math.min((elapsed) / this.ANIMATION_DURATION, 1);
      const chainsEase = this.easeOutQuad(chainsProgress);
      this.chainsCount = Math.floor(chainsTarget * chainsEase);
      
      const bridgesProgress = Math.min((elapsed - this.DELAY_BETWEEN) / this.ANIMATION_DURATION, 1);
      const bridgesEase = this.easeOutQuad(Math.max(0, bridgesProgress));
      this.bridgesCount = Math.floor(this.BRIDGES_TARGET * bridgesEase);
      
      const dexsProgress = Math.min((elapsed - this.DELAY_BETWEEN * 2) / this.ANIMATION_DURATION, 1);
      const dexsEase = this.easeOutQuad(Math.max(0, dexsProgress));
      this.dexsCount = Math.floor(this.DEXS_TARGET * dexsEase);
      
      if (chainsProgress < 1 || bridgesProgress < 1 || dexsProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  private async setTokenBorderColor() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 0) { // если пиксель не прозрачный
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }
      
      if (count > 0) {
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        
        const color = `rgb(${r}, ${g}, ${b})`;
        document.documentElement.style.setProperty('--token-border-color', color);
        console.log('Border color set to:', color); // для отладки
      }
    };

    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
    
    img.src = '/img/intro/arb-token.png';
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

  launchApp() {
    this.router.navigate(['/trade']);
  }

  reloadPage() {
    window.location.reload();
  }
} 