import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { algorithmData } from '@/data/algorithmData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Progress() {
  const navigate = useNavigate();
  const { progress, resetProgress } = useAppStore();

  const totalQuizzes = progress.totalQuizzes;
  const accuracy = totalQuizzes > 0 ? Math.round((progress.totalCorrect / totalQuizzes) * 100) : 0;
  const bestChallenge = progress.challengeResults.length > 0
    ? Math.max(...progress.challengeResults.map(r => r.score)) : 0;
  const totalChallenges = progress.challengeResults.length;

  const algoKeys = Object.keys(algorithmData);
  const barData = algoKeys.map(k => ({
    name: algorithmData[k].shortName,
    quizzes: progress.algorithmProgress[k]?.quizzesCompleted || 0,
    accuracy: progress.algorithmProgress[k]?.quizAccuracy || 0,
  }));

  const radarData = algoKeys.map(k => ({
    subject: algorithmData[k].shortName,
    mastery: Math.min(100, (progress.algorithmProgress[k]?.quizzesCompleted || 0) * 10 + (progress.algorithmProgress[k]?.quizAccuracy || 0) / 2),
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-mono font-bold text-foreground">
            <span className="text-primary">📊</span> Progress Analytics
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={resetProgress}>
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Quizzes', value: totalQuizzes, color: 'text-primary' },
            { label: 'Accuracy', value: `${accuracy}%`, color: 'text-accent' },
            { label: 'Best Score', value: bestChallenge, color: 'text-destructive' },
            { label: 'Challenges', value: totalChallenges, color: 'text-[hsl(280,60%,50%)]' },
          ].map(({ label, value, color }) => (
            <motion.div
              key={label}
              className="p-4 rounded-xl bg-card border border-border text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-mono font-semibold text-muted-foreground mb-4">Quiz Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                <Tooltip contentStyle={{ background: 'hsl(220, 18%, 13%)', border: '1px solid hsl(220, 15%, 20%)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="quizzes" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-mono font-semibold text-muted-foreground mb-4">Algorithm Mastery</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220, 15%, 20%)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'hsl(215, 15%, 55%)' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar dataKey="mastery" stroke="hsl(160, 60%, 45%)" fill="hsl(160, 60%, 45%)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Challenge History */}
        {progress.challengeResults.length > 0 && (
          <div className="p-4 rounded-xl bg-card border border-border">
            <h3 className="text-sm font-mono font-semibold text-muted-foreground mb-3">Challenge History</h3>
            <div className="overflow-auto max-h-64">
              <table className="w-full text-xs font-mono">
                <thead className="sticky top-0 bg-card">
                  <tr>
                    {['Date', 'Difficulty', 'Score', 'Time', 'Accuracy'].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-muted-foreground border-b border-border">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...progress.challengeResults].reverse().map((r) => (
                    <tr key={r.id} className="border-b border-border/30">
                      <td className="px-3 py-1.5 text-foreground">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-3 py-1.5 text-foreground capitalize">{r.difficulty}</td>
                      <td className="px-3 py-1.5 text-primary font-bold">{r.score}</td>
                      <td className="px-3 py-1.5 text-foreground">{r.timeSeconds}s</td>
                      <td className="px-3 py-1.5 text-foreground">{r.pathAccuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
