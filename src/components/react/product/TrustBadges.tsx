import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

export default function TrustBadges({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    return (
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 py-4 border-b border-white/5 mb-4">
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d4af37] text-lg">verified</span>
                <span className="text-[10px] md:text-xs text-[#FAFAF5]/80 uppercase tracking-wide font-bold">{t('product.trustRealGold')}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d4af37] text-lg">local_shipping</span>
                <span className="text-[10px] md:text-xs text-[#FAFAF5]/80 uppercase tracking-wide font-bold">{t('product.trustFreeShipping')}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d4af37] text-lg">star</span>
                <span className="text-[10px] md:text-xs text-[#FAFAF5]/80 uppercase tracking-wide font-bold">{t('product.trustStars')}</span>
            </div>
        </div>
    );
}
