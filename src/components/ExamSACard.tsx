import type { Question } from '../types';
import { renderMarkdown } from '../utils/markdown';

interface ExamSACardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

/** Short-answer card for exam mode: captures a free-text response without
 * revealing the model answer or self-grading, unlike practice mode's SACard.
 * The model answer only appears later, during Results-screen review. */
export function ExamSACard({ question, value, onChange }: ExamSACardProps) {
  const tierLabel = question.tier?.replace(/^Tier \d+ — /, '') || '';

  return (
    <div className="question-card sa-card">
      <div className="q-meta">
        <span className="q-number">Q{question.num}</span>
        <span className="q-type-badge">Short Answer</span>
        {tierLabel && <span className="q-tier">{tierLabel}</span>}
        {question.points != null && <span className="q-points">{question.points} pts</span>}
      </div>
      <div
        className="q-text sa-question-text"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(question.question) }}
      />
      <textarea
        className="exam-sa-input"
        placeholder="Type your answer here (optional; you'll compare it against the model answer after the exam)…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
      />
    </div>
  );
}
