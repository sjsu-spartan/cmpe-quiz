export type QuestionType = 'mcq' | 'tf' | 'sa';

export interface Question {
  num: number;
  /** Defaults to 'mcq' when omitted, for backward compatibility with existing data files. */
  type?: QuestionType;
  question: string;
  /** Required for 'mcq'/'tf' questions; a letter -> choice-text map (2 entries for tf, usually 4 for mcq). */
  options?: Record<string, string>;
  /** Required for 'mcq'/'tf' questions; the correct option letter. */
  answer?: string;
  explanation?: string;
  /** Required for 'sa' (short-answer) questions; the worked answer/approach shown on reveal. */
  answerText?: string;
  tier: string;
  optionContext?: Record<string, string>;
  lectureReference?: string;
  keyConcept?: string;
}

export interface FormulaItem {
  name: string;
  latex: string;
}

export interface FormulaSection {
  module: string;
  formulas: FormulaItem[];
}

export interface StudyGuide {
  id: string;
  file: string;
  label: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  questionFile: string;
  formulaFile?: string;
  enableShuffle: boolean;
  studyGuides: StudyGuide[];
}

export interface AppConfig {
  title: string;
  subtitle: string;
  enableBackButton: boolean;
  showFormulas: boolean;
  courses: Course[];
}

export interface Answer {
  qIndex: number;
  question: Question;
  selected: string;
  correct: string;
  isCorrect: boolean;
  timeSpent: number;
}

export type QuizMode = 'all' | 'quick' | 'tier' | 'custom';

export interface QuizState {
  courseId: string;
  questions: Question[];
  currentIndex: number;
  score: number;
  answered: number;
  answers: Answer[];
  mode: QuizMode;
  moduleFilter: string | null;
}

export type Screen = 'course' | 'mode' | 'quiz' | 'summary';
