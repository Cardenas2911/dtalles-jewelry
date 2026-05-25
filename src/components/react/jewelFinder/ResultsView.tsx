import React from 'react';
import ProductCard from '../ProductCard';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { RECIPIENT_OPTIONS, JEWELRY_TYPE_OPTIONS, BUDGET_OPTIONS } from './config';
import WhatsAppButton from './WhatsAppButton';
import type { AlternativeProduct, FinderProduct, QuizResult } from './types';

interface ResultsViewProps {
  result: QuizResult;
  onEdit: () => void;
  onStartOver: () => void;
  onViewStore: () => void;
  lang: 'es' | 'en';
}

function formatSummary(result: QuizResult, lang: 'es' | 'en'): string {
  const t = getTranslationFunctionForLang(lang);
  const parts: string[] = [];
  if (result.answersSnapshot.jewelryType && result.answersSnapshot.jewelryType !== 'any') {
    const opt = JEWELRY_TYPE_OPTIONS.find((o) => o.value === result.answersSnapshot.jewelryType);
    if (opt) parts.push(t(opt.i18nKey as any));
  }
  if (result.answersSnapshot.recipient && result.answersSnapshot.recipient !== 'unsure') {
    const opt = RECIPIENT_OPTIONS.find((o) => o.value === result.answersSnapshot.recipient);
    if (opt) parts.push(t(opt.i18nKey as any));
  }
  if (result.answersSnapshot.budget) {
    const opt = BUDGET_OPTIONS.find((o) => o.value === result.answersSnapshot.budget);
    if (opt) parts.push(t(opt.i18nKey as any));
  }
  return parts.join(' · ');
}

function ProductGrid({
  products,
  showFallbackTag,
  lang,
}: {
  products: Array<FinderProduct | AlternativeProduct>;
  showFallbackTag: boolean;
  lang: 'es' | 'en';
}) {
  const t = getTranslationFunctionForLang(lang);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => (
        <div key={p.id} className="flex flex-col">
          {showFallbackTag && 'fallbackReason' in p && (
            <div className="mb-2 flex justify-center">
              <span className="inline-flex items-center gap-1.5 bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider rounded-sm">
                <span className="material-symbols-outlined text-[14px]">
                  {p.fallbackReason === 'price_relaxed' ? 'trending_up' : 'swap_horiz'}
                </span>
                {p.fallbackReason === 'price_relaxed'
                  ? t('finder.results.tagPriceRelaxed' as any)
                  : t('finder.results.tagTypeRelaxed' as any)}
              </span>
            </div>
          )}
          <ProductCard product={p as any} lang={lang} />
        </div>
      ))}
    </div>
  );
}

export default function ResultsView({ result, onEdit, onStartOver, onViewStore, lang }: ResultsViewProps) {
  const t = getTranslationFunctionForLang(lang);
  const summary = formatSummary(result, lang);

  const whatsAppProducts = result.case === 3 ? result.alternatives : result.primary;

  return (
    <div className="w-full max-w-7xl mx-auto py-6 md:py-8 px-3 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-6 md:mb-8 pb-4 border-b border-white/10">
        <p className="text-[#A0A0A0] text-xs md:text-sm leading-relaxed">
          <span className="font-bold text-[#FAFAF5]">{t('finder.results.summary' as any)}:</span> {summary}
        </p>
        <button onClick={onEdit} className="text-[#d4af37] hover:underline text-xs md:text-sm uppercase tracking-widest self-start md:self-auto">
          {t('finder.editSelection' as any)}
        </button>
      </div>

      {result.case === 3 && (
        <div className="mb-6 p-3 md:p-4 border border-[#d4af37]/30 bg-[#d4af37]/5 text-center">
          <p className="text-[#FAFAF5] text-sm md:text-base">{t('finder.results.noMatch' as any)}</p>
        </div>
      )}

      {result.primary.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-[#FAFAF5] font-serif text-xl md:text-3xl mb-4 md:mb-6">
            {result.case === 1
              ? t('finder.results.perfect' as any)
              : t('finder.results.youAsked' as any)}
          </h2>
          <ProductGrid products={result.primary} showFallbackTag={false} lang={lang} />
        </section>
      )}

      {result.alternatives.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-[#FAFAF5] font-serif text-xl md:text-3xl mb-4 md:mb-6">
            {result.case === 3
              ? t('finder.results.weRecommend' as any)
              : t('finder.results.alsoLike' as any)}
          </h2>
          <ProductGrid products={result.alternatives} showFallbackTag={true} lang={lang} />
        </section>
      )}

      <div className="mb-6 md:mb-8">
        <WhatsAppButton products={whatsAppProducts} lang={lang} />
      </div>

      <div className="flex flex-col md:flex-row gap-2.5 md:gap-3 justify-center">
        <button
          onClick={onStartOver}
          className="px-5 py-2.5 md:px-6 md:py-3 border border-white/20 text-[#FAFAF5] text-[10px] md:text-xs uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
        >
          {t('finder.startOver' as any)}
        </button>
        <button
          onClick={onViewStore}
          className="px-5 py-2.5 md:px-6 md:py-3 border border-white/20 text-[#FAFAF5] text-[10px] md:text-xs uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
        >
          {t('finder.viewStore' as any)}
        </button>
      </div>
    </div>
  );
}
