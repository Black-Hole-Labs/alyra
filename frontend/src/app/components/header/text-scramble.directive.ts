import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, Renderer2 } from '@angular/core';

const POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|';
const GLITCH = '!@#$%^&*()_+{}:"<>?|\\';
const CYBER = '01010101110010101010101110101010';
const FRAMES = 20;
const SPEED = 20;
const IS_SAFARI = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

@Directive({
  selector: '[appTextScramble]',
  standalone: true,
})
export class TextScrambleDirective implements AfterViewInit, OnDestroy {
  private original = '';
  private timeoutId: number | null = null;

  constructor(
    private readonly r: Renderer2,
    private readonly host: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    const el = this.host.nativeElement;
    this.original = (el.textContent ?? '').toString();
  }

  @HostListener('mouseenter')
  onEnter() {
    const el = this.host.nativeElement;
    const text = this.original;
    if (!text) return;

    if (IS_SAFARI) {
      this.r.setProperty(el, 'textContent', text);
      return;
    }
    this.animate(el, text);
  }

  private animate(element: HTMLElement, finalText: string) {
    let frame = 0;
    const total = FRAMES;
    const glitchStates = Array(finalText.length).fill(false);
    const resolved = Array(finalText.length).fill(false);

    const tick = () => {
      if (frame >= total) {
        this.r.setProperty(element, 'textContent', finalText);
        this.timeoutId = null;
        return;
      }

      const progress = frame / total;
      const resolvedCount = Math.floor(finalText.length * Math.pow(progress, 0.8));
      for (let i = 0; i < resolvedCount; i++) resolved[i] = true;

      if (frame % 3 === 0) {
        for (let i = 0; i < finalText.length; i++) {
          if (Math.random() < 0.1) glitchStates[i] = !glitchStates[i];
        }
      }

      let out = '';
      for (let i = 0; i < finalText.length; i++) {
        if (resolved[i]) {
          if (glitchStates[i] && frame < total * 0.9 && finalText[i] !== ' ') {
            out +=
              Math.random() < 0.3
                ? CYBER[Math.floor(Math.random() * CYBER.length)]
                : GLITCH[Math.floor(Math.random() * GLITCH.length)];
          } else {
            out += finalText[i];
          }
        } else {
          if (finalText[i] === ' ') out += ' ';
          else {
            const r = Math.random();
            if (r < 0.2) out += GLITCH[Math.floor(Math.random() * GLITCH.length)];
            else if (r < 0.4) out += CYBER[Math.floor(Math.random() * CYBER.length)];
            else out += POSSIBLE[Math.floor(Math.random() * POSSIBLE.length)];
          }
        }
      }

      this.r.setProperty(element, 'textContent', out);
      frame++;
      this.timeoutId = window.setTimeout(tick, SPEED);
    };

    if (this.timeoutId) clearTimeout(this.timeoutId);
    tick();
  }

  ngOnDestroy() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}
