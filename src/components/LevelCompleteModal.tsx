import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Level, ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { Star, ArrowRight, RotateCcw, Grid, Sparkles, Trophy } from 'lucide-react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: Level;
  moves: number;
  livesRemaining: number;
  maxLives: number;
  themeId: ThemeId;
  onNextLevel: () => void;
  onRestartLevel: () => void;
  onOpenLevelSelect: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  moves,
  livesRemaining,
  maxLives,
  themeId,
  onNextLevel,
  onRestartLevel,
  onOpenLevelSelect,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'],
        });
      } catch {
        // Ignore canvas-confetti issues
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;
  const theme = THEMES[themeId];

  // Calculate stars: 3 stars if 0 lives lost, 2 stars if 1-2 lives lost, 1 star if completed
  const livesLost = maxLives - livesRemaining;
  const stars = livesLost === 0 ? 3 : livesLost <= 2 ? 2 : 1;
  const isPerfect = livesLost === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className={`w-full max-w-sm rounded-3xl ${theme.cardBg} border shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden`}>
        {/* Glow Header */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-900 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/30 animate-bounce">
          <Trophy className="w-9 h-9 fill-slate-900" />
        </div>

        <h2 className={`text-2xl font-black ${theme.textPrimary}`}>
          Grid Cleared!
        </h2>
        <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
          {level.title}
        </p>

        {/* Stars */}
        <div className="flex items-center gap-2 my-4">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-9 h-9 transition-all duration-300 ${
                s <= stars
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-md'
                  : 'fill-stone-300 dark:fill-stone-700 text-stone-300 dark:text-stone-700 scale-90 opacity-40'
              }`}
            />
          ))}
        </div>

        {/* Perfect Badge */}
        {isPerfect && (
          <div className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-extrabold flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Flawless Victory (0 Lives Lost!)</span>
          </div>
        )}

        {/* Move Count Details */}
        <div className="w-full py-3 px-4 rounded-2xl bg-stone-100/60 dark:bg-stone-800/60 border border-stone-200/50 dark:border-stone-700/50 flex justify-around my-2 text-xs">
          <div>
            <span className={`block ${theme.textSecondary}`}>Total Taps</span>
            <span className={`font-bold text-sm ${theme.textPrimary}`}>{moves}</span>
          </div>
          <div className="w-px bg-stone-200 dark:bg-stone-700" />
          <div>
            <span className={`block ${theme.textSecondary}`}>Lives Left</span>
            <span className={`font-bold text-sm ${theme.textPrimary}`}>{livesRemaining} / {maxLives}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-4">
          <button
            onClick={onNextLevel}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-98"
            id="btn-next-level"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={onRestartLevel}
              className={`flex-1 py-2.5 px-3 rounded-xl ${theme.cardBg} border border-stone-200/60 dark:border-stone-700/60 text-xs font-bold ${theme.textPrimary} flex items-center justify-center gap-1.5 hover:bg-stone-200/50`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Replay</span>
            </button>

            <button
              onClick={onOpenLevelSelect}
              className={`flex-1 py-2.5 px-3 rounded-xl ${theme.cardBg} border border-stone-200/60 dark:border-stone-700/60 text-xs font-bold ${theme.textPrimary} flex items-center justify-center gap-1.5 hover:bg-stone-200/50`}
            >
              <Grid className="w-4 h-4 text-emerald-500" />
              <span>Levels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
