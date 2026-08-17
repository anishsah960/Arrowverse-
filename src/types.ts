export type Direction = 'U' | 'D' | 'L' | 'R';

export interface Arrow {
  id: string;
  x: number;
  y: number;
  direction: Direction;
  colorIndex: number;
  isEscaping?: boolean;
  isBlockedShake?: boolean;
  isHinted?: boolean;
}

export type LevelDifficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface Level {
  id: number;
  title: string;
  width: number;
  height: number;
  arrows: Arrow[];
  maxLives: number;
  difficulty: LevelDifficulty;
  isDaily?: boolean;
  dailyDateString?: string;
}

export type GameMode = 'classic' | 'daily' | 'zen' | 'time-attack';

export type ThemeId = 'soft-zen' | 'midnight-calm' | 'nordic-fog' | 'sunset-flow' | 'neon-cyber';

export interface SoundSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  volume: number;
}

export interface GameStats {
  levelsCompleted: number;
  perfectClears: number;
  totalArrowsTapped: number;
  hintsUsed: number;
  dailyStreak: number;
  lastDailyDate: string;
  unlockedTrophies: string[];
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number; // 1 to 3
  bestMoves: number;
}

export interface Trophy {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}
