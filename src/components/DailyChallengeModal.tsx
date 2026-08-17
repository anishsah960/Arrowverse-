import React from 'react';
import { LevelProgress, ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { X, Calendar as CalendarIcon, Trophy, Check, Flame, Award } from 'lucide-react';

interface DailyChallengeModalProps {
  isOpen: boolean;
  dailyProgress: Record<string, { completed: boolean; stars: number }>;
  themeId: ThemeId;
  dailyStreak: number;
  onPlayDaily: (dateStr: string) => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  dailyProgress,
  themeId,
  dailyStreak,
  onPlayDaily,
  onClose,
}) => {
  if (!isOpen) return null;
  const theme = THEMES[themeId];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

  const todayDateNum = today.getDate();

  // Calculate monthly completed count
  let completedThisMonth = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDay = String(d).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    if (dailyProgress[dateStr]?.completed) {
      completedThisMonth++;
    }
  }

  const daysHeader = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className={`w-full max-w-lg max-h-[90vh] rounded-3xl ${theme.cardBg} border shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/40 dark:border-stone-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme.textPrimary}`}>
                Daily Challenges
              </h2>
              <p className={`text-xs ${theme.textSecondary}`}>
                {monthNames[month]} {year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            id="btn-close-daily"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak & Trophy Banner */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border-b border-amber-200/40 dark:border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
              <Flame className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm font-extrabold ${theme.textPrimary}`}>
                  {dailyStreak} Day Streak
                </span>
              </div>
              <p className={`text-xs ${theme.textSecondary}`}>
                {completedThisMonth} / {daysInMonth} challenges completed this month
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-400/20 px-3 py-1.5 rounded-xl border border-amber-400/30">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {completedThisMonth >= 10 ? 'Monthly Trophy Unlocked!' : `${10 - completedThisMonth} left for Trophy`}
            </span>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysHeader.map((d) => (
              <span key={d} className={`text-xs font-bold ${theme.textSecondary}`}>
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty padding for first week */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Day Cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const formattedDay = String(dayNum).padStart(2, '0');
              const formattedMonth = String(month + 1).padStart(2, '0');
              const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

              const isCompleted = dailyProgress[dateStr]?.completed;
              const isToday = dayNum === todayDateNum;
              const isFuture = dayNum > todayDateNum;

              return (
                <button
                  key={`day-${dayNum}`}
                  disabled={isFuture}
                  onClick={() => {
                    onPlayDaily(dateStr);
                    onClose();
                  }}
                  id={`daily-day-${dayNum}`}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-200 border ${
                    isToday
                      ? 'ring-2 ring-amber-500 border-amber-400 bg-amber-500/10 font-bold scale-102'
                      : 'border-stone-200/50 dark:border-stone-700/50'
                  } ${
                    isCompleted
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                      : isFuture
                      ? 'bg-stone-100/30 dark:bg-stone-900/30 text-stone-300 dark:text-stone-700 cursor-not-allowed'
                      : `${theme.cardBg} ${theme.textPrimary} hover:border-amber-400 hover:scale-105`
                  }`}
                >
                  <span className="text-xs font-bold">{dayNum}</span>

                  {isCompleted && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center mt-0.5 shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}

                  {isToday && !isCompleted && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Today CTA */}
          <div className="mt-5">
            <button
              onClick={() => {
                const formattedDay = String(todayDateNum).padStart(2, '0');
                const formattedMonth = String(month + 1).padStart(2, '0');
                const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
                onPlayDaily(dateStr);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-98"
            >
              <Award className="w-5 h-5" />
              <span>Play Today's Challenge ({monthNames[month]} {todayDateNum})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
