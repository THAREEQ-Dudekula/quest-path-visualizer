import { useParams, useNavigate } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Grid } from '@/components/Grid';
import { TraversalTable, TraversalRow } from '@/components/TraversalTable';
import { algorithmData } from '@/data/algorithmData';
import { useAppStore } from '@/store/useAppStore';
import {
  CellType, AlgorithmType, ALGORITHMS, AlgoStep, generateMaze, GridState,
} from '@/lib/pathfinding';

const DEMO_ROWS = 15;
const DEMO_COLS = 15;
const DEMO_START: [number, number] = [1, 1];
const DEMO_GOAL: [number, number] = [13, 13];

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
    const gridState: GridState = { cells: maze, rows: DEMO_ROWS, cols: DEMO_COLS, start: DEMO_START, goal: DEMO_GOAL };
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
    let visitCount = 0;
    for (let i = 0; i <= stepIndex && i < stepsRef.current.length; i++) {
      const s = stepsRef.current[i];
      if (!(s.row === DEMO_START[0] && s.col === DEMO_START[1]) && !(s.row === DEMO_GOAL[0] && s.col === DEMO_GOAL[1])) {
        base[s.row][s.col] = s.type === 'visit' ? 'visited' : s.type as CellType;
      }
      if (s.type === 'visit') {
        visitCount++;
        rows.push({
          step: visitCount, row: s.row, col: s.col, nodeType: s.type,
          parent: i > 0 ? `(${stepsRef.current[Math.max(0, i - 1)].row},${stepsRef.current[Math.max(0, i - 1)].col})` : 'start',
          status: 'visited',
        });
      }
    }
    setCells(base);
    setTraversalData(rows);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= stepsRef.current.length) { setIsPlaying(false); return; }
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
      else { setCells(baseCellsRef.current.map(r => [...r])); setTraversalData([]); }
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
          <h1 className="text-xl font-mono font-bold text-foreground">{algo.icon} {algo.name}</h1>
          <p className="text-xs font-mono text-muted-foreground">{algo.category} · {algo.dataStructure}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* 1. What is it */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2">1. What is {algo.shortName}?</h2>
          {algo.explanation.map((p, i) => (
            <p key={i} className="text-sm font-mono text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </motion.section>

        {/* 2. Complexity */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2 mb-4">2. Complexity & Properties</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Time', value: algo.timeComplexity },
              { label: 'Space', value: algo.spaceComplexity },
              { label: 'Optimal', value: algo.guaranteesShortestPath ? '✅ Yes' : '❌ No' },
              { label: 'Weighted', value: algo.weighted ? 'Yes' : 'No' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-card border border-border text-center">
                <div className="text-xs font-mono text-muted-foreground">{label}</div>
                <div className="text-sm font-mono font-bold text-foreground mt-1">{value}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* 3. Pseudocode */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2">3. Pseudocode</h2>
          <pre className="p-4 rounded-lg bg-card border border-border text-xs font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed">
            {algo.pseudocode}
          </pre>
        </motion.section>

        {/* 4. Real-world Uses */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2 mb-4">4. Real-World Applications</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {algo.realWorldUse.map((use, i) => (
              <div key={i} className="p-3 rounded-lg bg-card border border-border text-xs font-mono text-muted-foreground">
                🌐 {use}
              </div>
            ))}
          </div>
        </motion.section>

        {/* 5. Demo */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-4">
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2">5. Interactive Demo</h2>
          <div className="flex gap-2 mb-4 flex-wrap">
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
              <Grid cells={displayCells} onCellMouseDown={() => {}} onCellMouseEnter={() => {}} onMouseUp={() => {}} />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase mb-2">Traversal Table</h3>
              <TraversalTable data={traversalData} className="max-h-[400px]" />
            </div>
          </div>
        </motion.section>

        {/* 6. Summary */}
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

        {/* 7. Common Mistakes */}
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-mono font-bold text-foreground border-b border-border pb-2 mb-4">7. Common Mistakes</h2>
          <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 space-y-2">
            {algo.id === 'bfs' && <>
              <p className="text-xs font-mono text-muted-foreground">❌ Using BFS on weighted graphs and expecting shortest path by weight</p>
              <p className="text-xs font-mono text-muted-foreground">❌ Forgetting to mark nodes as visited before enqueuing (causes duplicates)</p>
            </>}
            {algo.id === 'dfs' && <>
              <p className="text-xs font-mono text-muted-foreground">❌ Assuming DFS finds the shortest path</p>
              <p className="text-xs font-mono text-muted-foreground">❌ Not handling cycles properly (infinite loops)</p>
            </>}
            {algo.id === 'dijkstra' && <>
              <p className="text-xs font-mono text-muted-foreground">❌ Using Dijkstra with negative edge weights</p>
              <p className="text-xs font-mono text-muted-foreground">❌ Processing already-visited nodes from the priority queue</p>
            </>}
            {algo.id === 'astar' && <>
              <p className="text-xs font-mono text-muted-foreground">❌ Using an inadmissible heuristic (overestimates)</p>
              <p className="text-xs font-mono text-muted-foreground">❌ Confusing g-score and f-score when updating</p>
            </>}
            {algo.id === 'greedy' && <>
              <p className="text-xs font-mono text-muted-foreground">❌ Expecting optimal paths from Greedy search</p>
              <p className="text-xs font-mono text-muted-foreground">❌ Using it in maze-heavy environments where it gets trapped</p>
            </>}
            {algo.id === 'bidirectional' && <>
              <p className="text-xs font-mono text-muted-foreground">❌ Not correctly merging the two search paths</p>
              <p className="text-xs font-mono text-muted-foreground">❌ Forgetting to check intersection after each expansion</p>
            </>}
          </div>
        </motion.section>

        {/* Quiz CTA */}
        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate(`/quiz?algo=${id}`)} className="bg-primary text-primary-foreground">
            Take {algo.shortName} Quiz →
          </Button>
          <Button variant="outline" onClick={() => navigate('/coding-lab')}>
            💻 Coding Lab
          </Button>
        </div>
      </div>
    </div>
  );
}
