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
  /** Point value for this question within a specific mock-exam paper. Only set on
   * questions loaded from an exams-<course>.json paper; absent for the regular
   * practice-question banks, which score by count, not points. */
  points?: number;
}

export interface ExamSection {
  type: QuestionType;
  label: string;
  pointsEach: number;
  questions: Question[];
}

export interface ExamPaper {
  paperNum: number;
  totalPoints: number;
  totalQuestions: number;
  postMidtermShare: number;
  sections: ExamSection[];
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
  /** Path to an exams-<course>.json file of pre-generated mock-exam papers
   * (see tools/scripts/generate_mock_exams.py in the spartan-msai repo).
   * Omit for courses without mock exams; the Mock Exam UI section is hidden. */
  examFile?: string;
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
  /** Free-text response typed during an exam-mode short-answer question. Only
   * set for exam mode; practice-mode SA uses the immediate self-grade flow
   * instead and never populates this. */
  response?: string;
  /** For exam-mode short-answer questions: true/false once self-graded on the
   * Results screen, undefined/null while awaiting grading. isCorrect stays
   * false until this is set, so the point total only reflects self-graded SA
   * answers, not unreviewed ones. */
  pendingSelfGrade?: boolean;
}

export type QuizMode = 'all' | 'quick' | 'tier' | 'part' | 'custom' | 'exam';

export interface QuizState {
  courseId: string;
  questions: Question[];
  currentIndex: number;
  score: number;
  answered: number;
  answers: Answer[];
  mode: QuizMode;
  moduleFilter: string | null;
  /** Set only when a quiz was started with a Part + Tier combo filter (mode 'part'
   * with an additional tier narrowing); null otherwise. */
  tierFilter: string | null;
}

export type Screen = 'course' | 'mode' | 'quiz' | 'summary';
