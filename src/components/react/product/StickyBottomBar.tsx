import React, { useState, useEffect } from 'react';
import { addCartItem, setIsCartOpen } from '../../../store/cart';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

interface StickyBottomBarProps {
    product: {
        id: string;
        title: string;
        handle: string;
    };
    selectedVariant: {
        id: string;
        price: { amount: string };
        availableForSale: boolean;
        title: string;
    };
    featuredImage?: string;
    lang?: 'es' | 'en';
}

export default function StickyBottomBar({ product, selectedVariant, featuredImage, lang = 'es' }: StickyBottomBarProps) {
    const t = getTranslationFunctionForLang(lang);
    const [isVisible, setIsVisible] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAdd = () => {
        setAdding(true);
        addCartItem({
            id: selectedVariant.id,
            title: product.title,
            price: parseFloat(selectedVariant.price.amount),
            image: featuredImage || '',
            handle: product.handle,
            variantTitle: selectedVariant.title,
            quantity: 1
        });
        setTimeout(() => {
            setAdding(false);
            setIsCartOpen(true);
        }, 600);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111] border-t border-[#d4af37]/30 p-4 lg:hidden animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-white text-xs font-bold truncate max-w-[150px]">{product.title}</span>
                    <span className="text-[#d4af37] text-sm font-serif">
                        ${parseFloat(selectedVariant.price.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!selectedVariant.availableForSale || adding}
                    className="bg-[#d4af37] text-black text-xs font-bold py-3 px-6 uppercase tracking-wider rounded-sm"
                >
                    {adding ? '...' : lang === 'en' ? 'Add' : 'Agregar'}
                </button>
            </div>
        </div>
    );
}
