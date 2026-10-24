import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedAnswer: string | null;
  correctAnswer: string | null;
  onSelect: (letter: string) => void;
  showResult: boolean;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedAnswer,
  correctAnswer,
  onSelect,
  showResult,
}: QuestionCardProps) {
  const tierLabel = question.tier?.replace(/^Tier \d+ — /, '') || '';
  const letters = Object.keys(question.options ?? {});

  return (
    <div className="question-card">
      <div className="q-meta">
        <span className="q-number">Q{question.num}</span>
        {question.type === 'tf' && <span className="q-type-badge">True / False</span>}
        {tierLabel && <span className="q-tier">{tierLabel}</span>}
      </div>
      <p className="q-text">{question.question}</p>
      <div className="q-options">
        {letters.map((letter) => {
          const isSelected = selectedAnswer === letter;
          const isCorrect = correctAnswer === letter;
          const isWrong = isSelected && !isCorrect;
          let cls = 'q-option';
          if (showResult) {
            if (isCorrect) cls += ' correct';
            if (isWrong) cls += ' wrong';
            if (isSelected && isCorrect) cls += ' selected-correct';
          }
          return (
            <button
              key={letter}
              className={cls}
              onClick={() => !showResult && onSelect(letter)}
              disabled={showResult}
            >
              <span className="option-letter">{letter}</span>
              <span className="option-text">{question.options?.[letter]}</span>
              {showResult && (
                <span className={`option-status ${isCorrect ? 'status-correct' : isWrong ? 'status-wrong' : ''}`}>
                  {isCorrect ? '✓' : isWrong ? '✗' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
