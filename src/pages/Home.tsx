import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Gamepad2, Swords, Brain, GitCompare, Code2,
} from 'lucide-react';

const cards = [
  {
    title: 'Learn',
    description: 'Master how each algorithm thinks and explores',
    icon: GraduationCap,
    route: '/learning',
    gradient: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
  {
    title: 'Playground',
    description: 'Build mazes and visualize algorithms in real-time',
    icon: Gamepad2,
    route: '/playground',
    gradient: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    title: "Knight's Challenge",
    description: 'Guide the knight through the maze to rescue the princess',
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
    title: 'Coding Lab',
    description: 'Practice implementing pathfinding algorithms',
    icon: Code2,
    route: '/coding-lab',
    gradient: 'from-primary/20 to-accent/5',
    iconColor: 'text-primary',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* CS-themed logo */}
            <div className="inline-flex items-center justify-center mb-4">
              <span className="text-4xl md:text-5xl font-mono font-bold text-muted-foreground/30">&lt;/&gt;</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-mono font-bold text-foreground tracking-tight">
              Algo<span className="text-primary">Maze</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-mono mt-3 max-w-lg mx-auto">
              Master algorithms through code, logic, and challenge.
            </p>
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
              transition={{ delay: 0.08 * i, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <card.icon className={`w-8 h-8 ${card.iconColor} mb-3`} />
              <h2 className="text-lg font-mono font-bold text-foreground mb-1">{card.title}</h2>
              <p className="text-sm font-mono text-muted-foreground">{card.description}</p>
              <div className="mt-4 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Enter →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
