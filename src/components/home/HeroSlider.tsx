import React, { useState, useEffect } from 'react';
import { resolvePath } from '../../utils/paths';

// Slides Configuration
const SLIDES = [
    {
        id: 1,
        image: '/images/hombre carrusel.webp',
        width: 1920,
        height: 1080,
        alt: 'Joyas de Oro Italiano 10k y 14k - DTalles Jewelry',
        titleAttribute: 'Oro Original Italiano 10 y 14 Kilates - DTalles Jewelry',
        alignment: 'items-start text-left', // Desktop: Left
        mobileAlignment: 'items-center text-center justify-end pb-20', // Mobile: Bottom Center
        bgPosition: 'object-center md:object-right',
        overline: 'EXCLUSIVIDAD ITALIANA',
        title: 'Oro Original Italiano 10 y 14 Kilates',
        subtitle: 'Autenticidad garantizada en cada gramo. El lujo del oro italiano directamente a tus manos.',
        cta: 'EXPLORAR COLECCIÓN',
        ctaLink: '/tienda',
        ctaStyle: 'bg-[#d4af37] text-black border-[#d4af37] hover:bg-white hover:border-white'
    },
    {
        id: 2,
        image: '/images/Mujer carrusel.webp',
        width: 1920,
        height: 1080,
        alt: 'Joyería Fina para Mujer - Layering y Gargantillas Oro',
        titleAttribute: 'Colección de Joyas para Mujer - Layering',
        alignment: 'items-start text-left', // Desktop: Left
        mobileAlignment: 'items-center text-center justify-end pb-20', // Mobile: Bottom Center
        bgPosition: 'object-center md:object-right',
        overline: 'NUEVA COLECCIÓN',
        title: 'Elegancia en Capas',
        subtitle: 'Descubre el arte del layering. Crea un look único para cada día.',
        cta: 'CREAR MI LOOK',
        ctaLink: '/mujer',
        ctaStyle: 'bg-transparent text-[#d4af37] border-2 border-[#d4af37] hover:bg-[#d4af37] hover:text-black backdrop-blur-sm'
    },
    {
        id: 3,
        image: '/images/Regalos carrusel.webp',
        width: 1920,
        height: 1080,
        alt: 'Guía de Regalos de Joyería - Empaque de Lujo',
        titleAttribute: 'El Arte de Regalar Joyas - DTalles Jewelry',
        alignment: 'items-start text-left', // Desktop: Left
        mobileAlignment: 'items-center text-left justify-end pb-20', // Mobile: Bottom Left
        bgPosition: 'object-center',
        overline: 'EL ARTE DE REGALAR',
        title: 'Un D-Talle Inolvidable',
        subtitle: 'Empaque de lujo y envío asegurado. El regalo que habla por ti.',
        cta: 'GUÍA DE REGALOS',
        ctaLink: '/guia-regalos',
        ctaStyle: 'bg-white text-black border-white hover:bg-[#d4af37] hover:border-[#d4af37]'
    }
];

const SLIDE_DURATION = 7000; // 7 seconds

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, SLIDE_DURATION);

        return () => clearInterval(timer);
    }, [isPaused]);

    // Manual navigation
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <section
            className="relative w-full h-[100vh] md:h-[85vh] overflow-hidden bg-[#050505] font-sans group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Carrusel de Productos Destacados"
        >
            {SLIDES.map((slide, index) => {
                const isActive = index === currentSlide;

                return (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        aria-hidden={!isActive}
                    >
                        {/* 1. Background Image with Ken Burns */}
                        <div className="absolute inset-0 overflow-hidden">
                            <img
                                src={resolvePath(slide.image)}
                                alt={slide.alt}
                                title={slide.titleAttribute}
                                width={slide.width}
                                height={slide.height}
                                className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${isActive ? 'scale-110' : 'scale-100'} ${slide.bgPosition}`}
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "auto"}
                            />
                            {/* Cinematic Overlay (Gradient) - Stronger on Mobile */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent opacity-90 transition-opacity duration-1000 ${slide.alignment.includes('right') ? 'md:bg-gradient-to-l' : ''}`}></div>
                        </div>

                        {/* 2. Content */}
                        <div className={`relative z-20 h-full max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col ${slide.mobileAlignment} md:justify-center md:${slide.alignment}`}>
                            <div className={`w-full max-w-xl md:max-w-2xl opacity-0 ${isActive ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
                                {/* Overline */}
                                <span className="block text-[#d4af37] text-xs md:text-sm font-bold tracking-[0.2em] mb-3 md:mb-4 uppercase font-sans text-shadow-sm">
                                    {slide.overline}
                                </span>

                                {/* Title */}
                                {index === 0 ? (
                                    <h2 className="text-white font-serif text-[2.8rem] leading-[1.1] md:text-[4.5rem] md:leading-[1.1] mb-4 md:mb-6 text-balance font-bold drop-shadow-lg">
                                        <span className="bg-gradient-to-r from-[#f5e3a3] via-[#d4af37] to-[#f5e3a3] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                                            {slide.title}
                                        </span>
                                    </h2>
                                ) : (
                                    <h2 className="text-white font-serif text-[2.5rem] leading-[1.1] md:text-[3.5rem] md:leading-tight mb-4 md:mb-6 text-balance font-bold drop-shadow-lg">
                                        {slide.title}
                                    </h2>
                                )}

                                {/* Subtitle */}
                                <p className="text-gray-100 text-sm md:text-[1.1rem] font-light mb-8 md:mb-10 leading-relaxed max-w-sm md:max-w-lg text-balance font-sans drop-shadow-md mx-auto md:mx-0">
                                    {slide.subtitle}
                                </p>

                                {/* CTA */}
                                <a
                                    href={resolvePath(slide.ctaLink)}
                                    className={`inline-flex items-center justify-center px-8 py-4 text-xs md:text-sm font-bold uppercase tracking-[2px] transition-all duration-300 border font-sans min-h-[48px] w-full md:w-auto ${slide.ctaStyle}`}
                                    style={{ fontWeight: 600 }}
                                >
                                    {slide.cta}
                                </a>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* 3. Progress Indicators */}
            <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-30 flex justify-center gap-3 md:gap-4">
                {SLIDES.map((slide, index) => (
                    <button
                        key={slide.id}
                        onClick={() => goToSlide(index)}
                        className="group relative h-10 w-16 md:w-24 flex items-center justify-center cursor-pointer"
                        aria-label={`Ir al slide ${index + 1}`}
                    >
                        {/* Background Line */}
                        <div className="h-[2px] w-full bg-white/20 overflow-hidden relative rounded-full">
                            {/* Active Progress Fill */}
                            <div
                                className={`h-full bg-[#d4af37] absolute top-0 left-0 transition-opacity duration-300`}
                                style={{
                                    width: '100%',
                                    opacity: index < currentSlide ? 1 : 0
                                }}
                            ></div>

                            {/* Animated Progress for Active Slide */}
                            {index === currentSlide && (
                                <div
                                    className="absolute inset-0 bg-[#d4af37] origin-left animate-progress"
                                    style={{
                                        animationDuration: `${SLIDE_DURATION}ms`,
                                        animationPlayState: isPaused ? 'paused' : 'running'
                                    }}
                                ></div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Global Keyframes for Animations */}
            <style>{`
                @keyframes progress {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                .animate-progress {
                    animation-name: progress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translate3d(0, 40px, 0);
                    }
                    to {
                        opacity: 1;
                        transform: translate3d(0, 0, 0);
                    }
                }
                .animate-fade-in-up {
                    animation-name: fadeInUp;
                    animation-duration: 0.8s;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </section>
    );
}
