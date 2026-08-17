import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Arrow, Direction, ThemeId } from '../types';
import { THEMES } from '../utils/themes';

interface GameBoardProps {
  width: number;
  height: number;
  arrows: Arrow[];
  themeId: ThemeId;
  onTapArrow: (arrow: Arrow) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  width,
  height,
  arrows,
  themeId,
  onTapArrow,
}) => {
  const theme = THEMES[themeId];

  // Helper to map rotation angle for directions
  const getRotationAngle = (dir: Direction): number => {
    switch (dir) {
      case 'U': return 0;
      case 'R': return 90;
      case 'D': return 180;
      case 'L': return 270;
    }
  };

  // Helper to compute fly-away transition vectors for escaping animation
  const getFlyAwayOffset = (dir: Direction) => {
    const distance = 900;
    switch (dir) {
      case 'U': return { x: 0, y: -distance };
      case 'D': return { x: 0, y: distance };
      case 'L': return { x: -distance, y: 0 };
      case 'R': return { x: distance, y: 0 };
    }
  };

  // Create empty grid representation
  const gridCells = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      gridCells.push({ x: c, y: r });
    }
  }

  // Calculate dynamic grid column style
  const gridStyle = {
    gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${height}, minmax(0, 1fr))`,
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-4 select-none overflow-hidden">
      <div
        className={`relative w-full max-w-xl aspect-square p-3 sm:p-5 rounded-3xl ${theme.cardBg} transition-colors duration-300 flex flex-col justify-center items-center shadow-lg`}
      >
        {/* Background Grid Mesh */}
        <div
          className="w-full h-full grid gap-2 sm:gap-3.5 relative"
          style={gridStyle}
        >
          {gridCells.map((cell) => (
            <div
              key={`cell-${cell.x}-${cell.y}`}
              className={`w-full h-full rounded-2xl ${theme.gridTileBg} border ${theme.gridTileBorder} transition-colors duration-300`}
            />
          ))}

          {/* Render Arrow Layer */}
          <AnimatePresence>
            {arrows.map((arrow) => {
              const colorTheme = theme.arrowColors[arrow.colorIndex % theme.arrowColors.length];
              const rotation = getRotationAngle(arrow.direction);
              const flyOffset = getFlyAwayOffset(arrow.direction);

              // Grid area placement using 1-based indexing
              const cellStyle = {
                gridColumnStart: arrow.x + 1,
                gridRowStart: arrow.y + 1,
              };

              return (
                <motion.div
                  key={arrow.id}
                  style={cellStyle}
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={
                    arrow.isEscaping
                      ? {
                          x: flyOffset.x,
                          y: flyOffset.y,
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.35, ease: 'easeIn' },
                        }
                      : arrow.isBlockedShake
                      ? {
                          x: [0, -8, 8, -6, 6, -3, 3, 0],
                          transition: { duration: 0.3 },
                        }
                      : arrow.isHinted
                      ? {
                          scale: [1, 1.08, 1],
                          transition: { repeat: Infinity, duration: 1.2 },
                        }
                      : {
                          scale: 1,
                          x: 0,
                          y: 0,
                          opacity: 1,
                          transition: { type: 'spring', stiffness: 350, damping: 25 },
                        }
                  }
                  exit={{ opacity: 0, scale: 0 }}
                  className="w-full h-full p-1 z-10"
                >
                  <button
                    onClick={() => onTapArrow(arrow)}
                    id={`arrow-${arrow.x}-${arrow.y}`}
                    className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md ${colorTheme.bg} ${
                      arrow.isHinted ? `ring-4 ${colorTheme.glow} shadow-lg shadow-amber-400/50` : ''
                    } ${arrow.isBlockedShake ? 'ring-4 ring-rose-500/80 shadow-rose-500/50' : ''}`}
                    title={`Arrow at (${arrow.x + 1}, ${arrow.y + 1}) pointing ${arrow.direction}`}
                  >
                    {/* SVG Arrow Vector */}
                    <div
                      className="w-3/5 h-3/5 flex items-center justify-center transition-transform duration-200"
                      style={{ transform: `rotate(${rotation}deg)` }}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-full h-full stroke-current"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Elegant directional arrow vector */}
                        <path d="M12 19V5" />
                        <path d="M5 12l7-7 7 7" />
                      </svg>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
