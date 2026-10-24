import { useState, useMemo, useEffect, useRef } from 'react';
import type { Answer } from '../types';
import { formatTime } from '../utils/formatTime';
import { typesetMath } from '../utils/mathjax';
import { renderMarkdown } from '../utils/markdown';

interface ReviewListProps {
  answers: Answer[];
}

type Filter = 'all' | 'correct' | 'wrong';

export function ReviewList({ answers }: ReviewListProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [searchTier, setSearchTier] = useState<string>('all');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      typesetMath(listRef.current);
    }, 50);
    return () => clearTimeout(timer);
  }, [answers, filter, searchTier]);

  const tiers = useMemo(() => {
    const t = new Set(answers.map((a) => a.question.tier?.replace(/^Tier \d+ — /, '') || 'General'));
    return [...t].sort();
  }, [answers]);

  const filtered = useMemo(() => {
    return answers.filter((a) => {
      if (filter === 'correct' && !a.isCorrect) return false;
      if (filter === 'wrong' && a.isCorrect) return false;
      const tier = a.question.tier?.replace(/^Tier \d+ — /, '') || 'General';
      if (searchTier !== 'all' && tier !== searchTier) return false;
      return true;
    });
  }, [answers, filter, searchTier]);

  return (
    <div className="review-section" ref={listRef}>
      <h3 className="review-title">Review Answers</h3>
      <div className="review-controls">
        <div className="review-filters">
          {(['all', 'correct', 'wrong'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`review-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'correct' ? '✅ Correct' : '❌ Wrong'}
            </button>
          ))}
        </div>
        <select
          className="review-tier-select"
          value={searchTier}
          onChange={(e) => setSearchTier(e.target.value)}
        >
          <option value="all">All Topics</option>
          {tiers.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="review-list">
        {filtered.map((a) => (
          <div key={a.qIndex} className={`review-item ${a.isCorrect ? 'item-correct' : 'item-wrong'}`}>
            <div className="review-item-header">
              <span className="review-icon">{a.isCorrect ? '✅' : '❌'}</span>
              <span className="review-q-num">Q{a.question.num}</span>
              <span className="review-tier-tag">
                {a.question.tier?.replace(/^Tier \d+ — /, '') || 'General'}
              </span>
            </div>
            {a.question.type === 'sa' ? (
              <div
                className="review-q-text"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(a.question.question) }}
              />
            ) : (
              <p className="review-q-text">{a.question.question}</p>
            )}
            {a.question.type === 'sa' ? (
              <div className="review-answers">
                <div className="review-answer-row">
                  <span className="review-answer-label">Self-graded:</span>
                  <span className={a.isCorrect ? 'text-correct' : 'text-wrong'}>
                    {a.isCorrect ? 'Got it right' : 'Missed it'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="review-answers">
                <div className="review-answer-row">
                  <span className="review-answer-label">Your answer:</span>
                  <span className={a.isCorrect ? 'text-correct' : 'text-wrong'}>
                    {a.selected}) {a.question.options?.[a.selected]}
                  </span>
                </div>
                {!a.isCorrect && (
                  <div className="review-answer-row">
                    <span className="review-answer-label">Correct:</span>
                    <span className="text-correct">{a.correct}) {a.question.options?.[a.correct]}</span>
                  </div>
                )}
              </div>
            )}
            {a.question.type === 'sa' ? (
              <div
                className="review-explanation"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(a.question.answerText || '') }}
              />
            ) : (
              a.question.explanation && <p className="review-explanation">{a.question.explanation}</p>
            )}
            {a.question.optionContext && Object.keys(a.question.optionContext).length > 0 && (
              <div className="review-breakdown">
                <div className="breakdown-title">💡 Why each choice:</div>
                <div className="breakdown-list">
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const ctx = a.question.optionContext?.[letter];
                    if (!ctx) return null;
                    const isOptCorrect = letter === a.question.answer;
                    return (
                      <div key={letter} className={`breakdown-row ${isOptCorrect ? 'breakdown-row-correct' : 'breakdown-row-distractor'}`}>
                        <span className="breakdown-tag">{letter}</span>
                        <div className="breakdown-info">
                          <span className="breakdown-choice-text">{a.question.options?.[letter]}</span>
                          <span className="breakdown-reason">{ctx}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {(a.question.lectureReference || a.question.keyConcept) && (
              <div className="review-context-card">
                {a.question.lectureReference && (
                  <div className="context-item">
                    <span className="context-item-label">📌 Reference:</span>
                    <span className="context-item-val">{a.question.lectureReference}</span>
                  </div>
                )}
                {a.question.keyConcept && (
                  <div className="context-item">
                    <span className="context-item-label">💡 Key Takeaway:</span>
                    <span className="context-item-val">{a.question.keyConcept}</span>
                  </div>
                )}
              </div>
            )}
            <span className="review-time">⏱ {formatTime(a.timeSpent)}</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="review-empty">No answers match the selected filter.</p>
        )}
      </div>
    </div>
  );
}
