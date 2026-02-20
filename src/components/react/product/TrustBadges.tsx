import React from 'react';

export default function TrustBadges() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2 py-4 border-b border-white/5 mb-4">
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d4af37] text-lg">verified</span>
                <span className="text-[10px] md:text-xs text-[#FAFAF5]/80 uppercase tracking-wide font-bold">Oro Real</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d4af37] text-lg">local_shipping</span>
                <span className="text-[10px] md:text-xs text-[#FAFAF5]/80 uppercase tracking-wide font-bold">Envío Gratis</span>
            </div>
            <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#d4af37] text-lg">star</span>
                <span className="text-[10px] md:text-xs text-[#FAFAF5]/80 uppercase tracking-wide font-bold">5.0 Estrellas</span>
            </div>
        </div>
    );
}
