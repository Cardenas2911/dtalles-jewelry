import React, { useState } from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';
import { runJewelFinderQuery } from '../../../lib/jewelFinderQuery';
import { BUDGET_OPTIONS, JEWELRY_TYPE_OPTIONS, RECIPIENT_OPTIONS } from './config';
import QuestionStep from './QuestionStep';
import ResultsView from './ResultsView';
import WelcomeStep from './WelcomeStep';
import type { BudgetBracket, JewelryType, QuizAnswers, QuizResult, Recipient } from './types';

type Phase = 'welcome' | 'q1' | 'q2' | 'q3' | 'loading' | 'results' | 'error';

interface JewelFinderProps {
  lang: 'es' | 'en';
  mode?: 'page' | 'modal';
  onClose?: () => void;
}

const EMPTY_ANSWERS: QuizAnswers = { recipient: null, jewelryType: null, budget: null };

export default function JewelFinder({ lang, mode = 'page', onClose }: JewelFinderProps) {
  const t = getTranslationFunctionForLang(lang);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (finalAnswers: QuizAnswers) => {
    setPhase('loading');
    setError(null);
    try {
      const r = await runJewelFinderQuery(finalAnswers, lang);
      setResult(r);
      setPhase('results');
    } catch (err) {
      console.error('JewelFinder query failed:', err);
      setError(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  };

  const startOver = () => {
    setAnswers(EMPTY_ANSWERS);
    setResult(null);
    setError(null);
    setPhase('welcome');
  };

  const goToStore = () => {
    window.location.href = getRoute('/tienda', lang);
  };

  return (
    <div className="bg-[#050505] text-[#FAFAF5] min-h-screen md:min-h-0">
      {mode === 'modal' && onClose && (
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#d4af37] transition-colors"
            aria-label={t('finder.closeModal' as any)}
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>
      )}

      {phase === 'welcome' && <WelcomeStep onStart={() => setPhase('q1')} lang={lang} />}

      {phase === 'q1' && (
        <QuestionStep<Recipient>
          questionI18nKey="finder.q.recipient"
          options={RECIPIENT_OPTIONS}
          step={1}
          totalSteps={3}
          lang={lang}
          onSelect={(v) => {
            setAnswers((prev) => ({ ...prev, recipient: v }));
            setPhase('q2');
          }}
          onBack={() => setPhase('welcome')}
        />
      )}

      {phase === 'q2' && (
        <QuestionStep<JewelryType>
          questionI18nKey="finder.q.type"
          options={JEWELRY_TYPE_OPTIONS}
          step={2}
          totalSteps={3}
          lang={lang}
          onSelect={(v) => {
            setAnswers((prev) => ({ ...prev, jewelryType: v }));
            setPhase('q3');
          }}
          onBack={() => setPhase('q1')}
        />
      )}

      {phase === 'q3' && (
        <QuestionStep<BudgetBracket>
          questionI18nKey="finder.q.budget"
          options={BUDGET_OPTIONS}
          step={3}
          totalSteps={3}
          lang={lang}
          onSelect={(v) => {
            const finalAnswers = { ...answers, budget: v };
            setAnswers(finalAnswers);
            void runQuery(finalAnswers);
          }}
          onBack={() => setPhase('q2')}
        />
      )}

      {phase === 'loading' && (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-6">
          <p className="text-center text-[#A0A0A0] mb-8">{t('finder.loading' as any)}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#111] animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="w-full max-w-xl mx-auto py-16 px-4 text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px] text-red-500">error</span>
          <p className="text-[#FAFAF5]">{t('finder.error' as any)}</p>
          {error && <p className="text-xs text-[#A0A0A0]">{error}</p>}
          <button
            onClick={() => void runQuery(answers)}
            className="mt-4 px-6 py-2 border border-[#d4af37] text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors"
          >
            {t('finder.retry' as any)}
          </button>
        </div>
      )}

      {phase === 'results' && result && (
        <ResultsView
          result={result}
          onEdit={() => setPhase('q1')}
          onStartOver={startOver}
          onViewStore={goToStore}
          lang={lang}
        />
      )}
    </div>
  );
}
