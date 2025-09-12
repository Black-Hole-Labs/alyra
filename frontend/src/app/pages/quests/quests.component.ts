import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { CreateQuestDto, Quest, QuestRank } from '../../models/quest.interface';
import { QuestService } from '../../services/quest.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests.component.html',
  styleUrls: ['./quests.component.scss', './quests.component.adaptives.scss'],
})
export class QuestsComponent {
  private questService = inject(QuestService);

  // Получаем сигналы из сервиса
  availableQuests = this.questService.availableQuests;
  endedQuests = this.questService.endedQuests;
  completedQuests = this.questService.completedQuests;

  // Состояние активной вкладки
  activeTab: 'available' | 'ended' = 'available';

  constructor() {
    // Очищаем старые данные и добавляем новые тестовые задания
    this.resetAndAddSampleQuests();
  }

  /**
   * Получить время до окончания задания
   */
  getTimeUntilEnd(quest: Quest): string {
    return this.questService.getTimeUntilEnd(quest);
  }

  /**
   * Получить конфигурацию ранга
   */
  getRankConfig(rank: QuestRank) {
    return this.questService.getRankConfig(rank);
  }

  /**
   * Переключить активную вкладку
   */
  setActiveTab(tab: 'available' | 'ended'): void {
    this.activeTab = tab;
  }

  /**
   * Получить квесты для отображения в зависимости от активной вкладки
   */
  getCurrentQuests(): Quest[] {
    return this.activeTab === 'available' ? this.availableQuests() : this.endedQuests();
  }

  /**
   * Проверить, активна ли вкладка
   */
  isTabActive(tab: 'available' | 'ended'): boolean {
    return this.activeTab === tab;
  }

  /**
   * Получить стиль фона для изображения квеста
   */
  getQuestImageStyle(quest: Quest) {
    const config = this.getRankConfig(quest.rank);
    return {
      'background-image': `url(${config.backgroundImage})`,
      'background-repeat': 'no-repeat',
      'background-position': 'center center',
      'background-size': 'cover',
    };
  }

  /**
   * Сбросить все квесты и добавить новые тестовые
   */
  private resetAndAddSampleQuests(): void {
    // Очищаем все существующие квесты
    this.questService.clearAllQuests();

    // Добавляем тестовые задания
    this.addSampleQuests();

    // Добавляем завершенные квесты
    this.addCompletedQuests();

    // Добавляем истекшие квесты
    this.addEndedQuests();
  }

  /**
   * Добавить тестовые задания
   */
  private addSampleQuests(): void {
    const sampleQuests: CreateQuestDto[] = [
      // COMMON квесты
      {
        title: 'First Trade',
        description: 'Complete your first trade',
        rank: QuestRank.COMMON,
        xp: 5,
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 часов
      },
      {
        title: 'Daily Trader',
        description: 'Make at least 1 trade today',
        rank: QuestRank.COMMON,
        xp: 10,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 день
      },
      {
        title: 'Connect Wallet',
        description: 'Connect your crypto wallet',
        rank: QuestRank.COMMON,
        xp: 5,
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 дня
      },

      // UNCOMMON квесты
      {
        title: 'Trading Introduction',
        description: 'Trading Volume $5,000',
        rank: QuestRank.UNCOMMON,
        xp: 30,
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 дня
      },
      {
        title: 'Multi-Chain Explorer',
        description: 'Trade on 3 different chains',
        rank: QuestRank.UNCOMMON,
        xp: 25,
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 дней
      },
      {
        title: 'Token Diversity',
        description: 'Trade 10 different tokens',
        rank: QuestRank.UNCOMMON,
        xp: 35,
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 дня
      },

      // RARE квесты
      {
        title: 'Bridge Master',
        description: 'Complete 10 bridge transactions',
        rank: QuestRank.RARE,
        xp: 50,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
      },
      {
        title: 'Volume Warrior',
        description: 'Reach $25,000 trading volume',
        rank: QuestRank.RARE,
        xp: 75,
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 дней
      },
      {
        title: 'Speed Trader',
        description: 'Complete 50 trades in 24 hours',
        rank: QuestRank.RARE,
        xp: 60,
        endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 день
      },

      // EPIC квесты
      {
        title: 'Epic Volume Challenge',
        description: 'Reach $100,000 trading volume',
        rank: QuestRank.EPIC,
        xp: 150,
        endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 дней
      },
      {
        title: 'Chain Conqueror',
        description: 'Trade on all 10 supported chains',
        rank: QuestRank.EPIC,
        xp: 200,
        endTime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 день
      },
      {
        title: 'DeFi Explorer',
        description: 'Use 5 different DeFi protocols',
        rank: QuestRank.EPIC,
        xp: 180,
        endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 дней
      },

      // LEGENDARY квесты
      {
        title: 'Legendary Trader',
        description: 'Complete 1,000 successful trades',
        rank: QuestRank.LEGENDARY,
        xp: 500,
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
      },
      {
        title: 'Million Dollar Volume',
        description: 'Reach $1,000,000 trading volume',
        rank: QuestRank.LEGENDARY,
        xp: 1000,
        endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 дней
      },
      {
        title: 'Alyra Master',
        description: 'Become the ultimate Alyra user',
        rank: QuestRank.LEGENDARY,
        xp: 2000,
        endTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 дней
      },
    ];

    sampleQuests.forEach((questData, index) => {
      const quest = this.questService.createQuest(questData);

      // Добавляем прогресс для некоторых квестов
      if (index === 1) {
        // Daily Trader
        this.questService.updateProgress(quest.id, 80);
      } else if (index === 4) {
        // Multi-Chain Explorer
        this.questService.updateProgress(quest.id, 33);
      } else if (index === 7) {
        // Volume Warrior
        this.questService.updateProgress(quest.id, 60);
      } else if (index === 10) {
        // Epic Volume Challenge
        this.questService.updateProgress(quest.id, 25);
      }
    });
  }

  /**
   * Добавить завершенные квесты для демонстрации
   */
  private addCompletedQuests(): void {
    const completedQuests: CreateQuestDto[] = [
      {
        title: 'Welcome Bonus',
        description: 'Register and verify account',
        rank: QuestRank.COMMON,
        xp: 10,
        endTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // вчера
      },
      {
        title: 'First Swap',
        description: 'Complete your first token swap',
        rank: QuestRank.UNCOMMON,
        xp: 20,
        endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 дня назад
      },
      {
        title: 'Early Adopter',
        description: 'Join Alyra in beta phase',
        rank: QuestRank.RARE,
        xp: 100,
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделю назад
      },
    ];

    // Создаем квесты и сразу помечаем их как завершенные
    completedQuests.forEach((questData) => {
      const quest = this.questService.createQuest(questData);
      this.questService.updateProgress(quest.id, 100); // 100% = завершено
    });
  }

  /**
   * Добавить истекшие квесты для демонстрации
   */
  private addEndedQuests(): void {
    const endedQuests: CreateQuestDto[] = [
      {
        title: 'Weekend Warrior',
        description: 'Trade $10,000 over the weekend',
        rank: QuestRank.UNCOMMON,
        xp: 40,
        endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 дня назад
      },
      {
        title: 'Flash Trader',
        description: 'Complete 20 trades in 1 hour',
        rank: QuestRank.RARE,
        xp: 80,
        endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 дней назад
      },
      {
        title: 'Monthly Challenge',
        description: 'Reach $500,000 volume in a month',
        rank: QuestRank.EPIC,
        xp: 300,
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // вчера
      },
      {
        title: 'Beta Tester',
        description: 'Test all platform features',
        rank: QuestRank.COMMON,
        xp: 15,
        endTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 дней назад
      },
      {
        title: 'Ultimate Challenger',
        description: 'Complete all available quests',
        rank: QuestRank.LEGENDARY,
        xp: 1500,
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // неделю назад
      },
    ];

    // Создаем квесты с истекшим временем - они автоматически станут ended
    endedQuests.forEach((questData) => {
      this.questService.createQuest(questData);
    });
  }
}
