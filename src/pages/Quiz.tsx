import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { quizQuestions } from '@/data/algorithmData';
import { useAppStore } from '@/store/useAppStore';

export default function Quiz() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const algoFilter = searchParams.get('algo');
  const addQuizResult = useAppStore((s) => s.addQuizResult);

  const questions = useMemo(() => {
    const filtered = algoFilter ? quizQuestions.filter(q => q.algorithm === algoFilter) : quizQuestions;
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [algoFilter]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    const correct = idx === current.correctIndex;
    if (correct) setCorrectCount(c => c + 1);
    addQuizResult(current.algorithm, correct);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">
            <span className="text-[hsl(280,60%,50%)]">🧠</span> Quiz Arena
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            {algoFilter ? `${algoFilter.toUpperCase()} Quiz` : 'All Algorithms'}
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {finished ? (
          <motion.div
            className="text-center space-y-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-mono font-bold text-foreground">Quiz Complete!</h2>
            <div className="text-4xl font-mono font-bold text-primary">
              {correctCount} / {questions.length}
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              {correctCount === questions.length ? 'Perfect score! 🏆' :
               correctCount >= questions.length * 0.7 ? 'Great job! 🌟' : 'Keep practicing! 💪'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => { setCurrentIndex(0); setSelected(null); setShowResult(false); setCorrectCount(0); setFinished(false); }}>
                Retry
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {currentIndex + 1}/{questions.length}
              </span>
            </div>

            {/* Question */}
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 rounded-xl bg-card border border-border"
            >
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
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`w-full p-4 rounded-lg border text-left font-mono text-sm text-foreground transition-all ${optClass}`}
                      disabled={showResult}
                    >
                      <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                      {opt}
                      {showResult && i === current.correctIndex && <CheckCircle2 className="w-4 h-4 text-primary inline ml-2" />}
                      {showResult && i === selected && i !== current.correctIndex && <XCircle className="w-4 h-4 text-destructive inline ml-2" />}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-secondary text-xs font-mono text-muted-foreground"
                >
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
