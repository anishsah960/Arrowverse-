import React, { useState, useEffect, useCallback } from 'react';
import { Arrow, GameMode, GameStats, Level, LevelProgress, SoundSettings, ThemeId } from './types';
import { getLevel, getDailyLevel } from './utils/handcraftedLevels';
import { canArrowEscape, findEscapableArrows } from './utils/levelGenerator';
import { THEMES } from './utils/themes';
import { sound } from './utils/sound';
import { recordLevelCompletedForAds, recordGameOverForAds } from './utils/adManager';

import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { LevelSelectModal } from './components/LevelSelectModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { StatsModal, ALL_TROPHIES } from './components/StatsModal';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameOverModal } from './components/GameOverModal';

const LOCAL_STORAGE_KEY = 'arrow_puzzle_save_v1';

export default function App() {
  // Theme State
  const [themeId, setThemeId] = useState<ThemeId>('soft-zen');

  // Sound Settings State
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    soundEnabled: true,
    hapticsEnabled: true,
    volume: 1.0,
  });

  // Game Mode State
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  // Active Level State
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [level, setLevel] = useState<Level>(() => getLevel(1));
  const [activeArrows, setActiveArrows] = useState<Arrow[]>([]);
  const [lives, setLives] = useState<number>(5);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [hintsLeft, setHintsLeft] = useState<number>(5);
  const [history, setHistory] = useState<Arrow[][]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [timeAttackScore, setTimeAttackScore] = useState<number>(0);

  // Persistent User Progress
  const [levelProgress, setLevelProgress] = useState<Record<number, LevelProgress>>({
    1: { unlocked: true, completed: false, stars: 0, bestMoves: 0 },
  });
  const [dailyProgress, setDailyProgress] = useState<Record<string, { completed: boolean; stars: number; moves: number }>>({});
  const [stats, setStats] = useState<GameStats>({
    levelsCompleted: 0,
    perfectClears: 0,
    totalArrowsTapped: 0,
    hintsUsed: 0,
    dailyStreak: 0,
    lastDailyDate: '',
    unlockedTrophies: [],
  });

  // Modal Open States
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isDailyOpen, setIsDailyOpen] = useState<boolean>(false);
  const [isStatsOpen, setIsStatsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState<boolean>(false);
  const [isLevelCompleteOpen, setIsLevelCompleteOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);

  // Time Attack Interval
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (gameMode === 'time-attack' && !isGameOverOpen && !isLevelCompleteOpen) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsGameOverOpen(true);
            sound.playBlocked(soundSettings.soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameMode, isGameOverOpen, isLevelCompleteOpen, soundSettings.soundEnabled]);

  // Handle Mode Selection
  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === 'classic') {
      loadLevel(getLevel(currentLevelNumber));
    } else if (mode === 'daily') {
      setIsDailyOpen(true);
    } else if (mode === 'zen') {
      loadLevel(getLevel(Math.floor(Math.random() * 20) + 1));
    } else if (mode === 'time-attack') {
      setTimeRemaining(60);
      setTimeAttackScore(0);
      loadLevel(getLevel(1));
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelNumber > 1) {
      const prevNum = currentLevelNumber - 1;
      setCurrentLevelNumber(prevNum);
      loadLevel(getLevel(prevNum));
    }
  };

  // Load Saved Data from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.themeId) setThemeId(data.themeId);
        if (data.soundSettings) setSoundSettings(data.soundSettings);
        if (data.levelProgress) setLevelProgress(data.levelProgress);
        if (data.dailyProgress) setDailyProgress(data.dailyProgress);
        if (data.stats) setStats(data.stats);
        if (data.currentLevelNumber) setCurrentLevelNumber(data.currentLevelNumber);
      } else {
        // Show tutorial on first launch
        setIsHowToPlayOpen(true);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save Progress to LocalStorage
  const saveProgress = useCallback(() => {
    try {
      const payload = {
        themeId,
        soundSettings,
        levelProgress,
        dailyProgress,
        stats,
        currentLevelNumber,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }
  }, [themeId, soundSettings, levelProgress, dailyProgress, stats, currentLevelNumber]);

  useEffect(() => {
    saveProgress();
  }, [saveProgress]);

  // Load level into active board state
  const loadLevel = useCallback((targetLevel: Level) => {
    setLevel(targetLevel);
    setActiveArrows(targetLevel.arrows.map(a => ({ ...a, isEscaping: false, isBlockedShake: false, isHinted: false })));
    setLives(targetLevel.maxLives);
    setMovesCount(0);
    setHistory([]);
    setIsLevelCompleteOpen(false);
    setIsGameOverOpen(false);
  }, []);

  // Initialize level whenever currentLevelNumber changes in classic mode
  useEffect(() => {
    if (gameMode === 'classic') {
      const l = getLevel(currentLevelNumber);
      loadLevel(l);
    }
  }, [currentLevelNumber, gameMode, loadLevel]);

  // Check and unlock trophies based on new stats
  const checkTrophyUnlocks = (newStats: GameStats) => {
    const unlocked = new Set(newStats.unlockedTrophies || []);

    if (newStats.levelsCompleted >= 1) unlocked.add('first_steps');
    if (newStats.perfectClears >= 5) unlocked.add('flawless_5');
    if (newStats.totalArrowsTapped >= 100) unlocked.add('arrows_100');
    if (newStats.dailyStreak >= 3) unlocked.add('streak_3');
    if (currentLevelNumber >= 20) unlocked.add('level_20');

    // Count daily challenges completed
    const dailyCount = (Object.values(dailyProgress) as Array<{ completed: boolean }>).filter(d => d && d.completed).length;
    if (dailyCount >= 10) unlocked.add('daily_10');

    return Array.from(unlocked);
  };

  // Main Interactive Arrow Tap Engine
  const handleTapArrow = (clickedArrow: Arrow) => {
    if (clickedArrow.isEscaping || isLevelCompleteOpen || isGameOverOpen) return;

    // Check if path is free
    const isFree = canArrowEscape(clickedArrow, activeArrows, level.width, level.height);

    if (isFree) {
      // Save current state for Undo
      setHistory(prev => [...prev, activeArrows.map(a => ({ ...a }))]);

      // Play tap away chime & haptic
      sound.playTapAway(soundSettings.soundEnabled);
      sound.triggerHaptic(soundSettings.hapticsEnabled, 'light');

      // Update arrow state to escaping
      setActiveArrows(prev =>
        prev.map(a => (a.id === clickedArrow.id ? { ...a, isEscaping: true, isHinted: false } : a))
      );

      setMovesCount(m => m + 1);

      if (gameMode === 'time-attack') {
        setTimeRemaining(t => t + 2); // +2s bonus for successful tap
        setTimeAttackScore(s => s + 1);
      }

      setStats(s => {
        const nextStats = { ...s, totalArrowsTapped: s.totalArrowsTapped + 1 };
        nextStats.unlockedTrophies = checkTrophyUnlocks(nextStats);
        return nextStats;
      });

      // Remove arrow after animation completes
      setTimeout(() => {
        setActiveArrows(prev => {
          const remaining = prev.filter(a => a.id !== clickedArrow.id);

          // Check if board is cleared!
          if (remaining.length === 0) {
            handleLevelCleared();
          }

          return remaining;
        });
      }, 350);
    } else {
      // Path blocked! Trigger error shake, lose life, error sound & haptic
      sound.playBlocked(soundSettings.soundEnabled);
      sound.triggerHaptic(soundSettings.hapticsEnabled, 'medium');

      setActiveArrows(prev =>
        prev.map(a => (a.id === clickedArrow.id ? { ...a, isBlockedShake: true } : a))
      );

      if (gameMode === 'time-attack') {
        setTimeRemaining(t => Math.max(0, t - 2)); // -2s penalty for blocked tap
      }

      // Clear shake after 300ms
      setTimeout(() => {
        setActiveArrows(prev =>
          prev.map(a => (a.id === clickedArrow.id ? { ...a, isBlockedShake: false } : a))
        );
      }, 300);

      // Deduct life if not in Zen or Time-Attack mode
      if (gameMode !== 'zen' && gameMode !== 'time-attack') {
        setLives(l => {
          const nextLives = l - 1;
          if (nextLives <= 0) {
            setIsGameOverOpen(true);
            recordGameOverForAds();
          }
          return Math.max(0, nextLives);
        });
      }
    }
  };

  // Level Win Handler
  const handleLevelCleared = () => {
    sound.playWin(soundSettings.soundEnabled);

    if (gameMode === 'time-attack') {
      // In time attack mode, add +5s bonus and immediately start next level without pause
      setTimeRemaining(t => t + 5);
      const nextLvl = getLevel(currentLevelNumber + 1);
      setCurrentLevelNumber(n => n + 1);
      loadLevel(nextLvl);
      return;
    }

    const livesLost = level.maxLives - lives;
    const starsEarned = livesLost === 0 ? 3 : livesLost <= 2 ? 2 : 1;
    const isPerfect = livesLost === 0;

    if (gameMode === 'classic') {
      // Update Classic Level Progress
      setLevelProgress(prev => {
        const nextProgress = { ...prev };
        nextProgress[level.id] = {
          unlocked: true,
          completed: true,
          stars: Math.max(nextProgress[level.id]?.stars || 0, starsEarned),
          bestMoves: nextProgress[level.id]?.bestMoves
            ? Math.min(nextProgress[level.id].bestMoves, movesCount + 1)
            : movesCount + 1,
        };
        // Unlock next level
        if (!nextProgress[level.id + 1]) {
          nextProgress[level.id + 1] = {
            unlocked: true,
            completed: false,
            stars: 0,
            bestMoves: 0,
          };
        }
        return nextProgress;
      });

      // Update stats
      setStats(s => {
        const next = {
          ...s,
          levelsCompleted: s.levelsCompleted + 1,
          perfectClears: isPerfect ? s.perfectClears + 1 : s.perfectClears,
        };
        next.unlockedTrophies = checkTrophyUnlocks(next);
        return next;
      });
    } else if (gameMode === 'daily' && level.dailyDateString) {
      // Update Daily Challenge Progress & Streaks
      setDailyProgress(prev => ({
        ...prev,
        [level.dailyDateString!]: {
          completed: true,
          stars: starsEarned,
          moves: movesCount + 1,
        },
      }));

      // Calculate streak
      setStats(s => {
        const todayStr = new Date().toISOString().split('T')[0];
        let streak = s.dailyStreak;
        if (s.lastDailyDate !== todayStr) {
          streak = s.dailyStreak + 1;
        }
        const next = {
          ...s,
          dailyStreak: streak,
          lastDailyDate: todayStr,
        };
        next.unlockedTrophies = checkTrophyUnlocks(next);
        return next;
      });
    }

    setIsLevelCompleteOpen(true);
    recordLevelCompletedForAds();
  };

  // Hint Button Handler
  const handleHint = () => {
    const freeArrows = findEscapableArrows(activeArrows, level.width, level.height);
    if (freeArrows.length > 0) {
      const target = freeArrows[Math.floor(Math.random() * freeArrows.length)];
      sound.playHint(soundSettings.soundEnabled);

      setActiveArrows(prev =>
        prev.map(a => (a.id === target.id ? { ...a, isHinted: true } : a))
      );

      if (hintsLeft > 0) {
        setHintsLeft(h => h - 1);
      }

      setStats(s => ({ ...s, hintsUsed: s.hintsUsed + 1 }));

      if (isGameOverOpen) {
        setIsGameOverOpen(false);
      }
    }
  };

  // Undo Handler
  const handleUndo = () => {
    if (history.length > 0) {
      const prevBoard = history[history.length - 1];
      setActiveArrows(prevBoard);
      setHistory(prev => prev.slice(0, prev.length - 1));
      if (lives < level.maxLives) {
        setLives(l => l + 1);
      }
      if (isGameOverOpen) {
        setIsGameOverOpen(false);
      }
    }
  };

  // Select Level Handler
  const handleSelectLevel = (levelId: number) => {
    setGameMode('classic');
    setCurrentLevelNumber(levelId);
  };

  // Daily Challenge Launcher
  const handlePlayDaily = (dateStr: string) => {
    setGameMode('daily');
    const dailyLvl = getDailyLevel(dateStr);
    loadLevel(dailyLvl);
  };

  // Next Level Handler
  const handleNextLevel = () => {
    if (gameMode === 'classic') {
      setCurrentLevelNumber(n => n + 1);
    } else {
      // In Zen or Daily mode, load next procedural puzzle
      const nextLvl = getLevel(currentLevelNumber + 1);
      loadLevel(nextLvl);
    }
  };

  // Reset Progress Data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all progress and stats?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setLevelProgress({ 1: { unlocked: true, completed: false, stars: 0, bestMoves: 0 } });
      setDailyProgress({});
      setStats({
        levelsCompleted: 0,
        perfectClears: 0,
        totalArrowsTapped: 0,
        hintsUsed: 0,
        dailyStreak: 0,
        lastDailyDate: '',
        unlockedTrophies: [],
      });
      setCurrentLevelNumber(1);
      loadLevel(getLevel(1));
      setIsSettingsOpen(false);
    }
  };

  const currentTheme = THEMES[themeId];

  return (
    <div className={`w-full min-h-screen ${currentTheme.bg} transition-colors duration-300 flex flex-col items-center justify-between font-sans antialiased`}>
      {/* Top Controls Header */}
      <Header
        level={level}
        lives={lives}
        maxLives={level.maxLives}
        hintsLeft={hintsLeft}
        gameMode={gameMode}
        themeId={themeId}
        soundSettings={soundSettings}
        canUndo={history.length > 0}
        timeRemaining={timeRemaining}
        onSelectMode={handleSelectMode}
        onHint={handleHint}
        onUndo={handleUndo}
        onRestart={() => loadLevel(level)}
        onPrevLevel={handlePrevLevel}
        onNextLevel={handleNextLevel}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
      />

      {/* Main Interactive Arrow Maze Stage */}
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <GameBoard
          width={level.width}
          height={level.height}
          arrows={activeArrows}
          themeId={themeId}
          onTapArrow={handleTapArrow}
        />
      </main>

      {/* Footer / Helper Prompt */}
      <footer className="w-full max-w-xl mx-auto p-3 text-center select-none">
        <p className={`text-xs ${currentTheme.textSecondary} flex items-center justify-center gap-1.5`}>
          <span>Tap arrows to clear a path out of the maze</span>
        </p>
      </footer>

      {/* Modal Dialogs */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        currentLevelId={currentLevelNumber}
        levelProgress={levelProgress}
        themeId={themeId}
        onSelectLevel={handleSelectLevel}
        onClose={() => setIsLevelSelectOpen(false)}
      />

      <DailyChallengeModal
        isOpen={isDailyOpen}
        dailyProgress={dailyProgress}
        themeId={themeId}
        dailyStreak={stats.dailyStreak}
        onPlayDaily={handlePlayDaily}
        onClose={() => setIsDailyOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        stats={stats}
        themeId={themeId}
        onClose={() => setIsStatsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        themeId={themeId}
        soundSettings={soundSettings}
        gameMode={gameMode}
        onSelectTheme={(t) => setThemeId(t)}
        onToggleSound={() => setSoundSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
        onToggleHaptics={() => setSoundSettings(s => ({ ...s, hapticsEnabled: !s.hapticsEnabled }))}
        onChangeMode={(mode) => {
          setGameMode(mode);
          if (mode === 'classic') loadLevel(getLevel(currentLevelNumber));
          else if (mode === 'zen') loadLevel(getLevel(Math.floor(Math.random() * 50) + 1));
          else setIsDailyOpen(true);
        }}
        onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
        onResetData={handleResetData}
        onClose={() => setIsSettingsOpen(false)}
      />

      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        themeId={themeId}
        onClose={() => setIsHowToPlayOpen(false)}
      />

      <LevelCompleteModal
        isOpen={isLevelCompleteOpen}
        level={level}
        moves={movesCount}
        livesRemaining={lives}
        maxLives={level.maxLives}
        themeId={themeId}
        onNextLevel={handleNextLevel}
        onRestartLevel={() => loadLevel(level)}
        onOpenLevelSelect={() => {
          setIsLevelCompleteOpen(false);
          setIsLevelSelectOpen(true);
        }}
      />

      <GameOverModal
        isOpen={isGameOverOpen}
        themeId={themeId}
        canUndo={history.length > 0}
        isTimeAttack={gameMode === 'time-attack'}
        score={timeAttackScore}
        onRestart={() => {
          if (gameMode === 'time-attack') {
            setTimeRemaining(60);
            setTimeAttackScore(0);
          }
          loadLevel(level);
        }}
        onUndo={handleUndo}
        onHint={handleHint}
      />
    </div>
  );
}
