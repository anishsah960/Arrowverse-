import React from 'react';
import { GameStats, ThemeId, Trophy } from '../types';
import { THEMES } from '../utils/themes';
import { X, Trophy as TrophyIcon, Award, Target, Flame, Layers, CheckCircle } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  stats: GameStats;
  themeId: ThemeId;
  onClose: () => void;
}

export const ALL_TROPHIES: Trophy[] = [
  {
    id: 'first_steps',
    title: 'First Escape',
    description: 'Clear your first puzzle level',
    icon: '🌱',
  },
  {
    id: 'flawless_5',
    title: 'Perfect Focus',
    description: 'Complete 5 levels with 0 lives lost',
    icon: '🎯',
  },
  {
    id: 'arrows_100',
    title: 'Flow Master',
    description: 'Tap away 100 total arrows',
    icon: '⚡',
  },
  {
    id: 'streak_3',
    title: 'Daily Ritual',
    description: 'Maintain a 3-day Daily Challenge streak',
    icon: '🔥',
  },
  {
    id: 'level_20',
    title: 'Maze Explorer',
    description: 'Reach Level 20 in Classic mode',
    icon: '👑',
  },
  {
    id: 'daily_10',
    title: 'Monthly Champion',
    description: 'Complete 10 Daily Challenges',
    icon: '🏆',
  },
];

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  stats,
  themeId,
  onClose,
}) => {
  if (!isOpen) return null;
  const theme = THEMES[themeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className={`w-full max-w-md max-h-[85vh] rounded-3xl ${theme.cardBg} border shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/40 dark:border-stone-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
              <TrophyIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme.textPrimary}`}>Stats & Trophies</h2>
              <p className={`text-xs ${theme.textSecondary}`}>Your puzzle achievements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            id="btn-close-stats"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-5">
          {/* Stats Grid Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200/50 dark:border-stone-700/50 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                <CheckCircle className="w-4 h-4" />
                <span>Levels Cleared</span>
              </div>
              <span className={`text-2xl font-extrabold ${theme.textPrimary}`}>
                {stats.levelsCompleted}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200/50 dark:border-stone-700/50 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-amber-500 font-semibold mb-1">
                <Target className="w-4 h-4" />
                <span>Perfect Clears</span>
              </div>
              <span className={`text-2xl font-extrabold ${theme.textPrimary}`}>
                {stats.perfectClears}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200/50 dark:border-stone-700/50 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-semibold mb-1">
                <Layers className="w-4 h-4" />
                <span>Arrows Escaped</span>
              </div>
              <span className={`text-2xl font-extrabold ${theme.textPrimary}`}>
                {stats.totalArrowsTapped}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200/50 dark:border-stone-700/50 flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-rose-500 font-semibold mb-1">
                <Flame className="w-4 h-4" />
                <span>Daily Streak</span>
              </div>
              <span className={`text-2xl font-extrabold ${theme.textPrimary}`}>
                {stats.dailyStreak} Days
              </span>
            </div>
          </div>

          {/* Trophy Room Section */}
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary} mb-3 flex items-center gap-1.5`}>
              <Award className="w-4 h-4 text-amber-500" />
              <span>Trophy Cabinet ({stats.unlockedTrophies?.length || 0} / {ALL_TROPHIES.length})</span>
            </h3>

            <div className="flex flex-col gap-2.5">
              {ALL_TROPHIES.map((t) => {
                const isUnlocked = stats.unlockedTrophies?.includes(t.id);

                return (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl flex items-center gap-3 border transition-all ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-300/40 dark:border-amber-700/40'
                        : 'bg-stone-100/30 dark:bg-stone-900/30 border-stone-200/30 dark:border-stone-800/30 opacity-50'
                    }`}
                  >
                    <div className="text-2xl w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center shrink-0">
                      {isUnlocked ? t.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-bold truncate ${theme.textPrimary}`}>
                          {t.title}
                        </h4>
                        {isUnlocked && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900">
                            UNLOCKED
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${theme.textSecondary} truncate`}>
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
