import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Grid } from '@/components/Grid';
import { algorithmData } from '@/data/algorithmData';
import { useAppStore } from '@/store/useAppStore';
import {
  CellType, AlgorithmType, ALGORITHMS, AlgoStep, generateMaze, GridState,
} from '@/lib/pathfinding';

const DEMO_ROWS = 15;
const DEMO_COLS = 15;
const DEMO_START: [number, number] = [1, 1];
const DEMO_GOAL: [number, number] = [13, 13];

interface TraversalRow {
  step: number;
  row: number;
  col: number;
  nodeType: string;
  parent: string;
}

export default function Lesson() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const markLessonViewed = useAppStore((s) => s.markLessonViewed);
  const algo = id ? algorithmData[id] : null;

  const [cells, setCells] = useState<CellType[][]>(() => {
    const maze = generateMaze(DEMO_ROWS, DEMO_COLS);
    maze[DEMO_START[0]][DEMO_START[1]] = 'empty';
    maze[DEMO_GOAL[0]][DEMO_GOAL[1]] = 'empty';
    return maze;
  });
  const [traversalData, setTraversalData] = useState<TraversalRow[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const stepsRef = useRef<AlgoStep[]>([]);
  const baseCellsRef = useRef<CellType[][]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (id) markLessonViewed(id);
  }, [id, markLessonViewed]);

  const prepareDemo = useCallback(() => {
    const maze = generateMaze(DEMO_ROWS, DEMO_COLS);
    maze[DEMO_START[0]][DEMO_START[1]] = 'empty';
    maze[DEMO_GOAL[0]][DEMO_GOAL[1]] = 'empty';
    baseCellsRef.current = maze.map(r => [...r]);

    const algoKey = id as AlgorithmType;
    if (!ALGORITHMS[algoKey]) return;
    const gridState: GridState = {
      cells: maze, rows: DEMO_ROWS, cols: DEMO_COLS, start: DEMO_START, goal: DEMO_GOAL,
    };
    const result = ALGORITHMS[algoKey].fn(gridState);
    stepsRef.current = result.steps;
    setCells(maze);
    setCurrentStep(0);
    setTraversalData([]);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [id]);

  useEffect(() => { prepareDemo(); }, [prepareDemo]);

  const applyStepsUpTo = useCallback((stepIndex: number) => {
    const base = baseCellsRef.current.map(r => [...r]);
    const rows: TraversalRow[] = [];
    for (let i = 0; i <= stepIndex && i < stepsRef.current.length; i++) {
      const s = stepsRef.current[i];
      const { row: r, col: c, type } = s;
      if (!(r === DEMO_START[0] && c === DEMO_START[1]) && !(r === DEMO_GOAL[0] && c === DEMO_GOAL[1])) {
        base[r][c] = type === 'visit' ? 'visited' : type as CellType;
      }
      if (type === 'visit') {
        rows.push({
          step: rows.length + 1,
          row: r,
          col: c,
          nodeType: type,
          parent: i > 0 ? `(${stepsRef.current[Math.max(0, i - 1)].row},${stepsRef.current[Math.max(0, i - 1)].col})` : 'start',
        });
      }
    }
    setCells(base);
    setTraversalData(rows);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= stepsRef.current.length) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      const next = currentStep + 1;
      setCurrentStep(next);
      applyStepsUpTo(next - 1);
    }, 80);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentStep, applyStepsUpTo]);

  const onNextStep = () => {
    if (currentStep < stepsRef.current.length) {
      applyStepsUpTo(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };
  const onPrevStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 2;
      if (prev >= 0) applyStepsUpTo(prev);
      else {
        setCells(baseCellsRef.current.map(r => [...r]));
        setTraversalData([]);
      }
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  if (!algo) return <div className="p-8 text-foreground">Algorithm not found</div>;

  const displayCells = cells.map(r => [...r]);
  displayCells[DEMO_START[0]][DEMO_START[1]] = 'start';
  displayCells[DEMO_GOAL[0]][DEMO_GOAL[1]] = 'goal';

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">
            {algo.icon} {algo.name}
          </h1>
          <p className="text-xs font-mono text-muted-foreground">{algo.category} · {algo.dataStructure}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* What is it */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2">What is {algo.shortName}?</h2>
          {algo.explanation.map((p, i) => (
            <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">{p}</p>
          ))}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Time', value: algo.timeComplexity },
              { label: 'Space', value: algo.spaceComplexity },
              { label: 'Optimal', value: algo.guaranteesShortestPath ? 'Yes' : 'No' },
              { label: 'Weighted', value: algo.weighted ? 'Yes' : 'No' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-xs font-mono text-muted-foreground">{label}</div>
                <div className="text-sm font-mono font-bold text-foreground mt-1">{value}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Pseudocode */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2">Pseudocode</h2>
          <pre className="p-4 rounded-lg bg-card border border-border text-xs font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed">
            {algo.pseudocode}
          </pre>
        </motion.section>

        {/* Demo */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2">Interactive Demo</h2>
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <><Pause className="w-3 h-3 mr-1" /> Pause</> : <><Play className="w-3 h-3 mr-1" /> Play</>}
            </Button>
            <Button size="sm" variant="outline" onClick={onPrevStep} disabled={isPlaying || currentStep === 0}>
              <SkipBack className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={onNextStep} disabled={isPlaying || currentStep >= stepsRef.current.length}>
              <SkipForward className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={prepareDemo}>
              <RotateCcw className="w-3 h-3 mr-1" /> New Maze
            </Button>
            <span className="text-xs font-mono text-muted-foreground self-center ml-2">
              Step {currentStep} / {stepsRef.current.length}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full max-w-[400px] aspect-square">
              <Grid
                cells={displayCells}
                onCellMouseDown={() => {}}
                onCellMouseEnter={() => {}}
                onMouseUp={() => {}}
              />
            </div>

            {/* Traversal Table */}
            <div className="flex-1 max-h-[400px] overflow-auto rounded-lg border border-border">
              <table className="w-full text-xs font-mono">
                <thead className="bg-card sticky top-0">
                  <tr>
                    {['Step', 'Row', 'Col', 'Type', 'Parent'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-muted-foreground font-semibold border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {traversalData.map((row, i) => (
                    <tr key={i} className={`border-b border-border/50 ${i === traversalData.length - 1 ? 'bg-primary/10' : ''}`}>
                      <td className="px-3 py-1.5 text-foreground">{row.step}</td>
                      <td className="px-3 py-1.5 text-foreground">{row.row}</td>
                      <td className="px-3 py-1.5 text-foreground">{row.col}</td>
                      <td className="px-3 py-1.5 text-foreground">{row.nodeType}</td>
                      <td className="px-3 py-1.5 text-muted-foreground">{row.parent}</td>
                    </tr>
                  ))}
                  {traversalData.length === 0 && (
                    <tr><td colSpan={5} className="px-3 py-4 text-center text-muted-foreground">Press Play or Step to begin</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid md:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-mono font-bold text-primary mb-2">✅ Advantages</h3>
            <ul className="space-y-1">{algo.advantages.map((a, i) => (
              <li key={i} className="text-xs font-mono text-muted-foreground">• {a}</li>
            ))}</ul>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-mono font-bold text-destructive mb-2">⚠️ Limitations</h3>
            <ul className="space-y-1">{algo.limitations.map((l, i) => (
              <li key={i} className="text-xs font-mono text-muted-foreground">• {l}</li>
            ))}</ul>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="text-sm font-mono font-bold text-accent mb-2">🎯 When to Use</h3>
            <ul className="space-y-1">{algo.whenToUse.map((w, i) => (
              <li key={i} className="text-xs font-mono text-muted-foreground">• {w}</li>
            ))}</ul>
          </div>
        </motion.section>

        {/* Quiz CTA */}
        <div className="flex justify-center">
          <Button onClick={() => navigate(`/quiz?algo=${id}`)} className="bg-primary text-primary-foreground">
            Take {algo.shortName} Quiz →
          </Button>
        </div>
      </div>
    </div>
  );
}
