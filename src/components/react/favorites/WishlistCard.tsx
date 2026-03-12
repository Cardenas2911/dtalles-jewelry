import React, { useState } from 'react';
import { addCartItem, setIsCartOpen } from '../../../store/cart';
import { toggleFavorite } from '../../../store/favorites'; 
import { getRoute } from '../../../utils/paths'; 
import { getTranslationFunctionForLang } from '../../../i18n/utils';

interface WishlistCardProps {
    item: {
        id: string;
        title: string;
        price: string;
        image: string;
        handle: string;
        variantId?: string;
        availableForSale?: boolean;
    };
    lang?: 'es' | 'en';
}

export default function WishlistCard({ item, lang = 'es' }: WishlistCardProps) {
    const t = getTranslationFunctionForLang(lang);
    const [moving, setMoving] = useState(false);

    const handleMoveToBag = () => {
        setMoving(true);

        addCartItem({
            id: item.variantId || item.id,
            title: item.title,
            price: parseFloat(item.price),
            image: item.image,
            handle: item.handle,
            quantity: 1
        });

        setTimeout(() => {
            toggleFavorite(item);
            setMoving(false);
            setIsCartOpen(true);
        }, 600);
    };

    const handleRemove = () => {
        toggleFavorite(item);
    };

    const isAvailable = item.availableForSale !== false;

    return (
        <article className="group relative flex flex-col h-full animate-fade-in-up bg-[#111] border border-white/5 hover:border-[#d4af37]/30 transition-colors duration-300">
            <button
                onClick={handleRemove}
                className="absolute top-2 right-2 z-20 text-gray-500 hover:text-red-500 transition-colors p-2"
                aria-label={t('ui.product.removeFav')}
            >
                <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <a href={getRoute(`/producto/${item.handle}`, lang)} className="aspect-[4/5] overflow-hidden relative block bg-[#050505]">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
            </a>

            <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${isAvailable ? 'text-emerald-500' : 'text-gray-500'}`}>
                        {isAvailable ? t('ui.product.inStock') : t('ui.product.outOfStock')}
                    </span>
                </div>

                <h3 className="text-[#FAFAF5] font-sans font-medium text-sm md:text-base leading-tight mb-1 line-clamp-2">
                    <a href={getRoute(`/producto/${item.handle}`, lang)}>{item.title}</a>
                </h3>

                <div className="mt-auto pt-2">
                    <span className="text-[#d4af37] text-xl font-light">
                        ${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                </div>

                <button
                    onClick={handleMoveToBag}
                    disabled={moving || !isAvailable}
                    className={`w-full py-3 mt-2 border text-[10px] uppercase font-bold tracking-[2px] transition-all flex items-center justify-center gap-2 ${isAvailable
                        ? 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black'
                        : 'border-white/10 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {moving ? t('ui.product.moving') : isAvailable ? t('ui.product.moveToBag') : t('ui.product.notifyMe')}
                </button>
            </div>
        </article>
    );
}
