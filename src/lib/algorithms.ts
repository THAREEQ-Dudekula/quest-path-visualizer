import type { GridState, AlgoResult, AlgoStep } from './pathfinding';

const DIRS: [number, number][] = [
  [0, 1], [1, 0], [0, -1], [-1, 0],
];

function neighbors(r: number, c: number, rows: number, cols: number): [number, number][] {
  return DIRS
    .map(([dr, dc]) => [r + dr, c + dc] as [number, number])
    .filter(([nr, nc]) => nr >= 0 && nr < rows && nc >= 0 && nc < cols);
}

function reconstructPath(cameFrom: Map<string, string>, goal: [number, number]): AlgoStep[] {
  const path: AlgoStep[] = [];
  let key = `${goal[0]},${goal[1]}`;
  while (cameFrom.has(key)) {
    const [r, c] = key.split(',').map(Number);
    path.unshift({ type: 'path', row: r, col: c });
    key = cameFrom.get(key)!;
  }
  const [r, c] = key.split(',').map(Number);
  path.unshift({ type: 'path', row: r, col: c });
  return path;
}

function manhattan(a: [number, number], b: [number, number]) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function greedy(grid: GridState): AlgoResult {
  const { cells, rows, cols, start, goal } = grid;
  const steps: AlgoStep[] = [];
  const cameFrom = new Map<string, string>();
  const visited = new Set<string>();
  let nodesVisited = 0;

  const pq: { r: number; c: number; h: number }[] = [];
  pq.push({ r: start[0], c: start[1], h: manhattan(start, goal) });

  while (pq.length > 0) {
    pq.sort((a, b) => a.h - b.h);
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

    for (const [nr, nc] of neighbors(r, c, rows, cols)) {
      const nkey = `${nr},${nc}`;
      if (!visited.has(nkey) && cells[nr][nc] !== 'wall') {
        if (!cameFrom.has(nkey)) cameFrom.set(nkey, key);
        pq.push({ r: nr, c: nc, h: manhattan([nr, nc], goal) });
        steps.push({ type: 'frontier', row: nr, col: nc });
      }
    }
  }

  return { steps, pathLength: 0, nodesVisited, found: false };
}

export function bidirectional(grid: GridState): AlgoResult {
  const { cells, rows, cols, start, goal } = grid;
  const steps: AlgoStep[] = [];
  const visitedF = new Set<string>();
  const visitedB = new Set<string>();
  const cameFromF = new Map<string, string>();
  const cameFromB = new Map<string, string>();
  const queueF: [number, number][] = [start];
  const queueB: [number, number][] = [goal];
  visitedF.add(`${start[0]},${start[1]}`);
  visitedB.add(`${goal[0]},${goal[1]}`);
  let nodesVisited = 0;

  while (queueF.length > 0 || queueB.length > 0) {
    // Forward step
    if (queueF.length > 0) {
      const [r, c] = queueF.shift()!;
      nodesVisited++;
      steps.push({ type: 'visit', row: r, col: c });
      const key = `${r},${c}`;

      if (visitedB.has(key)) {
        const pathF = reconstructHalf(cameFromF, key);
        const pathB = reconstructHalfReverse(cameFromB, key);
        const pathSteps = [...pathF, ...pathB].map(([pr, pc]) => ({ type: 'path' as const, row: pr, col: pc }));
        return { steps: [...steps, ...pathSteps], pathLength: pathSteps.length, nodesVisited, found: true };
      }

      for (const [nr, nc] of neighbors(r, c, rows, cols)) {
        const nkey = `${nr},${nc}`;
        if (!visitedF.has(nkey) && cells[nr][nc] !== 'wall') {
          visitedF.add(nkey);
          cameFromF.set(nkey, key);
          queueF.push([nr, nc]);
          steps.push({ type: 'frontier', row: nr, col: nc });
        }
      }
    }

    // Backward step
    if (queueB.length > 0) {
      const [r, c] = queueB.shift()!;
      nodesVisited++;
      steps.push({ type: 'visit', row: r, col: c });
      const key = `${r},${c}`;

      if (visitedF.has(key)) {
        const pathF = reconstructHalf(cameFromF, key);
        const pathB = reconstructHalfReverse(cameFromB, key);
        const pathSteps = [...pathF, ...pathB].map(([pr, pc]) => ({ type: 'path' as const, row: pr, col: pc }));
        return { steps: [...steps, ...pathSteps], pathLength: pathSteps.length, nodesVisited, found: true };
      }

      for (const [nr, nc] of neighbors(r, c, rows, cols)) {
        const nkey = `${nr},${nc}`;
        if (!visitedB.has(nkey) && cells[nr][nc] !== 'wall') {
          visitedB.add(nkey);
          cameFromB.set(nkey, key);
          queueB.push([nr, nc]);
          steps.push({ type: 'frontier', row: nr, col: nc });
        }
      }
    }
  }

  return { steps, pathLength: 0, nodesVisited, found: false };
}

function reconstructHalf(cameFrom: Map<string, string>, meetKey: string): [number, number][] {
  const path: [number, number][] = [];
  let key = meetKey;
  while (cameFrom.has(key)) {
    const [r, c] = key.split(',').map(Number);
    path.unshift([r, c]);
    key = cameFrom.get(key)!;
  }
  const [r, c] = key.split(',').map(Number);
  path.unshift([r, c]);
  return path;
}

function reconstructHalfReverse(cameFrom: Map<string, string>, meetKey: string): [number, number][] {
  const path: [number, number][] = [];
  let key = meetKey;
  // Skip the meet node itself (already in forward path)
  while (cameFrom.has(key)) {
    key = cameFrom.get(key)!;
    const [r, c] = key.split(',').map(Number);
    path.push([r, c]);
  }
  return path;
}
