import React, { useState, useEffect } from 'react';
import { addCartItem, setIsCartOpen } from '../../../store/cart';

interface StickyBottomBarProps {
    product: {
        id: string; // Should be the Selected Variant ID really, but we need to track that state globally or pass it down. 
        // For simplicity, we might default to main product if variant state isn't lifted (it is in Parent).
        // So we need props: selectedVariant.
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
}

export default function StickyBottomBar({ product, selectedVariant, featuredImage }: StickyBottomBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show bar after scrolling past 600px (roughly past the main CTA area on mobile)
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111] border-t border-[#d4af37]/30 p-4 md:hidden animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                    <span className="text-white text-xs font-bold truncate max-w-[150px]">{product.title}</span>
                    <span className="text-[#d4af37] text-sm font-serif">
                        ${parseFloat(selectedVariant.price.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!selectedVariant.availableForSale || adding}
                    className="bg-[#d4af37] text-black text-xs font-bold py-3 px-6 uppercase tracking-wider rounded-sm"
                >
                    {adding ? '...' : 'Agregar'}
                </button>
            </div>
        </div>
    );
}
