import React from 'react';
import { ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { X, ArrowRight, Heart, Lightbulb, CheckCircle2, AlertCircle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  themeId: ThemeId;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  isOpen,
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
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme.textPrimary}`}>How to Play</h2>
              <p className={`text-xs ${theme.textSecondary}`}>Simple rules for relaxing logic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            id="btn-close-how-to-play"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div>
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Find a Free Path</h3>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                An arrow can only escape if no other arrows block its line of sight ahead.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div>
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Tap to Release</h3>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Tap a free arrow to help it fly off the grid. This opens up room for other arrows to move!
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Avoid Blocked Arrows</h3>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Tapping a blocked arrow loses 1 life <Heart className="w-3.5 h-3.5 inline text-rose-500 fill-rose-500" />. Take a breath and plan your sequence!
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-sm shrink-0">
              4
            </div>
            <div>
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Need a Nudge?</h3>
              <p className={`text-xs ${theme.textSecondary} mt-0.5`}>
                Use the <Lightbulb className="w-3.5 h-3.5 inline text-amber-500 fill-amber-500" /> Hint button anytime to highlight a safe arrow that can safely escape.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-2 w-full py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
