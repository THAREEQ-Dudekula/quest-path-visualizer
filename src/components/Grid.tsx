import React, { useCallback, useMemo } from 'react';
import { CellType } from '@/lib/pathfinding';

interface GridProps {
  cells: CellType[][];
  onCellMouseDown: (r: number, c: number) => void;
  onCellMouseEnter: (r: number, c: number) => void;
  onMouseUp: () => void;
}

const CELL_CLASS: Record<CellType, string> = {
  empty: 'grid-cell grid-cell-empty',
  wall: 'grid-cell grid-cell-wall',
  start: 'grid-cell grid-cell-start',
  goal: 'grid-cell grid-cell-goal',
  visited: 'grid-cell grid-cell-visited',
  frontier: 'grid-cell grid-cell-frontier',
  path: 'grid-cell grid-cell-path',
};

const GridCell = React.memo(({ type, row, col, onMouseDown, onMouseEnter }: {
  type: CellType;
  row: number;
  col: number;
  onMouseDown: (r: number, c: number) => void;
  onMouseEnter: (r: number, c: number) => void;
}) => (
  <div
    className={CELL_CLASS[type]}
    onMouseDown={() => onMouseDown(row, col)}
    onMouseEnter={() => onMouseEnter(row, col)}
  />
));

GridCell.displayName = 'GridCell';

export function Grid({ cells, onCellMouseDown, onCellMouseEnter, onMouseUp }: GridProps) {
  const cols = cells[0]?.length ?? 0;

  const style = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 0,
  }), [cols]);

  return (
    <div
      className="rounded-lg overflow-hidden border border-border"
      style={style}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {cells.map((row, r) =>
        row.map((type, c) => (
          <GridCell
            key={`${r}-${c}`}
            type={type}
            row={r}
            col={c}
            onMouseDown={onCellMouseDown}
            onMouseEnter={onCellMouseEnter}
          />
        ))
      )}
    </div>
  );
}
