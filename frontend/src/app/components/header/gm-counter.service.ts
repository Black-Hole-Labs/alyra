import { Injectable } from '@angular/core';

@Injectable()
export class GmCounterService {
  private readonly GM_COUNT_KEY = 'gmCount';
  private readonly LAST_GM_TIME_KEY = 'lastGmTime';
  private readonly LAST_CLICK_KEY = 'lastGmClick';

  loadGmCount(): number | null {
    const savedCount = localStorage.getItem(this.GM_COUNT_KEY);
    const lastGmTime = localStorage.getItem(this.LAST_GM_TIME_KEY);

    if (savedCount && lastGmTime) {
      const now = Date.now();
      const timeDiff = now - parseInt(lastGmTime, 10);
      if (timeDiff > 172800000) {
        localStorage.removeItem(this.GM_COUNT_KEY);
        localStorage.removeItem(this.LAST_GM_TIME_KEY);
        return null;
      } else {
        return parseInt(savedCount, 10);
      }
    }
    return null;
  }

  tryIncrement(): { ok: true } | { ok: false; timeLeft: string } {
    const lastClickTime = localStorage.getItem(this.LAST_CLICK_KEY);
    const now = new Date();

    if (lastClickTime) {
      const lastClickDate = new Date(lastClickTime);
      const nextAllowedClick = new Date(lastClickDate);
      nextAllowedClick.setUTCDate(lastClickDate.getUTCDate() + 1);

      if (now < nextAllowedClick) {
        return { ok: false, timeLeft: this.calculateTimeLeft(nextAllowedClick, now) };
      }
    }

    localStorage.setItem(this.LAST_CLICK_KEY, now.toISOString());
    return { ok: true };
  }

  calculateTimeLeft(nextAllowed: Date, current: Date): string {
    const diff = nextAllowed.getTime() - current.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
}
