export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  algorithm: string;
  type: 'mcq' | 'true-false' | 'predict';
}

export interface ChallengeResult {
  id: string;
  date: string;
  score: number;
  difficulty: Difficulty;
  timeSeconds: number;
  pathAccuracy: number;
}

export interface AlgorithmProgress {
  lessonsViewed: number;
  quizzesCompleted: number;
  quizAccuracy: number;
  bestScore: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface UserProgress {
  totalQuizzes: number;
  totalCorrect: number;
  challengeResults: ChallengeResult[];
  algorithmProgress: Record<string, AlgorithmProgress>;
  lastActivity: string;
  streak: number;
  badges: string[];
}
