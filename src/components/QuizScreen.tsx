import { useState, useCallback, useEffect, useRef } from 'react';
import type { Question, Answer } from '../types';
import { QuestionCard } from './QuestionCard';
import { SACard } from './SACard';
import { formatTime } from '../utils/formatTime';

interface QuizScreenProps {
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  score: number;
  answered: number;
  elapsed: number;
  onSelectAnswer: (selected: string, timeSpent: number) => void;
  onSelfGrade: (isCorrect: boolean, timeSpent: number) => void;
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
  onSelectAnswer,
  onSelfGrade,
  onNext,
  onPrev,
  onExit,
}: QuizScreenProps) {
  const total = questions.length;
  const q = questions[currentIndex];
  const isSA = q?.type === 'sa';
  const prevAnswer = answers.find((a) => a.qIndex === currentIndex) ?? null;
  const progress = ((currentIndex + (prevAnswer ? 1 : 0)) / total) * 100;
  const [hasAnswered, setHasAnswered] = useState(!!prevAnswer);
  const [saRevealed, setSaRevealed] = useState(!!prevAnswer);
  const prevIndexRef = useRef(currentIndex);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    if (prevIndexRef.current !== currentIndex) {
      prevIndexRef.current = currentIndex;
      setHasAnswered(false);
      setSaRevealed(false);
      questionStartRef.current = Date.now();
    }
  }, [currentIndex]);

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

  if (!q) return null;

  return (
    <div className="screen-content" ref={containerRef}>
      <div className="quiz-header">
        <div className="quiz-progress-text">
          <span>Question {currentIndex + 1} of {total}</span>
          <span className="quiz-score">Score: {score}/{answered}</span>
        </div>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>
      </div>

      {isSA ? (
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
          correctAnswer={prevAnswer?.correct ?? null}
          onSelect={handleSelect}
          showResult={hasAnswered}
        />
      )}

      {!isSA && hasAnswered && prevAnswer && (
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
        {hasAnswered && (
          <button className="nav-btn next-btn" onClick={onNext}>
            {currentIndex < total - 1 ? 'Next →' : 'View Results →'}
          </button>
        )}
      </div>
    </div>
  );
}
