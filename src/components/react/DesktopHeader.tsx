import React, { useState, useEffect, useRef } from 'react';
import PredictiveSearch from './PredictiveSearch';
import { useStore } from '@nanostores/react';
import { isCartOpen, setIsCartOpen, cartItems } from '../../store/cart';
import { favoriteItems } from '../../store/favorites';
import { resolvePath } from '../../utils/paths';

// Navigation Data
const NAV_ITEMS = [
    {
        label: 'Inicio', href: resolvePath('/'),
        simple: true // Enlace simple, sin mega menu
    },
    {
        label: 'Tienda', href: resolvePath('/tienda'),
        simple: true
    },
    {
        label: 'Hombre', href: resolvePath('/hombre'),
        categories: ['Cadenas', 'Esclavas', 'Anillos', 'Dijes'],
        purity: ['Oro 10k (Resistencia)', 'Oro 14k (Estándar)', 'Oro 18k (Exclusivo)'],
        styles: ['Cuban Links', 'Soga (Rope)', 'Figaro', 'Tenis'],
        image: resolvePath('/images/menu-hombre.webp'),
        alt: 'Cadena Cubana de Oro 14k - Joyería Exclusiva para Hombre',
        promoText: 'EL BRILLO CLÁSICO'
    },
    {
        label: 'Mujer', href: resolvePath('/mujer'),
        categories: ['Collares', 'Aretes', 'Anillos', 'Tobilleras'],
        purity: ['Oro 10k', 'Oro 14k', 'Oro 18k'],
        styles: ['Gargantillas', 'Huggies', 'Solitarios', 'Sets'],
        image: resolvePath('/images/menu-mujer.webp'),
        alt: 'Joyería Fina de Oro para Mujer - Aretes y Collares',
        promoText: 'ELEGANCIA PURA'
    },
    {
        label: 'Religiosos', href: resolvePath('/coleccion/religiosa'),
        categories: ['Cruces', 'Medallas', 'Rosarios', 'Juegos'],
        purity: ['Oro 10k', 'Oro 14k'],
        styles: ['San Judas', 'Virgen Guadalupe', 'Cristo', 'Ángeles'],
        image: resolvePath('/images/menu-religiosos.webp'),
        alt: 'Medallas y Cruces de Oro 14k - Colección Religiosa',
        promoText: 'DEVOCIÓN EN ORO'
    },
    {
        label: 'Niños', href: resolvePath('/ninos'),
        categories: ['Aretes', 'Broqueles', 'Esclavas', 'Cadenas'],
        purity: ['Oro 10k', 'Oro 14k'],
        styles: ['Recién Nacido', 'Bautizo', 'Primera Comunión', 'Animalitos'],
        image: resolvePath('/images/menu-ninos.webp'),
        alt: 'Joyería de Oro para Niños y Bebés - Hipoalergénico',
        promoText: 'PEQUEÑOS TESOROS'
    },
    {
        label: 'Regalos', href: resolvePath('/guia-regalos'),
        categories: ['Para Ella', 'Para Él', 'Aniversario', 'Cumpleaños'],
        purity: ['Oro 10k', 'Oro 14k'],
        styles: ['Personalizados', 'Iniciales', 'Corazones', 'Infinito'],
        image: resolvePath('/images/menu-regalos.webp'),
        alt: 'Regalos de Joyería en Oro - Detalles Especiales y Aniversarios',
        promoText: 'MOMENTOS DE ORO'
    },
    {
        label: 'Lo Nuevo', href: resolvePath('/coleccion/nuevo'),
        highlight: true
    },
    {
        label: 'Vender Oro', href: resolvePath('/servicios/vender-oro'),
        highlight: true // Special style
    }
];

export default function DesktopHeader() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const $cartItems = useStore(cartItems);
    const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);
    const $favorites = useStore(favoriteItems);
    const favCount = Object.keys($favorites).length;

    // Smart Sticky Logic
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show background blur after scrolling a bit
            setIsScrolled(currentScrollY > 20);

            if (currentScrollY > 100) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling DOWN -> Hide
                    setIsVisible(false);
                } else {
                    // Scrolling UP -> Show
                    setIsVisible(true);
                }
            } else {
                // Top of page -> Always Show
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    // Menu Hover Handlers (with delay to prevent flickering)
    const handleMouseEnter = (label: string) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setActiveMenu(label);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setActiveMenu(null);
        }, 150);
    };

    // Active item data
    const activeItem = NAV_ITEMS.find(item => item.label === activeMenu);

    return (
        <header
            className={`hidden lg:block fixed top-0 w-full z-50 transition-all duration-500 ease-in-out transform 
                ${isVisible ? 'translate-y-0' : '-translate-y-full'}
                ${isScrolled ? 'bg-[#050505]/95 backdrop-blur-md shadow-[0_1px_0_rgba(212,175,55,0.2)]' : 'bg-[#050505] shadow-none'}
            `}
            onMouseLeave={handleMouseLeave}
        >
            <div className="max-w-[1920px] mx-auto px-12 h-24 flex items-center justify-between relative z-50">
                {/* 1. Left: Logo */}
                <div className="w-1/4 flex items-center">
                    <a href={resolvePath('/')} className="group block">
                        <img
                            src={resolvePath('/images/Logo.webp')}
                            alt="Dtalles Jewelry - Joyería de Oro en Miami"
                            className="h-20 md:h-24 w-auto object-contain"
                        />
                    </a>
                </div>

                {/* 2. Center: Mega Menu Navigation */}
                <nav className="w-1/2 flex justify-center items-center h-full">
                    <ul className="flex items-center gap-10 h-full">
                        {NAV_ITEMS.map((item) => (
                            <li
                                key={item.label}
                                className="h-full flex items-center"
                                onMouseEnter={() => { if (item.highlight || item.simple) { setActiveMenu(null); } else { handleMouseEnter(item.label); } }}
                            >
                                <a
                                    href={item.href}
                                    className={`relative text-[13px] font-bold uppercase tracking-[1.5px] transition-colors py-8
                                        ${item.highlight ? 'text-[#d4af37]' : 'text-[#FAFAF5] hover:text-[#d4af37]'}
                                        ${activeMenu === item.label ? 'text-[#d4af37]' : ''}
                                    `}
                                >
                                    {item.label}
                                    {/* Animated Underline */}
                                    {!item.highlight && (
                                        <span className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#d4af37] transition-all duration-300 ${activeMenu === item.label ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* 3. Right: Tools */}
                <div className="w-1/4 flex justify-end items-center gap-6">
                    {/* Predictive Search */}
                    <PredictiveSearch />

                    {/* Favorites */}
                    <a href={resolvePath('/favoritos')} className="text-[#FAFAF5] hover:text-[#d4af37] transition-colors relative" aria-label="Favoritos">
                        <span className="material-symbols-outlined text-[24px]">favorite</span>
                        {favCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#d4af37] text-[8px] font-bold text-black">
                                {favCount}
                            </span>
                        )}
                    </a>

                    {/* Account */}
                    <a href={resolvePath('/account/login')} className="text-[#FAFAF5] hover:text-[#d4af37] transition-colors" aria-label="Cuenta">
                        <span className="material-symbols-outlined text-[24px]">person</span>
                    </a>

                    {/* Cart Trigger */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="text-[#FAFAF5] hover:text-[#d4af37] transition-colors relative"
                        aria-label="Carrito"
                    >
                        <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-black">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Overlay de fondo cuando el mega menú está abierto */}
            {activeMenu && activeItem && !activeItem.highlight && (
                <div
                    className="fixed inset-0 top-[72px] bg-black/60 backdrop-blur-sm z-40 pointer-events-none"
                    style={{ animation: 'fadeIn 0.2s ease' }}
                />
            )}

            {/* MEGA MENU PANEL */}
            <div
                className={`absolute left-0 top-full w-full z-50 transition-all duration-300 ease-out overflow-hidden
                    ${activeMenu && activeItem && !activeItem.highlight
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-3'
                    }
                `}
                style={{
                    background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
                    borderTop: '1px solid rgba(212, 175, 55, 0.5)',
                    boxShadow: '0 20px 60px -10px rgba(0,0,0,0.9), 0 2px 0 0 rgba(212,175,55,0.3), inset 0 1px 0 0 rgba(212,175,55,0.15)'
                }}
                onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); }}
                onMouseLeave={handleMouseLeave}
            >
                {activeItem && !activeItem.highlight && (
                    <div className="max-w-7xl mx-auto px-12 py-10 relative">
                        {/* Línea decorativa dorada superior */}
                        <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
                        <div className="grid grid-cols-4 gap-8">
                            {/* Col 1: Categories */}
                            <div className="space-y-6 border-r border-[#d4af37]/10 pr-6">
                                <h4 className="text-[#d4af37] font-serif text-lg italic mb-2">Categorías</h4>
                                <ul className="space-y-3">
                                    {activeItem.categories?.map(cat => (
                                        <li key={cat}>
                                            <a href={`${activeItem.href}?category=${cat.toLowerCase()}`} className="text-[#FAFAF5] text-sm hover:text-[#d4af37] transition-colors hover:pl-2 duration-300 flex items-center gap-2">
                                                <span className="w-1 h-px bg-[#d4af37] opacity-0 group-hover:opacity-100"></span>
                                                {cat}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <a href={activeItem.href} className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-[#d4af37] border-b border-[#d4af37] pb-1">Ver Todo</a>
                            </div>

                            {/* Col 2: Style */}
                            <div className="space-y-6 border-r border-[#d4af37]/10 pr-6">
                                <h4 className="text-[#d4af37] font-serif text-lg italic mb-2">Estilos</h4>
                                <ul className="space-y-3">
                                    {activeItem.styles?.map(style => (
                                        <li key={style}>
                                            <a href={`${activeItem.href}?style=${style.toLowerCase().replace(' ', '-')}`} className="text-gray-400 text-sm hover:text-white transition-colors">
                                                {style}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Col 4: Visual Hook */}
                            <div className="relative h-64 rounded-sm overflow-hidden group cursor-pointer bg-[#1a1a1a]">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>
                                <img
                                    src={activeItem.image}
                                    alt={activeItem.alt || activeItem.promoText}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-6 left-6 z-20">
                                    <span className="text-[#d4af37] text-[10px] font-bold uppercase tracking-widest mb-2 block">Lo más vendido</span>
                                    <h3 className="text-white font-serif text-2xl">{activeItem.promoText}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
