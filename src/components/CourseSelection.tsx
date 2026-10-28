import type { Course } from '../types';
import { courseThemes } from '../utils/themes';

interface CourseSelectionProps {
  courses: Course[];
  questionCounts: Record<string, number>;
  tierCounts: Record<string, Record<string, number>>;
  onSelect: (courseId: string) => void;
}

export function CourseSelection({ courses, questionCounts, tierCounts, onSelect }: CourseSelectionProps) {
  return (
    <div className="home">
      <div className="home-banner">
        <svg className="banner-art" viewBox="0 0 720 240" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0055a2" />
              <stop offset="40%" stopColor="#0f1b4d" />
              <stop offset="100%" stopColor="#0a0a12" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e5a823" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <radialGradient id="nodeBlueGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#a5b4fc" />
              <stop offset="100%" stopColor="#6366f1" />
            </radialGradient>
            <radialGradient id="nodeGoldGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#e5a823" />
            </radialGradient>
            <radialGradient id="vignette" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#0a0e27" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0a0e27" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="720" height="240" fill="url(#bgGrad)" rx="20" />

          {/* neural-network motif: a 4-layer feedforward net, input -> hidden -> hidden -> output */}
          <g className="banner-net">
            <line x1="100" y1="40" x2="280" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="40" x2="280" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="40" x2="280" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="40" x2="280" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="40" x2="280" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="40" x2="280" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="93" x2="280" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="93" x2="280" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="93" x2="280" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="93" x2="280" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="93" x2="280" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="93" x2="280" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="147" x2="280" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="147" x2="280" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="147" x2="280" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="147" x2="280" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="147" x2="280" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="147" x2="280" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="200" x2="280" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="200" x2="280" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="200" x2="280" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="200" x2="280" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="200" x2="280" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="100" y1="200" x2="280" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.22" />
            <line x1="280" y1="40" x2="460" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="40" x2="460" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="40" x2="460" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="40" x2="460" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="40" x2="460" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="40" x2="460" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="72" x2="460" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="72" x2="460" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="72" x2="460" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="72" x2="460" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="72" x2="460" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="72" x2="460" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="104" x2="460" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="104" x2="460" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="104" x2="460" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="104" x2="460" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="104" x2="460" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="104" x2="460" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="136" x2="460" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="136" x2="460" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="136" x2="460" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="136" x2="460" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="136" x2="460" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="136" x2="460" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="168" x2="460" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="168" x2="460" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="168" x2="460" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="168" x2="460" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="168" x2="460" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="168" x2="460" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="200" x2="460" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="200" x2="460" y2="72" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="200" x2="460" y2="104" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="200" x2="460" y2="136" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="200" x2="460" y2="168" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="280" y1="200" x2="460" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.7" opacity="0.18" />
            <line x1="460" y1="40" x2="630" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="40" x2="630" y2="120" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="40" x2="630" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="72" x2="630" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="72" x2="630" y2="120" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="72" x2="630" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="104" x2="630" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="104" x2="630" y2="120" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="104" x2="630" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="136" x2="630" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="136" x2="630" y2="120" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="136" x2="630" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="168" x2="630" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="168" x2="630" y2="120" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="168" x2="630" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="200" x2="630" y2="40" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="200" x2="630" y2="120" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />
            <line x1="460" y1="200" x2="630" y2="200" stroke="url(#edgeGrad)" strokeWidth="0.8" opacity="0.26" />

            <circle cx="100" cy="40" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="100" cy="93" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="100" cy="147" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="100" cy="200" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="280" cy="40" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="280" cy="72" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="280" cy="104" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="280" cy="136" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="280" cy="168" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="280" cy="200" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="460" cy="40" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="460" cy="72" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="460" cy="104" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="460" cy="136" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="460" cy="168" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="460" cy="200" r="4.5" fill="url(#nodeBlueGrad)" />
            <circle cx="630" cy="40" r="5.5" fill="url(#nodeGoldGrad)" />
            <circle cx="630" cy="120" r="5.5" fill="url(#nodeGoldGrad)" />
            <circle cx="630" cy="200" r="5.5" fill="url(#nodeGoldGrad)" />
          </g>

          {/* vignette behind the text for contrast against the network lines */}
          <ellipse cx="360" cy="110" rx="240" ry="95" fill="url(#vignette)" />

          {/* text */}
          <text x="360" y="100" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="800" letterSpacing="-0.5">Gradient</text>
          <text x="360" y="128" textAnchor="middle" fill="url(#goldGrad)" fontSize="13" fontWeight="700" letterSpacing="3">SJSU GRADUATE AI &amp; ML EXAM PREP</text>
          <text x="360" y="152" textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontWeight="400" letterSpacing="1.2">Perception · Learning · Optimization</text>
        </svg>
      </div>

      <div className="home-courses">
        {courses.map((c) => {
          const count = questionCounts[c.id] ?? 0;
          const tiers = Object.keys(tierCounts[c.id] ?? {}).length;
          const t = courseThemes[c.id] || courseThemes.cmpe260;

          return (
            <button key={c.id} className="hc" onClick={() => onSelect(c.id)} style={{ '--hc-bg': t.gradient, '--hc-glow': t.glow } as React.CSSProperties}>
              <div className="hc-bg" />
              <div className="hc-content">
                <span className="hc-icon">{t.icon}</span>
                <div className="hc-code">{c.code}</div>
                <div className="hc-name">{c.name}</div>
                <div className="hc-desc">{c.description}</div>
                <div className="hc-stats">
                  <span className="hc-stat">{count} questions</span>
                  <span className="hc-stat">{tiers} topic tiers</span>
                </div>
                <div className="hc-action">
                  <span>Start Quiz</span>
                  <span className="hc-action-arrow">→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
