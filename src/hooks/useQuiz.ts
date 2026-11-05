import { useState, useCallback } from 'react';
import type { Question, Answer, QuizState, QuizMode, ExamPaper } from '../types';
import { shuffle } from '../utils/shuffle';

const initial: Omit<QuizState, 'courseId'> = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: 0,
  answers: [],
  mode: 'all',
  moduleFilter: null,
  tierFilter: null,
};

export function useQuiz() {
  const [courseId, setCourseId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [mode, setMode] = useState<QuizMode>('all');
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  /** Set only for 'exam' mode; carries the paper's metadata (number, total points,
   * section breakdown) for the exam-style header and point-weighted summary screen. */
  const [examPaper, setExamPaper] = useState<ExamPaper | null>(null);

  const initQuiz = useCallback((
    cId: string,
    allQ: Question[],
    count: number,
    quizMode: QuizMode,
    shouldShuffle: boolean,
    tier?: string | null,
    part?: string | null,
  ) => {
    // First narrow down to the relevant subset of questions: an exact part/tier/
    // part+tier filter match, or a random sample of `count` questions (in original
    // order) when no filter is given.
    let subset: Question[];
    if (part && tier) {
      subset = allQ.filter((q) => q.lectureReference === part && q.tier === tier);
    } else if (part) {
      subset = allQ.filter((q) => q.lectureReference === part);
    } else if (tier) {
      subset = allQ.filter((q) => q.tier === tier);
    } else if (count >= allQ.length) {
      subset = [...allQ];
    } else {
      const indices = shuffle([...Array(allQ.length).keys()]).slice(0, count);
      indices.sort((a, b) => a - b);
      subset = indices.map((i) => allQ[i]);
    }
    // The shuffle toggle then controls only the presentation order of that subset,
    // applied uniformly across every mode (part/tier filters previously ignored
    // it and always stayed in the data file's original order).
    const selected = shouldShuffle ? shuffle(subset) : subset;
    setCourseId(cId);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setAnswers([]);
    setMode(quizMode);
    setModuleFilter(part ?? tier ?? null);
    setTierFilter(part ? tier ?? null : null);
    setExamPaper(null);
    setStartTime(Date.now());
  }, []);

  /** Starts a fixed-composition mock-exam paper (sections in their generated order,
   * optionally shuffled within the full question list). Unlike initQuiz, there is no
   * subset selection: the paper's questions are used exactly as generated. */
  const initExam = useCallback((cId: string, paper: ExamPaper, shouldShuffle: boolean) => {
    const allQ = paper.sections.flatMap((s) => s.questions);
    const selected = shouldShuffle ? shuffle(allQ) : allQ;
    setCourseId(cId);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setAnswers([]);
    setMode('exam');
    setModuleFilter(`Mock Exam ${paper.paperNum}`);
    setTierFilter(null);
    setExamPaper(paper);
    setStartTime(Date.now());
  }, []);

  /** Replaces any existing answer for this question index with a new one (so revisiting
   * an already-answered question via Prev/Next and picking a different option corrects
   * the record instead of appending a duplicate), then recomputes score/answered from
   * the resulting answers array so counts always match the actual number of distinct
   * questions answered. */
  const recordAnswer = useCallback((newAnswer: Answer) => {
    setAnswers((prev) => {
      const next = prev.filter((a) => a.qIndex !== newAnswer.qIndex);
      next.push(newAnswer);
      setAnswered(next.length);
      setScore(next.filter((a) => a.isCorrect).length);
      return next;
    });
  }, []);

  const selectAnswer = useCallback((selected: string, timeSpent: number) => {
    const q = questions[currentIndex];
    const correct = q.answer ?? '';
    const isCorrect = selected === correct;
    recordAnswer({ qIndex: currentIndex, question: q, selected, correct, isCorrect, timeSpent });
  }, [currentIndex, questions, recordAnswer]);

  /** For 'sa' (short-answer/flashcard) questions: the learner self-reports correctness after revealing the answer. */
  const selfGradeAnswer = useCallback((isCorrect: boolean, timeSpent: number) => {
    const q = questions[currentIndex];
    recordAnswer({ qIndex: currentIndex, question: q, selected: 'self', correct: 'self', isCorrect, timeSpent });
  }, [currentIndex, questions, recordAnswer]);

  /** Exam-mode short-answer: captures the typed free-text response without grading
   * it (the model answer is never shown during the exam). isCorrect stays false and
   * pendingSelfGrade stays true until gradeExamSA runs on the Results screen, so this
   * never contributes to the point total on its own. */
  const recordExamSAResponse = useCallback((response: string, timeSpent: number) => {
    const q = questions[currentIndex];
    recordAnswer({
      qIndex: currentIndex, question: q, selected: 'self', correct: 'self',
      isCorrect: false, timeSpent, response, pendingSelfGrade: true,
    });
  }, [currentIndex, questions, recordAnswer]);

  /** Applies a self-grade to an already-recorded exam-mode SA answer (by qIndex,
   * not necessarily the currently displayed question, since this runs from the
   * Results screen after the exam has ended). */
  const gradeExamSA = useCallback((qIndex: number, isCorrect: boolean) => {
    setAnswers((prev) => {
      const next = prev.map((a) =>
        a.qIndex === qIndex ? { ...a, isCorrect, pendingSelfGrade: false } : a
      );
      setScore(next.filter((a) => a.isCorrect).length);
      return next;
    });
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) setCurrentIndex(index);
  }, [questions.length]);

  const totalElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  // Point-weighted score, only meaningful in 'exam' mode (regular practice
  // questions have no .points field, so pointsTotal is 0 for them and the
  // UI falls back to the plain correct-count score).
  const pointsEarned = answers.reduce((sum, a) => sum + (a.isCorrect ? (a.question.points ?? 0) : 0), 0);
  const pointsTotal = examPaper?.totalPoints ?? questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
  const pendingSACount = answers.filter((a) => a.pendingSelfGrade).length;

  return {
    courseId,
    questions,
    currentIndex,
    score,
    answered,
    answers,
    mode,
    moduleFilter,
    tierFilter,
    examPaper,
    pointsEarned,
    pointsTotal,
    pendingSACount,
    totalElapsed,
    initQuiz,
    initExam,
    selectAnswer,
    selfGradeAnswer,
    recordExamSAResponse,
    gradeExamSA,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    isFinished: currentIndex >= questions.length && questions.length > 0,
  };
}
