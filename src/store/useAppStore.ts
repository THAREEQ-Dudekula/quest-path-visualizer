import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProgress, ChallengeResult } from '@/types';

interface AppState {
  progress: UserProgress;
  soundEnabled: boolean;
  toggleSound: () => void;
  addQuizResult: (algorithm: string, correct: boolean) => void;
  addChallengeResult: (result: ChallengeResult) => void;
  markLessonViewed: (algorithm: string) => void;
  resetProgress: () => void;
}

const defaultProgress: UserProgress = {
  totalQuizzes: 0,
  totalCorrect: 0,
  challengeResults: [],
  algorithmProgress: {},
  lastActivity: new Date().toISOString(),
  streak: 0,
  badges: [],
};

function ensureAlgo(progress: UserProgress, algo: string): UserProgress {
  if (!progress.algorithmProgress[algo]) {
    progress.algorithmProgress[algo] = {
      lessonsViewed: 0,
      quizzesCompleted: 0,
      quizAccuracy: 0,
      bestScore: 0,
    };
  }
  return progress;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      progress: defaultProgress,
      soundEnabled: false,
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      addQuizResult: (algorithm, correct) =>
        set((s) => {
          const p = { ...s.progress };
          ensureAlgo(p, algorithm);
          p.totalQuizzes++;
          if (correct) p.totalCorrect++;
          const ap = { ...p.algorithmProgress[algorithm] };
          ap.quizzesCompleted++;
          ap.quizAccuracy = Math.round(
            ((ap.quizAccuracy * (ap.quizzesCompleted - 1) + (correct ? 100 : 0)) /
              ap.quizzesCompleted)
          );
          p.algorithmProgress[algorithm] = ap;
          p.lastActivity = new Date().toISOString();
          return { progress: p };
        }),
      addChallengeResult: (result) =>
        set((s) => {
          const p = { ...s.progress };
          p.challengeResults = [...p.challengeResults, result];
          p.lastActivity = new Date().toISOString();
          return { progress: p };
        }),
      markLessonViewed: (algorithm) =>
        set((s) => {
          const p = { ...s.progress };
          ensureAlgo(p, algorithm);
          p.algorithmProgress[algorithm] = {
            ...p.algorithmProgress[algorithm],
            lessonsViewed: p.algorithmProgress[algorithm].lessonsViewed + 1,
          };
          p.lastActivity = new Date().toISOString();
          return { progress: p };
        }),
      resetProgress: () => set({ progress: defaultProgress }),
    }),
    { name: 'algomaze-progress' }
  )
);
