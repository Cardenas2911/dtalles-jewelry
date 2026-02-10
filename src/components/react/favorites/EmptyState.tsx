import React from 'react';

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-fade-in">
            <div className="relative mb-8 opacity-50">
                <span className="material-symbols-outlined text-[80px] text-[#d4af37] font-thin">favorite</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-serif text-[#FAFAF5] mb-4">
                Tu cofre está vacío
            </h2>

            <p className="text-gray-400 mb-10 max-w-md text-sm md:text-base font-light leading-relaxed">
                El oro es una inversión eterna. Empieza tu colección hoy con piezas que cuentan tu historia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a
                    href="/hombre"
                    className="flex-1 py-4 border border-[#d4af37] text-[#d4af37] uppercase tracking-[2px] text-xs font-bold hover:bg-[#d4af37] hover:text-black transition-all text-center"
                >
                    Ver Joyas Hombre
                </a>
                <a
                    href="/mujer"
                    className="flex-1 py-4 bg-[#d4af37] text-black border border-[#d4af37] uppercase tracking-[2px] text-xs font-bold hover:bg-white hover:border-white transition-all text-center"
                >
                    Ver Joyas Mujer
                </a>
            </div>
        </div>
    );
}
