import { useEffect, useRef } from 'react';
import type { Question } from '../types';
import { renderMarkdown } from '../utils/markdown';
import { typesetMath } from '../utils/mathjax';

interface SACardProps {
  question: Question;
  revealed: boolean;
  gotIt: boolean | null;
  onReveal: () => void;
  onGrade: (gotIt: boolean) => void;
}

export function SACard({ question, revealed, gotIt, onReveal, onGrade }: SACardProps) {
  const tierLabel = question.tier?.replace(/^Tier \d+ — /, '') || '';
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (revealed && answerRef.current) {
      const timer = setTimeout(() => typesetMath(answerRef.current), 20);
      return () => clearTimeout(timer);
    }
  }, [revealed]);

  return (
    <div className="question-card sa-card">
      <div className="q-meta">
        <span className="q-number">Q{question.num}</span>
        <span className="q-type-badge">Short Answer</span>
        {tierLabel && <span className="q-tier">{tierLabel}</span>}
      </div>
      <div
        className="q-text sa-question-text"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(question.question) }}
      />

      {!revealed && (
        <button className="sa-reveal-btn" onClick={onReveal}>
          Show Answer
        </button>
      )}

      {revealed && (
        <>
          <div className="sa-answer" ref={answerRef}>
            <div className="sa-answer-label">Answer / Approach</div>
            <div
              className="sa-answer-text"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(question.answerText || '') }}
            />
          </div>
          <div className="self-grade">
            <button
              className={`btn-grade got-it ${gotIt === true ? 'selected-got-it' : ''}`}
              onClick={() => onGrade(true)}
            >
              ✓ I got it right
            </button>
            <button
              className={`btn-grade missed ${gotIt === false ? 'selected-missed' : ''}`}
              onClick={() => onGrade(false)}
            >
              ✕ I missed it
            </button>
          </div>
        </>
      )}
    </div>
  );
}
