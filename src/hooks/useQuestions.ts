import { useState, useEffect } from 'react';
import type { AppConfig, Question, FormulaSection, ExamPaper } from '../types';

export function useQuestions(config: AppConfig | null) {
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [formulas, setFormulas] = useState<Record<string, FormulaSection[]>>({});
  const [exams, setExams] = useState<Record<string, ExamPaper[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!config) return;
    let cancelled = false;

    const questionFetches = config.courses.map(async (c) => {
      const r = await fetch(c.questionFile, { cache: 'no-cache' });
      if (!r.ok) throw new Error(`Failed to load ${c.questionFile}`);
      return ['q', c.id, await r.json()] as const;
    });
    const formulaFetches = config.courses.filter((c) => c.formulaFile).map(async (c) => {
      const r = await fetch(c.formulaFile!, { cache: 'no-cache' });
      if (!r.ok) return null;
      return ['f', c.id, await r.json()] as const;
    });
    const examFetches = config.courses.filter((c) => c.examFile).map(async (c) => {
      const r = await fetch(c.examFile!, { cache: 'no-cache' });
      if (!r.ok) return null;
      return ['e', c.id, await r.json()] as const;
    });

    Promise.all([...questionFetches, ...formulaFetches, ...examFetches])
      .then((results) => {
        if (cancelled) return;
        const qs: Record<string, Question[]> = {};
        const fs: Record<string, FormulaSection[]> = {};
        const ex: Record<string, ExamPaper[]> = {};
        for (const r of results) {
          if (!r) continue;
          const [kind, id, data] = r;
          if (kind === 'q') qs[id] = data;
          else if (kind === 'f') fs[id] = data;
          else ex[id] = data;
        }
        setQuestions(qs);
        setFormulas(fs);
        setExams(ex);
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          console.warn('Data load warning:', err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [config]);

  return { questions, formulas, exams, loading };
}
