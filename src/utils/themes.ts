import { ThemeId } from '../types';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  previewColor: string;
  bg: string;
  cardBg: string;
  gridTileBg: string;
  gridTileBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  arrowColors: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  }[];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'soft-zen': {
    id: 'soft-zen',
    name: 'Soft Zen',
    previewColor: '#e2ece9',
    bg: 'bg-stone-100 dark:bg-stone-900',
    cardBg: 'bg-white/80 dark:bg-stone-800/80 backdrop-blur-md shadow-sm border border-stone-200/60 dark:border-stone-700/60',
    gridTileBg: 'bg-stone-200/50 dark:bg-stone-800/60',
    gridTileBorder: 'border-stone-300/40 dark:border-stone-700/40',
    textPrimary: 'text-stone-800 dark:text-stone-100',
    textSecondary: 'text-stone-500 dark:text-stone-400',
    accent: 'emerald-600',
    arrowColors: [
      {
        bg: 'bg-emerald-500 text-white shadow-emerald-500/20',
        border: 'border-emerald-600',
        text: 'text-white',
        glow: 'ring-emerald-400',
      },
      {
        bg: 'bg-sky-500 text-white shadow-sky-500/20',
        border: 'border-sky-600',
        text: 'text-white',
        glow: 'ring-sky-400',
      },
      {
        bg: 'bg-amber-500 text-white shadow-amber-500/20',
        border: 'border-amber-600',
        text: 'text-white',
        glow: 'ring-amber-400',
      },
      {
        bg: 'bg-rose-500 text-white shadow-rose-500/20',
        border: 'border-rose-600',
        text: 'text-white',
        glow: 'ring-rose-400',
      },
      {
        bg: 'bg-indigo-500 text-white shadow-indigo-500/20',
        border: 'border-indigo-600',
        text: 'text-white',
        glow: 'ring-indigo-400',
      },
    ],
  },

  'midnight-calm': {
    id: 'midnight-calm',
    name: 'Midnight Calm',
    previewColor: '#1e1b4b',
    bg: 'bg-slate-950 dark:bg-slate-950',
    cardBg: 'bg-slate-900/90 backdrop-blur-md shadow-xl border border-slate-800',
    gridTileBg: 'bg-slate-900/80',
    gridTileBorder: 'border-slate-800/80',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accent: 'violet-500',
    arrowColors: [
      {
        bg: 'bg-violet-600 text-white shadow-violet-500/30',
        border: 'border-violet-400',
        text: 'text-white',
        glow: 'ring-violet-400',
      },
      {
        bg: 'bg-cyan-600 text-white shadow-cyan-500/30',
        border: 'border-cyan-400',
        text: 'text-white',
        glow: 'ring-cyan-400',
      },
      {
        bg: 'bg-fuchsia-600 text-white shadow-fuchsia-500/30',
        border: 'border-fuchsia-400',
        text: 'text-white',
        glow: 'ring-fuchsia-400',
      },
      {
        bg: 'bg-teal-600 text-white shadow-teal-500/30',
        border: 'border-teal-400',
        text: 'text-white',
        glow: 'ring-teal-400',
      },
      {
        bg: 'bg-blue-600 text-white shadow-blue-500/30',
        border: 'border-blue-400',
        text: 'text-white',
        glow: 'ring-blue-400',
      },
    ],
  },

  'nordic-fog': {
    id: 'nordic-fog',
    name: 'Nordic Fog',
    previewColor: '#f1f5f9',
    bg: 'bg-slate-100 dark:bg-slate-900',
    cardBg: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-md shadow-sm border border-slate-200 dark:border-slate-700',
    gridTileBg: 'bg-slate-200/60 dark:bg-slate-800/60',
    gridTileBorder: 'border-slate-300/50 dark:border-slate-700/50',
    textPrimary: 'text-slate-800 dark:text-slate-100',
    textSecondary: 'text-slate-500 dark:text-slate-400',
    accent: 'cyan-600',
    arrowColors: [
      {
        bg: 'bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900',
        border: 'border-slate-800 dark:border-slate-100',
        text: 'text-white dark:text-slate-900',
        glow: 'ring-slate-400',
      },
      {
        bg: 'bg-teal-600 text-white',
        border: 'border-teal-700',
        text: 'text-white',
        glow: 'ring-teal-400',
      },
      {
        bg: 'bg-blue-600 text-white',
        border: 'border-blue-700',
        text: 'text-white',
        glow: 'ring-blue-400',
      },
      {
        bg: 'bg-indigo-600 text-white',
        border: 'border-indigo-700',
        text: 'text-white',
        glow: 'ring-indigo-400',
      },
      {
        bg: 'bg-cyan-700 text-white',
        border: 'border-cyan-800',
        text: 'text-white',
        glow: 'ring-cyan-400',
      },
    ],
  },

  'sunset-flow': {
    id: 'sunset-flow',
    name: 'Sunset Flow',
    previewColor: '#fef3c7',
    bg: 'bg-orange-50/50 dark:bg-zinc-900',
    cardBg: 'bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-sm border border-orange-100 dark:border-zinc-700',
    gridTileBg: 'bg-orange-100/50 dark:bg-zinc-800/60',
    gridTileBorder: 'border-orange-200/50 dark:border-zinc-700/50',
    textPrimary: 'text-zinc-800 dark:text-zinc-100',
    textSecondary: 'text-zinc-500 dark:text-zinc-400',
    accent: 'amber-600',
    arrowColors: [
      {
        bg: 'bg-orange-500 text-white shadow-orange-500/20',
        border: 'border-orange-600',
        text: 'text-white',
        glow: 'ring-orange-400',
      },
      {
        bg: 'bg-amber-500 text-white shadow-amber-500/20',
        border: 'border-amber-600',
        text: 'text-white',
        glow: 'ring-amber-400',
      },
      {
        bg: 'bg-rose-500 text-white shadow-rose-500/20',
        border: 'border-rose-600',
        text: 'text-white',
        glow: 'ring-rose-400',
      },
      {
        bg: 'bg-red-500 text-white shadow-red-500/20',
        border: 'border-red-600',
        text: 'text-white',
        glow: 'ring-red-400',
      },
      {
        bg: 'bg-yellow-600 text-white shadow-yellow-600/20',
        border: 'border-yellow-700',
        text: 'text-white',
        glow: 'ring-yellow-400',
      },
    ],
  },

  'neon-cyber': {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    previewColor: '#0f172a',
    bg: 'bg-gray-950',
    cardBg: 'bg-gray-900/90 backdrop-blur-md shadow-2xl border border-pink-500/30',
    gridTileBg: 'bg-gray-900/90',
    gridTileBorder: 'border-purple-900/60',
    textPrimary: 'text-pink-300',
    textSecondary: 'text-purple-300',
    accent: 'pink-500',
    arrowColors: [
      {
        bg: 'bg-pink-600 text-white shadow-pink-500/40',
        border: 'border-pink-400',
        text: 'text-white',
        glow: 'ring-pink-400',
      },
      {
        bg: 'bg-purple-600 text-white shadow-purple-500/40',
        border: 'border-purple-400',
        text: 'text-white',
        glow: 'ring-purple-400',
      },
      {
        bg: 'bg-cyan-500 text-black font-bold shadow-cyan-400/40',
        border: 'border-cyan-300',
        text: 'text-black',
        glow: 'ring-cyan-300',
      },
      {
        bg: 'bg-emerald-500 text-black font-bold shadow-emerald-400/40',
        border: 'border-emerald-300',
        text: 'text-black',
        glow: 'ring-emerald-300',
      },
      {
        bg: 'bg-yellow-400 text-black font-bold shadow-yellow-400/40',
        border: 'border-yellow-200',
        text: 'text-black',
        glow: 'ring-yellow-200',
      },
    ],
  },
};
