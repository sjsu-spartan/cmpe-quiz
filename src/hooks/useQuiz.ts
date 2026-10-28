import { useState, useCallback } from 'react';
import type { Question, Answer, QuizState, QuizMode } from '../types';
import { shuffle } from '../utils/shuffle';

const initial: Omit<QuizState, 'courseId'> = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answered: 0,
  answers: [],
  mode: 'all',
  moduleFilter: null,
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
  const [startTime, setStartTime] = useState<number | null>(null);

  const initQuiz = useCallback((
    cId: string,
    allQ: Question[],
    count: number,
    quizMode: QuizMode,
    shouldShuffle: boolean,
    tier?: string | null,
    part?: string | null,
  ) => {
    let selected: Question[];
    if (part) {
      selected = allQ.filter((q) => q.lectureReference === part);
    } else if (tier) {
      selected = allQ.filter((q) => q.tier === tier);
    } else if (shouldShuffle) {
      selected = shuffle(allQ).slice(0, Math.min(count, allQ.length));
    } else {
      if (count >= allQ.length) {
        selected = [...allQ];
      } else {
        const indices = shuffle([...Array(allQ.length).keys()]).slice(0, count);
        indices.sort((a, b) => a - b);
        selected = indices.map((i) => allQ[i]);
      }
    }
    setCourseId(cId);
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setAnswers([]);
    setMode(quizMode);
    setModuleFilter(part ?? tier ?? null);
    setStartTime(Date.now());
  }, []);

  const selectAnswer = useCallback((selected: string, timeSpent: number) => {
    const q = questions[currentIndex];
    const correct = q.answer ?? '';
    const isCorrect = selected === correct;

    setAnswered((a) => a + 1);
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [
      ...prev,
      { qIndex: currentIndex, question: q, selected, correct, isCorrect, timeSpent },
    ]);
  }, [currentIndex, questions]);

  /** For 'sa' (short-answer/flashcard) questions: the learner self-reports correctness after revealing the answer. */
  const selfGradeAnswer = useCallback((isCorrect: boolean, timeSpent: number) => {
    const q = questions[currentIndex];

    setAnswered((a) => a + 1);
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [
      ...prev,
      { qIndex: currentIndex, question: q, selected: 'self', correct: 'self', isCorrect, timeSpent },
    ]);
  }, [currentIndex, questions]);

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

  return {
    courseId,
    questions,
    currentIndex,
    score,
    answered,
    answers,
    mode,
    moduleFilter,
    totalElapsed,
    initQuiz,
    selectAnswer,
    selfGradeAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    isFinished: currentIndex >= questions.length && questions.length > 0,
  };
}
