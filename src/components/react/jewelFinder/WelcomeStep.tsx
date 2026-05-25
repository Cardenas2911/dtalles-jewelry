import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

interface WelcomeStepProps {
  onStart: () => void;
  lang: 'es' | 'en';
}

export default function WelcomeStep({ onStart, lang }: WelcomeStepProps) {
  const t = getTranslationFunctionForLang(lang);
  return (
    <div className="w-full max-w-xl mx-auto py-8 md:py-12 px-4 text-center flex flex-col items-center gap-4 md:gap-6">
      <span className="material-symbols-outlined text-[#d4af37] text-[40px] md:text-[48px]">diamond</span>
      <h1 className="text-[#FAFAF5] font-serif text-2xl md:text-4xl leading-tight px-2">
        {t('finder.title' as any)}
      </h1>
      <p className="text-[#A0A0A0] text-sm md:text-lg max-w-md px-2">
        {t('finder.subtitle' as any)}
      </p>
      <button
        onClick={onStart}
        className="
          mt-2 md:mt-4 px-8 md:px-10 py-3
          bg-[#d4af37] text-black
          font-sans font-bold text-xs md:text-sm uppercase tracking-widest
          hover:brightness-110 active:scale-[0.98]
          transition-all duration-200
        "
      >
        {t('finder.start' as any)}
      </button>
    </div>
  );
}
