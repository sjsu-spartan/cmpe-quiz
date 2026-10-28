import { useState, useMemo } from 'react';
import type { Question } from '../types';

interface ModeSelectionProps {
  courseTitle: string;
  questions: Question[];
  onStartQuiz: (count: number, tier?: string, part?: string, shouldShuffle?: boolean) => void;
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

/** Strips the "Part N: " prefix for display purposes only; the full string (with
 * "Part N: ") is still used internally as the lectureReference filter value and is
 * what's stored in the data file. */
function stripPartPrefix(part: string): string {
  return part.replace(/^Part \d+:\s*/, '');
}

/** CMPE 249's 56 parts each contain a mix of per-question tiers (unlike CMPE 253's
 * single-tier-per-part banks), so there's no one tier to show in the Part dropdown
 * by default. This is a manual topic-level judgment call (not a plurality of the
 * per-question tiers) distinguishing historical/survey/company-trivia content
 * (lower exam priority per course emphasis) from actual model/architecture/mechanism
 * content (higher priority) -- display-only, does not alter any question's stored
 * per-question tier in the data file. Keyed by part number parsed from
 * "Part N: ...". Parts not listed here (or for any other mixed-tier course) fall
 * back to whichever tier has the most questions in that part. */
const CMPE249_PART_TOPIC_TIER: Record<number, 'high' | 'medium' | 'low'> = {
  1: 'high', 2: 'low', 3: 'low', 4: 'medium', 5: 'high', 6: 'high', 7: 'high',
  8: 'high', 9: 'medium', 10: 'medium', 11: 'high', 12: 'high', 13: 'medium',
  14: 'low', 15: 'medium', 16: 'medium', 17: 'medium', 18: 'high', 19: 'medium',
  20: 'low', 21: 'low', 22: 'high', 23: 'high', 24: 'high', 25: 'high', 26: 'high',
  27: 'high', 28: 'high', 29: 'high', 30: 'high', 31: 'high', 32: 'high', 33: 'high',
  34: 'high', 35: 'high', 36: 'medium', 37: 'high', 38: 'high', 39: 'high',
  40: 'high', 41: 'medium', 42: 'high', 43: 'low', 44: 'high', 45: 'high',
  46: 'high', 47: 'high', 48: 'high', 49: 'high', 50: 'high', 51: 'high',
  52: 'high', 53: 'high', 54: 'high', 55: 'high', 56: 'high',
};

const TOPIC_TIER_LABEL: Record<'high' | 'medium' | 'low', string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/** Returns a short tier label to show in front of a Part's name in the dropdown.
 * Single-tier parts (e.g. CMPE 253) just use their one real tier. Mixed-tier parts
 * (CMPE 249) use the manual topic-level override above, falling back to whichever
 * tier has the most questions in that part if no override is defined. */
function getPartTierLabel(part: string, partTiers: string[], partQuestions: Question[]): string {
  if (partTiers.length === 1) {
    return partTiers[0].replace(/^Tier \S+ — /, '');
  }
  const partNum = parseInt(part.match(/^Part (\d+):/)?.[1] ?? '', 10);
  const override = CMPE249_PART_TOPIC_TIER[partNum];
  if (override) {
    return TOPIC_TIER_LABEL[override];
  }
  const counts = new Map<string, number>();
  for (const q of partQuestions) {
    counts.set(q.tier, (counts.get(q.tier) ?? 0) + 1);
  }
  const dominant = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  return dominant.replace(/^Tier \S+ — /, '');
}

export function ModeSelection({ courseTitle, questions, onStartQuiz, onBack }: ModeSelectionProps) {
  const [shuffle, setShuffle] = useState(true);
  const [customCount, setCustomCount] = useState(Math.min(30, Math.floor(questions.length / 2)));
  const tiers = useMemo(() => getAvailableTiers(questions), [questions]);
  const parts = useMemo(() => getAvailableParts(questions), [questions]);
  const [selectedPart, setSelectedPart] = useState('');
  const total = questions.length;

  const partTiers = useMemo(
    () => getAvailableTiers(questions.filter((q) => q.lectureReference === selectedPart)),
    [questions, selectedPart]
  );

  const handlePartChange = (part: string) => {
    setSelectedPart(part);
  };

  const partTotalCount = useMemo(
    () => questions.filter((q) => q.lectureReference === selectedPart).length,
    [questions, selectedPart]
  );

  const partTierCount = (tier: string) =>
    questions.filter((q) => q.lectureReference === selectedPart && q.tier === tier).length;

  const presets = useMemo(() => {
    const preferred = [10, 25, 50, 100];
    return preferred.filter((n) => n < total && n <= total * 0.7);
  }, [total]);

  const partTierLabels = useMemo(() => {
    const labels = new Map<string, string>();
    for (const part of parts) {
      const partQuestions = questions.filter((q) => q.lectureReference === part);
      const thisPartTiers = getAvailableTiers(partQuestions);
      labels.set(part, getPartTierLabel(part, thisPartTiers, partQuestions));
    }
    return labels;
  }, [parts, questions]);

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
                  onClick={() => onStartQuiz(n, undefined, undefined, shuffle)}
                >
                  <span className="preset-icon">{n === 10 ? '🎯' : n === 25 ? '⚡' : n === 50 ? '🔥' : '💯'}</span>
                  <span className="preset-label">Quick {n}</span>
                </button>
              ))}
              <button
                className="mode-preset-btn mode-preset-all"
                onClick={() => onStartQuiz(total, undefined, undefined, shuffle)}
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
                    onClick={() => onStartQuiz(count, tier, undefined, shuffle)}
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
            <div className="mode-part-row">
              <select
                className="review-tier-select mode-part-select"
                value={selectedPart}
                onChange={(e) => handlePartChange(e.target.value)}
              >
                <option value="">Choose a part…</option>
                {parts.map((part) => (
                  <option key={part} value={part}>
                    {partTierLabels.get(part)} — {stripPartPrefix(part)}
                  </option>
                ))}
              </select>
              {selectedPart && (
                partTiers.length > 1 ? (
                  <div className="mode-part-tier-pills">
                    <button
                      className="mode-part-tier-pill"
                      onClick={() => onStartQuiz(partTotalCount, undefined, selectedPart, shuffle)}
                    >
                      All <span className="pill-count">{partTotalCount}q</span>
                    </button>
                    {partTiers.map((tier) => {
                      const shortLabel = tier.replace(/^Tier \d+ — /, '');
                      const isHigh = tier.includes('Highest') || tier.includes('Tier 1');
                      return (
                        <button
                          key={tier}
                          className={`mode-part-tier-pill ${isHigh ? 'tier-high' : ''}`}
                          onClick={() => onStartQuiz(partTierCount(tier), tier, selectedPart, shuffle)}
                        >
                          {shortLabel} <span className="pill-count">{partTierCount(tier)}q</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    className="mode-preset-btn custom-go-btn mode-part-go-btn"
                    onClick={() => onStartQuiz(partTotalCount, undefined, selectedPart, shuffle)}
                  >
                    Start 📖
                  </button>
                )
              )}
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
              <button className="mode-preset-btn custom-go-btn" onClick={() => onStartQuiz(customCount, undefined, undefined, shuffle)}>
                Go 🎲
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
