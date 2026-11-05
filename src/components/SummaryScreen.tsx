import { useEffect, useRef, useState } from 'react';
import type { Answer, QuizMode } from '../types';
import { formatTime } from '../utils/formatTime';
import { ModuleBreakdown } from './ModuleBreakdown';
import { ReviewList } from './ReviewList';

interface SummaryScreenProps {
  mode: QuizMode;
  moduleFilter: string | null;
  total: number;
  score: number;
  elapsed: number;
  answers: Answer[];
  onRestart: () => void;
  onBackToCourses: () => void;
  courseTitle: string;
  /** Only meaningful when mode === 'exam'; shows a point-weighted score
   * alongside the plain correct-count score. */
  pointsEarned?: number;
  pointsTotal?: number;
  /** Count of exam-mode short-answer questions not yet self-graded. */
  pendingSACount?: number;
  onGradeExamSA?: (qIndex: number, isCorrect: boolean) => void;
}

export function SummaryScreen({
  mode,
  moduleFilter,
  total,
  score,
  elapsed,
  answers,
  onRestart,
  onBackToCourses,
  courseTitle,
  pointsEarned,
  pointsTotal,
  pendingSACount = 0,
  onGradeExamSA,
}: SummaryScreenProps) {
  const isExam = mode === 'exam' && !!pointsTotal;
  const pct = isExam
    ? Math.round(((pointsEarned ?? 0) / (pointsTotal ?? 1)) * 100)
    : Math.round((score / total) * 100);
  const barRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setBarWidth(pct), 100);
    return () => clearTimeout(id);
  }, [pct]);

  const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
  const gradeColor = pct >= 70 ? 'var(--color-success)' : pct >= 50 ? '#f59e0b' : 'var(--color-error)';

  return (
    <div className="screen-content">
      <div className="card summary-card">
        <h2 className="summary-title">{courseTitle}{isExam && moduleFilter ? ` · ${moduleFilter}` : ''} · Results</h2>
        <div className="score-hero">
          {isExam ? (
            <>
              <div className="score-big" style={{ color: gradeColor }}>{pointsEarned}<span className="score-total">/{pointsTotal} pts</span></div>
              <div className="score-pct">{score}/{total} questions correct ({pct}%)</div>
            </>
          ) : (
            <>
              <div className="score-big" style={{ color: gradeColor }}>{score}<span className="score-total">/{total}</span></div>
              <div className="score-pct">{pct}% correct</div>
            </>
          )}
          <div className="score-grade" style={{ background: gradeColor }}>{grade}</div>
          <div className="score-time">⏱ {formatTime(elapsed)} total</div>
        </div>
        <div className="score-bar-track">
          <div
            ref={barRef}
            className="score-bar-fill"
            style={{
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, var(--color-success), ${gradeColor})`,
            }}
          />
        </div>
        {isExam && pendingSACount > 0 && (
          <div className="pending-sa-banner">
            ⏳ {pendingSACount} short-answer {pendingSACount === 1 ? 'question' : 'questions'} awaiting self-grade
            — scroll down to compare your answers against the model answers and grade them. Your point total
            above will update as you do.
          </div>
        )}
      </div>

      <ModuleBreakdown answers={answers} />

      <ReviewList answers={answers} onGradeExamSA={onGradeExamSA} />

      <div className="summary-actions">
        <button className="action-btn action-restart" onClick={onRestart}>🔄 Restart Quiz</button>
        <button className="action-btn action-switch" onClick={onBackToCourses}>📚 Switch Course</button>
      </div>
    </div>
  );
}
