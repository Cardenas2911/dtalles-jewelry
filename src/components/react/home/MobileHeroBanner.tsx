import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';

export default function MobileHeroBanner({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    return (
        <div className="relative w-full px-5 mt-2 mb-6">
            <div className="bg-[#F4F0EB] rounded-2xl flex flex-row items-center p-6 min-h-[160px] relative overflow-hidden">

                {/* Text Content (Left) */}
                <div className="flex flex-col z-10 w-[60%] shrink-0">
                    <h2 className="text-2xl font-bold text-black leading-tight max-w-full">
                        {t('mobile.banner.title')}
                    </h2>
                    <a
                        href={getRoute('/tienda', lang)}
                        className="mt-4 px-5 py-2 bg-black text-white text-sm font-semibold rounded-full w-max shrink-0 transition-transform active:scale-95"
                    >
                        {t('mobile.banner.cta')}
                    </a>
                </div>

                {/* Image Content (Right absolute) */}
                <div className="absolute right-0 top-0 bottom-0 w-[45%] flex items-center justify-end pointer-events-none">
                    <img
                        src="https://cdn.shopify.com/s/files/1/0612/0357/9018/files/IMG_1811.png?v=1738604758"
                        alt={lang === 'en' ? 'Special Promotion' : 'Promoción Especial'}
                        className="h-full object-contain scale-[1.3] translate-x-4 mix-blend-multiply"
                        loading="eager"
                    />
                </div>
            </div>

            {/* Pagination Dots (Below Banner) */}
            <div className="flex justify-center gap-1.5 mt-3">
                <span className="w-2 h-2 bg-black rounded-full" aria-label="Slide 1"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full" aria-label="Slide 2"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full" aria-label="Slide 3"></span>
            </div>
        </div>
    );
}
