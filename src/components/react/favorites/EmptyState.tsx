import React from 'react';
import { resolvePath, getRoute } from '../../../utils/paths';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

export default function EmptyState({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
            <div className="relative mb-8 opacity-50">
                <span className="material-symbols-outlined text-[80px] text-[#d4af37] font-thin">favorite</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-[#FAFAF5] mb-4">
                {t('ui.favorites.emptyTitle')}
            </h2>

            <p className="text-gray-400 mb-10 max-w-md text-sm md:text-base font-light leading-relaxed">
                {t('ui.favorites.emptyDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a
                    href={getRoute('/hombre', lang)}
                    className="flex-1 py-4 border border-[#d4af37] text-[#d4af37] uppercase tracking-[2px] text-xs font-bold hover:bg-[#d4af37] hover:text-black transition-all text-center"
                >
                    {t('ui.favorites.viewMen')}
                </a>
                <a
                    href={getRoute('/mujer', lang)}
                    className="flex-1 py-4 bg-[#d4af37] text-black border border-[#d4af37] uppercase tracking-[2px] text-xs font-bold hover:bg-white hover:border-white transition-all text-center"
                >
                    {t('ui.favorites.viewWomen')}
                </a>
            </div>
        </div>
    );
}
