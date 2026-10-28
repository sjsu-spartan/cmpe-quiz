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
            <radialGradient id="blob1" cx="30%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob2" cx="70%" cy="60%" r="55%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="blob3" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#e5a823" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#e5a823" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="720" height="240" fill="url(#bgGrad)" rx="20" />

          {/* ambient glow blobs */}
          <ellipse cx="200" cy="100" rx="260" ry="140" fill="url(#blob1)" />
          <ellipse cx="540" cy="150" rx="220" ry="120" fill="url(#blob2)" />
          <ellipse cx="360" cy="60" rx="180" ry="100" fill="url(#blob3)" />

          {/* large organic sweep */}
          <path d="M0 180 C 120 140, 240 200, 360 160 C 480 120, 600 190, 720 150 L 720 240 L 0 240 Z" fill="rgba(129, 140, 248, 0.06)" />
          <path d="M0 200 C 180 160, 300 220, 420 180 C 540 140, 660 210, 720 170 L 720 240 L 0 240 Z" fill="rgba(34, 211, 238, 0.05)" />

          {/* floating rings */}
          <circle cx="120" cy="60" r="40" fill="none" stroke="rgba(129, 140, 248, 0.08)" strokeWidth="1" />
          <circle cx="120" cy="60" r="55" fill="none" stroke="rgba(129, 140, 248, 0.04)" strokeWidth="0.5" />
          <circle cx="600" cy="80" r="30" fill="none" stroke="rgba(34, 211, 238, 0.07)" strokeWidth="1" />
          <circle cx="600" cy="80" r="44" fill="none" stroke="rgba(34, 211, 238, 0.04)" strokeWidth="0.5" />

          {/* painterly dots */}
          <circle cx="80" cy="180" r="2" fill="#22d3ee" opacity="0.2" />
          <circle cx="160" cy="50" r="1.5" fill="#818cf8" opacity="0.25" />
          <circle cx="280" cy="170" r="2.5" fill="#e5a823" opacity="0.15" />
          <circle cx="400" cy="40" r="1.5" fill="#22d3ee" opacity="0.2" />
          <circle cx="500" cy="190" r="2" fill="#818cf8" opacity="0.15" />
          <circle cx="640" cy="50" r="1.5" fill="#e5a823" opacity="0.2" />
          <circle cx="680" cy="170" r="2" fill="#22d3ee" opacity="0.15" />
          <circle cx="300" cy="30" r="1" fill="#fff" opacity="0.1" />
          <circle cx="520" cy="45" r="1" fill="#fff" opacity="0.08" />
          <circle cx="220" cy="190" r="1.5" fill="#22d3ee" opacity="0.12" />
          <circle cx="450" cy="180" r="1" fill="#e5a823" opacity="0.2" />

          {/* painterly curve strokes */}
          <path d="M-20 120 Q 100 60, 180 130 Q 260 200, 360 140" fill="none" stroke="rgba(129, 140, 248, 0.06)" strokeWidth="3" />
          <path d="M360 140 Q 460 80, 540 150 Q 620 220, 740 160" fill="none" stroke="rgba(34, 211, 238, 0.05)" strokeWidth="2.5" />
          <path d="M0 40 Q 200 10, 360 50 Q 520 90, 720 30" fill="none" stroke="rgba(229, 168, 35, 0.04)" strokeWidth="2" />

          {/* text */}
          <text x="360" y="88" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="800" letterSpacing="-0.5">SJSU</text>
          <text x="360" y="120" textAnchor="middle" fill="url(#goldGrad)" fontSize="17" fontWeight="700" letterSpacing="3">CMPE EXAM PREP</text>
          <text x="360" y="150" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="400" letterSpacing="1.5">Graduate Exam Practice · Multiple Courses</text>
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
