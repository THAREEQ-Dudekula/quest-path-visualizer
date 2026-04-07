import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid } from '@/components/Grid';
import { MetricsPanel } from '@/components/MetricsPanel';
import {
  CellType, AlgorithmType, ALGORITHMS, AlgoStep, AlgoResult, generateMaze, GridState,
} from '@/lib/pathfinding';

const ROWS = 21;
const COLS = 21;
const START: [number, number] = [1, 1];
const GOAL: [number, number] = [ROWS - 2, COLS - 2];

interface CompareResult {
  algorithm: AlgorithmType;
  result: AlgoResult;
  timeTaken: number;
}

export default function Compare() {
  const navigate = useNavigate();
  const [algo1, setAlgo1] = useState<AlgorithmType>('bfs');
  const [algo2, setAlgo2] = useState<AlgorithmType>('astar');
  const [baseCells, setBaseCells] = useState<CellType[][]>(() => {
    const m = generateMaze(ROWS, COLS);
    m[START[0]][START[1]] = 'empty';
    m[GOAL[0]][GOAL[1]] = 'empty';
    return m;
  });
  const [cells1, setCells1] = useState<CellType[][]>(baseCells);
  const [cells2, setCells2] = useState<CellType[][]>(baseCells);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<[CompareResult | null, CompareResult | null]>([null, null]);

  const stepsRef1 = useRef<AlgoStep[]>([]);
  const stepsRef2 = useRef<AlgoStep[]>([]);
  const stepIdx1 = useRef(0);
  const stepIdx2 = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runRef = useRef(false);

  const newMaze = useCallback(() => {
    const m = generateMaze(ROWS, COLS);
    m[START[0]][START[1]] = 'empty';
    m[GOAL[0]][GOAL[1]] = 'empty';
    setBaseCells(m);
    setCells1(m.map(r => [...r]));
    setCells2(m.map(r => [...r]));
    setResults([null, null]);
  }, []);

  const runComparison = useCallback(() => {
    const gridState: GridState = { cells: baseCells.map(r => [...r]), rows: ROWS, cols: COLS, start: START, goal: GOAL };

    const t1 = performance.now();
    const r1 = ALGORITHMS[algo1].fn({ ...gridState, cells: baseCells.map(r => [...r]) });
    const time1 = performance.now() - t1;

    const t2 = performance.now();
    const r2 = ALGORITHMS[algo2].fn({ ...gridState, cells: baseCells.map(r => [...r]) });
    const time2 = performance.now() - t2;

    stepsRef1.current = r1.steps;
    stepsRef2.current = r2.steps;
    stepIdx1.current = 0;
    stepIdx2.current = 0;
    setCells1(baseCells.map(r => [...r]));
    setCells2(baseCells.map(r => [...r]));
    runRef.current = true;
    setIsRunning(true);

    const animate = () => {
      if (!runRef.current) return;

      if (stepIdx1.current < stepsRef1.current.length) {
        const s = stepsRef1.current[stepIdx1.current];
        setCells1(prev => {
          const n = prev.map(r => [...r]);
          if (!(s.row === START[0] && s.col === START[1]) && !(s.row === GOAL[0] && s.col === GOAL[1])) {
            n[s.row][s.col] = s.type === 'visit' ? 'visited' : s.type as CellType;
          }
          return n;
        });
        stepIdx1.current++;
      }

      if (stepIdx2.current < stepsRef2.current.length) {
        const s = stepsRef2.current[stepIdx2.current];
        setCells2(prev => {
          const n = prev.map(r => [...r]);
          if (!(s.row === START[0] && s.col === START[1]) && !(s.row === GOAL[0] && s.col === GOAL[1])) {
            n[s.row][s.col] = s.type === 'visit' ? 'visited' : s.type as CellType;
          }
          return n;
        });
        stepIdx2.current++;
      }

      if (stepIdx1.current >= stepsRef1.current.length && stepIdx2.current >= stepsRef2.current.length) {
        runRef.current = false;
        setIsRunning(false);
        setResults([
          { algorithm: algo1, result: r1, timeTaken: time1 },
          { algorithm: algo2, result: r2, timeTaken: time2 },
        ]);
        return;
      }
      timerRef.current = setTimeout(animate, 15);
    };
    timerRef.current = setTimeout(animate, 15);
  }, [baseCells, algo1, algo2]);

  const d1 = cells1.map(r => [...r]);
  d1[START[0]][START[1]] = 'start';
  d1[GOAL[0]][GOAL[1]] = 'goal';
  const d2 = cells2.map(r => [...r]);
  d2[START[0]][START[1]] = 'start';
  d2[GOAL[0]][GOAL[1]] = 'goal';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">Algorithm Compare</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={algo1} onValueChange={(v) => setAlgo1(v as AlgorithmType)} disabled={isRunning}>
            <SelectTrigger className="w-48 bg-secondary"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(ALGORITHMS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground font-mono text-sm">vs</span>
          <Select value={algo2} onValueChange={(v) => setAlgo2(v as AlgorithmType)} disabled={isRunning}>
            <SelectTrigger className="w-48 bg-secondary"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(ALGORITHMS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={runComparison} disabled={isRunning} className="bg-primary text-primary-foreground">
            Run Comparison
          </Button>
          <Button onClick={newMaze} variant="outline" disabled={isRunning}>New Maze</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { cells: d1, label: ALGORITHMS[algo1].name, result: results[0] },
            { cells: d2, label: ALGORITHMS[algo2].name, result: results[1] },
          ].map(({ cells, label, result }, i) => (
            <motion.div key={i} className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="text-sm font-mono font-bold text-foreground">{label}</h3>
              <div className="aspect-square">
                <Grid cells={cells} onCellMouseDown={() => {}} onCellMouseEnter={() => {}} onMouseUp={() => {}} />
              </div>
              {result && (
                <MetricsPanel
                  algorithm={result.algorithm}
                  nodesVisited={result.result.nodesVisited}
                  pathLength={result.result.pathLength}
                  timeTaken={result.timeTaken}
                  found={result.result.found}
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
