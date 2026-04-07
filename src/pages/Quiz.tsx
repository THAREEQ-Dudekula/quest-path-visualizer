import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/data/algorithmData';
import { useAppStore } from '@/store/useAppStore';

const QUIZ_SIZE = 10;
const HISTORY_KEY = 'algomaze-quiz-history';
const COOLDOWN = 15; // don't repeat within last N questions

function getHistory(): string[] {
  try {
    return JSON.parse(sessionStorage.getItem(HISTORY_KEY) || '[]');
  } catch { return []; }
}
function addToHistory(ids: string[]) {
  const h = getHistory();
  const updated = [...h, ...ids].slice(-200);
  sessionStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions(algoFilter: string | null, weakTopics: Record<string, number>) {
  const history = getHistory();
  const recentIds = new Set(history.slice(-COOLDOWN));

  let pool = algoFilter
    ? quizQuestions.filter(q => q.algorithm === algoFilter)
    : quizQuestions;

  // Separate into fresh and stale
  const fresh = pool.filter(q => !recentIds.has(q.id));
  const stale = pool.filter(q => recentIds.has(q.id));

  // Weight fresh questions by weak topics
  const weighted = fresh.map(q => ({
    q,
    weight: 1 + (weakTopics[q.algorithm] || 0),
  }));

  // Weighted shuffle
  const selected: typeof quizQuestions = [];
  const remaining = [...weighted];
  while (selected.length < QUIZ_SIZE && remaining.length > 0) {
    const totalWeight = remaining.reduce((s, w) => s + w.weight, 0);
    let r = Math.random() * totalWeight;
    let idx = 0;
    for (let i = 0; i < remaining.length; i++) {
      r -= remaining[i].weight;
      if (r <= 0) { idx = i; break; }
    }
    selected.push(remaining[idx].q);
    remaining.splice(idx, 1);
  }

  // Fill from stale if needed
  if (selected.length < QUIZ_SIZE) {
    const extra = shuffleArray(stale).slice(0, QUIZ_SIZE - selected.length);
    selected.push(...extra);
  }

  // Shuffle answer options for each question
  return selected.map(q => {
    const indices = q.options.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    return {
      ...q,
      options: shuffled.map(i => q.options[i]),
      correctIndex: shuffled.indexOf(q.correctIndex),
    };
  });
}

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const algoFilter = searchParams.get('algo');
  const addQuizResult = useAppStore((s) => s.addQuizResult);
  const progress = useAppStore((s) => s.progress);

  // Compute weak topics from progress
  const weakTopics = useMemo(() => {
    const wt: Record<string, number> = {};
    for (const [algo, ap] of Object.entries(progress.algorithmProgress)) {
      if (ap.quizzesCompleted > 0 && ap.quizAccuracy < 70) {
        wt[algo] = Math.max(1, Math.round((70 - ap.quizAccuracy) / 10));
      }
    }
    return wt;
  }, [progress.algorithmProgress]);

  const [questions, setQuestions] = useState(() => pickQuestions(algoFilter, weakTopics));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const current = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === current.correctIndex;
    if (correct) {
      setCorrectCount(c => c + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    addQuizResult(current.algorithm, correct);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      addToHistory(questions.map(q => q.id));
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const retryWithNewSet = () => {
    const newQ = pickQuestions(algoFilter, weakTopics);
    setQuestions(newQ);
    setCurrentIndex(0);
    setSelected(null);
    setShowResult(false);
    setCorrectCount(0);
    setFinished(false);
    setStreak(0);
    setBestStreak(0);
  };

  // Determine weak topics after finish
  const weakAlgos = useMemo(() => {
    if (!finished) return [];
    const missed: Record<string, number> = {};
    questions.forEach((q, i) => {
      // We don't track per-question result here, but we can infer from progress
    });
    return Object.entries(progress.algorithmProgress)
      .filter(([, ap]) => ap.quizAccuracy < 60 && ap.quizzesCompleted > 0)
      .map(([algo]) => algo)
      .slice(0, 3);
  }, [finished, progress.algorithmProgress]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground font-mono">No quiz questions available.</p>
          <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
        </div>
      </div>
    );
  }

  const mastery = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">Quiz Arena</h1>
          <p className="text-xs font-mono text-muted-foreground">
            {algoFilter ? `${algoFilter.toUpperCase()} Quiz` : 'All Algorithms'} · {questions.length} questions
          </p>
        </div>
        {streak > 1 && (
          <div className="ml-auto text-sm font-mono text-accent font-bold">{streak} streak</div>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {finished ? (
          <motion.div className="text-center space-y-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h2 className="text-2xl font-mono font-bold text-foreground">Quiz Complete!</h2>
            <div className="text-4xl font-mono font-bold text-primary">{correctCount} / {questions.length}</div>
            <div className="text-sm font-mono text-muted-foreground">Mastery: {mastery}% · Best streak: {bestStreak}</div>
            <p className="text-sm font-mono text-muted-foreground">
              {mastery === 100 ? 'Perfect score!' :
               mastery >= 70 ? 'Great job!' : 'Keep practicing!'}
            </p>
            {weakAlgos.length > 0 && (
              <div className="text-xs font-mono text-muted-foreground">
                Suggested review: {weakAlgos.map(a => (
                  <Button key={a} variant="link" size="sm" className="text-xs px-1" onClick={() => navigate(`/learning/${a}`)}>
                    {a.toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={retryWithNewSet}>New Quiz</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground">{currentIndex + 1}/{questions.length}</span>
            </div>

            <motion.div key={current.id + '-' + currentIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl bg-card border border-border">
              <div className="text-xs font-mono text-muted-foreground mb-2 uppercase">{current.algorithm} · {current.type}</div>
              <h2 className="text-lg font-mono font-bold text-foreground mb-6">{current.question}</h2>

              <div className="space-y-3">
                {current.options.map((opt, i) => {
                  let optClass = 'border-border hover:border-primary/50';
                  if (showResult) {
                    if (i === current.correctIndex) optClass = 'border-primary bg-primary/10';
                    else if (i === selected) optClass = 'border-destructive bg-destructive/10';
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(i)}
                      className={`w-full p-4 rounded-lg border text-left font-mono text-sm text-foreground transition-all ${optClass}`}
                      disabled={showResult}
                    >
                      <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                      {showResult && i === current.correctIndex && <CheckCircle2 className="w-4 h-4 text-primary inline ml-2" />}
                      {showResult && i === selected && i !== current.correctIndex && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-3 rounded-lg bg-secondary text-xs font-mono text-muted-foreground">
                  {current.explanation}
                </motion.div>
              )}
            </motion.div>

            {showResult && (
              <div className="flex justify-end">
                <Button onClick={handleNext}>
                  {currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
