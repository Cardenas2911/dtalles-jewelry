import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

export default function ReviewSnippet({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    return (
        <div className="mb-6 bg-white/5 p-4 rounded-sm border border-white/10">
            <div className="flex text-[#d4af37] mb-2 text-xs">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="material-symbols-outlined text-sm">star</span>
            </div>
            <p className="text-sm italic text-[#FAFAF5]/90 mb-2 font-serif">
                {t('product.reviewText')}
            </p>
            <p className="text-xs text-[#FAFAF5]/50 font-bold uppercase tracking-widest">
                {t('product.reviewAuthor')} <span className="text-[#d4af37] ml-1">{t('product.reviewVerified')}</span>
            </p>
        </div>
    );
}
