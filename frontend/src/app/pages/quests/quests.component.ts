import { Component, inject } from '@angular/core';
import { MouseGradientService } from '../../services/mouse-gradient.service';
import { CommonModule } from '@angular/common';
import { BlockchainStateService } from '../../services/blockchain-state.service';

@Component({
  selector: 'app-quests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quests.component.html',
  styleUrls: [
		'./quests.component.scss',
		'./quests.component.adaptives.scss'
	]
})
export class QuestsComponent {
  private mouseGradientService = inject(MouseGradientService);
  private blockchainStateService = inject(BlockchainStateService);

  // Пагинация
  currentPage = 0;
  questsPerPage = 8; // 2 ряда по 4 квеста
  
  // Выбранные экосистемы
  selectedEcosystems: string[] = [];
  
  // Состояние фильтра "My Activity"
  myActivityActive: boolean = false;
  
  // Данные экосистем
  ecosystems = [
    'Ethereum', 'Solana', 'Base', 'HyperEVM', 
    'Arbitrum', 'Optimism', 'Unichain', 'Abstract', 
    'Linea', 'BSC'
  ];
  
  allQuests = [
    { id: 1, title: 'ETH Introduction', description: 'Trading Volume $5000', progress: '5000/5000', xp: 20, status: 'Completed', ecosystem: 'Ethereum', backgroundImage: '/img/quests/example.png' },
    { id: 2, title: 'Sol Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Solana', backgroundImage: '/img/quests/example.png' },
    { id: 3, title: 'Base Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Base', backgroundImage: '/img/quests/example.png' },
    { id: 4, title: 'Arb Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Arbitrum', backgroundImage: '/img/quests/example.png' },
    { id: 5, title: 'Opt Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Optimism', backgroundImage: '/img/quests/example.png' },
    { id: 6, title: 'Trading Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'ALL', backgroundImage: '/img/quests/example.png' },
    { id: 7, title: 'Hyper Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'HyperEVM', backgroundImage: '/img/quests/example.png' },
    { id: 8, title: 'Unichain Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Unichain', backgroundImage: '/img/quests/example.png' },
    { id: 9, title: 'Abstract Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Abstract', backgroundImage: '/img/quests/example.png' },
    { id: 10, title: 'Linea Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'Linea', backgroundImage: '/img/quests/example.png' },
    { id: 11, title: 'BSC Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'BSC', backgroundImage: '/img/quests/example.png' },
    { id: 12, title: 'Trading 1 Introduction', description: 'Trading Volume $5000', progress: '0/5000', xp: 20, status: null, ecosystem: 'ALL', backgroundImage: '/img/quests/example.png' },
  ];

  get filteredQuests() {
    let filtered = this.allQuests;
    
    // Фильтрация по "My Activity" (только завершенные квесты)
    if (this.myActivityActive) {
      filtered = filtered.filter(quest => quest.status === 'Completed');
    }
    
    // Фильтрация по выбранным экосистемам
    if (this.selectedEcosystems.length > 0) {
      filtered = filtered.filter(quest => 
        quest.ecosystem === 'ALL' || this.selectedEcosystems.includes(quest.ecosystem)
      );
    }
    
    return filtered;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredQuests.length / this.questsPerPage);
  }

  get currentQuests() {
    const start = this.currentPage * this.questsPerPage;
    const end = start + this.questsPerPage;
    return this.filteredQuests.slice(start, end);
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 0;
  }

  nextPage(): void {
    if (this.canGoNext) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.canGoPrevious) {
      this.currentPage--;
    }
  }

  onEcosystemMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

  onActivityMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

  onQuestMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

  onNavButtonMouseMove(event: MouseEvent): void {
    this.mouseGradientService.onMouseMove(event);
  }

  trackByQuestId(index: number, quest: any): number {
    return quest.id;
  }

  // Выбор экосистемы
  toggleEcosystem(ecosystem: string): void {
    const index = this.selectedEcosystems.indexOf(ecosystem);
    if (index > -1) {
      this.selectedEcosystems.splice(index, 1);
    } else {
      this.selectedEcosystems.push(ecosystem);
    }
    
    // Сбрасываем пагинацию при изменении фильтра
    this.currentPage = 0;
  }

  // Переключение фильтра "My Activity"
  toggleMyActivity(): void {
    this.myActivityActive = !this.myActivityActive;
    
    // Сбрасываем пагинацию при изменении фильтра
    this.currentPage = 0;
  }

  isEcosystemSelected(ecosystem: string): boolean {
    return this.selectedEcosystems.includes(ecosystem);
  }

  getEcosystemImageUrl(ecosystem: string): string {
    const allNetworks = this.blockchainStateService.allNetworks();
    const network = allNetworks.find(n => n.name === ecosystem);
    return network?.logoURI || '/img/ecosystem/evm.png';
  }

  getQuestEcosystemImageUrl(quest: any): string {
    if (quest.ecosystem === 'ALL') {
      return '/img/ecosystem/evm.png'; // Дефолтное изображение для ALL
    }
    return this.getEcosystemImageUrl(quest.ecosystem);
  }

  getQuestBackgroundImageUrl(quest: any): string {
    return quest.backgroundImage || '/img/quests/example.png';
  }

  getQuestBackgroundStyle(quest: any): string {
    const imageUrl = this.getQuestBackgroundImageUrl(quest);
    const baseGradient = 'linear-gradient(to top, rgba(var(--black), 0.95) 10%, rgba(var(--black), 0.5) 80%, transparent 100%)';
    
    if (quest.status === 'Completed') {
      const saturationGradient = 'linear-gradient(to bottom, rgb(128, 128, 128), rgb(128, 128, 128))';
      return `${baseGradient}, ${saturationGradient}, url(${imageUrl})`;
    }
    
    return `${baseGradient}, url(${imageUrl})`;
  }
} 