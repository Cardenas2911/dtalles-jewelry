import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import ProgressBar from './ProgressBar';

interface Option<T extends string> {
  value: T;
  i18nKey: string;
  emoji?: string;
}

interface QuestionStepProps<T extends string> {
  questionI18nKey: string;
  options: Array<Option<T>>;
  onSelect: (value: T) => void;
  onBack?: () => void;
  step: number;
  totalSteps: number;
  lang: 'es' | 'en';
}

export default function QuestionStep<T extends string>({
  questionI18nKey,
  options,
  onSelect,
  onBack,
  step,
  totalSteps,
  lang,
}: QuestionStepProps<T>) {
  const t = getTranslationFunctionForLang(lang);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#A0A0A0] hover:text-[#d4af37] text-xs uppercase tracking-widest mb-4 flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          {t('finder.back' as any)}
        </button>
      )}

      <ProgressBar current={step} total={totalSteps} />

      <h2 className="text-[#FAFAF5] font-serif text-2xl md:text-3xl text-center mb-8 leading-tight">
        {t(questionI18nKey as any)}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="
              min-h-[64px] px-4 py-4
              bg-[#111] border border-white/10
              text-[#FAFAF5] text-sm md:text-base font-sans
              flex flex-col items-center justify-center gap-2
              hover:border-[#d4af37] hover:text-[#d4af37]
              active:bg-[#d4af37] active:text-black
              transition-all duration-200
            "
          >
            {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
            <span>{t(opt.i18nKey as any)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
