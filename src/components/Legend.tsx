export function Legend() {
  const items = [
    { label: 'Empty', className: 'grid-cell-empty' },
    { label: 'Wall', className: 'grid-cell-wall' },
    { label: 'Start', className: 'grid-cell-start' },
    { label: 'Goal', className: 'grid-cell-goal' },
    { label: 'Visited', className: 'grid-cell-visited' },
    { label: 'Frontier', className: 'grid-cell-frontier' },
    { label: 'Path', className: 'grid-cell-path' },
  ];

  return (
    <div className="p-4 rounded-lg bg-card border border-border">
      <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider mb-3">Legend</h2>
      <div className="grid grid-cols-2 gap-2">
        {items.map(({ label, className }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-sm ${className}`} />
            <span className="text-xs font-mono text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
