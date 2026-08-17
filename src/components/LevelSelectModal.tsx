import React, { useState } from 'react';
import { LevelProgress, ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { HANDCRAFTED_LEVELS } from '../utils/handcraftedLevels';
import { X, Star, Lock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface LevelSelectModalProps {
  isOpen: boolean;
  currentLevelId: number;
  levelProgress: Record<number, LevelProgress>;
  themeId: ThemeId;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  currentLevelId,
  levelProgress,
  themeId,
  onSelectLevel,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'handcrafted' | 'endless'>('handcrafted');
  const [levelRange, setLevelRange] = useState<number>(0); // 0: 1-25, 1: 26-50, 2: 51-75, 3: 76-100
  const [customLevelInput, setCustomLevelInput] = useState<string>('10');
  const [unlockAll, setUnlockAll] = useState<boolean>(true);

  if (!isOpen) return null;
  const theme = THEMES[themeId];

  // Helper to determine star rating display
  const getStars = (levelId: number) => {
    return levelProgress[levelId]?.stars || 0;
  };

  const isUnlocked = (levelId: number) => {
    if (unlockAll) return true;
    if (levelId === 1) return true;
    return levelProgress[levelId]?.unlocked || levelProgress[levelId - 1]?.completed || false;
  };

  const currentRangeStart = levelRange * 25 + 1;
  const currentRangeEnd = (levelRange + 1) * 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className={`w-full max-w-xl max-h-[85vh] rounded-3xl ${theme.cardBg} border shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/40 dark:border-stone-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme.textPrimary}`}>Select Level</h2>
              <p className={`text-xs ${theme.textSecondary}`}>Choose your next puzzle journey (100 Levels)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setUnlockAll(!unlockAll)}
              className={`text-xs font-bold px-2.5 py-1 rounded-xl transition-all border ${
                unlockAll
                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                  : 'bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
              }`}
              title="Toggle Unlock All Levels"
            >
              {unlockAll ? '🔓 All Unlocked' : '🔒 Sequential'}
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
              id="btn-close-level-select"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-3 bg-stone-100/50 dark:bg-stone-900/50 flex gap-2 border-b border-stone-200/40 dark:border-stone-700/40">
          <button
            onClick={() => setSelectedCategory('handcrafted')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'handcrafted'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : `${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-800/50`
            }`}
          >
            Story Levels (1 - 100)
          </button>
          <button
            onClick={() => setSelectedCategory('endless')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'endless'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : `${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-800/50`
            }`}
          >
            Endless Generator
          </button>
        </div>

        {/* Level Range Page Tabs */}
        {selectedCategory === 'handcrafted' && (
          <div className="px-4 pt-3 flex gap-1.5 overflow-x-auto pb-1">
            {[0, 1, 2, 3].map((r) => {
              const start = r * 25 + 1;
              const end = (r + 1) * 25;
              const isActive = levelRange === r;
              return (
                <button
                  key={r}
                  onClick={() => setLevelRange(r)}
                  className={`py-1 px-3 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40'
                      : `${theme.textSecondary} hover:bg-stone-200/40 dark:hover:bg-stone-800/40`
                  }`}
                >
                  Levels {start} - {end}
                </button>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {selectedCategory === 'handcrafted' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {Array.from({ length: 25 }).map((_, i) => {
                const levelId = currentRangeStart + i;
                const unlocked = isUnlocked(levelId);
                const stars = getStars(levelId);
                const isCurrent = levelId === currentLevelId;
                const isHandcrafted = levelId <= HANDCRAFTED_LEVELS.length;

                return (
                  <button
                    key={levelId}
                    disabled={!unlocked}
                    onClick={() => {
                      onSelectLevel(levelId);
                      onClose();
                    }}
                    id={`select-level-${levelId}`}
                    className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-200 p-2 border ${
                      isCurrent
                        ? 'bg-emerald-500 text-white border-emerald-400 ring-4 ring-emerald-400/30 shadow-lg scale-105'
                        : unlocked
                        ? `${theme.cardBg} ${theme.textPrimary} hover:border-emerald-500/60 hover:scale-102`
                        : 'bg-stone-200/40 dark:bg-stone-800/40 text-stone-400 dark:text-stone-600 border-stone-300/30 dark:border-stone-700/30 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {isHandcrafted && unlocked && (
                      <span className="absolute top-1 right-1 text-[9px] font-extrabold px-1 py-0.2 rounded bg-amber-400/20 text-amber-600 dark:text-amber-400">
                        ★
                      </span>
                    )}

                    {!unlocked ? (
                      <Lock className="w-5 h-5 text-stone-400 dark:text-stone-600" />
                    ) : (
                      <>
                        <span className="text-base font-bold">{levelId}</span>
                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= stars
                                  ? isCurrent
                                    ? 'fill-amber-300 text-amber-300'
                                    : 'fill-amber-400 text-amber-400'
                                  : 'fill-stone-300 dark:fill-stone-700 text-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className={`text-base font-bold ${theme.textPrimary}`}>Jump to Any Custom Level</h3>
                <p className={`text-xs ${theme.textSecondary} max-w-sm mt-1`}>
                  Enter any level number from 1 to 1000+. Infinite procedurally generated guaranteed-solvable puzzles!
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={customLevelInput}
                  onChange={(e) => setCustomLevelInput(e.target.value)}
                  className={`w-28 px-3 py-2 rounded-xl text-center font-bold text-sm border ${theme.cardBg} ${theme.textPrimary} border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                <button
                  onClick={() => {
                    const num = parseInt(customLevelInput) || 1;
                    onSelectLevel(num);
                    onClose();
                  }}
                  className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm flex items-center gap-1 shadow-md shadow-emerald-500/20"
                >
                  <span>Play Level</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
