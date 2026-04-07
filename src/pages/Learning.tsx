import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { algorithmData } from '@/data/algorithmData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Learning() {
  const navigate = useNavigate();
  const algorithms = Object.values(algorithmData);
  const [tab, setTab] = useState<'learn' | 'practice'>('learn');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">Learning Mode</h1>
          <p className="text-xs font-mono text-muted-foreground">Select an algorithm to learn or practice</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          <Button variant={tab === 'learn' ? 'default' : 'outline'} size="sm" onClick={() => setTab('learn')}>
            Learn
          </Button>
          <Button variant={tab === 'practice' ? 'default' : 'outline'} size="sm" onClick={() => setTab('practice')}>
            Practice
          </Button>
        </div>

        {tab === 'learn' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {algorithms.map((algo, i) => (
              <motion.button
                key={algo.id}
                onClick={() => navigate(`/learning/${algo.id}`)}
                className="group relative p-6 rounded-xl border border-border bg-card text-left transition-all hover:border-primary/50 hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-base font-mono font-bold text-foreground mb-1">{algo.name}</h2>
                <p className="text-xs font-mono text-muted-foreground mb-3">{algo.description}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {algo.dataStructure}
                  </span>
                  {algo.guaranteesShortestPath && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                      Optimal
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <PracticeTab />
        )}
      </div>
    </div>
  );
}

function PracticeTab() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const practiceQuestions = [
    { id: 'p1', question: 'A maze has no weights. Which algorithm guarantees the shortest path with the least overhead?', options: ['DFS', 'BFS', 'Dijkstra', 'Greedy'], correct: 'BFS' },
    { id: 'p2', question: 'You need to find the shortest path in a weighted graph. Which algorithm should you use?', options: ['BFS', 'DFS', 'Dijkstra', 'Bidirectional'], correct: 'Dijkstra' },
    { id: 'p3', question: 'Which algorithm explores as deep as possible before backtracking?', options: ['BFS', 'A*', 'DFS', 'Greedy'], correct: 'DFS' },
    { id: 'p4', question: 'Which formula does A* use to evaluate nodes?', options: ['f = g', 'f = h', 'f = g + h', 'f = g × h'], correct: 'f = g + h' },
    { id: 'p5', question: 'Which search reduces space by searching from both ends?', options: ['DFS', 'A*', 'Greedy', 'Bidirectional'], correct: 'Bidirectional' },
    { id: 'p6', question: 'Greedy Best-First Search guarantees the shortest path. True or False?', options: ['True', 'False'], correct: 'False' },
    { id: 'p7', question: 'What is the time complexity of BFS on a graph?', options: ['O(V)', 'O(E)', 'O(V + E)', 'O(V²)'], correct: 'O(V + E)' },
    { id: 'p8', question: 'Order these BFS steps: 1) Dequeue node 2) Check if goal 3) Enqueue neighbors 4) Mark visited', options: ['1→2→4→3', '1→4→2→3', '4→1→2→3', '1→2→3→4'], correct: '1→2→4→3' },
  ];

  const correctCount = practiceQuestions.filter(q => answers[q.id] === q.correct).length;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-card border border-border">
        <h3 className="text-sm font-mono font-bold text-foreground mb-1">Practice Challenges</h3>
        <p className="text-xs font-mono text-muted-foreground">Test your understanding with interactive questions</p>
      </div>

      {practiceQuestions.map((q, i) => (
        <motion.div
          key={q.id}
          className="p-4 rounded-lg bg-card border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * i }}
        >
          <div className="text-xs font-mono text-muted-foreground mb-1">Question {i + 1}</div>
          <p className="text-sm font-mono font-bold text-foreground mb-3">{q.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map(opt => {
              let cls = 'border-border hover:border-primary/50';
              if (showResults) {
                if (opt === q.correct) cls = 'border-primary bg-primary/10';
                else if (answers[q.id] === opt && opt !== q.correct) cls = 'border-destructive bg-destructive/10';
              } else if (answers[q.id] === opt) {
                cls = 'border-primary bg-primary/10';
              }
              return (
                <button
                  key={opt}
                  onClick={() => !showResults && setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                  className={`p-2 rounded-lg border text-xs font-mono text-foreground transition-all ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </motion.div>
      ))}

      <div className="flex gap-3 justify-center">
        <Button onClick={() => setShowResults(true)} disabled={showResults}>Check Answers</Button>
        {showResults && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono font-bold text-primary">{correctCount}/{practiceQuestions.length}</span>
            <Button variant="outline" size="sm" onClick={() => { setAnswers({}); setShowResults(false); }}>Retry</Button>
          </div>
        )}
      </div>
    </div>
  );
}
