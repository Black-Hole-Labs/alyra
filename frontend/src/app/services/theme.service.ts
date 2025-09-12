import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(true);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor(private router: Router) {
    // Для /pro страницы загружаем сохраненную тему, для остальных всегда темная
    this.initializeTheme();
  }

  private initializeTheme() {
    const currentUrl = this.router.url;
    if (currentUrl === '/pro') {
      const savedTheme = localStorage.getItem('pro-page-theme');
      const isDark = savedTheme ? savedTheme === 'dark' : true;
      this.isDarkTheme.next(isDark);
      this.applyTheme(isDark);
    } else {
      // Для всех остальных страниц всегда темная тема
      this.isDarkTheme.next(true);
      this.applyTheme(true);
    }
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.className = document.documentElement.className.replace(
      /\b(dark|light)-theme\b/g,
      '',
    );
    document.documentElement.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }

  toggleTheme() {
    const currentUrl = this.router.url;
    // Переключение темы работает только на /pro странице
    if (currentUrl === '/pro') {
      const newTheme = !this.isDarkTheme.value;
      this.isDarkTheme.next(newTheme);
      localStorage.setItem('pro-page-theme', newTheme ? 'dark' : 'light');
      this.applyTheme(newTheme);
    }
  }

  // Метод для принудительной установки темной темы (для навигации с /pro)
  forceApplyDarkTheme() {
    this.isDarkTheme.next(true);
    this.applyTheme(true);
  }

  // Метод для инициализации темы при навигации
  handleRouteChange(url: string) {
    if (url === '/pro') {
      const savedTheme = localStorage.getItem('pro-page-theme');
      const isDark = savedTheme ? savedTheme === 'dark' : true;
      this.isDarkTheme.next(isDark);
      this.applyTheme(isDark);
    } else {
      // Для всех остальных страниц всегда темная тема
      this.isDarkTheme.next(true);
      this.applyTheme(true);
    }
  }

  getCurrentTheme(): boolean {
    return this.isDarkTheme.value;
  }
}
