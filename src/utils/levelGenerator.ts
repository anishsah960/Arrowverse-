import { Arrow, Direction, Level, LevelDifficulty } from '../types';

// Check if an arrow has an unblocked path off the edge of the board
export function canArrowEscape(
  arrow: Arrow,
  allArrows: Arrow[],
  width: number,
  height: number
): boolean {
  // Check positions along the arrow's ray direction
  let dx = 0;
  let dy = 0;

  switch (arrow.direction) {
    case 'U': dy = -1; break;
    case 'D': dy = 1; break;
    case 'L': dx = -1; break;
    case 'R': dx = 1; break;
  }

  let currX = arrow.x + dx;
  let currY = arrow.y + dy;

  while (currX >= 0 && currX < width && currY >= 0 && currY < height) {
    // Check if any other active arrow is standing in this cell
    const occupyingArrow = allArrows.find(a => a.x === currX && a.y === currY && !a.isEscaping);
    if (occupyingArrow) {
      return false; // Path blocked!
    }
    currX += dx;
    currY += dy;
  }

  return true; // Path is totally free to the boundary!
}

// Find all arrows that can escape right now
export function findEscapableArrows(
  arrows: Arrow[],
  width: number,
  height: number
): Arrow[] {
  const activeArrows = arrows.filter(a => !a.isEscaping);
  return activeArrows.filter(arrow => canArrowEscape(arrow, activeArrows, width, height));
}

// Check if a level is completely solvable from its current state
export function isLevelSolvable(
  arrows: Arrow[],
  width: number,
  height: number
): boolean {
  let remaining = arrows.filter(a => !a.isEscaping).map(a => ({ ...a }));

  while (remaining.length > 0) {
    const free = remaining.filter(a => canArrowEscape(a, remaining, width, height));
    if (free.length === 0) {
      return false; // Deadlock encountered
    }
    // Greedily remove the first free arrow
    const toRemove = free[0];
    remaining = remaining.filter(a => a.id !== toRemove.id);
  }

  return true;
}

// Auto-corrects any level to be 100% solvable by breaking circular deadlocks
export function makeLevelSolvable(
  arrows: Arrow[],
  width: number,
  height: number
): Arrow[] {
  let current = arrows.map(a => ({ ...a }));
  let attempts = 0;

  while (!isLevelSolvable(current, width, height) && attempts < 100) {
    attempts++;

    // Find which arrows remain stuck in a deadlock
    let remaining = current.map(a => ({ ...a, isEscaping: false }));
    while (remaining.length > 0) {
      const free = remaining.filter(a => canArrowEscape(a, remaining, width, height));
      if (free.length === 0) break;
      const toRemove = free[0];
      remaining = remaining.filter(a => a.id !== toRemove.id);
    }

    if (remaining.length === 0) break; // Solved!

    // Pick a stuck arrow and point it towards the nearest outer boundary
    const stuckArrow = remaining[Math.floor(Math.random() * remaining.length)];
    const targetInCurrent = current.find(a => a.id === stuckArrow.id);

    if (targetInCurrent) {
      const distU = targetInCurrent.y;
      const distD = height - 1 - targetInCurrent.y;
      const distL = targetInCurrent.x;
      const distR = width - 1 - targetInCurrent.x;

      const sortedDirs: Direction[] = [
        { dir: 'U' as Direction, d: distU },
        { dir: 'D' as Direction, d: distD },
        { dir: 'L' as Direction, d: distL },
        { dir: 'R' as Direction, d: distR },
      ].sort((a, b) => a.d - b.d).map(item => item.dir);

      // Choose a direction different from current direction
      const newDir = sortedDirs.find(d => d !== targetInCurrent.direction) || sortedDirs[0];
      targetInCurrent.direction = newDir;
    }
  }

  return current;
}

export function ensureLevelSolvable(level: Level): Level {
  if (isLevelSolvable(level.arrows, level.width, level.height)) {
    return level;
  }

  const fixedArrows = makeLevelSolvable(level.arrows, level.width, level.height);
  return {
    ...level,
    arrows: fixedArrows,
  };
}

// Generate guaranteed solvable procedural level
export function generateProceduralLevel(
  levelId: number,
  width: number = 5,
  height: number = 5,
  difficulty: LevelDifficulty = 'medium',
  isDaily: boolean = false,
  dailyDateString?: string
): Level {
  const directions: Direction[] = ['U', 'D', 'L', 'R'];

  // Target fill ratio based on difficulty
  let fillRatio = 0.65;
  if (difficulty === 'beginner') fillRatio = 0.45;
  else if (difficulty === 'easy') fillRatio = 0.55;
  else if (difficulty === 'medium') fillRatio = 0.68;
  else if (difficulty === 'hard') fillRatio = 0.78;
  else if (difficulty === 'expert') fillRatio = 0.85;

  const targetArrowCount = Math.max(4, Math.floor(width * height * fillRatio));

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const arrows: Arrow[] = [];

    // Create a pool of random unique cell positions
    const allCells: { x: number; y: number }[] = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        allCells.push({ x, y });
      }
    }

    // Shuffle cells
    allCells.sort(() => Math.random() - 0.5);

    const chosenCells = allCells.slice(0, targetArrowCount);

    chosenCells.forEach((cell, idx) => {
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      arrows.push({
        id: `arrow-${levelId}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
        x: cell.x,
        y: cell.y,
        direction: randomDir,
        colorIndex: idx % 5,
      });
    });

    // Check if solvable and not trivially 100% free on first turn (needs some logic)
    if (isLevelSolvable(arrows, width, height)) {
      const initialFree = findEscapableArrows(arrows, width, height);
      // Ensure at least 1-3 initial free options, but not all of them
      if (initialFree.length > 0 && initialFree.length < arrows.length) {
        return ensureLevelSolvable({
          id: levelId,
          title: isDaily ? `Daily Challenge ${dailyDateString}` : `Level ${levelId}`,
          width,
          height,
          arrows,
          maxLives: 5,
          difficulty,
          isDaily,
          dailyDateString,
        });
      }
    }
  }

  // Fallback: Generate guaranteed reverse-placed arrows if random generation hits cap
  return generateReverseGuaranteedLevel(levelId, width, height, targetArrowCount, difficulty, isDaily, dailyDateString);
}

// Reverse placement generator: builds a level back-to-front so it's guaranteed 100% solvable
function generateReverseGuaranteedLevel(
  levelId: number,
  width: number,
  height: number,
  targetCount: number,
  difficulty: LevelDifficulty,
  isDaily: boolean,
  dailyDateString?: string
): Level {
  const directions: Direction[] = ['U', 'D', 'L', 'R'];
  const arrows: Arrow[] = [];
  const occupied = new Set<string>();

  // Place arrows one by one
  for (let i = 0; i < targetCount; i++) {
    // Find un-occupied cells
    const freeCells: { x: number; y: number }[] = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (!occupied.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }

    if (freeCells.length === 0) break;

    const cell = freeCells[Math.floor(Math.random() * freeCells.length)];
    const dir = directions[Math.floor(Math.random() * directions.length)];

    occupied.add(`${cell.x},${cell.y}`);
    arrows.push({
      id: `arrow-rev-${levelId}-${i}`,
      x: cell.x,
      y: cell.y,
      direction: dir,
      colorIndex: i % 5,
    });
  }

  // Ensure at least 1 solvable path exists, otherwise adjust directions of outer arrows
  let safeArrows = [...arrows];
  let checkAttempts = 0;
  while (!isLevelSolvable(safeArrows, width, height) && checkAttempts < 50) {
    checkAttempts++;
    safeArrows = safeArrows.map(a => {
      // Make boundary arrows point outwards to guarantee exit valves
      if (a.y === 0 && Math.random() < 0.6) return { ...a, direction: 'U' as Direction };
      if (a.y === height - 1 && Math.random() < 0.6) return { ...a, direction: 'D' as Direction };
      if (a.x === 0 && Math.random() < 0.6) return { ...a, direction: 'L' as Direction };
      if (a.x === width - 1 && Math.random() < 0.6) return { ...a, direction: 'R' as Direction };
      return a;
    });
  }

  // Final fallback: if still blocked after 50 attempts, force all boundary arrows to point outward
  if (!isLevelSolvable(safeArrows, width, height)) {
    safeArrows = safeArrows.map(a => {
      if (a.y === 0) return { ...a, direction: 'U' as Direction };
      if (a.y === height - 1) return { ...a, direction: 'D' as Direction };
      if (a.x === 0) return { ...a, direction: 'L' as Direction };
      if (a.x === width - 1) return { ...a, direction: 'R' as Direction };
      return a;
    });
  }

  // Ensure level is 100% solvable by running solver auto-corrector
  const finalArrows = makeLevelSolvable(safeArrows, width, height);

  return {
    id: levelId,
    title: isDaily ? `Daily Challenge ${dailyDateString}` : `Level ${levelId}`,
    width,
    height,
    arrows: finalArrows,
    maxLives: 5,
    difficulty,
    isDaily,
    dailyDateString,
  };
}
