import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, setIsCartOpen, cartItems } from '../../store/cart';
import { favoriteItems } from '../../store/favorites';
import { setIsSearchOpen } from '../../store/search';
import { resolvePath } from '../../utils/paths';

// Helper para construir URL de filtro (igual que DesktopHeader)
const f = (productType?: string, tag?: string) => {
    const base = resolvePath('/tienda');
    const params = new URLSearchParams();
    if (productType) params.set('productType', productType);
    if (tag) params.set('tag', tag);
    return `${base}?${params.toString()}`;
};

// Misma estructura de navegación que el DesktopHeader (tags verificados contra Shopify)
const NAV_SECTIONS = [
    {
        label: 'Hombre',
        href: resolvePath('/hombre'),
        icon: 'male',
        items: [
            { label: 'Cadenas', href: f('Cadena', 'hombre') },
            { label: 'Pulseras', href: f('Pulsera', 'hombre') },
            { label: 'Anillos', href: f('Anillo', 'hombre') },
            { label: 'Collares con Dije', href: f('Collar con Dije', 'hombre') },
            { label: 'Cuban Links', href: f(undefined, 'cuban links') },
            { label: 'Cadena Soga', href: f(undefined, 'cadena soga') },
            { label: 'Miami Cuban', href: f(undefined, 'miami cuban') },
        ],
    },
    {
        label: 'Mujer',
        href: resolvePath('/mujer'),
        icon: 'female',
        items: [
            { label: 'Collares', href: f('Collar', 'mujer') },
            { label: 'Aretes', href: f('Aretes', 'mujer') },
            { label: 'Anillos', href: f('Anillo', 'mujer') },
            { label: 'Pulseras', href: f('Pulsera', 'mujer') },
            { label: 'Gargantillas', href: f(undefined, 'gargantilla') },
            { label: 'Aretes de Aro', href: f(undefined, 'aretes de aro') },
            { label: 'Sets de Oro', href: f(undefined, 'set oro') },
        ],
    },
    {
        label: 'Religiosos',
        href: resolvePath('/coleccion/religioso'),
        icon: 'church',
        items: [
            { label: 'Cruces', href: f(undefined, 'joyería religiosa') },
            { label: 'Collares con Cruz', href: f('Collar con Dije', 'joyería religiosa') },
            { label: 'Anillos', href: f('Anillo', 'joyería religiosa') },
            { label: 'Amuletos', href: f(undefined, 'amuleto') },
            { label: 'Buena Suerte', href: f(undefined, 'buena suerte') },
        ],
    },
    {
        label: 'Niños',
        href: resolvePath('/ninos'),
        icon: 'child_care',
        items: [
            { label: 'Aretes', href: f('Aretes', 'niña') },
            { label: 'Broqueles', href: f(undefined, 'broqueles') },
            { label: 'Pulseras', href: f('Pulsera', 'niña') },
            { label: 'Cadenas', href: f('Cadena', 'niña') },
        ],
    },
    {
        label: 'Regalos',
        href: resolvePath('/guia-regalos'),
        icon: 'redeem',
        items: [
            { label: 'Para Ella', href: f(undefined, 'regalo mujer') },
            { label: 'Para Él', href: f(undefined, 'regalo hombre') },
            { label: 'Aniversario', href: f(undefined, 'regalo aniversario') },
            { label: 'Corazones', href: f(undefined, 'dije corazon') },
            { label: 'Bridal', href: f(undefined, 'bridal') },
        ],
    },
];

// Links directos (sin submenú)
const DIRECT_LINKS = [
    { label: 'Ver toda la Tienda', href: resolvePath('/tienda'), icon: 'storefront' },
    { label: 'Lo Nuevo', href: resolvePath('/coleccion/nuevo'), icon: 'auto_awesome', gold: true },
    { label: 'Vender Oro', href: resolvePath('/servicios/vender-oro'), icon: 'currency_exchange', gold: true },
];

export default function MobileAppNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openSection, setOpenSection] = useState<string | null>(null);
    const [isTopBarVisible, setIsTopBarVisible] = useState(true);
    const lastScrollY = useRef(0);

    const $cartItems = useStore(cartItems);
    const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);
    const $favorites = useStore(favoriteItems);
    const favCount = Object.keys($favorites).length;

    // El header ahora es siempre fijo por petición del usuario

    // Bloquear scroll del body cuando el menú esté abierto
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }, [isMenuOpen]);

    const toggleSection = (label: string) => {
        setOpenSection(openSection === label ? null : label);
    };

    return (
        <div className="lg:hidden">

            {/* ── TOP BAR ────────────────────────────────────────── */}
            <header className="fixed top-0 left-0 w-full z-40 bg-[#050505]/95 backdrop-blur-md border-b border-[#d4af37]/15 h-16 flex items-center justify-between px-5 transition-transform duration-300 translate-y-0"
            >
                <a href={resolvePath('/')} className="block">
                    <img
                        src={resolvePath('/images/Logo.webp')}
                        alt="Dtalles Jewelry"
                        className="h-11 w-auto object-contain"
                    />
                </a>

                <div className="flex items-center gap-2">
                    {/* Buscar */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="p-2 text-[#FAFAF5]/70 hover:text-[#d4af37] transition-colors"
                        aria-label="Buscar"
                    >
                        <span className="material-symbols-outlined text-[22px]">search</span>
                    </button>

                    {/* Favoritos */}
                    <a
                        href={resolvePath('/favoritos')}
                        className="relative p-2 text-[#FAFAF5]/70 hover:text-[#d4af37] transition-colors"
                        aria-label="Favoritos"
                    >
                        <span className="material-symbols-outlined text-[22px]">favorite</span>
                        {favCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#d4af37] rounded-full"></span>
                        )}
                    </a>

                    {/* Carrito */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-[#FAFAF5]/70 hover:text-[#d4af37] transition-colors"
                        aria-label="Carrito"
                    >
                        <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-1 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {/* ── BOTTOM NAV BAR ─────────────────────────────────── */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#050505]/98 backdrop-blur-xl border-t border-[#d4af37]/20 h-[64px] px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]">
                <div className="grid grid-cols-5 h-full items-center">

                    {/* Inicio */}
                    <a href={resolvePath('/')} className="flex flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[22px]">home</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Inicio</span>
                    </a>

                    {/* Buscar */}
                    <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[22px]">search</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Buscar</span>
                    </button>

                    {/* Menú Central (FAB dorado vibrante) */}
                    <div className="relative -top-4 flex justify-center">
                        <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#d4af37]/40 blur-xl animate-pulse -z-10 mx-auto"></div>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8a6d2b] via-[#d4af37] to-[#f5e3a3] text-black flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.6)] border-4 border-[#050505] transition-all active:scale-90 hover:scale-105"
                            aria-label="Abrir menú"
                        >
                            <span className="material-symbols-outlined text-[26px] drop-shadow-sm font-bold">grid_view</span>
                        </button>
                    </div>

                    {/* Favoritos */}
                    <a href={resolvePath('/favoritos')} className="flex flex-col items-center justify-center gap-1 group relative">
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[22px]">favorite</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Guardados</span>
                        {favCount > 0 && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>}
                    </a>

                    {/* Cuenta */}
                    <a
                        href="https://dtalles-jewelry.myshopify.com/account/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1 group"
                    >
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[22px]">person</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Cuenta</span>
                    </a>
                </div>
            </nav>

            {/* ── MENU DRAWER ────────────────────────────────────── */}
            <div className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>

                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Drawer */}
                <aside className={`absolute top-0 left-0 w-[88%] max-w-[340px] h-full bg-[#080808] flex flex-col shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    {/* Drawer Header */}
                    <div className="px-6 pt-14 pb-5 flex justify-between items-center border-b border-[#d4af37]/15 flex-shrink-0">
                        <a href={resolvePath('/')} onClick={() => setIsMenuOpen(false)}>
                            <img src={resolvePath('/images/Logo.webp')} alt="Dtalles Jewelry" className="h-10 w-auto object-contain" />
                        </a>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-[#FAFAF5]/60 hover:text-[#d4af37] transition-colors"
                            aria-label="Cerrar menú"
                        >
                            <span className="material-symbols-outlined text-[28px]">close</span>
                        </button>
                    </div>

                    {/* Nav Links (con accordion) */}
                    <div className="flex-1 overflow-y-auto">

                        {/* Links directos (Lo Nuevo + Vender Oro) */}
                        <div className="px-4 pt-4 pb-2 flex gap-2">
                            <a
                                href={resolvePath('/coleccion/nuevo')}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-[11px] font-bold uppercase tracking-widest hover:bg-[#d4af37]/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                Lo Nuevo
                            </a>
                            <a
                                href={resolvePath('/servicios/vender-oro')}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[#FAFAF5]/70 text-[11px] font-bold uppercase tracking-widest hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">currency_exchange</span>
                                Vender Oro
                            </a>
                        </div>

                        {/* Divider */}
                        <div className="mx-6 my-3 h-px bg-white/5" />

                        {/* Secciones con accordion */}
                        {NAV_SECTIONS.map((section) => (
                            <div key={section.label} className="border-b border-white/5">
                                <button
                                    onClick={() => toggleSection(section.label)}
                                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[#d4af37] text-[18px]">{section.icon}</span>
                                        <span className="text-[#FAFAF5] text-[13px] font-semibold uppercase tracking-[1.5px]">{section.label}</span>
                                    </span>
                                    <span className={`material-symbols-outlined text-[#d4af37]/60 text-[18px] transition-transform duration-200 ${openSection === section.label ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {/* Sub-items */}
                                <div className={`overflow-hidden transition-all duration-300 ${openSection === section.label ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <ul className="pb-3">
                                        {section.items.map((item) => (
                                            <li key={item.label}>
                                                <a
                                                    href={item.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center gap-3 pl-14 pr-6 py-3 text-[#FAFAF5]/60 text-[13px] hover:text-[#d4af37] hover:bg-white/5 transition-all"
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/40 flex-shrink-0"></span>
                                                    {item.label}
                                                </a>
                                            </li>
                                        ))}
                                        {/* Ver todo esta sección */}
                                        <li>
                                            <a
                                                href={section.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-2 pl-14 pr-6 py-3 text-[10px] font-bold text-[#d4af37] uppercase tracking-widest hover:opacity-70"
                                            >
                                                Ver todo
                                                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        ))}

                        {/* Tienda completa - Vibrante e Intensa */}
                        <div className="px-4 py-6">
                            <a
                                href={resolvePath('/tienda')}
                                onClick={() => setIsMenuOpen(false)}
                                className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-[#8a6d2b] via-[#d4af37] to-[#f5e3a3] shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all active:scale-95 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]"></div>
                                <span className="material-symbols-outlined text-black text-[20px] font-bold">storefront</span>
                                <span className="text-black text-[14px] font-black uppercase tracking-[2px]">Ver Tienda Completa</span>
                                <span className="material-symbols-outlined text-black/70 text-[18px] ml-auto animate-bounce-x">arrow_forward</span>
                            </a>
                        </div>
                    </div>

                    {/* Drawer Footer */}
                    <div className="flex-shrink-0 px-6 py-5 border-t border-[#d4af37]/15 bg-[#0a0a0a] space-y-3">
                        <a
                            href={resolvePath('/rastrear')}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 text-[11px] text-[#A0A0A0] uppercase tracking-widest hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                            Rastrear Pedido
                        </a>
                        <a
                            href="https://wa.me/17867644952?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20sus%20joyas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-[11px] text-[#25D366] uppercase tracking-widest hover:opacity-80 transition-opacity"
                        >
                            {/* WhatsApp icon */}
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            +1 (786) 764-4952
                        </a>
                    </div>
                </aside>
            </div>

            <style>{`
                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
                .animate-bounce-x {
                    animation: bounce-x 1s infinite;
                }
                @keyframes shine {
                    from { transform: translateX(-100%) skewX(-20deg); }
                    to { transform: translateX(100%) skewX(-20deg); }
                }
            `}</style>
        </div>
    );
}
