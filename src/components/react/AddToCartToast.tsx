import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { showAddToCartToast } from '../../store/cart';

export default function AddToCartToast() {
    const visible = useStore(showAddToCartToast);

    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => showAddToCartToast.set(false), 2500);
        return () => clearTimeout(t);
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            className="fixed left-4 right-4 bottom-32 lg:bottom-8 z-[55] flex justify-center pointer-events-none"
            role="status"
            aria-live="polite"
        >
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#111] border border-[#d4af37]/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-fade-in">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                </span>
                <span className="text-[#FAFAF5] font-semibold text-sm">Añadido a la bolsa</span>
            </div>
        </div>
    );
}
