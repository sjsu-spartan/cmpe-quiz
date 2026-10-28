import { useState, useMemo } from 'react';
import type { Question } from '../types';

interface ModeSelectionProps {
  courseTitle: string;
  questions: Question[];
  onStartQuiz: (count: number, tier?: string, part?: string) => void;
  onBack: () => void;
}

function getAvailableTiers(questions: Question[]): string[] {
  const tiers = new Set(questions.map((q) => q.tier).filter(Boolean));
  return [...tiers].sort();
}

/** Parts are detected from lectureReference values that follow the "Part N: ..." naming
 * convention (currently only CMPE 253's 19-part bank), sorted numerically by part number. */
function getAvailableParts(questions: Question[]): string[] {
  const parts = new Set(
    questions.map((q) => q.lectureReference).filter((ref): ref is string => !!ref && /^Part \d+:/.test(ref))
  );
  return [...parts].sort((a, b) => {
    const na = parseInt(a.match(/^Part (\d+):/)?.[1] ?? '0', 10);
    const nb = parseInt(b.match(/^Part (\d+):/)?.[1] ?? '0', 10);
    return na - nb;
  });
}

export function ModeSelection({ courseTitle, questions, onStartQuiz, onBack }: ModeSelectionProps) {
  const [shuffle, setShuffle] = useState(true);
  const [customCount, setCustomCount] = useState(Math.min(30, Math.floor(questions.length / 2)));
  const tiers = useMemo(() => getAvailableTiers(questions), [questions]);
  const parts = useMemo(() => getAvailableParts(questions), [questions]);
  const [selectedPart, setSelectedPart] = useState('');
  const total = questions.length;

  const presets = useMemo(() => {
    const preferred = [10, 25, 50, 100];
    return preferred.filter((n) => n < total && n <= total * 0.7);
  }, [total]);

  return (
    <div className="screen-content">
      <div className="card">
        <div className="mode-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>{courseTitle}</h2>
          <p className="mode-subtitle">{total} questions available</p>
        </div>

        {presets.length > 0 && (
          <div className="mode-section">
            <h3 className="mode-section-title">Quick Practice</h3>
            <div className="mode-presets">
              {presets.map((n) => (
                <button
                  key={n}
                  className="mode-preset-btn"
                  onClick={() => onStartQuiz(n)}
                >
                  <span className="preset-icon">{n === 10 ? '🎯' : n === 25 ? '⚡' : n === 50 ? '🔥' : '💯'}</span>
                  <span className="preset-label">Quick {n}</span>
                </button>
              ))}
              <button
                className="mode-preset-btn mode-preset-all"
                onClick={() => onStartQuiz(total)}
              >
                <span className="preset-icon">📋</span>
                <span className="preset-label">All {total}</span>
              </button>
            </div>
          </div>
        )}

        {tiers.length > 0 && (
          <div className="mode-section">
            <h3 className="mode-section-title">By Exam Probability</h3>
            <div className="mode-tiers">
              {tiers.map((tier) => {
                const count = questions.filter((q) => q.tier === tier).length;
                const shortLabel = tier.replace(/^Tier \d+ — /, '');
                const isHigh = tier.includes('Highest') || tier.includes('Tier 1');
                return (
                  <button
                    key={tier}
                    className={`mode-tier-btn ${isHigh ? 'tier-high' : ''}`}
                    onClick={() => onStartQuiz(count, tier)}
                  >
                    <span className="tier-badge">{isHigh ? '🏆' : '⭐'}</span>
                    <span className="tier-label">{shortLabel}</span>
                    <span className="tier-count">{count}q</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {parts.length > 0 && (
          <div className="mode-section">
            <h3 className="mode-section-title">By Part</h3>
            <div className="custom-row">
              <select
                className="review-tier-select mode-part-select"
                value={selectedPart}
                onChange={(e) => setSelectedPart(e.target.value)}
              >
                <option value="">Choose a part…</option>
                {parts.map((part) => {
                  const count = questions.filter((q) => q.lectureReference === part).length;
                  return (
                    <option key={part} value={part}>
                      {part} ({count}q)
                    </option>
                  );
                })}
              </select>
              <button
                className="mode-preset-btn custom-go-btn"
                disabled={!selectedPart}
                onClick={() => {
                  const count = questions.filter((q) => q.lectureReference === selectedPart).length;
                  onStartQuiz(count, undefined, selectedPart);
                }}
              >
                Start 📖
              </button>
            </div>
          </div>
        )}

        <div className="mode-section">
          <div className="mode-controls">
            <label className="toggle-row">
              <span className="toggle-label-text">Shuffle questions</span>
              <div className="toggle" onClick={() => setShuffle((s) => !s)}>
                <div className={`toggle-knob ${shuffle ? 'on' : ''}`} />
              </div>
            </label>
          </div>
        </div>

        {total > 10 && (
          <div className="mode-section">
            <h3 className="mode-section-title">Custom Random</h3>
            <div className="custom-row">
              <input
                type="number"
                className="custom-input"
                min={1}
                max={total}
                value={customCount}
                onChange={(e) => setCustomCount(Math.min(Math.max(1, +e.target.value), total))}
              />
              <button className="mode-preset-btn custom-go-btn" onClick={() => onStartQuiz(customCount)}>
                Go 🎲
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
