import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(true);
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    this.isDarkTheme.next(isDark);
    this.applyTheme(isDark);
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.className = document.documentElement.className.replace(/\b(dark|light)-theme\b/g, '');
    document.documentElement.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }

  toggleTheme() {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    this.applyTheme(newTheme);
  }

  getCurrentTheme(): boolean {
    return this.isDarkTheme.value;
  }
} 