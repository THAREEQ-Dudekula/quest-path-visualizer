import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, Trophy, Pause, Play, Square, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid } from '@/components/Grid';
import { useAppStore } from '@/store/useAppStore';
import { CellType, generateMaze, GridState, ALGORITHMS } from '@/lib/pathfinding';
import type { Difficulty, ChallengeResult } from '@/types';

const difficultyConfig: Record<Difficulty, { rows: number; cols: number; label: string; wallDensity: number }> = {
  easy: { rows: 9, cols: 9, label: '🌱 Easy (9×9)', wallDensity: 0.15 },
  medium: { rows: 13, cols: 13, label: '⚔️ Medium (13×13)', wallDensity: 0.25 },
  hard: { rows: 19, cols: 19, label: '🔥 Hard (19×19)', wallDensity: 0.35 },
  expert: { rows: 25, cols: 25, label: '💀 Expert (25×25)', wallDensity: 0.45 },
};

function generateChallengeMaze(difficulty: Difficulty): CellType[][] {
  const { rows, cols } = difficultyConfig[difficulty];
  if (difficulty === 'hard' || difficulty === 'expert') {
    return generateMaze(rows, cols);
  }
  const grid: CellType[][] = Array.from({ length: rows }, () => Array(cols).fill('empty'));
  const density = difficultyConfig[difficulty].wallDensity;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < density) grid[r][c] = 'wall';
    }
  }
  grid[1][1] = 'empty';
  grid[rows - 2][cols - 2] = 'empty';
  return grid;
}

export default function Challenge() {
  const navigate = useNavigate();
  const addChallengeResult = useAppStore((s) => s.addChallengeResult);
  const challengeResults = useAppStore((s) => s.progress.challengeResults);

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const config = difficultyConfig[difficulty];
  const [cells, setCells] = useState<CellType[][]>(() => generateChallengeMaze('medium'));
  const startPos: [number, number] = [1, 1];
  const [goalPos, setGoalPos] = useState<[number, number]>([config.rows - 2, config.cols - 2]);
  const [knightPos, setKnightPos] = useState<[number, number]>([1, 1]);
  const [userPath, setUserPath] = useState<[number, number][]>([[1, 1]]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'won' | 'stopped'>('idle');
  const [timer, setTimer] = useState(0);
  const [wrongMoves, setWrongMoves] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const [optimalPath, setOptimalPath] = useState<[number, number][]>([]);
  const [showOptimal, setShowOptimal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      const dirs: Record<string, [number, number]> = {
        'w': [-1, 0], 'a': [0, -1], 's': [1, 0], 'd': [0, 1],
        'ArrowUp': [-1, 0], 'ArrowLeft': [0, -1], 'ArrowDown': [1, 0], 'ArrowRight': [0, 1],
      };
      const dir = dirs[e.key];
      if (!dir) return;
      e.preventDefault();
      moveKnight(dir[0], dir[1]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, knightPos, cells]);

  const moveKnight = useCallback((dr: number, dc: number) => {
    const nr = knightPos[0] + dr;
    const nc = knightPos[1] + dc;
    const rows = cells.length;
    const cols = cells[0].length;

    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
      setWrongMoves(w => w + 1);
      return;
    }
    if (cells[nr][nc] === 'wall') {
      setWrongMoves(w => w + 1);
      return;
    }

    const newPos: [number, number] = [nr, nc];
    setKnightPos(newPos);
    setUserPath(prev => [...prev, newPos]);

    const gRows = cells.length;
    const gCols = cells[0].length;
    const gGoal: [number, number] = [gRows - 2, gCols - 2];

    if (nr === gGoal[0] && nc === gGoal[1]) {
      finishGame([...userPath, newPos]);
    }
  }, [knightPos, cells, userPath]);

  const finishGame = useCallback((finalPath: [number, number][]) => {
    const rows = cells.length;
    const cols = cells[0].length;
    const gGoal: [number, number] = [rows - 2, cols - 2];
    const gridState: GridState = { cells, rows, cols, start: startPos, goal: gGoal };
    const optimalResult = ALGORITHMS.bfs.fn(gridState);
    const optimalLen = optimalResult.pathLength;

    // Extract optimal path coordinates
    const optPath: [number, number][] = optimalResult.steps
      .filter(s => s.type === 'path')
      .map(s => [s.row, s.col] as [number, number]);
    setOptimalPath(optPath);

    const extraMoves = Math.max(0, finalPath.length - optimalLen);
    const finalScore = Math.max(0, 1000 - extraMoves * 5 - timer * 2);
    setScore(finalScore);
    setGameState('won');
    setShowOptimal(true);

    const result: ChallengeResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      score: finalScore,
      difficulty,
      timeSeconds: timer,
      pathAccuracy: optimalLen > 0 ? Math.round((optimalLen / finalPath.length) * 100) : 0,
    };
    addChallengeResult(result);
  }, [cells, timer, difficulty, addChallengeResult, userPath]);

  const startGame = useCallback(() => {
    const cfg = difficultyConfig[difficulty];
    const maze = generateChallengeMaze(difficulty);
    setCells(maze);
    const gGoal: [number, number] = [cfg.rows - 2, cfg.cols - 2];
    setGoalPos(gGoal);
    setKnightPos([1, 1]);
    setUserPath([[1, 1]]);
    setGameState('playing');
    setTimer(0);
    setWrongMoves(0);
    setScore(null);
    setOptimalPath([]);
    setShowOptimal(false);
  }, [difficulty]);

  const stopGame = useCallback(() => {
    const rows = cells.length;
    const cols = cells[0].length;
    const gGoal: [number, number] = [rows - 2, cols - 2];
    const gridState: GridState = { cells, rows, cols, start: startPos, goal: gGoal };
    const optimalResult = ALGORITHMS.bfs.fn(gridState);
    const optPath: [number, number][] = optimalResult.steps
      .filter(s => s.type === 'path')
      .map(s => [s.row, s.col] as [number, number]);
    setOptimalPath(optPath);
    setShowOptimal(true);
    setGameState('stopped');
  }, [cells]);

  // Build display cells
  const rows = cells.length;
  const cols = cells[0]?.length ?? 0;
  const gGoal: [number, number] = [rows - 2, cols - 2];
  const displayCells: CellType[][] = cells.map(r => [...r]);
  displayCells[startPos[0]][startPos[1]] = 'start';
  if (rows > 2 && cols > 2) displayCells[gGoal[0]][gGoal[1]] = 'goal';

  // Show user trail
  for (const [r, c] of userPath) {
    if (!(r === startPos[0] && c === startPos[1]) && !(r === gGoal[0] && c === gGoal[1])) {
      displayCells[r][c] = 'visited';
    }
  }
  // Knight position
  if (!(knightPos[0] === startPos[0] && knightPos[1] === startPos[1]) && !(knightPos[0] === gGoal[0] && knightPos[1] === gGoal[1])) {
    displayCells[knightPos[0]][knightPos[1]] = 'frontier';
  }
  // Show optimal path
  if (showOptimal) {
    for (const [r, c] of optimalPath) {
      if (!(r === startPos[0] && c === startPos[1]) && !(r === gGoal[0] && c === gGoal[1])) {
        displayCells[r][c] = 'path';
      }
    }
  }

  const efficiency = score !== null && optimalPath.length > 0
    ? Math.round((optimalPath.length / userPath.length) * 100) : 0;

  const leaderboard = [...challengeResults].sort((a, b) => b.score - a.score).slice(0, 8);

  return (
    <div className="min-h-screen bg-background" tabIndex={0}>
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">
            ⚔️ Knight's Challenge
          </h1>
          <p className="text-xs font-mono text-muted-foreground">Guide the knight 🏰→🗼 using WASD or Arrow keys</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Controls */}
          <div className="lg:w-64 space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border space-y-3">
              <label className="text-xs font-mono text-muted-foreground">Difficulty</label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)} disabled={gameState === 'playing'}>
                <SelectTrigger className="bg-secondary"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(difficultyConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={startGame} className="col-span-2 bg-primary text-primary-foreground">
                  {gameState === 'idle' ? '🏰 Start Quest' : '🔄 New Quest'}
                </Button>
                {gameState === 'playing' && (
                  <>
                    <Button onClick={() => setGameState('paused')} variant="secondary" size="sm">
                      <Pause className="w-3 h-3 mr-1" /> Pause
                    </Button>
                    <Button onClick={stopGame} variant="destructive" size="sm">
                      <Square className="w-3 h-3 mr-1" /> Stop
                    </Button>
                  </>
                )}
                {gameState === 'paused' && (
                  <Button onClick={() => setGameState('playing')} className="col-span-2" variant="secondary" size="sm">
                    <Play className="w-3 h-3 mr-1" /> Resume
                  </Button>
                )}
              </div>
            </div>

            {/* Controls hint */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">Controls</div>
              <div className="grid grid-cols-3 gap-1 w-20 mx-auto">
                <div /><div className="bg-secondary rounded px-1 py-0.5 text-center text-xs font-mono text-foreground">W</div><div />
                <div className="bg-secondary rounded px-1 py-0.5 text-center text-xs font-mono text-foreground">A</div>
                <div className="bg-secondary rounded px-1 py-0.5 text-center text-xs font-mono text-foreground">S</div>
                <div className="bg-secondary rounded px-1 py-0.5 text-center text-xs font-mono text-foreground">D</div>
              </div>
            </div>

            {gameState !== 'idle' && (
              <motion.div className="p-4 rounded-lg bg-card border border-border space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <Timer className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground font-bold">{timer}s</span>
                </div>
                <div className="text-sm font-mono">
                  <span className="text-muted-foreground">Moves:</span>
                  <span className="text-foreground ml-2 font-bold">{userPath.length - 1}</span>
                </div>
                <div className="text-sm font-mono">
                  <span className="text-muted-foreground">Wrong moves:</span>
                  <span className="text-destructive ml-2 font-bold">{wrongMoves}</span>
                </div>
              </motion.div>
            )}

            {(gameState === 'won' || gameState === 'stopped') && (
              <motion.div
                className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center space-y-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                {gameState === 'won' ? (
                  <>
                    <div className="text-3xl">👸</div>
                    <div className="text-sm font-mono font-bold text-foreground">Princess Rescued!</div>
                    <Trophy className="w-6 h-6 text-accent mx-auto" />
                    <div className="text-2xl font-mono font-bold text-foreground">{score}</div>
                    <div className="text-xs font-mono text-muted-foreground">points</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      Efficiency: {efficiency}% · Optimal: {optimalPath.length} steps
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">🗺️</div>
                    <div className="text-sm font-mono text-muted-foreground">Shortest path revealed</div>
                    <div className="text-xs font-mono text-muted-foreground">
                      Optimal: {optimalPath.length} steps
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {leaderboard.length > 0 && (
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase mb-2">🏆 Leaderboard</h3>
                <div className="space-y-1">
                  {leaderboard.map((r, i) => (
                    <div key={r.id} className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                      <span className="text-foreground font-bold">{r.score}</span>
                      <span className="text-muted-foreground capitalize">{r.difficulty}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[500px] aspect-square">
              <Grid
                cells={displayCells}
                onCellMouseDown={() => {}}
                onCellMouseEnter={() => {}}
                onMouseUp={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
