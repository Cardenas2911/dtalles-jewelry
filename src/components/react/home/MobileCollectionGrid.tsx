import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { resolvePath, getRoute } from '../../../utils/paths';

export default function MobileCollectionGrid({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);

    const collections = [
        {
            titleKey: 'nav.men' as const,
            handle: "hombre",
            image: resolvePath("/images/menu-hombre.webp")
        },
        {
            titleKey: 'nav.women' as const,
            handle: "mujer",
            image: resolvePath("/images/menu-mujer.webp")
        },
        {
            titleKey: 'nav.religious' as const,
            handle: "coleccion/religiosa",
            image: resolvePath("/images/menu-religiosos.webp")
        },
        {
            titleKey: 'nav.gifts' as const,
            handle: "guia-regalos",
            image: resolvePath("/images/menu-regalos.webp")
        }
    ];

    return (
        <section className="px-5 mt-10 mb-24">
            <h2 className="text-xl font-bold mb-4 text-black tracking-tight">{t('home.collections.title')}</h2>

            <div className="grid grid-cols-2 gap-4">
                {collections.map((coll, idx) => (
                    <a
                        key={idx}
                        href={getRoute(`/coleccion/${coll.handle}`, lang)}
                        className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group block"
                    >
                        {/* Background Image */}
                        <img
                            src={coll.image}
                            alt={t(coll.titleKey)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />

                        {/* Subtle Overlay for Contrast */}
                        <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40"></div>

                        {/* Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
                            <span className="text-white text-lg font-semibold tracking-wide drop-shadow-md text-center">
                                {t(coll.titleKey)}
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}
