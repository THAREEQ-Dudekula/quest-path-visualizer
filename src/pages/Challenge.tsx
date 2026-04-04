import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Timer, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid } from '@/components/Grid';
import { useAppStore } from '@/store/useAppStore';
import { CellType, generateMaze, GridState, ALGORITHMS } from '@/lib/pathfinding';
import type { Difficulty, ChallengeResult } from '@/types';

const ROWS = 21;
const COLS = 21;

const difficultyConfig: Record<Difficulty, { wallDensity: number; label: string }> = {
  easy: { wallDensity: 0.15, label: 'Easy' },
  medium: { wallDensity: 0.25, label: 'Medium' },
  hard: { wallDensity: 0.35, label: 'Hard' },
  expert: { wallDensity: 0.45, label: 'Expert' },
};

function generateChallengeMaze(difficulty: Difficulty): CellType[][] {
  // Use maze generator for harder levels, random walls for easier
  if (difficulty === 'hard' || difficulty === 'expert') {
    return generateMaze(ROWS, COLS);
  }
  const grid: CellType[][] = Array.from({ length: ROWS }, () => Array(COLS).fill('empty'));
  const density = difficultyConfig[difficulty].wallDensity;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (Math.random() < density) grid[r][c] = 'wall';
    }
  }
  grid[1][1] = 'empty';
  grid[ROWS - 2][COLS - 2] = 'empty';
  return grid;
}

export default function Challenge() {
  const navigate = useNavigate();
  const addChallengeResult = useAppStore((s) => s.addChallengeResult);
  const challengeResults = useAppStore((s) => s.progress.challengeResults);

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cells, setCells] = useState<CellType[][]>(() => generateChallengeMaze('medium'));
  const start: [number, number] = [1, 1];
  const goal: [number, number] = [ROWS - 2, COLS - 2];
  const [userPath, setUserPath] = useState<[number, number][]>([[1, 1]]);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [timer, setTimer] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [score, setScore] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState]);

  const startGame = useCallback(() => {
    const maze = generateChallengeMaze(difficulty);
    setCells(maze);
    setUserPath([[1, 1]]);
    setGameState('playing');
    setTimer(0);
    setWrongClicks(0);
    setScore(null);
  }, [difficulty]);

  const onCellClick = useCallback((r: number, c: number) => {
    if (gameState !== 'playing') return;
    const last = userPath[userPath.length - 1];
    const dr = Math.abs(r - last[0]);
    const dc = Math.abs(c - last[1]);

    // Must be orthogonal neighbor
    if (!((dr === 1 && dc === 0) || (dr === 0 && dc === 1))) {
      setWrongClicks(w => w + 1);
      return;
    }
    if (cells[r][c] === 'wall') {
      setWrongClicks(w => w + 1);
      return;
    }

    const newPath = [...userPath, [r, c] as [number, number]];
    setUserPath(newPath);

    if (r === goal[0] && c === goal[1]) {
      // Calculate score
      const gridState: GridState = { cells, rows: ROWS, cols: COLS, start, goal };
      const optimalResult = ALGORITHMS.bfs.fn(gridState);
      const optimalLen = optimalResult.pathLength;
      const extraSteps = Math.max(0, newPath.length - optimalLen);
      const finalScore = Math.max(0, 1000 - extraSteps * 10 - wrongClicks * 20 - timer * 2);
      setScore(finalScore);
      setGameState('won');

      const result: ChallengeResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: finalScore,
        difficulty,
        timeSeconds: timer,
        pathAccuracy: optimalLen > 0 ? Math.round((optimalLen / newPath.length) * 100) : 0,
      };
      addChallengeResult(result);
    }
  }, [gameState, userPath, cells, goal, start, wrongClicks, timer, difficulty, addChallengeResult]);

  // Build display cells
  const displayCells = cells.map(r => [...r]);
  displayCells[start[0]][start[1]] = 'start';
  displayCells[goal[0]][goal[1]] = 'goal';
  for (const [r, c] of userPath) {
    if (!(r === start[0] && c === start[1]) && !(r === goal[0] && c === goal[1])) {
      displayCells[r][c] = 'path';
    }
  }

  const leaderboard = [...challengeResults]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">
            <span className="text-destructive">⚔️</span> Challenge Mode
          </h1>
          <p className="text-xs font-mono text-muted-foreground">Find the path manually — beat the clock!</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
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
              <Button onClick={startGame} className="w-full bg-primary text-primary-foreground">
                {gameState === 'idle' ? 'Start Challenge' : 'New Challenge'}
              </Button>
            </div>

            {gameState !== 'idle' && (
              <motion.div className="p-4 rounded-lg bg-card border border-border space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-2 text-sm font-mono">
                  <Timer className="w-4 h-4 text-accent" />
                  <span className="text-muted-foreground">Time:</span>
                  <span className="text-foreground font-bold">{timer}s</span>
                </div>
                <div className="text-sm font-mono">
                  <span className="text-muted-foreground">Steps:</span>
                  <span className="text-foreground ml-2 font-bold">{userPath.length}</span>
                </div>
                <div className="text-sm font-mono">
                  <span className="text-muted-foreground">Wrong clicks:</span>
                  <span className="text-destructive ml-2 font-bold">{wrongClicks}</span>
                </div>
              </motion.div>
            )}

            {gameState === 'won' && score !== null && (
              <motion.div
                className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-mono font-bold text-foreground">{score}</div>
                <div className="text-xs font-mono text-muted-foreground">points</div>
              </motion.div>
            )}

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="p-4 rounded-lg bg-card border border-border">
                <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase mb-2">Leaderboard</h3>
                <div className="space-y-1">
                  {leaderboard.map((r, i) => (
                    <div key={r.id} className="flex justify-between text-xs font-mono">
                      <span className="text-muted-foreground">#{i + 1}</span>
                      <span className="text-foreground font-bold">{r.score}</span>
                      <span className="text-muted-foreground">{r.difficulty}</span>
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
                onCellMouseDown={onCellClick}
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
