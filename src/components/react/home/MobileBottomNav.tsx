import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';

export default function MobileBottomNav({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    // Para simplificar la demo, asumimos que estamos en el Home (activo)
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

    return (
        <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 flex justify-between items-center px-8 py-4 pb-safe z-50 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">

            {/* Home */}
            <a href={getRoute('/', lang)} className={`flex flex-col items-center gap-1 ${currentPath === getRoute('/', lang) ? 'text-black' : 'text-gray-400'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill={currentPath === getRoute('/', lang) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={currentPath === getRoute('/', lang) ? "0" : "1.5"} strokeLinecap="round" strokeLinejoin="round">
                    {currentPath === getRoute('/', lang) ? (
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                    ) : (
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    )}
                    {currentPath !== getRoute('/', lang) && <polyline points="9 22 9 12 15 12 15 22" />}
                </svg>
            </a>

            {/* Search */}
            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors" aria-label={t('mobile.nav.search')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>

            {/* Profile */}
            <a href="https://dtalles-jewelry.myshopify.com/account" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-gray-400 hover:text-black transition-colors" aria-label={t('mobile.nav.profile')}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </a>

        </div>
    );
}
