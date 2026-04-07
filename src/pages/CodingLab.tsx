import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodingChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  solution: string;
  hint: string;
  testCases: { input: string; expected: string }[];
}

const challenges: CodingChallenge[] = [
  {
    id: 'bfs-impl', title: 'Implement BFS Traversal Order',
    description: 'Complete the BFS function that returns the order of visited nodes.',
    difficulty: 'easy',
    starterCode: `function bfs(graph, start) {\n  const visited = [];\n  const queue = [start];\n  const seen = new Set([start]);\n\n  while (queue.length > 0) {\n    // TODO: Dequeue the first element\n    // TODO: Add it to visited\n    // TODO: Enqueue unvisited neighbors\n  }\n\n  return visited;\n}`,
    solution: `function bfs(graph, start) {\n  const visited = [];\n  const queue = [start];\n  const seen = new Set([start]);\n\n  while (queue.length > 0) {\n    const node = queue.shift();\n    visited.push(node);\n    for (const neighbor of graph[node] || []) {\n      if (!seen.has(neighbor)) {\n        seen.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n\n  return visited;\n}`,
    hint: 'Use queue.shift() to dequeue. Mark neighbors as seen BEFORE adding to queue.',
    testCases: [
      { input: 'graph = {A:[B,C], B:[D], C:[D], D:[]}, start = A', expected: '[A, B, C, D]' },
      { input: 'graph = {1:[2,3], 2:[4], 3:[], 4:[]}, start = 1', expected: '[1, 2, 3, 4]' },
    ],
  },
  {
    id: 'dfs-impl', title: 'Implement DFS Traversal Order',
    description: 'Complete the DFS function using a stack (iterative approach).',
    difficulty: 'easy',
    starterCode: `function dfs(graph, start) {\n  const visited = [];\n  const stack = [start];\n  const seen = new Set();\n\n  while (stack.length > 0) {\n    // TODO: Pop from stack\n    // TODO: Skip if already seen\n    // TODO: Mark as seen and add to visited\n    // TODO: Push neighbors to stack\n  }\n\n  return visited;\n}`,
    solution: `function dfs(graph, start) {\n  const visited = [];\n  const stack = [start];\n  const seen = new Set();\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    if (seen.has(node)) continue;\n    seen.add(node);\n    visited.push(node);\n    for (const neighbor of (graph[node] || []).reverse()) {\n      if (!seen.has(neighbor)) stack.push(neighbor);\n    }\n  }\n\n  return visited;\n}`,
    hint: 'Use stack.pop() for LIFO behavior. Check visited AFTER popping.',
    testCases: [{ input: 'graph = {A:[B,C], B:[D], C:[], D:[]}, start = A', expected: '[A, B, D, C]' }],
  },
  {
    id: 'shortest-path', title: 'Reconstruct Shortest Path',
    description: 'Given a parent map from BFS, reconstruct the shortest path from start to goal.',
    difficulty: 'medium',
    starterCode: `function reconstructPath(parent, start, goal) {\n  const path = [];\n  // TODO: Trace back from goal to start using parent map\n  // TODO: Reverse to get start→goal order\n  return path;\n}`,
    solution: `function reconstructPath(parent, start, goal) {\n  const path = [];\n  let current = goal;\n  while (current !== undefined) {\n    path.unshift(current);\n    if (current === start) break;\n    current = parent.get(current);\n  }\n  return path[0] === start ? path : [];\n}`,
    hint: 'Start from the goal and follow parent pointers backward. Use unshift() or reverse at the end.',
    testCases: [{ input: 'parent = {B→A, C→A, D→B}, start=A, goal=D', expected: '[A, B, D]' }],
  },
  {
    id: 'fix-astar', title: 'Fix Buggy A* Implementation',
    description: 'This A* implementation has a bug. Find and fix it.',
    difficulty: 'hard',
    starterCode: `function astar(graph, start, goal, heuristic) {\n  const openSet = [{ node: start, f: heuristic(start) }];\n  const gScore = new Map([[start, 0]]);\n  const parent = new Map();\n\n  while (openSet.length > 0) {\n    openSet.sort((a, b) => a.f - b.f);\n    const { node } = openSet.shift();\n    if (node === goal) return reconstructPath(parent, start, goal);\n    for (const [neighbor, cost] of graph[node]) {\n      // BUG: What's wrong with this line?\n      const newG = gScore.get(node) + 1;\n      if (!gScore.has(neighbor) || newG < gScore.get(neighbor)) {\n        gScore.set(neighbor, newG);\n        parent.set(neighbor, node);\n        openSet.push({ node: neighbor, f: newG + heuristic(neighbor) });\n      }\n    }\n  }\n  return null;\n}`,
    solution: `// The bug: const newG = gScore.get(node) + 1;\n// Should be: const newG = gScore.get(node) + cost;\n// It ignores the actual edge weight, treating all edges as weight 1.`,
    hint: 'Look at how the new g-score is calculated. Is it using the actual edge weight?',
    testCases: [{ input: 'Weighted graph with varying costs', expected: 'Use actual edge cost instead of 1' }],
  },
  {
    id: 'manhattan', title: 'Implement Manhattan Distance Heuristic',
    description: 'Write the Manhattan distance function used as a heuristic in A* for grid pathfinding.',
    difficulty: 'easy',
    starterCode: `function manhattan(nodeA, nodeB) {\n  // nodeA and nodeB are [row, col] arrays\n  // TODO: Calculate |row_diff| + |col_diff|\n}`,
    solution: `function manhattan(nodeA, nodeB) {\n  return Math.abs(nodeA[0] - nodeB[0]) + Math.abs(nodeA[1] - nodeB[1]);\n}`,
    hint: 'Manhattan distance = |x1 - x2| + |y1 - y2|. Use Math.abs().',
    testCases: [
      { input: 'nodeA = [0,0], nodeB = [3,4]', expected: '7' },
      { input: 'nodeA = [2,5], nodeB = [2,5]', expected: '0' },
    ],
  },
];

export default function CodingLab() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const selected = challenges.find(c => c.id === selectedId);

  const selectChallenge = (c: CodingChallenge) => {
    setSelectedId(c.id);
    setCode(c.starterCode);
    setShowSolution(false);
    setShowHint(false);
  };

  const diffColor: Record<string, string> = {
    easy: 'text-primary',
    medium: 'text-accent',
    hard: 'text-destructive',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">Coding Lab</h1>
          <p className="text-xs font-mono text-muted-foreground">Practice implementing pathfinding algorithms</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {!selected ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {challenges.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => selectChallenge(c)}
                className="p-5 rounded-xl border border-border bg-card text-left transition-all hover:border-primary/50 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ scale: 1.02 }}
              >
                <span className={`text-xs font-mono font-bold uppercase ${diffColor[c.difficulty]}`}>{c.difficulty}</span>
                <h3 className="text-sm font-mono font-bold text-foreground mb-1 mt-2">{c.title}</h3>
                <p className="text-xs font-mono text-muted-foreground">{c.description}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                ← All Challenges
              </Button>
              <span className={`text-xs font-mono font-bold uppercase ${diffColor[selected.difficulty]}`}>{selected.difficulty}</span>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border">
              <h2 className="text-lg font-mono font-bold text-foreground mb-2">{selected.title}</h2>
              <p className="text-sm font-mono text-muted-foreground">{selected.description}</p>
            </div>

            <div className="rounded-lg border border-border overflow-hidden">
              <div className="bg-card px-4 py-2 border-b border-border flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">editor.js</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setShowHint(!showHint)}>
                    <Lightbulb className="w-3 h-3 mr-1" /> Hint
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowSolution(!showSolution)}>
                    {showSolution ? <><XCircle className="w-3 h-3 mr-1" /> Hide</> : <><CheckCircle2 className="w-3 h-3 mr-1" /> Solution</>}
                  </Button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 bg-background text-foreground text-xs font-mono resize-none focus:outline-none"
                spellCheck={false}
              />
            </div>

            {showHint && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-accent/10 border border-accent/30 text-xs font-mono text-muted-foreground">
                <strong className="text-accent">Hint:</strong> {selected.hint}
              </motion.div>
            )}

            {showSolution && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-xs font-mono text-muted-foreground mb-1">Solution</div>
                <pre className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-xs font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed">
                  {selected.solution}
                </pre>
              </motion.div>
            )}

            <div className="p-4 rounded-lg bg-card border border-border">
              <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase mb-3">Test Cases</h3>
              <div className="space-y-2">
                {selected.testCases.map((tc, i) => (
                  <div key={i} className="p-2 rounded bg-secondary text-xs font-mono">
                    <div className="text-muted-foreground">Input: {tc.input}</div>
                    <div className="text-primary">Expected: {tc.expected}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
