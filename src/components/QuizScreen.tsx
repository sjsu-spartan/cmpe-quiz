import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, Answer } from '../types';
import { QuestionCard } from './QuestionCard';
import { SACard } from './SACard';
import { ExamSACard } from './ExamSACard';
import { formatTime } from '../utils/formatTime';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  answered: number;
  elapsed: number;
  /** True for a mock exam: suppresses immediate per-question feedback (no
   * correct/wrong, no explanation) to simulate real exam conditions. Short-answer
   * questions switch to a free-text capture flow instead of reveal+self-grade. */
  isExamMode?: boolean;
  onSelectAnswer: (selected: string, timeSpent: number) => void;
  onSelfGrade: (isCorrect: boolean, timeSpent: number) => void;
  onRecordExamSAResponse: (response: string, timeSpent: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

import { typesetMath } from '../utils/mathjax';

export function QuizScreen({
  questions,
  currentIndex,
  answers,
  score,
  answered,
  elapsed,
  isExamMode = false,
  onSelectAnswer,
  onSelfGrade,
  onRecordExamSAResponse,
  onNext,
  onPrev,
  onExit,
}: QuizScreenProps) {
  const total = questions.length;
  const q = questions[currentIndex];
  const isSA = q?.type === 'sa';
  const isExamSA = isExamMode && isSA;
  const prevAnswer = answers.find((a) => a.qIndex === currentIndex) ?? null;
  // In exam mode, an SA question is "answered" (for progress/Next purposes) the
  // moment it's recorded via onRecordExamSAResponse, same as prevAnswer existing
  // for TF/MCQ; the free-text box itself never blocks navigation (input is optional).
  const progress = ((currentIndex + (prevAnswer ? 1 : 0)) / total) * 100;
  const [hasAnswered, setHasAnswered] = useState(!!prevAnswer);
  const [saRevealed, setSaRevealed] = useState(!!prevAnswer);
  const [examSAText, setExamSAText] = useState(prevAnswer?.response ?? '');
  const prevIndexRef = useRef(currentIndex);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      // Reflect whether the question we're navigating TO already has a recorded answer
      // (e.g. revisiting via Prev), rather than always unlocking it -- otherwise picking
      // a different option on a revisited question would re-fire the answer handler and
      // overwrite the original recorded answer without it being visible that a change
      // happened, which is what caused incorrect selections to silently show as correct.
      setHasAnswered(!!prevAnswer);
      setSaRevealed(!!prevAnswer);
      setExamSAText(prevAnswer?.response ?? '');
      questionStartRef.current = Date.now();
    }
  }, [currentIndex, prevAnswer]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q) {
      const timer = setTimeout(() => {
        typesetMath(containerRef.current);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [q, currentIndex, prevAnswer, hasAnswered]);

  const handleSelect = useCallback((letter: string) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000);
    onSelectAnswer(letter, timeSpent);
  }, [hasAnswered, onSelectAnswer]);

  const handleSaReveal = useCallback(() => {
    setSaRevealed(true);
  }, []);

  const handleSaGrade = useCallback((isCorrect: boolean) => {
    if (hasAnswered) return;
    setHasAnswered(true);
    const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000);
    onSelfGrade(isCorrect, timeSpent);
  }, [hasAnswered, onSelfGrade]);

  // Exam-mode SA: records the free-text response (possibly empty) the first time
  // Next is pressed on this question; re-pressing Next on an already-recorded
  // question (e.g. after Prev then Next again) does not re-record, matching how
  // TF/MCQ's handleSelect only fires once via the hasAnswered guard.
  const handleExamSANext = useCallback(() => {
    if (!hasAnswered) {
      setHasAnswered(true);
      const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000);
      onRecordExamSAResponse(examSAText, timeSpent);
    }
    onNext();
  }, [hasAnswered, examSAText, onRecordExamSAResponse, onNext]);

  if (!q) return null;

  return (
    <div className="screen-content" ref={containerRef}>
      <div className="quiz-header">
        <div className="quiz-progress-text">
          <span>Question {currentIndex + 1} of {total}</span>
          {/* Live score is withheld in exam mode: watching it tick up/stay flat would
              leak correctness feedback the exam is supposed to hide until Results. */}
          {!isExamMode && <span className="quiz-score">Score: {score}/{answered}</span>}
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>
      </div>

      {isExamSA ? (
        <ExamSACard
          question={q}
          value={examSAText}
          onChange={setExamSAText}
        />
      ) : isSA ? (
        <SACard
          question={q}
          revealed={saRevealed}
          gotIt={prevAnswer ? prevAnswer.isCorrect : null}
          onReveal={handleSaReveal}
          onGrade={handleSaGrade}
        />
      ) : (
        <QuestionCard
          question={q}
          index={currentIndex}
          total={total}
          selectedAnswer={prevAnswer?.selected ?? null}
          correctAnswer={isExamMode ? null : (prevAnswer?.correct ?? null)}
          onSelect={handleSelect}
          showResult={!isExamMode && hasAnswered}
          locked={hasAnswered}
        />
      )}

      {!isExamMode && !isSA && hasAnswered && prevAnswer && (
        <div className={`feedback ${prevAnswer.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          <div className="feedback-header">
            <span className="feedback-icon">{prevAnswer.isCorrect ? '✅' : '❌'}</span>
            <span className={`feedback-title ${prevAnswer.isCorrect ? 'correct-title' : 'wrong-title'}`}>
              {prevAnswer.isCorrect ? 'Correct!' : `Wrong — Answer: ${prevAnswer.correct}`}
            </span>
            <span className="feedback-time">⏱ {formatTime(prevAnswer.timeSpent)}</span>
          </div>
          {q.explanation && <p className="feedback-explanation">{q.explanation}</p>}
          {q.optionContext && Object.keys(q.optionContext).length > 0 && (
            <div className="feedback-breakdown">
              <div className="breakdown-title">💡 Why each choice:</div>
              <div className="breakdown-list">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const ctx = q.optionContext?.[letter];
                  if (!ctx) return null;
                  const isOptCorrect = letter === q.answer;
                  return (
                    <div key={letter} className={`breakdown-row ${isOptCorrect ? 'breakdown-row-correct' : 'breakdown-row-distractor'}`}>
                      <span className="breakdown-tag">{letter}</span>
                      <div className="breakdown-info">
                        <span className="breakdown-choice-text">{q.options?.[letter]}</span>
                        <span className="breakdown-reason">{ctx}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {(q.lectureReference || q.keyConcept) && (
            <div className="feedback-context-card">
              {q.lectureReference && (
                <div className="context-item">
                  <span className="context-item-label">📌 Reference:</span>
                  <span className="context-item-val">{q.lectureReference}</span>
                </div>
              )}
              {q.keyConcept && (
                <div className="context-item">
                  <span className="context-item-label">💡 Key Takeaway:</span>
                  <span className="context-item-val">{q.keyConcept}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="quiz-nav">
        <button
          className="nav-btn prev-btn"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          ← Prev
        </button>
        {isExamSA ? (
          <button className="nav-btn next-btn" onClick={handleExamSANext}>
            {currentIndex < total - 1 ? 'Next →' : 'View Results →'}
          </button>
        ) : hasAnswered && (
          <button className="nav-btn next-btn" onClick={onNext}>
            {currentIndex < total - 1 ? 'Next →' : 'View Results →'}
          </button>
        )}
      </div>
    </div>
  );
}
