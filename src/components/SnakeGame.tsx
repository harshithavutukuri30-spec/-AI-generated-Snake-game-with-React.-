import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameStatus } from '../types';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const speedRef = useRef(150);

  const generateFood = useCallback(() => {
    let newFood;
    while (!newFood || snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_SIZE / GRID_SIZE))
      };
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setStatus('playing');
    setFood(generateFood());
    speedRef.current = 150;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (status !== 'playing') return;

    const moveSnake = () => {
      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

      // Wall collision
      if (
        head.x < 0 || 
        head.x >= CANVAS_SIZE / GRID_SIZE || 
        head.y < 0 || 
        head.y >= CANVAS_SIZE / GRID_SIZE
      ) {
        setStatus('gameover');
        return;
      }

      // Self collision
      if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setStatus('gameover');
        return;
      }

      const newSnake = [head, ...snake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood());
        speedRef.current = Math.max(80, speedRef.current - 2);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameLoop = setTimeout(moveSnake, speedRef.current);
    return () => clearTimeout(gameLoop);
  }, [snake, direction, status, food, generateFood]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid (Subtle)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_SIZE; i += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF00FF';
    ctx.fillStyle = '#FF00FF';
    ctx.beginPath();
    ctx.roundRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4, 4);
    ctx.fill();

    // Snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 20 : 10;
      ctx.shadowColor = '#00FFFF';
      ctx.fillStyle = isHead ? '#00FFFF' : 'rgba(0, 255, 255, 0.6)';
      
      ctx.beginPath();
      ctx.roundRect(
        segment.x * GRID_SIZE + 1, 
        segment.y * GRID_SIZE + 1, 
        GRID_SIZE - 2, 
        GRID_SIZE - 2, 
        isHead ? 6 : 4
      );
      ctx.fill();

      // Eye for head
      if (isHead) {
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 0;
        const eyeSize = 2;
        const offset = 4;
        // Direction based eyes
        if (direction.x > 0) { // Right
           ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + 5, eyeSize, eyeSize);
           ctx.fillRect(segment.x * GRID_SIZE + 12, segment.y * GRID_SIZE + 13, eyeSize, eyeSize);
        } else if (direction.x < 0) { // Left
           ctx.fillRect(segment.x * GRID_SIZE + 6, segment.y * GRID_SIZE + 5, eyeSize, eyeSize);
           ctx.fillRect(segment.x * GRID_SIZE + 6, segment.y * GRID_SIZE + 13, eyeSize, eyeSize);
        } else if (direction.y < 0) { // Up
           ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 6, eyeSize, eyeSize);
           ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 6, eyeSize, eyeSize);
        } else { // Down
           ctx.fillRect(segment.x * GRID_SIZE + 5, segment.y * GRID_SIZE + 13, eyeSize, eyeSize);
           ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 13, eyeSize, eyeSize);
        }
      }
    });

  }, [snake, food, direction]);

  return (
    <div className="relative group">
      {/* Game Window Chrome */}
      <div className="bg-black border-2 border-white/10 rounded-2xl p-2 shadow-[0_0_100px_rgba(0,255,255,0.1)] relative overflow-hidden">
        {/* Scanning Line Effect */}
        <div className="absolute inset-x-0 h-px bg-cyan-500/10 z-20 pointer-events-none animate-scanline" />
        
        {/* HUD */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">Score</span>
          </div>
          <div className="text-3xl font-mono text-white font-black tracking-tighter leading-none italic">{score.toString().padStart(4, '0')}</div>
        </div>

        <div className="absolute top-4 right-4 z-10 text-right pointer-events-none">
          <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">High Score</div>
          <div className="text-xl font-mono text-white/50">{highScore.toString().padStart(4, '0')}</div>
        </div>

        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE}
          className="rounded-xl"
        />

        {/* Overlay States */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl"
            >
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">Neon Snake</h2>
              <button 
                onClick={resetGame}
                className="group relative px-8 py-3 bg-cyan-500 text-black font-bold rounded-lg overflow-hidden hover:scale-105 active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                <div className="flex items-center gap-2 relative z-10">
                  <Play size={20} fill="currentColor" />
                  <span>START SYSTEM</span>
                </div>
              </button>
              <p className="mt-4 text-white/40 text-xs font-mono uppercase tracking-[0.2em]">Use arrow keys to navigate</p>
            </motion.div>
          )}

          {status === 'gameover' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-magenta-950/40 backdrop-blur-md rounded-xl"
            >
              <h2 className="text-5xl font-black text-magenta-400 italic uppercase tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(255,0,255,0.5)]">Terminated</h2>
              <p className="text-white/60 font-mono text-sm mb-8 uppercase tracking-widest">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="group relative px-8 py-3 bg-white text-black font-bold rounded-lg overflow-hidden hover:scale-105 active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <RefreshCcw size={20} />
                  <span>REBOOT</span>
                </div>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Corners */}
      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-xl pointer-events-none" />
      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-cyan-500 rounded-tr-xl pointer-events-none" />
      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-magenta-500 rounded-bl-xl pointer-events-none" />
      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-magenta-500 rounded-br-xl pointer-events-none" />
    </div>
  );
}
