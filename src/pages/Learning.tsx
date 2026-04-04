import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { algorithmData } from '@/data/algorithmData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Learning() {
  const navigate = useNavigate();
  const algorithms = Object.values(algorithmData);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-mono font-bold text-foreground">
            <span className="text-primary">📚</span> Learning Mode
          </h1>
          <p className="text-xs font-mono text-muted-foreground">Select an algorithm to learn</p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
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
              <div className="text-3xl mb-3">{algo.icon}</div>
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
      </div>
    </div>
  );
}
