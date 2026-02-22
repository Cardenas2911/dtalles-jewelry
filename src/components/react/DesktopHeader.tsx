import React, { useState, useEffect, useRef } from 'react';
import PredictiveSearch from './PredictiveSearch';
import { useStore } from '@nanostores/react';
import { isCartOpen, setIsCartOpen, cartItems } from '../../store/cart';
import { favoriteItems } from '../../store/favorites';
import { resolvePath } from '../../utils/paths';

// Tipos auxiliares
interface NavSubItem { label: string; href: string; }
interface NavItem {
    label: string;
    href: string;
    simple?: boolean;
    highlight?: boolean;
    categories?: NavSubItem[];
    styles?: NavSubItem[];
    image?: string;
    alt?: string;
    promoText?: string;
}

// Ayudante para construir URL de filtro
const f = (productType?: string, tag?: string) => {
    const base = resolvePath('/tienda');
    const params = new URLSearchParams();
    if (productType) params.set('productType', productType);
    if (tag) params.set('tag', tag);
    return `${base}?${params.toString()}`;
};

// Navigation Data — tags verificados contra Shopify el 2026-02-19
const NAV_ITEMS: NavItem[] = [
    { label: 'Inicio', href: resolvePath('/'), simple: true },
    { label: 'Tienda', href: resolvePath('/tienda'), simple: true },
    {
        label: 'Hombre', href: resolvePath('/hombre'),
        categories: [
            { label: 'Cadenas', href: f('Cadena', 'hombre') },
            { label: 'Pulseras', href: f('Pulsera', 'hombre') },
            { label: 'Anillos', href: f('Anillo', 'hombre') },
            { label: 'Collares con Dije', href: f('Collar con Dije', 'hombre') },
        ],
        styles: [
            { label: 'Cuban Links', href: f(undefined, 'cuban links') },
            { label: 'Cadena Soga', href: f(undefined, 'cadena soga') },
            { label: 'Miami Cuban', href: f(undefined, 'miami cuban') },
            { label: 'Box Chain', href: f(undefined, 'box chain') },
        ],
        image: resolvePath('/images/menu-hombre.webp'),
        alt: 'Cadena Cubana de Oro 10k - Joyería Exclusiva para Hombre',
        promoText: 'EL BRILLO CLÁSICO'
    },
    {
        label: 'Mujer', href: resolvePath('/mujer'),
        categories: [
            { label: 'Collares', href: f('Collar', 'mujer') },
            { label: 'Aretes', href: f('Aretes', 'mujer') },
            { label: 'Anillos', href: f('Anillo', 'mujer') },
            { label: 'Pulseras', href: f('Pulsera', 'mujer') },
        ],
        styles: [
            { label: 'Gargantillas', href: f(undefined, 'gargantilla') },
            { label: 'Aretes de Aro', href: f(undefined, 'aretes de aro') },
            { label: 'Minimalistas', href: f(undefined, 'minimalista') },
            { label: 'Sets de Oro', href: f(undefined, 'set oro') },
        ],
        image: resolvePath('/images/menu-mujer.webp'),
        alt: 'Joyería Fina de Oro para Mujer - Aretes y Collares',
        promoText: 'ELEGANCIA PURA'
    },
    {
        label: 'Religiosos', href: resolvePath('/coleccion/religiosa'),
        categories: [
            { label: 'Cruces', href: f(undefined, 'joyería religiosa') },
            { label: 'Collares con Cruz', href: f('Collar con Dije', 'joyería religiosa') },
            { label: 'Anillos', href: f('Anillo', 'joyería religiosa') },
            { label: 'Amuletos', href: f(undefined, 'amuleto') },
        ],
        styles: [
            { label: 'Cruz Minimalista', href: f(undefined, 'cruz minimalista') },
            { label: 'Casino', href: f(undefined, 'casino') },
            { label: 'Buena Suerte', href: f(undefined, 'buena suerte') },
            { label: 'San Valentín', href: f(undefined, 'san valentin') },
        ],
        image: resolvePath('/images/menu-religiosos.webp'),
        alt: 'Medallas y Cruces de Oro 10k - Colección Religiosa',
        promoText: 'DEVOCIÓN EN ORO'
    },
    {
        label: 'Niños', href: resolvePath('/ninos'),
        categories: [
            { label: 'Aretes', href: f('Aretes', 'niña') },
            { label: 'Broqueles', href: f(undefined, 'broqueles') },
            { label: 'Pulseras', href: f('Pulsera', 'niña') },
            { label: 'Cadenas', href: f('Cadena', 'niña') },
        ],
        styles: [
            { label: 'Florales', href: f(undefined, 'floral jewelry') },
            { label: 'Mariquitas', href: f(undefined, 'aretes mariquita') },
            { label: 'Ligeros', href: f(undefined, 'ligeros') },
            { label: 'Básicos', href: f(undefined, 'básicos') },
        ],
        image: resolvePath('/images/menu-ninos.webp'),
        alt: 'Joyería de Oro para Niños y Bebés - Hipoalergénico',
        promoText: 'PEQUEÑOS TESOROS'
    },
    {
        label: 'Regalos', href: resolvePath('/guia-regalos'),
        categories: [
            { label: 'Para Ella', href: f(undefined, 'regalo mujer') },
            { label: 'Para Él', href: f(undefined, 'regalo hombre') },
            { label: 'Aniversario', href: f(undefined, 'regalo aniversario') },
            { label: 'Lujo', href: f(undefined, 'regalo lujo') },
        ],
        styles: [
            { label: 'Corazones', href: f(undefined, 'dije corazon') },
            { label: 'Bridal', href: f(undefined, 'bridal') },
            { label: 'Anillos de Compromiso', href: f(undefined, 'anillo compromiso') },
            { label: 'Para Novia', href: f(undefined, 'regalo novia') },
        ],
        image: resolvePath('/images/menu-regalos.webp'),
        alt: 'Regalos de Joyería en Oro - Detalles Especiales y Aniversarios',
        promoText: 'MOMENTOS DE ORO'
    },
    { label: 'Lo Nuevo', href: resolvePath('/coleccion/nuevo'), highlight: true },
    { label: 'Vender Oro', href: resolvePath('/servicios/vender-oro'), highlight: true },
];

export default function DesktopHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [pathname, setPathname] = useState('');
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const $cartItems = useStore(cartItems);
    const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);
    const $favorites = useStore(favoriteItems);
    const favCount = Object.keys($favorites).length;

    // Ruta actual para marcar página activa (incluye navegación con View Transitions)
    useEffect(() => {
        const update = () => setPathname(typeof window !== 'undefined' ? window.location.pathname : '');
        update();
        window.addEventListener('astro:page-load', update);
        return () => window.removeEventListener('astro:page-load', update);
    }, []);

    const isCurrentPage = (item: NavItem) => {
        if (!pathname) return false;
        if (pathname === item.href) return true;
        if (item.href !== resolvePath('/') && pathname.startsWith(item.href + '/')) return true;
        return false;
    };

    // Scroll para cambiar fondo (siempre visible)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Menu Hover Handlers
    const handleMouseEnter = (label: string) => {
        if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
        setActiveMenu(label);
    };

    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => {
            setActiveMenu(null);
        }, 150);
    };

    const activeItem = NAV_ITEMS.find(item => item.label === activeMenu);

    return (
        <header
            className="hidden lg:flex flex-col fixed top-0 w-full z-50 transition-colors duration-300"
            onMouseLeave={handleMouseLeave}
        >
            {/* Announcement Bar — más compacto en 1024 */}
            <div className="relative z-50 w-full text-center py-1.5 lg:py-2 text-[9px] lg:text-[10px] uppercase tracking-widest font-medium bg-[#d4af37] text-[#050505] font-bold">
                Envío asegurado a todo USA &nbsp; · &nbsp; Oro Sólido 10k Certificado &nbsp; · &nbsp; Garantía de por vida
            </div>

            {/* Main Header Bar */}
            <div className={`relative z-50 w-full transition-all duration-300
                ${isScrolled ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#d4af37]/15' : 'bg-[#050505]'}
            `}>
                <div className="max-w-[1440px] mx-auto px-4 lg:px-5 xl:px-8 h-16 xl:h-20 flex items-center justify-between relative z-50 gap-1">

                    {/* LEFT: Logo — más pequeño para dar espacio al menú en 1 línea */}
                    <div className="flex-shrink-0">
                        <a href={resolvePath('/')} className="block group">
                            <img
                                src={resolvePath('/images/Logo.webp')}
                                alt="Dtalles Jewelry - Joyería de Oro en Miami"
                                className="h-9 lg:h-10 xl:h-12 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                            />
                        </a>
                    </div>

                    {/* CENTER: Navigation — 1 sola fila, sin wrap; texto e iconos más pequeños */}
                    <nav className="flex-1 flex justify-center min-w-0 overflow-hidden">
                        <ul className="flex items-center gap-0 flex-nowrap justify-center">
                            {NAV_ITEMS.map((item) => (
                                <li
                                    key={item.label}
                                    className="relative flex-shrink-0"
                                    onMouseEnter={() => handleMouseEnter(item.label)}
                                >
                                    <a
                                        href={item.href}
                                        className={`relative flex flex-col items-center px-1.5 lg:px-2 xl:px-2.5 py-1.5 rounded-md text-[8px] lg:text-[8.5px] xl:text-[9.5px] font-semibold uppercase tracking-[0.08em] xl:tracking-[0.1em] transition-all duration-200 whitespace-nowrap
                                            ${item.highlight
                                                ? 'text-[#d4af37] hover:bg-[#d4af37]/10'
                                                : isCurrentPage(item)
                                                    ? 'text-[#d4af37] bg-white/5'
                                                    : activeMenu === item.label
                                                        ? 'text-[#d4af37] bg-white/5'
                                                        : 'text-[#FAFAF5]/80 hover:text-[#FAFAF5] hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {item.label}
                                        {/* Indicador activo (hover o página actual) */}
                                        {!item.highlight && (
                                            <span className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-[#d4af37] transition-all duration-300
                                                ${activeMenu === item.label || isCurrentPage(item) ? 'w-5 opacity-100' : 'w-0 opacity-0'}
                                            `} />
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* RIGHT: Actions — iconos más pequeños para que el menú quepa en 1 línea */}
                    <div className="flex-shrink-0 flex items-center gap-2 lg:gap-3 xl:gap-4">
                        {/* Search */}
                        <PredictiveSearch />

                        {/* Divider */}
                        <div className="w-px h-3.5 lg:h-4 bg-[#d4af37]/30 hidden sm:block" />

                        {/* Favorites */}
                        <a
                            href={resolvePath('/favoritos')}
                            className="relative group text-[#FAFAF5]/80 hover:text-[#d4af37] transition-colors p-0.5"
                            aria-label="Favoritos"
                        >
                            <span className="material-symbols-outlined text-[18px] lg:text-[19px] xl:text-[22px]">favorite</span>
                            {favCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#d4af37] text-[8px] font-bold text-[#050505]">
                                    {favCount}
                                </span>
                            )}
                        </a>

                        {/* Account */}
                        <a
                            href="https://dtalles-jewelry.myshopify.com/account"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#FAFAF5]/80 hover:text-[#d4af37] transition-colors p-0.5"
                            aria-label="Cuenta"
                        >
                            <span className="material-symbols-outlined text-[18px] lg:text-[19px] xl:text-[22px]">person</span>
                        </a>

                        {/* Cart */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative group text-[#FAFAF5]/80 hover:text-[#d4af37] transition-colors p-0.5"
                            aria-label="Carrito"
                        >
                            <span className="material-symbols-outlined text-[18px] lg:text-[19px] xl:text-[22px]">shopping_bag</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#d4af37] text-[8px] font-bold text-[#050505]">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay del mega menú */}
            {
                activeMenu && activeItem && !activeItem.highlight && !activeItem.simple && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-none"
                        style={{ top: '0', animation: 'fadeIn 0.2s ease' }}
                    />
                )
            }

            {/* Mega Menu Panel — más compacto en 1024 */}
            <div
                className={`absolute left-1/2 -translate-x-1/2 w-full max-w-4xl xl:max-w-5xl z-50 transition-all duration-300 ease-out overflow-hidden rounded-b-xl border-x border-b border-[#d4af37]/30
                    ${activeMenu && activeItem && !activeItem.highlight && !activeItem.simple
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-3'
                    }
                `}
                style={{
                    top: '100%',
                    background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
                    boxShadow: '0 20px 60px -10px rgba(0,0,0,0.9), 0 2px 0 0 rgba(212,175,55,0.3)'
                }}
                onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); }}
                onMouseLeave={handleMouseLeave}
            >
                {activeItem && !activeItem.highlight && (
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12 py-6 lg:py-8 xl:py-10 relative">
                        <div className="absolute top-0 left-6 lg:left-8 xl:left-12 right-6 lg:right-8 xl:right-12 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />
                        <div className="grid grid-cols-3 gap-4 lg:gap-6 xl:gap-8">
                            {/* Col 1: Categorías */}
                            <div className="space-y-4 lg:space-y-5 border-r border-[#d4af37]/10 pr-4 lg:pr-6">
                                <h4 className="text-[#d4af37] font-serif text-sm lg:text-base italic mb-1 flex items-center gap-2">
                                    <span className="w-3 h-px bg-[#d4af37]" /> Categorías
                                </h4>
                                <ul className="space-y-3">
                                    {activeItem.categories?.map(cat => (
                                        <li key={cat.label}>
                                            <a href={cat.href} className="text-[#FAFAF5]/80 text-sm hover:text-[#d4af37] hover:pl-2 transition-all duration-200 flex items-center gap-2 group/link">
                                                <span className="w-0 group-hover/link:w-3 h-px bg-[#d4af37] transition-all duration-300 flex-shrink-0" />
                                                {cat.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                                <a href={activeItem.href} className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-widest text-[#d4af37] border-b border-[#d4af37]/40 pb-1 hover:border-[#d4af37] transition-colors">
                                    Ver Todo
                                </a>
                            </div>

                            {/* Col 2: Estilos */}
                            <div className="space-y-4 lg:space-y-5 border-r border-[#d4af37]/10 pr-4 lg:pr-6">
                                <h4 className="text-[#d4af37] font-serif text-sm lg:text-base italic mb-1 flex items-center gap-2">
                                    <span className="w-3 h-px bg-[#d4af37]" /> Estilos
                                </h4>
                                <ul className="space-y-3">
                                    {activeItem.styles?.map(style => (
                                        <li key={style.label}>
                                            <a href={style.href} className="text-gray-400 text-sm hover:text-white hover:pl-2 transition-all duration-200">
                                                {style.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Col 3: Visual (Sin spacer previo) — altura adaptada a 1024 */}
                            <div className="relative h-48 lg:h-52 xl:h-60 rounded-sm overflow-hidden group cursor-pointer bg-[#1a1a1a]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                                <img
                                    src={activeItem.image}
                                    alt={activeItem.alt || activeItem.promoText}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-5 left-5 z-20">
                                    <span className="text-[#d4af37] text-[9px] font-bold uppercase tracking-[3px] mb-1.5 block">
                                        Colección destacada
                                    </span>
                                    <h3 className="text-white font-serif text-xl leading-tight">{activeItem.promoText}</h3>
                                    <a href={activeItem.href} className="mt-2 inline-block text-[10px] text-[#d4af37] uppercase tracking-widest border-b border-[#d4af37]/50 pb-0.5 hover:border-[#d4af37]">
                                        Explorar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header >
    );
}
