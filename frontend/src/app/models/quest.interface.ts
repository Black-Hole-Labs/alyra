export interface Quest {
  id: string;
  title: string;
  description: string;
  rank: QuestRank;
  xp: number;
  endTime: Date;
  status: QuestStatus;
  progress?: number; // Прогресс в процентах (0-100)
  createdAt: Date;
}

export enum QuestRank {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
}

export enum QuestStatus {
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ENDED = 'ended',
}

export interface CreateQuestDto {
  title: string;
  description: string;
  rank: QuestRank;
  xp: number;
  endTime: Date;
}
