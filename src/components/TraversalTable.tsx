import React from 'react';

export interface TraversalRow {
  step: number;
  row: number;
  col: number;
  nodeType: string;
  parent: string;
  cost?: number;
  heuristic?: number;
  status: string;
}

interface TraversalTableProps {
  data: TraversalRow[];
  className?: string;
}

export const TraversalTable = React.memo(function TraversalTable({ data, className = '' }: TraversalTableProps) {
  return (
    <div className={`overflow-auto rounded-lg border border-border ${className}`}>
      <table className="w-full text-xs font-mono">
        <thead className="bg-card sticky top-0 z-10">
          <tr>
            {['#', 'Node', 'Row', 'Col', 'Parent', 'Cost', 'H', 'Status'].map(h => (
              <th key={h} className="px-2 py-2 text-left text-muted-foreground font-semibold border-b border-border whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className={`border-b border-border/30 ${i === data.length - 1 ? 'bg-primary/10' : ''}`}>
              <td className="px-2 py-1 text-foreground">{row.step}</td>
              <td className="px-2 py-1 text-foreground">({row.row},{row.col})</td>
              <td className="px-2 py-1 text-foreground">{row.row}</td>
              <td className="px-2 py-1 text-foreground">{row.col}</td>
              <td className="px-2 py-1 text-muted-foreground">{row.parent}</td>
              <td className="px-2 py-1 text-foreground">{row.cost ?? '—'}</td>
              <td className="px-2 py-1 text-foreground">{row.heuristic ?? '—'}</td>
              <td className="px-2 py-1 text-foreground">{row.status}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={8} className="px-3 py-4 text-center text-muted-foreground">Press Start or Step to begin</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
});
