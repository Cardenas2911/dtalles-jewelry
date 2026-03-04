import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('dtalles_cookie_consent');
        if (!consent) {
            // Give it a tiny delay to not block initial rendering aggressively
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        } else if (consent === 'all') {
            triggerAnalytics();
        }
    }, []);

    const triggerAnalytics = () => {
        // Disparar un evento global al que cualquier script de analíticas (Clarity, Pixel, GTM) 
        // pueda suscribirse si el cliente aceptó las cookies opcionales.
        window.dispatchEvent(new Event('cookie_consent_all'));
    };

    const handleAcceptAll = () => {
        localStorage.setItem('dtalles_cookie_consent', 'all');
        setIsVisible(false);
        triggerAnalytics();
    };

    const handleEssentialOnly = () => {
        localStorage.setItem('dtalles_cookie_consent', 'essential');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed bottom-0 left-0 w-full z-[150] bg-[#121212]/95 backdrop-blur-md border-t border-[#d4af37]/30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transform translate-y-0 transition-transform duration-500 animate-slide-up"
            role="alertdialog"
            aria-labelledby="cookie-title"
            aria-describedby="cookie-desc"
        >
            <div className="max-w-7xl mx-auto px-5 py-5 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex-1 text-sm text-gray-300 pr-0 md:pr-10">
                    <h3 id="cookie-title" className="text-[#FAFAF5] font-serif text-lg mb-1 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#d4af37] text-xl">cookie</span>
                        Tu Privacidad Importa
                    </h3>
                    <p id="cookie-desc" className="mb-2 leading-relaxed">
                        En DTalles Jewelry utilizamos cookies para asegurar que obtengas la mejor experiencia en nuestra tienda, recordar tus favoritos y ofrecer recomendaciones personalizadas.
                    </p>
                    <p className="text-xs text-gray-500">
                        Al pulsar "Aceptar Todo", consientes el uso de cookies analíticas y de rendimiento. Puedes leer más detalles en nuestra <a href="/politicas" className="text-[#d4af37] underline hover:text-white transition-colors">Política de Privacidad</a>.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch gap-3 shrink-0">
                    <button
                        onClick={handleEssentialOnly}
                        className="px-6 py-3 bg-transparent border border-gray-600 text-gray-300 text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:border-white hover:text-white transition-colors whitespace-nowrap"
                    >
                        Rechazar Opcionales
                    </button>
                    <button
                        onClick={handleAcceptAll}
                        className="px-6 py-3 bg-[#d4af37] text-black border border-transparent text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                    >
                        Aceptar Todo
                    </button>
                </div>
            </div>
            {/* Pequeño CSS integrado para la animación inicial suave */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slideUpBanner {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUpBanner 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}} />
        </div>
    );
}
