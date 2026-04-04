import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import {
  Gamepad2, GraduationCap, Swords, Brain, GitCompare, BarChart3,
} from 'lucide-react';

const cards = [
  {
    title: 'Playground',
    description: 'Build mazes and visualize algorithms in real-time',
    icon: Gamepad2,
    route: '/playground',
    gradient: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    title: 'Learning',
    description: 'Deep-dive into how each algorithm works',
    icon: GraduationCap,
    route: '/learning',
    gradient: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    title: 'Challenge',
    description: 'Test your pathfinding skills against the clock',
    icon: Swords,
    route: '/challenge',
    gradient: 'from-destructive/20 to-destructive/5',
    iconColor: 'text-destructive',
  },
  {
    title: 'Quiz Arena',
    description: 'Answer questions and prove your knowledge',
    icon: Brain,
    route: '/quiz',
    gradient: 'from-[hsl(280,60%,50%)]/20 to-[hsl(280,60%,50%)]/5',
    iconColor: 'text-[hsl(280,60%,50%)]',
  },
  {
    title: 'Compare',
    description: 'Run algorithms side-by-side on the same maze',
    icon: GitCompare,
    route: '/compare',
    gradient: 'from-[hsl(170,60%,45%)]/20 to-[hsl(170,60%,45%)]/5',
    iconColor: 'text-[hsl(170,60%,45%)]',
  },
  {
    title: 'Progress',
    description: 'Track your learning journey and stats',
    icon: BarChart3,
    route: '/progress',
    gradient: 'from-primary/20 to-accent/5',
    iconColor: 'text-primary',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { progress } = useAppStore();

  const totalQuizzes = progress.totalQuizzes;
  const bestScore = progress.challengeResults.length > 0
    ? Math.max(...progress.challengeResults.map(r => r.score))
    : 0;
  const accuracy = totalQuizzes > 0 ? Math.round((progress.totalCorrect / totalQuizzes) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-mono font-bold text-foreground tracking-tight">
              <span className="text-primary">⬡</span> AlgoMaze
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-mono mt-3 max-w-xl">
              Learn, Visualize, Practice, Master Pathfinding
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="flex gap-6 mt-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { label: 'Quizzes', value: totalQuizzes },
              { label: 'Accuracy', value: `${accuracy}%` },
              { label: 'Best Score', value: bestScore },
              { label: 'Algorithms', value: 6 },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-mono font-bold text-foreground">{value}</div>
                <div className="text-xs font-mono text-muted-foreground">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.button
              key={card.title}
              onClick={() => navigate(card.route)}
              className={`group relative p-6 rounded-xl border border-border bg-gradient-to-br ${card.gradient} backdrop-blur-sm text-left transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <card.icon className={`w-10 h-10 ${card.iconColor} mb-4 transition-transform group-hover:scale-110`} />
              <h2 className="text-lg font-mono font-bold text-foreground mb-1">{card.title}</h2>
              <p className="text-sm font-mono text-muted-foreground">{card.description}</p>
              <div className="mt-4 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
