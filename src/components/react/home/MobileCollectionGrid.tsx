import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';

export default function MobileCollectionGrid({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);

    const collections = [
        {
            titleKey: 'home.collections.rings' as const,
            handle: "anillos",
            image: "https://cdn.shopify.com/s/files/1/0612/0357/9018/files/1907-M-removebg-preview_600x600.png?v=1690412808"
        },
        {
            titleKey: 'home.collections.chains' as const,
            handle: "cadenas-1",
            image: "https://dtallesjewelry.com/cdn/shop/files/A73F9005-EE48-4B7C-A5A5-A7AA8CE0F07E_720x.png?v=1738870129"
        },
        {
            titleKey: 'home.collections.earrings' as const,
            handle: "aretes",
            image: "https://dtallesjewelry.com/cdn/shop/files/IMG_3962.jpg?v=1710515152&width=720"
        },
        {
            titleKey: 'home.collections.bracelets' as const,
            handle: "manillas",
            image: "https://dtallesjewelry.com/cdn/shop/products/P3200762.jpg?v=1630121759&width=720"
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
