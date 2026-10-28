import { formatTime } from '../utils/formatTime';

interface HeaderProps {
  title: string;
  subtitle?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  elapsed: number;
  showTimer: boolean;
  showFormula?: boolean;
  showStudyGuide?: boolean;
  onFormula?: () => void;
  onStudyGuide?: () => void;
  onExit?: () => void;
  showExit?: boolean;
  minimal?: boolean;
  gradient?: string;
}

export function Header({
  title,
  subtitle,
  theme,
  onToggleTheme,
  elapsed,
  showTimer,
  showFormula,
  showStudyGuide,
  onFormula,
  onStudyGuide,
  onExit,
  showExit,
  minimal,
  gradient,
}: HeaderProps) {
  const hasGrad = !minimal && !!gradient;
  const style = hasGrad ? { background: gradient } as React.CSSProperties : undefined;

  return (
    <header className={`header ${minimal ? 'header-minimal' : ''} ${hasGrad ? 'header-themed' : ''}`} style={style}>
      {minimal ? (
        <span className="header-logo">📝</span>
      ) : (
        <div className="header-titles">
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="header-actions">
        {showExit && onExit && (
          <button className="header-btn header-btn-exit" onClick={onExit} title="Exit quiz">✕</button>
        )}
        {showStudyGuide && onStudyGuide && (
          <button className="header-btn" onClick={onStudyGuide} title="Study guide">📖</button>
        )}
        {showFormula && onFormula && (
          <button className="header-btn" onClick={onFormula} title="Formula sheet">📐</button>
        )}
        {showTimer && (
          <span className="header-timer">{formatTime(elapsed)}</span>
        )}
        <button className="header-btn theme-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
