import React from 'react';
import { setIsSearchOpen } from '../../store/search';

export default function PredictiveSearch() {
    return (
        <button
            onClick={() => setIsSearchOpen(true)}
            className="text-[#FAFAF5]/80 hover:text-[#d4af37] transition-colors p-1"
            aria-label="Buscar"
        >
            <span className="material-symbols-outlined text-[24px]">search</span>
        </button>
    );
}
