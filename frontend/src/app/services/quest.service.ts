import { computed, Injectable, signal } from '@angular/core';

import { CreateQuestDto, Quest, QuestRank, QuestStatus } from '../models/quest.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestService {
  private questsSignal = signal<Quest[]>([]);

  quests = this.questsSignal.asReadonly();

  availableQuests = computed(() =>
    this.questsSignal().filter((quest) => quest.status === QuestStatus.AVAILABLE),
  );

  endedQuests = computed(() =>
    this.questsSignal().filter((quest) => quest.status === QuestStatus.ENDED),
  );

  completedQuests = computed(() =>
    this.questsSignal().filter((quest) => quest.status === QuestStatus.COMPLETED),
  );

  constructor() {
    this.loadQuests();

    setInterval(() => this.checkExpiredQuests(), 60000);
  }

  createQuest(questData: CreateQuestDto): Quest {
    const newQuest: Quest = {
      id: this.generateId(),
      title: questData.title,
      description: questData.description,
      rank: questData.rank,
      xp: questData.xp,
      endTime: questData.endTime,
      status: QuestStatus.AVAILABLE,
      progress: 0,
      createdAt: new Date(),
    };

    this.questsSignal.update((quests) => [...quests, newQuest]);
    this.saveQuests();

    return newQuest;
  }

  updateQuest(questId: string, updates: Partial<Quest>): boolean {
    const questIndex = this.questsSignal().findIndex((q) => q.id === questId);

    if (questIndex === -1) {
      return false;
    }

    this.questsSignal.update((quests) => {
      const updatedQuests = [...quests];
      updatedQuests[questIndex] = { ...updatedQuests[questIndex], ...updates };
      return updatedQuests;
    });

    this.saveQuests();
    return true;
  }

  deleteQuest(questId: string): boolean {
    const initialLength = this.questsSignal().length;

    this.questsSignal.update((quests) => quests.filter((q) => q.id !== questId));

    const wasDeleted = this.questsSignal().length < initialLength;
    if (wasDeleted) {
      this.saveQuests();
    }

    return wasDeleted;
  }

  getQuestById(questId: string): Quest | undefined {
    return this.questsSignal().find((q) => q.id === questId);
  }

  updateProgress(questId: string, progress: number): boolean {
    const quest = this.getQuestById(questId);

    if (!quest || quest.status !== QuestStatus.AVAILABLE) {
      return false;
    }

    const clampedProgress = Math.max(0, Math.min(100, progress));
    const updates: Partial<Quest> = { progress: clampedProgress };

    if (clampedProgress >= 100) {
      updates.status = QuestStatus.COMPLETED;
    }

    return this.updateQuest(questId, updates);
  }

  getTimeUntilEnd(quest: Quest): string {
    const now = new Date();
    const endTime = new Date(quest.endTime);
    const timeDiff = endTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return 'Ended';
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  getRankConfig(rank: QuestRank) {
    const configs = {
      [QuestRank.COMMON]: {
        color: 'rgba(255, 255, 255, 1)',
        bgColor: 'rgba(255, 255, 255, 0)',
        backgroundImage: '/img/quests/common-quest-bg.png',
        name: 'Common',
      },
      [QuestRank.UNCOMMON]: {
        color: 'rgba(120, 255, 174, 1)',
        bgColor: 'rgba(43, 111, 34, 0.4)',
        backgroundImage: '/img/quests/uncommon-quest-bg.png',
        name: 'Uncommon',
      },
      [QuestRank.RARE]: {
        color: 'rgba(170, 212, 255, 1)',
        bgColor: 'rgba(60, 156, 255, 0.2)',
        backgroundImage: '/img/quests/rare-quest-bg.png',
        name: 'Rare',
      },
      [QuestRank.EPIC]: {
        color: 'rgba(197, 140, 255, 1)',
        bgColor: 'rgba(147, 51, 234, 0.2)',
        backgroundImage: '/img/quests/epic-quest-bg.png',
        name: 'Epic',
      },
      [QuestRank.LEGENDARY]: {
        color: 'rgba(255, 214, 120, 1)',
        bgColor: 'rgba(245, 158, 11, 0.2)',
        backgroundImage: '/img/quests/legendary-quest-bg.png',
        name: 'Legendary',
      },
    };

    return configs[rank];
  }

  clearAllQuests(): void {
    this.questsSignal.set([]);
    this.saveQuests();
  }

  private checkExpiredQuests(): void {
    const now = new Date();
    let hasChanges = false;

    this.questsSignal.update((quests) => {
      return quests.map((quest) => {
        if (quest.status === QuestStatus.AVAILABLE && new Date(quest.endTime) <= now) {
          hasChanges = true;
          return { ...quest, status: QuestStatus.ENDED };
        }
        return quest;
      });
    });

    if (hasChanges) {
      this.saveQuests();
    }
  }

  private saveQuests(): void {
    try {
      localStorage.setItem('quests', JSON.stringify(this.questsSignal()));
    } catch (error) {
      console.error('Ошибка сохранения заданий:', error);
    }
  }

  private loadQuests(): void {
    try {
      const savedQuests = localStorage.getItem('quests');
      if (savedQuests) {
        const quests = JSON.parse(savedQuests) as Quest[];
        const questsWithDates = quests.map((quest) => ({
          ...quest,
          endTime: new Date(quest.endTime),
          createdAt: new Date(quest.createdAt),
        }));
        this.questsSignal.set(questsWithDates);
      }
    } catch (error) {
      console.error('Ошибка загрузки заданий:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}
