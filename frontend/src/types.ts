export interface StudyItem {
  id: string;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  mastery?: 'unseen' | 'cursed' | 'haunted' | 'purified';
  starred?: boolean;
}

export interface DocInfo {
  docId: string;
  title: string;
  pageCount?: number;
  wordCount?: number;
  summary?: string;
  uploadedAt: string;
}

export interface TopicMastery {
  topic: string;
  attempts: number;
  correct: number;
  wrong: number;
  accuracy: number;
  status: 'cursed' | 'haunted' | 'purified'; // cursed: < 50%, haunted: 50-79%, purified: >= 80%
}

export type StudyMode = 'upload' | 'flashcards' | 'quiz' | 'analytics';

export interface AnswerPayload {
  docId: string;
  topic: string;
  correct: boolean;
}

export interface GeneratePayload {
  docId: string;
  mode: 'quiz' | 'flashcards';
}

export interface UserStats {
  streak: number;
  totalCardsReviewed: number;
  totalQuizzesTaken: number;
  correctAnswers: number;
  wrongAnswers: number;
  cursedTopicsPurged: number;
}
