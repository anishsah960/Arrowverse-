import React from 'react';
import { ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { RotateCcw, HeartOff, Undo2, Lightbulb } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  themeId: ThemeId;
  canUndo: boolean;
  isTimeAttack?: boolean;
  score?: number;
  onRestart: () => void;
  onUndo: () => void;
  onHint: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  themeId,
  canUndo,
  isTimeAttack,
  score = 0,
  onRestart,
  onUndo,
  onHint,
}) => {
  if (!isOpen) return null;
  const theme = THEMES[themeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className={`w-full max-w-sm rounded-3xl ${theme.cardBg} border shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
          isTimeAttack ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
        }`}>
          {isTimeAttack ? <RotateCcw className="w-8 h-8" /> : <HeartOff className="w-8 h-8" />}
        </div>

        <h2 className={`text-xl font-bold ${theme.textPrimary}`}>
          {isTimeAttack ? "Time's Up!" : 'No Lives Remaining'}
        </h2>
        
        {isTimeAttack ? (
          <div className="my-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 w-full flex flex-col items-center">
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">Speedrun Score</span>
            <span className="text-3xl font-extrabold text-amber-500 mt-0.5">{score} Arrows</span>
          </div>
        ) : (
          <p className={`text-xs ${theme.textSecondary} mt-1 max-w-xs`}>
            Don't worry! Take a moment to rethink your sequence and clear the maze at your own pace.
          </p>
        )}

        <div className="w-full flex flex-col gap-2.5 mt-5">
          <button
            onClick={onRestart}
            className={`w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isTimeAttack ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25'
            }`}
            id="btn-retry-level"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>

          {!isTimeAttack && canUndo && (
            <button
              onClick={onUndo}
              className={`w-full py-2.5 px-3 rounded-xl ${theme.cardBg} border border-stone-200/60 dark:border-stone-700/60 text-xs font-bold ${theme.textPrimary} flex items-center justify-center gap-2 hover:bg-stone-200/50`}
            >
              <Undo2 className="w-4 h-4 text-emerald-500" />
              <span>Undo Last Move & Continue</span>
            </button>
          )}

          {!isTimeAttack && (
            <button
              onClick={onHint}
              className={`w-full py-2.5 px-3 rounded-xl ${theme.cardBg} border border-amber-200 dark:border-amber-900/60 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2 hover:bg-amber-50 dark:hover:bg-amber-950/40`}
            >
              <Lightbulb className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Highlight Safe Arrow</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
