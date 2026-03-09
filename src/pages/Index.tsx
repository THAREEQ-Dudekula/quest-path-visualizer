import { useState, useCallback, useRef, useEffect } from 'react';
import { Grid } from '@/components/Grid';
import { ControlPanel } from '@/components/ControlPanel';
import { MetricsPanel } from '@/components/MetricsPanel';
import { Legend } from '@/components/Legend';
import {
  CellType, AlgorithmType, ALGORITHMS, AlgoStep, generateMaze, GridState,
} from '@/lib/pathfinding';

const ROWS = 25;
const COLS = 25;
const DEFAULT_START: [number, number] = [1, 1];
const DEFAULT_GOAL: [number, number] = [ROWS - 2, COLS - 2];

function createEmptyGrid(): CellType[][] {
  return Array.from({ length: ROWS }, () => Array(COLS).fill('empty' as CellType));
}

export default function Index() {
  const [cells, setCells] = useState<CellType[][]>(() => createEmptyGrid());
  const [start, setStart] = useState<[number, number]>(DEFAULT_START);
  const [goal, setGoal] = useState<[number, number]>(DEFAULT_GOAL);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar');
  const [speed, setSpeed] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [metrics, setMetrics] = useState<{
    nodesVisited: number; pathLength: number; timeTaken: number; found: boolean | null; algorithm: AlgorithmType | null;
  }>({ nodesVisited: 0, pathLength: 0, timeTaken: 0, found: null, algorithm: null });

  const mouseDown = useRef(false);
  const dragType = useRef<'wall' | 'erase' | 'start' | 'goal'>('wall');
  const pausedRef = useRef(false);
  const runningRef = useRef(false);
  const stepsRef = useRef<AlgoStep[]>([]);
  const stepIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedRef = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);

  const onCellMouseDown = useCallback((r: number, c: number) => {
    if (isRunning) return;
    mouseDown.current = true;
    if (r === start[0] && c === start[1]) {
      dragType.current = 'start';
    } else if (r === goal[0] && c === goal[1]) {
      dragType.current = 'goal';
    } else {
      setCells(prev => {
        const n = prev.map(row => [...row]);
        if (n[r][c] === 'wall') {
          n[r][c] = 'empty';
          dragType.current = 'erase';
        } else {
          n[r][c] = 'wall';
          dragType.current = 'wall';
        }
        return n;
      });
    }
  }, [isRunning, start, goal]);

  const onCellMouseEnter = useCallback((r: number, c: number) => {
    if (!mouseDown.current || isRunning) return;
    if (dragType.current === 'start') {
      if (cells[r][c] !== 'wall' && !(r === goal[0] && c === goal[1])) {
        setStart([r, c]);
      }
    } else if (dragType.current === 'goal') {
      if (cells[r][c] !== 'wall' && !(r === start[0] && c === start[1])) {
        setGoal([r, c]);
      }
    } else {
      setCells(prev => {
        const n = prev.map(row => [...row]);
        if (r === start[0] && c === start[1]) return prev;
        if (r === goal[0] && c === goal[1]) return prev;
        n[r][c] = dragType.current === 'wall' ? 'wall' : 'empty';
        return n;
      });
    }
  }, [isRunning, cells, start, goal]);

  const onMouseUp = useCallback(() => { mouseDown.current = false; }, []);

  // Build display grid
  const displayCells = cells.map(row => [...row]);
  displayCells[start[0]][start[1]] = 'start';
  displayCells[goal[0]][goal[1]] = 'goal';

  const clearPath = useCallback(() => {
    setCells(prev => prev.map(row => row.map(c => (c === 'visited' || c === 'frontier' || c === 'path') ? 'empty' : c)));
    setMetrics({ nodesVisited: 0, pathLength: 0, timeTaken: 0, found: null, algorithm: null });
  }, []);

  const resetGrid = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    runningRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setCells(createEmptyGrid());
    setStart(DEFAULT_START);
    setGoal(DEFAULT_GOAL);
    setMetrics({ nodesVisited: 0, pathLength: 0, timeTaken: 0, found: null, algorithm: null });
  }, []);

  const onGenerateMaze = useCallback(() => {
    const maze = generateMaze(ROWS, COLS);
    // Ensure start/goal are empty
    maze[DEFAULT_START[0]][DEFAULT_START[1]] = 'empty';
    maze[DEFAULT_GOAL[0]][DEFAULT_GOAL[1]] = 'empty';
    setCells(maze);
    setStart(DEFAULT_START);
    setGoal(DEFAULT_GOAL);
    setMetrics({ nodesVisited: 0, pathLength: 0, timeTaken: 0, found: null, algorithm: null });
  }, []);

  const runVisualization = useCallback(() => {
    clearPath();
    const gridState: GridState = {
      cells: cells.map(row => [...row]),
      rows: ROWS, cols: COLS, start, goal,
    };
    const t0 = performance.now();
    const result = ALGORITHMS[algorithm].fn(gridState);
    const timeTaken = performance.now() - t0;

    stepsRef.current = result.steps;
    stepIndexRef.current = 0;
    runningRef.current = true;
    setIsRunning(true);
    setIsPaused(false);

    const animate = () => {
      if (!runningRef.current) return;
      if (pausedRef.current) {
        timerRef.current = setTimeout(animate, 50);
        return;
      }
      if (stepIndexRef.current >= stepsRef.current.length) {
        runningRef.current = false;
        setIsRunning(false);
        setMetrics({
          nodesVisited: result.nodesVisited,
          pathLength: result.pathLength,
          timeTaken,
          found: result.found,
          algorithm,
        });
        return;
      }
      const step = stepsRef.current[stepIndexRef.current];
      setCells(prev => {
        const n = prev.map(row => [...row]);
        const { row: r, col: c, type } = step;
        // Don't overwrite start/goal visually (they stay in displayCells)
        if ((r === start[0] && c === start[1]) || (r === goal[0] && c === goal[1])) {
          // still mark for metrics but don't change cell
        } else {
          n[r][c] = type;
        }
        return n;
      });
      stepIndexRef.current++;
      timerRef.current = setTimeout(animate, speedRef.current);
    };

    timerRef.current = setTimeout(animate, speedRef.current);
  }, [cells, start, goal, algorithm, clearPath]);

  const onPauseResume = useCallback(() => {
    setIsPaused(p => !p);
  }, []);

  const onStart = useCallback(() => {
    runVisualization();
  }, [runVisualization]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-mono font-bold text-foreground tracking-tight">
          <span className="text-primary">⬡</span> Pathfinding Visualizer
        </h1>
        <p className="text-xs font-mono text-muted-foreground mt-1">
          Click to place walls · Drag start/goal nodes · Select algorithm and visualize
        </p>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 max-w-[1400px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 flex flex-col gap-4">
          <ControlPanel
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            speed={speed}
            onSpeedChange={setSpeed}
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={onStart}
            onPauseResume={onPauseResume}
            onReset={resetGrid}
            onClearPath={clearPath}
            onGenerateMaze={onGenerateMaze}
          />
          <MetricsPanel
            algorithm={metrics.algorithm}
            nodesVisited={metrics.nodesVisited}
            pathLength={metrics.pathLength}
            timeTaken={metrics.timeTaken}
            found={metrics.found}
          />
          <Legend />
        </aside>

        {/* Grid */}
        <main className="flex-1 flex items-start justify-center">
          <div className="w-full max-w-[600px] aspect-square">
            <Grid
              cells={displayCells}
              onCellMouseDown={onCellMouseDown}
              onCellMouseEnter={onCellMouseEnter}
              onMouseUp={onMouseUp}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
