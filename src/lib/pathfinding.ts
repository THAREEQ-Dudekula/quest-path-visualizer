export type CellType = 'empty' | 'wall' | 'start' | 'goal' | 'visited' | 'frontier' | 'path';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
}

export interface GridState {
  cells: CellType[][];
  rows: number;
  cols: number;
  start: [number, number];
  goal: [number, number];
}

export interface AlgoStep {
  type: 'visit' | 'frontier' | 'path';
  row: number;
  col: number;
}

export interface AlgoResult {
  steps: AlgoStep[];
  pathLength: number;
  nodesVisited: number;
  found: boolean;
}

const DIRS = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
];

function neighbors(r: number, c: number, rows: number, cols: number) {
  return DIRS
    .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
    .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols);
}

function reconstructPath(
  cameFrom: Map<string, string>,
  goal: [number, number]
): AlgoStep[] {
  const path: AlgoStep[] = [];
  let key = `${goal[0]},${goal[1]}`;
  while (cameFrom.has(key)) {
    const [r, c] = key.split(',').map(Number);
    path.unshift({ type: 'path', row: r, col: c });
    key = cameFrom.get(key)!;
  }
  // Add start
  const [r, c] = key.split(',').map(Number);
  path.unshift({ type: 'path', row: r, col: c });
  return path;
}

export function bfs(grid: GridState): AlgoResult {
  const { cells, rows, cols, start, goal } = grid;
  const steps: AlgoStep[] = [];
  const visited = new Set<string>();
  const cameFrom = new Map<string, string>();
  const queue: [number, number][] = [start];
  visited.add(`${start[0]},${start[1]}`);
  let nodesVisited = 0;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    nodesVisited++;
    steps.push({ type: 'visit', row: r, col: c });

    if (r === goal[0] && c === goal[1]) {
      const pathSteps = reconstructPath(cameFrom, goal);
      return { steps: [...steps, ...pathSteps], pathLength: pathSteps.length, nodesVisited, found: true };
    }

    for (const [nr, nc] of neighbors(r, c, rows, cols)) {
      const key = `${nr},${nc}`;
      if (!visited.has(key) && cells[nr][nc] !== 'wall') {
        visited.add(key);
        cameFrom.set(key, `${r},${c}`);
        queue.push([nr, nc]);
        steps.push({ type: 'frontier', row: nr, col: nc });
      }
    }
  }

  return { steps, pathLength: 0, nodesVisited, found: false };
}

export function dfs(grid: GridState): AlgoResult {
  const { cells, rows, cols, start, goal } = grid;
  const steps: AlgoStep[] = [];
  const visited = new Set<string>();
  const cameFrom = new Map<string, string>();
  const stack: [number, number][] = [start];
  let nodesVisited = 0;

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    nodesVisited++;
    steps.push({ type: 'visit', row: r, col: c });

    if (r === goal[0] && c === goal[1]) {
      const pathSteps = reconstructPath(cameFrom, goal);
      return { steps: [...steps, ...pathSteps], pathLength: pathSteps.length, nodesVisited, found: true };
    }

    for (const [nr, nc] of neighbors(r, c, rows, cols)) {
      const nkey = `${nr},${nc}`;
      if (!visited.has(nkey) && cells[nr][nc] !== 'wall') {
        if (!cameFrom.has(nkey)) cameFrom.set(nkey, key);
        stack.push([nr, nc]);
        steps.push({ type: 'frontier', row: nr, col: nc });
      }
    }
  }

  return { steps, pathLength: 0, nodesVisited, found: false };
}

export function dijkstra(grid: GridState): AlgoResult {
  const { cells, rows, cols, start, goal } = grid;
  const steps: AlgoStep[] = [];
  const dist = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>();
  let nodesVisited = 0;

  // Simple priority queue using array
  const pq: { r: number; c: number; d: number }[] = [];
  const startKey = `${start[0]},${start[1]}`;
  dist.set(startKey, 0);
  pq.push({ r: start[0], c: start[1], d: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { r, c, d } = pq.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    nodesVisited++;
    steps.push({ type: 'visit', row: r, col: c });

    if (r === goal[0] && c === goal[1]) {
      const pathSteps = reconstructPath(cameFrom, goal);
      return { steps: [...steps, ...pathSteps], pathLength: pathSteps.length, nodesVisited, found: true };
    }

    for (const [nr, nc] of neighbors(r, c, rows, cols)) {
      const nkey = `${nr},${nc}`;
      if (!visited.has(nkey) && cells[nr][nc] !== 'wall') {
        const nd = d + 1;
        if (!dist.has(nkey) || nd < dist.get(nkey)!) {
          dist.set(nkey, nd);
          cameFrom.set(nkey, key);
          pq.push({ r: nr, c: nc, d: nd });
          steps.push({ type: 'frontier', row: nr, col: nc });
        }
      }
    }
  }

  return { steps, pathLength: 0, nodesVisited, found: false };
}

function manhattan(a: [number, number], b: [number, number]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function astar(grid: GridState): AlgoResult {
  const { cells, rows, cols, start, goal } = grid;
  const steps: AlgoStep[] = [];
  const gScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>();
  let nodesVisited = 0;

  const pq: { r: number; c: number; f: number }[] = [];
  const startKey = `${start[0]},${start[1]}`;
  gScore.set(startKey, 0);
  pq.push({ r: start[0], c: start[1], f: manhattan(start, goal) });

  while (pq.length > 0) {
    pq.sort((a, b) => a.f - b.f);
    const { r, c } = pq.shift()!;
    const key = `${r},${c}`;
    if (visited.has(key)) continue;
    visited.add(key);
    nodesVisited++;
    steps.push({ type: 'visit', row: r, col: c });

    if (r === goal[0] && c === goal[1]) {
      const pathSteps = reconstructPath(cameFrom, goal);
      return { steps: [...steps, ...pathSteps], pathLength: pathSteps.length, nodesVisited, found: true };
    }

    const g = gScore.get(key)!;
    for (const [nr, nc] of neighbors(r, c, rows, cols)) {
      const nkey = `${nr},${nc}`;
      if (!visited.has(nkey) && cells[nr][nc] !== 'wall') {
        const ng = g + 1;
        if (!gScore.has(nkey) || ng < gScore.get(nkey)!) {
          gScore.set(nkey, ng);
          cameFrom.set(nkey, key);
          pq.push({ r: nr, c: nc, f: ng + manhattan([nr, nc], goal) });
          steps.push({ type: 'frontier', row: nr, col: nc });
        }
      }
    }
  }

  return { steps, pathLength: 0, nodesVisited, found: false };
}

export function generateMaze(rows: number, cols: number): CellType[][] {
  // Recursive backtracker maze generation
  const grid: CellType[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'wall' as CellType)
  );

  const stack: [number, number][] = [];
  const startR = 1, startC = 1;
  grid[startR][startC] = 'empty';
  stack.push([startR, startC]);

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const dirs = [...DIRS].sort(() => Math.random() - 0.5);
    let found = false;
    for (const [dr, dc] of dirs) {
      const nr = r + dr * 2, nc = c + dc * 2;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && grid[nr][nc] === 'wall') {
        grid[r + dr][c + dc] = 'empty';
        grid[nr][nc] = 'empty';
        stack.push([nr, nc]);
        found = true;
        break;
      }
    }
    if (!found) stack.pop();
  }

  return grid;
}

export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

export const ALGORITHMS: Record<AlgorithmType, { name: string; fn: (g: GridState) => AlgoResult }> = {
  bfs: { name: 'Breadth First Search', fn: bfs },
  dfs: { name: 'Depth First Search', fn: dfs },
  dijkstra: { name: "Dijkstra's Algorithm", fn: dijkstra },
  astar: { name: 'A* Algorithm', fn: astar },
};
