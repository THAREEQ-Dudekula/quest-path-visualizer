import { AlgorithmType, ALGORITHMS } from '@/lib/pathfinding';
import { Timer, MapPin, Route, Cpu } from 'lucide-react';

interface MetricsPanelProps {
  algorithm: AlgorithmType | null;
  nodesVisited: number;
  pathLength: number;
  timeTaken: number;
  found: boolean | null;
}

export function MetricsPanel({ algorithm, nodesVisited, pathLength, timeTaken, found }: MetricsPanelProps) {
  if (found === null) {
    return (
      <div className="p-4 rounded-lg bg-card border border-border">
        <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metrics</h2>
        <p className="text-xs text-muted-foreground font-mono">Run an algorithm to see metrics</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-3">Metrics</h2>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-mono">
          <Cpu className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">Algorithm:</span>
          <span className="text-foreground">{algorithm ? ALGORITHMS[algorithm].name : '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <MapPin className="w-4 h-4 text-[hsl(var(--cell-visited))]" />
          <span className="text-muted-foreground">Nodes visited:</span>
          <span className="text-foreground">{nodesVisited}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <Route className="w-4 h-4 text-[hsl(var(--cell-path))]" />
          <span className="text-muted-foreground">Path length:</span>
          <span className="text-foreground">{found ? pathLength : 'No path'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <Timer className="w-4 h-4 text-accent" />
          <span className="text-muted-foreground">Time:</span>
          <span className="text-foreground">{timeTaken.toFixed(1)}ms</span>
        </div>
        {found === false && (
          <div className="mt-2 p-2 rounded bg-destructive/10 border border-destructive/30 text-xs font-mono text-destructive">
            No path found to goal
          </div>
        )}
      </div>
    </div>
  );
}
