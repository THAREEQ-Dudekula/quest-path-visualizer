import { AlgorithmType, ALGORITHMS } from '@/lib/pathfinding';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Eraser, Shuffle } from 'lucide-react';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  onAlgorithmChange: (a: AlgorithmType) => void;
  speed: number;
  onSpeedChange: (s: number) => void;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  onClearPath: () => void;
  onGenerateMaze: () => void;
}

export function ControlPanel({
  algorithm, onAlgorithmChange,
  speed, onSpeedChange,
  isRunning, isPaused,
  onStart, onPauseResume, onReset, onClearPath, onGenerateMaze,
}: ControlPanelProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-card border border-border">
      <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-wider">Controls</h2>

      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground">Algorithm</label>
        <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)} disabled={isRunning}>
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(ALGORITHMS) as [AlgorithmType, { name: string }][]).map(([key, { name }]) => (
              <SelectItem key={key} value={key}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-muted-foreground">Speed: {speed}ms</label>
        <Slider
          min={1}
          max={100}
          step={1}
          value={[speed]}
          onValueChange={([v]) => onSpeedChange(v)}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>Fast</span><span>Slow</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {!isRunning ? (
          <Button onClick={onStart} className="col-span-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="w-4 h-4 mr-1" /> Start
          </Button>
        ) : (
          <Button onClick={onPauseResume} variant="secondary" className="col-span-2">
            {isPaused ? <><Play className="w-4 h-4 mr-1" /> Resume</> : <><Pause className="w-4 h-4 mr-1" /> Pause</>}
          </Button>
        )}
        <Button onClick={onClearPath} variant="outline" disabled={isRunning} size="sm">
          <Eraser className="w-3 h-3 mr-1" /> Clear Path
        </Button>
        <Button onClick={onReset} variant="outline" disabled={isRunning} size="sm">
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
        <Button onClick={onGenerateMaze} variant="outline" disabled={isRunning} className="col-span-2" size="sm">
          <Shuffle className="w-3 h-3 mr-1" /> Generate Maze
        </Button>
      </div>
    </div>
  );
}
