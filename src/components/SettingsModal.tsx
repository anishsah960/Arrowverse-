import React from 'react';
import { GameMode, SoundSettings, ThemeId } from '../types';
import { THEMES } from '../utils/themes';
import { X, Volume2, VolumeX, Smartphone, Palette, HelpCircle, RefreshCw, ImageDown } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  themeId: ThemeId;
  soundSettings: SoundSettings;
  gameMode: GameMode;
  onSelectTheme: (themeId: ThemeId) => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onChangeMode: (mode: GameMode) => void;
  onOpenHowToPlay: () => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  themeId,
  soundSettings,
  gameMode,
  onSelectTheme,
  onToggleSound,
  onToggleHaptics,
  onChangeMode,
  onOpenHowToPlay,
  onResetData,
  onClose,
}) => {
  if (!isOpen) return null;
  const theme = THEMES[themeId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl ${theme.cardBg} border shadow-2xl flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/40 dark:border-stone-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-stone-500/10 text-stone-500 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${theme.textPrimary}`}>Settings</h2>
              <p className={`text-xs ${theme.textSecondary}`}>Personalize your experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors ${theme.textSecondary} hover:bg-stone-200/50 dark:hover:bg-stone-700/50`}
            id="btn-close-settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Game Mode Selector */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary} block mb-2`}>
              Game Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['classic', 'daily', 'zen', 'time-attack'] as GameMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onChangeMode(mode)}
                  className={`py-2.5 px-2 rounded-2xl text-xs font-bold capitalize transition-all border text-center ${
                    gameMode === mode
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/20'
                      : `${theme.cardBg} ${theme.textPrimary} border-stone-200/60 dark:border-stone-700/60 hover:bg-stone-200/50`
                  }`}
                >
                  {mode === 'classic'
                    ? 'Classic'
                    : mode === 'daily'
                    ? 'Daily'
                    : mode === 'zen'
                    ? 'Zen'
                    : '⚡ Time Attack'}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette Theme Picker */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary} block mb-2`}>
              Visual Theme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.keys(THEMES) as ThemeId[]).map((tid) => {
                const t = THEMES[tid];
                const isSelected = tid === themeId;

                return (
                  <button
                    key={tid}
                    onClick={() => onSelectTheme(tid)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                        : `${theme.cardBg} border-stone-200/60 dark:border-stone-700/60 hover:border-emerald-400/50`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: t.previewColor }}
                      />
                      <span className={`text-xs font-bold ${theme.textPrimary}`}>
                        {t.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio & Haptics Toggles */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary} block mb-2`}>
              Audio & Feedback
            </label>
            <div className="flex flex-col gap-2">
              <div className={`p-3 rounded-2xl ${theme.cardBg} border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  {soundSettings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-stone-400" />
                  )}
                  <div>
                    <h4 className={`text-xs font-bold ${theme.textPrimary}`}>Sound Effects</h4>
                    <p className={`text-[11px] ${theme.textSecondary}`}>Chimes and escape sounds</p>
                  </div>
                </div>
                <button
                  onClick={onToggleSound}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    soundSettings.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
                  }`}
                  id="toggle-sound"
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              <div className={`p-3 rounded-2xl ${theme.cardBg} border border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between`}>
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-sky-500" />
                  <div>
                    <h4 className={`text-xs font-bold ${theme.textPrimary}`}>Haptic Vibration</h4>
                    <p className={`text-[11px] ${theme.textSecondary}`}>Soft tap feedback on mobile</p>
                  </div>
                </div>
                <button
                  onClick={onToggleHaptics}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    soundSettings.hapticsEnabled ? 'bg-emerald-500 justify-end' : 'bg-stone-300 dark:bg-stone-700 justify-start'
                  }`}
                  id="toggle-haptics"
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
              </div>
            </div>
          </div>

          {/* Promotional Assets / Download */}
          <div>
            <label className={`text-xs font-bold uppercase tracking-wider ${theme.textSecondary} block mb-2`}>
              Export & Publishing Bundles
            </label>
            <div className="flex flex-col gap-2">
              <a
                href="/arrow-puzzle-itchio.zip"
                download="arrow-puzzle-itchio.zip"
                className={`w-full py-3 px-3.5 rounded-2xl border border-rose-500/40 bg-rose-500/10 text-rose-400 text-xs font-bold flex items-center justify-between hover:bg-rose-500/20 transition-all`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🎮</span>
                  <div className="text-left">
                    <div className="font-bold text-rose-400">itch.io Ready HTML5 Bundle (.zip)</div>
                    <div className="text-[10px] text-stone-400">Upload directly to itch.io for instant browser play</div>
                  </div>
                </div>
                <ImageDown className="w-4 h-4 shrink-0 text-rose-400" />
              </a>

              <a
                href="/uptodown-feature-1024x500.jpg"
                download="uptodown-featured-1024x500.jpg"
                target="_blank"
                rel="noreferrer"
                className={`w-full py-2.5 px-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center justify-between hover:bg-emerald-500/20 transition-all`}
              >
                <span>Store Feature Graphic (1024×500)</span>
                <ImageDown className="w-3.5 h-3.5 shrink-0" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/apkpure-feature.jpg"
                  download="feature-image-1024x500.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className={`py-2 px-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-emerald-500/20 transition-all text-center`}
                >
                  <ImageDown className="w-3.5 h-3.5 shrink-0" />
                  <span>Feature Graphic</span>
                </a>

                <a
                  href="/screenshot-1.jpg"
                  download="screenshot-gameplay.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className={`py-2 px-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400 text-[11px] font-bold flex items-center justify-center gap-1 hover:bg-sky-500/20 transition-all text-center`}
                >
                  <ImageDown className="w-3.5 h-3.5 shrink-0" />
                  <span>Screenshot 1</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 flex flex-col gap-2 border-t border-stone-200/40 dark:border-stone-700/40">
            <button
              onClick={() => {
                onClose();
                onOpenHowToPlay();
              }}
              className={`w-full py-2.5 px-3 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-xs font-bold ${theme.textPrimary} flex items-center justify-center gap-2 hover:bg-stone-200/50`}
            >
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>How to Play Tutorial</span>
            </button>

            <button
              onClick={onResetData}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Game Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
