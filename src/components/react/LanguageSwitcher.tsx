import React from 'react';
import { getRoute, getSpanishRoute } from '../../utils/paths';

// Bandera de España (SVG inline circular)
function SpainFlag({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" className="rounded-full flex-shrink-0" style={{ overflow: 'hidden' }}>
            <rect width="32" height="32" fill="#C60B1E" />
            <rect y="8" width="32" height="16" fill="#FFC400" />
        </svg>
    );
}

// Bandera de USA (SVG inline circular)
function USAFlag({ size = 16 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" className="rounded-full flex-shrink-0" style={{ overflow: 'hidden' }}>
            <rect width="32" height="32" fill="#FFF" />
            {/* Franjas rojas */}
            <rect y="0" width="32" height="2.46" fill="#B22234" />
            <rect y="4.92" width="32" height="2.46" fill="#B22234" />
            <rect y="9.85" width="32" height="2.46" fill="#B22234" />
            <rect y="14.77" width="32" height="2.46" fill="#B22234" />
            <rect y="19.69" width="32" height="2.46" fill="#B22234" />
            <rect y="24.62" width="32" height="2.46" fill="#B22234" />
            <rect y="29.54" width="32" height="2.46" fill="#B22234" />
            {/* Cantón azul */}
            <rect width="12.8" height="17.23" fill="#3C3B6E" />
            {/* Estrellas simplificadas */}
            <circle cx="2" cy="2" r="0.7" fill="#FFF" />
            <circle cx="4.5" cy="2" r="0.7" fill="#FFF" />
            <circle cx="7" cy="2" r="0.7" fill="#FFF" />
            <circle cx="9.5" cy="2" r="0.7" fill="#FFF" />
            <circle cx="11.5" cy="2" r="0.7" fill="#FFF" />
            <circle cx="3.25" cy="4" r="0.7" fill="#FFF" />
            <circle cx="5.75" cy="4" r="0.7" fill="#FFF" />
            <circle cx="8.25" cy="4" r="0.7" fill="#FFF" />
            <circle cx="10.5" cy="4" r="0.7" fill="#FFF" />
            <circle cx="2" cy="6" r="0.7" fill="#FFF" />
            <circle cx="4.5" cy="6" r="0.7" fill="#FFF" />
            <circle cx="7" cy="6" r="0.7" fill="#FFF" />
            <circle cx="9.5" cy="6" r="0.7" fill="#FFF" />
            <circle cx="11.5" cy="6" r="0.7" fill="#FFF" />
            <circle cx="3.25" cy="8" r="0.7" fill="#FFF" />
            <circle cx="5.75" cy="8" r="0.7" fill="#FFF" />
            <circle cx="8.25" cy="8" r="0.7" fill="#FFF" />
            <circle cx="10.5" cy="8" r="0.7" fill="#FFF" />
            <circle cx="2" cy="10" r="0.7" fill="#FFF" />
            <circle cx="4.5" cy="10" r="0.7" fill="#FFF" />
            <circle cx="7" cy="10" r="0.7" fill="#FFF" />
            <circle cx="9.5" cy="10" r="0.7" fill="#FFF" />
            <circle cx="11.5" cy="10" r="0.7" fill="#FFF" />
            <circle cx="3.25" cy="12" r="0.7" fill="#FFF" />
            <circle cx="5.75" cy="12" r="0.7" fill="#FFF" />
            <circle cx="8.25" cy="12" r="0.7" fill="#FFF" />
            <circle cx="10.5" cy="12" r="0.7" fill="#FFF" />
            <circle cx="2" cy="14" r="0.7" fill="#FFF" />
            <circle cx="4.5" cy="14" r="0.7" fill="#FFF" />
            <circle cx="7" cy="14" r="0.7" fill="#FFF" />
            <circle cx="9.5" cy="14" r="0.7" fill="#FFF" />
            <circle cx="11.5" cy="14" r="0.7" fill="#FFF" />
            <circle cx="3.25" cy="16" r="0.7" fill="#FFF" />
            <circle cx="5.75" cy="16" r="0.7" fill="#FFF" />
            <circle cx="8.25" cy="16" r="0.7" fill="#FFF" />
        </svg>
    );
}

export default function LanguageSwitcher({ lang = 'es', className = '' }: { lang?: 'es' | 'en', className?: string }) {
    const handleSwitch = (newLang: 'es' | 'en') => {
        if (newLang === lang) return;

        const path = window.location.pathname;
        const search = window.location.search;
        let newPath = path;

        if (newLang === 'en') {
            // Ir de ES a EN
            const base = import.meta.env.BASE_URL;
            let cleanPath = path;
            if (base !== '/') {
                 const cleanBase = base.replace(/\/$/, '');
                 if (cleanPath.startsWith(cleanBase)) {
                     cleanPath = cleanPath.substring(cleanBase.length);
                 }
            }
            newPath = getRoute(cleanPath, 'en');
        } else {
            // Ir de EN a ES
            newPath = getSpanishRoute(path);
        }

        window.location.href = `${newPath}${search}`;
    };

    return (
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${className}`}>
            <button
                onClick={() => handleSwitch('es')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200 ${
                    lang === 'es' 
                        ? 'bg-[#d4af37]/15 text-[#d4af37] ring-1 ring-[#d4af37]/40' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Cambiar a Español"
            >
                <SpainFlag size={14} />
                <span>ES</span>
            </button>
            <button
                onClick={() => handleSwitch('en')}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-200 ${
                    lang === 'en' 
                        ? 'bg-[#d4af37]/15 text-[#d4af37] ring-1 ring-[#d4af37]/40' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                aria-label="Switch to English"
            >
                <USAFlag size={14} />
                <span>EN</span>
            </button>
        </div>
    );
}
