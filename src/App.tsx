import { useState, useEffect, useCallback } from 'react';
import { useConfig } from './hooks/useConfig';
import { useQuestions } from './hooks/useQuestions';
import { useTheme } from './hooks/useTheme';
import { useTimer } from './hooks/useTimer';
import { useQuiz } from './hooks/useQuiz';
import { courseThemes } from './utils/themes';
import { Header } from './components/Header';
import { CourseSelection } from './components/CourseSelection';
import { ModeSelection } from './components/ModeSelection';
import { QuizScreen } from './components/QuizScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { FormulaSheet } from './components/FormulaSheet';
import { StudyGuide } from './components/StudyGuide';
import type { Screen } from './types';

export default function App() {
  const { config, loading: configLoading, error: configError } = useConfig();
  const { questions: allQuestions, formulas, loading: dataLoading } = useQuestions(config);
  const { theme, toggle: toggleTheme } = useTheme();
  const timer = useTimer();
  const quiz = useQuiz();

  const [screen, setScreen] = useState<Screen>('course');
  const [showFormula, setShowFormula] = useState(false);
  const [showStudyGuide, setShowStudyGuide] = useState(false);

  const course = config?.courses.find((c) => c.id === quiz.courseId);
  const courseTitle = course ? `${course.code} — ${course.name}` : '';
  const headerTitle =
    screen === 'course'
      ? config?.title || 'CMPE Exam Prep'
      : screen === 'mode' && quiz.courseId
      ? courseTitle
      : screen === 'quiz' || screen === 'summary'
      ? `${courseTitle}${quiz.moduleFilter ? ' · ' + quiz.moduleFilter.replace(/^Tier \d+ — /, '') : ''}`
      : config?.title || 'CMPE Exam Prep';

  const questionCounts: Record<string, number> = {};
  const tierCounts: Record<string, Record<string, number>> = {};
  for (const c of config?.courses || []) {
    const qs = allQuestions[c.id] ?? [];
    questionCounts[c.id] = qs.length;
    const tiers: Record<string, number> = {};
    for (const q of qs) {
      const t = q.tier?.replace(/^Tier \d+ — /, '') || 'General';
      tiers[t] = (tiers[t] || 0) + 1;
    }
    tierCounts[c.id] = tiers;
  }

  const handleSelectCourse = useCallback((courseId: string) => {
    quiz.initQuiz(courseId, [], 0, 'all', true);
    setScreen('mode');
  }, [quiz]);

  const handleStartQuiz = useCallback((count: number, tier?: string, part?: string) => {
    if (!quiz.courseId) return;
    const allQ = allQuestions[quiz.courseId];
    if (!allQ || allQ.length === 0) return;
    const quizMode = part ? 'part' : tier ? 'tier' : count >= allQ.length ? 'all' : 'quick';
    quiz.initQuiz(quiz.courseId, allQ, count, quizMode, true, tier, part);
    timer.start();
    setScreen('quiz');
  }, [quiz, allQuestions, timer]);

  const handleSelectAnswer = useCallback((selected: string, timeSpent: number) => {
    quiz.selectAnswer(selected, timeSpent);
  }, [quiz]);

  const handleSelfGrade = useCallback((isCorrect: boolean, timeSpent: number) => {
    quiz.selfGradeAnswer(isCorrect, timeSpent);
  }, [quiz]);

  const handleNext = useCallback(() => {
    if (quiz.currentIndex >= quiz.questions.length - 1) {
      timer.stop();
      setScreen('summary');
    } else {
      quiz.nextQuestion();
    }
  }, [quiz, timer]);

  const handlePrev = useCallback(() => {
    quiz.prevQuestion();
  }, [quiz]);

  const handleExit = useCallback(() => {
    if (quiz.answered === 0) {
      timer.stop();
      timer.reset();
      setScreen('mode');
      return;
    }
    if (confirm(`Exit quiz? You've answered ${quiz.answered} of ${quiz.questions.length} questions.`)) {
      timer.stop();
      setScreen('summary');
    }
  }, [quiz, timer]);

  const handleRestart = useCallback(() => {
    timer.reset();
    if (quiz.courseId) {
      const allQ = allQuestions[quiz.courseId];
      if (allQ) {
        const restartTier = quiz.mode === 'tier' ? quiz.moduleFilter : undefined;
        const restartPart = quiz.mode === 'part' ? quiz.moduleFilter : undefined;
        quiz.initQuiz(quiz.courseId, allQ, quiz.questions.length, quiz.mode, true, restartTier, restartPart);
        timer.start();
        setScreen('quiz');
      }
    }
  }, [quiz, allQuestions, timer]);

  const handleBackToCourses = useCallback(() => {
    timer.reset();
    setScreen('course');
  }, [timer]);

  const handleBackToMode = useCallback(() => {
    setScreen('mode');
  }, []);

  const handleCloseFormula = useCallback(() => {
    setShowFormula(false);
  }, []);

  const handleCloseStudyGuide = useCallback(() => {
    setShowStudyGuide(false);
  }, []);

  // Escape key to close modals
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowFormula(false);
        setShowStudyGuide(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  if (configLoading || dataLoading) {
    return (
      <div className="app">
        <Header title="" theme={theme} onToggleTheme={toggleTheme} elapsed={0} showTimer={false} minimal />
        <div className="screen-content" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📚</div>
          <p style={{ color: 'var(--color-text-2)' }}>Loading questions…</p>
        </div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="app">
        <Header title="⚠️ Error" theme={theme} onToggleTheme={toggleTheme} elapsed={0} showTimer={false} minimal />
        <div className="screen-content" style={{ textAlign: 'center', padding: 40 }}>
          <div className="card">
            <h2>⚠️ Failed to load</h2>
            <p style={{ color: 'var(--color-text-2)', marginTop: 12 }}>
              Make sure <code>data/config.json</code> exists.<br />
              This app must be served via HTTP (not file://).
            </p>
            <p style={{ color: 'var(--color-error)', marginTop: 8, fontSize: '0.85rem' }}>{configError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        title={headerTitle}
        theme={theme}
        onToggleTheme={toggleTheme}
        elapsed={timer.elapsed}
        showTimer={screen === 'quiz'}
        showFormula={screen === 'quiz' && !!(course?.formulaFile && formulas[quiz.courseId || '']?.length)}
        showStudyGuide={screen === 'quiz' && !!(course?.studyGuides?.length)}
        onFormula={() => setShowFormula(true)}
        onStudyGuide={() => setShowStudyGuide(true)}
        onExit={handleExit}
        showExit={screen === 'quiz'}
      />

      {screen === 'course' && config && (
        <CourseSelection
          courses={config.courses}
          questionCounts={questionCounts}
          tierCounts={tierCounts}
          onSelect={handleSelectCourse}
        />
      )}

      {screen === 'mode' && quiz.courseId && (
        <ModeSelection
          courseTitle={courseTitle}
          questions={allQuestions[quiz.courseId] || []}
          onStartQuiz={handleStartQuiz}
          onBack={handleBackToCourses}
        />
      )}

      {screen === 'quiz' && (
        <QuizScreen
          questions={quiz.questions}
          currentIndex={quiz.currentIndex}
          answers={quiz.answers}
          score={quiz.score}
          answered={quiz.answered}
          elapsed={timer.elapsed}
          onSelectAnswer={handleSelectAnswer}
          onSelfGrade={handleSelfGrade}
          onNext={handleNext}
          onPrev={handlePrev}
          onExit={handleExit}
        />
      )}

      {screen === 'summary' && (
        <SummaryScreen
          mode={quiz.mode}
          moduleFilter={quiz.moduleFilter}
          total={quiz.questions.length}
          score={quiz.score}
          elapsed={quiz.totalElapsed}
          answers={quiz.answers}
          onRestart={handleRestart}
          onBackToCourses={handleBackToCourses}
          courseTitle={courseTitle}
        />
      )}

      {showFormula && formulas[quiz.courseId || ''] && (
        <FormulaSheet
          formulas={formulas[quiz.courseId || '']}
          onClose={handleCloseFormula}
        />
      )}

      {showStudyGuide && course?.studyGuides && (
        <StudyGuide
          guides={course.studyGuides}
          onClose={handleCloseStudyGuide}
        />
      )}
    </div>
  );
}
