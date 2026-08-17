import React from 'react';
import { GameMode, Level, SoundSettings, ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { 
  Heart, 
  Lightbulb, 
  RotateCcw, 
  Grid, 
  Calendar, 
  BarChart3, 
  Settings as SettingsIcon,
  HelpCircle,
  Undo2,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  level: Level;
  lives: number;
  maxLives: number;
  hintsLeft: number;
  gameMode: GameMode;
  themeId: ThemeId;
  soundSettings: SoundSettings;
  canUndo: boolean;
  timeRemaining?: number;
  onSelectMode: (mode: GameMode) => void;
  onHint: () => void;
  onUndo: () => void;
  onRestart: () => void;
  onPrevLevel: () => void;
  onNextLevel: () => void;
  onOpenLevelSelect: () => void;
  onOpenDaily: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenHowToPlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  level,
  lives,
  maxLives,
  hintsLeft,
  gameMode,
  themeId,
  canUndo,
  timeRemaining = 60,
  onSelectMode,
  onHint,
  onUndo,
  onRestart,
  onPrevLevel,
  onNextLevel,
  onOpenLevelSelect,
  onOpenDaily,
  onOpenStats,
  onOpenSettings,
  onOpenHowToPlay,
}) => {
  const theme = THEMES[themeId];

  return (
    <header className="w-full max-w-2xl mx-auto px-4 pt-3 pb-2 flex flex-col gap-2.5 select-none">
      {/* Top Navbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <svg className="w-6 h-6 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div>
            <h1 className={`text-lg font-bold leading-tight ${theme.textPrimary} tracking-tight`}>
              Arrow Puzzle
            </h1>
            <div className="flex items-center gap-1.5">
              <span className={`text-[11px] font-semibold ${theme.textSecondary}`}>
                Level {level.id} • Grid {level.width}x{level.height}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenLevelSelect}
            className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 text-xs font-medium ${theme.cardBg} ${theme.textPrimary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            title="Level Select"
            id="btn-level-select"
          >
            <Grid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Levels</span>
          </button>

          <button
            onClick={onOpenDaily}
            className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 text-xs font-medium ${theme.cardBg} ${theme.textPrimary} hover:bg-amber-100/50 dark:hover:bg-amber-900/30`}
            title="Daily Challenge"
            id="btn-daily-challenge"
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Daily</span>
          </button>

          <button
            onClick={onOpenStats}
            className={`p-2 rounded-xl transition-all active:scale-95 ${theme.cardBg} ${theme.textPrimary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            title="Statistics & Trophies"
            id="btn-stats"
          >
            <BarChart3 className="w-4 h-4 text-sky-500" />
          </button>

          <button
            onClick={onOpenHowToPlay}
            className={`p-2 rounded-xl transition-all active:scale-95 ${theme.cardBg} ${theme.textPrimary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            title="How to Play"
            id="btn-how-to-play"
          >
            <HelpCircle className="w-4 h-4 text-indigo-500" />
          </button>

          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl transition-all active:scale-95 ${theme.cardBg} ${theme.textPrimary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            title="Settings"
            id="btn-settings"
          >
            <SettingsIcon className="w-4 h-4 text-stone-500 dark:text-stone-400" />
          </button>
        </div>
      </div>

      {/* Mode Selector Navigation Tabs */}
      <div className={`p-1 rounded-2xl ${theme.cardBg} flex gap-1 border border-stone-200/50 dark:border-stone-700/50`}>
        {(['classic', 'daily', 'zen', 'time-attack'] as GameMode[]).map((m) => {
          const isActive = gameMode === m;
          return (
            <button
              key={m}
              onClick={() => onSelectMode(m)}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : `${theme.textSecondary} hover:bg-stone-200/40 dark:hover:bg-stone-800/40`
              }`}
            >
              {m === 'classic' && <span>🏆 Classic</span>}
              {m === 'daily' && <span>📅 Daily</span>}
              {m === 'zen' && <span>🧘 Zen</span>}
              {m === 'time-attack' && <span>⚡ Speed</span>}
            </button>
          );
        })}
      </div>

      {/* Level Info Bar & Gameplay Controls */}
      <div className={`p-3 rounded-2xl ${theme.cardBg} flex items-center justify-between gap-2 shadow-sm`}>
        {/* Level Title with Quick Level Switches */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onPrevLevel}
            disabled={level.id <= 1}
            className={`p-1.5 rounded-xl transition-all active:scale-95 ${
              level.id > 1
                ? 'bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                : 'text-stone-300 dark:text-stone-700 cursor-not-allowed opacity-40'
            }`}
            title="Previous Level"
            id="btn-prev-level"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col cursor-pointer" onClick={onOpenLevelSelect} title="Click to view all levels">
            <span className={`text-sm font-bold ${theme.textPrimary} flex items-center gap-1`}>
              {level.title}
            </span>
            <span className={`text-xs ${theme.textSecondary}`}>
              {gameMode === 'time-attack' ? 'Speedrun Mode' : level.difficulty}
            </span>
          </div>

          <button
            onClick={onNextLevel}
            className="p-1.5 rounded-xl transition-all active:scale-95 bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300"
            title="Next Level"
            id="btn-next-level"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Lives / Mode Counter */}
        {gameMode === 'time-attack' ? (
          <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-sm animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>{timeRemaining}s</span>
          </div>
        ) : gameMode !== 'zen' ? (
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-xl border border-rose-200/60 dark:border-rose-900/60">
            {Array.from({ length: maxLives }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 transition-all duration-300 ${
                  i < lives
                    ? 'fill-rose-500 text-rose-500 scale-100'
                    : 'fill-stone-300 dark:fill-stone-700 text-stone-300 dark:text-stone-700 scale-90 opacity-60'
                }`}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/40 rounded-xl text-teal-600 dark:text-teal-400 text-xs font-medium border border-teal-200 dark:border-teal-900">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Endless Zen</span>
          </div>
        )}

        {/* Action Controls: Undo, Hint, Restart */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded-xl transition-all active:scale-95 flex items-center gap-1 text-xs font-semibold ${
              canUndo
                ? 'bg-stone-200/80 dark:bg-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 opacity-50 cursor-not-allowed'
            }`}
            title="Undo Last Tap"
            id="btn-undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onHint}
            className="p-2 px-3 rounded-xl transition-all active:scale-95 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
            title="Highlight a safe arrow"
            id="btn-hint"
          >
            <Lightbulb className="w-4 h-4 fill-slate-900" />
            <span>Hint ({hintsLeft})</span>
          </button>

          <button
            onClick={onRestart}
            className={`p-2 rounded-xl transition-all active:scale-95 ${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            title="Restart Level"
            id="btn-restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
