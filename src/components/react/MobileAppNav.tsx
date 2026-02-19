import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { isCartOpen, setIsCartOpen, cartItems } from '../../store/cart';
import { favoriteItems } from '../../store/favorites';
import { setIsSearchOpen } from '../../store/search';

import { resolvePath } from '../../utils/paths';

// Mock Data for Categories (Tabs)
const CATEGORIES = {
    HOMBRE: [
        { id: 'h1', title: 'Cadenas de Oro', image: 'https://dtallesjewelry.com/images/cat-cuban.jpg', href: resolvePath('/hombre/cadenas') },
        { id: 'h2', title: 'Esclavas de Oro', image: 'https://dtallesjewelry.com/images/cat-bracelet.jpg', href: resolvePath('/hombre/esclavas') },
        { id: 'h3', title: 'Anillos', image: 'https://dtallesjewelry.com/images/cat-rings.jpg', href: resolvePath('/hombre/anillos') },
        { id: 'h4', title: 'Dijes / Colgantes', image: 'https://dtallesjewelry.com/images/cat-id.jpg', href: resolvePath('/hombre/dijes') },
    ],
    MUJER: [
        { id: 'm1', title: 'Collares / Cadenas', image: 'https://dtallesjewelry.com/images/cat-necklace.jpg', href: '/mujer/collares' },
        { id: 'm2', title: 'Aretes / Huggies', image: 'https://dtallesjewelry.com/images/cat-earrings.jpg', href: '/mujer/aretes' },
        { id: 'm3', title: 'Anillos', image: 'https://dtallesjewelry.com/images/cat-w-rings.jpg', href: '/mujer/anillos' },
        { id: 'm4', title: 'Tobilleras', image: 'https://dtallesjewelry.com/images/cat-anklets.jpg', href: '/mujer/tobilleras' },
    ],
    NINOS: [
        { id: 'n1', title: 'Esclavas Bebé', image: 'https://dtallesjewelry.com/images/cat-baby-id.jpg', href: '/ninos/esclavas' },
        { id: 'n2', title: 'Broqueles', image: 'https://dtallesjewelry.com/images/cat-baby-earrings.jpg', href: '/ninos/aretes' },
        { id: 'n3', title: 'Cadenas', image: 'https://dtallesjewelry.com/images/cat-baby-chain.jpg', href: '/ninos/cadenas' },
    ]
};

const PURITY_CHIPS = ['10k', '14k', 'Con Diamantes'];

export default function MobileAppNav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // Removed local isSearchOpen and searchQuery
    const [activeTab, setActiveTab] = useState<'HOMBRE' | 'MUJER' | 'NINOS'>('HOMBRE');
    const [isTopBarVisible, setIsTopBarVisible] = useState(true);
    const lastScrollY = useRef(0);

    const $cartItems = useStore(cartItems);
    const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);
    const $favorites = useStore(favoriteItems);
    const favCount = Object.keys($favorites).length;

    // Scroll Logic for Sticky Top Bar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > 50) {
                if (currentScrollY > lastScrollY.current) {
                    setIsTopBarVisible(false); // Hide on Scroll Down
                } else {
                    setIsTopBarVisible(true); // Show on Scroll Up
                }
            } else {
                setIsTopBarVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when overlays are open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isMenuOpen]);



    return (
        <div className="lg:hidden">
            {/* 1. TOP BAR (Sticky) */}
            <header className={`fixed top-0 left-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 h-16 flex items-center justify-between px-6 transition-transform duration-300 ${isTopBarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <a href={resolvePath('/')} className="block">
                    <img
                        src={resolvePath('/images/Logo.webp')}
                        alt="Dtalles Jewelry"
                        className="h-12 w-auto object-contain"
                    />
                </a>

                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative text-[#FAFAF5] p-2"
                >
                    <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
                    {cartCount > 0 && (
                        <span className="absolute top-0 right-0 bg-[#d4af37] text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                            {cartCount}
                        </span>
                    )}
                </button>
            </header>

            {/* 2. BOTTOM NAV BAR (Fixed) */}
            <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#050505]/95 backdrop-blur-xl border-t border-[#d4af37]/30 h-[65px] px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <div className="grid grid-cols-5 h-full items-center">
                    {/* Home */}
                    <a href={resolvePath('/')} className="flex flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[24px]">home</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Inicio</span>
                    </a>

                    {/* Search */}
                    <button onClick={() => setIsSearchOpen(true)} className="flex flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined transition-colors text-[24px] text-[#A0A0A0] group-hover:text-[#FAFAF5]">search</span>
                        <span className="text-[9px] font-medium tracking-wide text-[#A0A0A0]">Buscar</span>
                    </button>

                    {/* Menu (Center - Highlighted) */}
                    <div className="relative -top-5">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="w-14 h-14 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] border-4 border-[#050505] transform transition-transform active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[28px]">grid_view</span>
                        </button>
                    </div>

                    {/* Wishlist */}
                    <a href={resolvePath('/favoritos')} className="flex flex-col items-center justify-center gap-1 group relative">
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[24px]">favorite</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Favoritos</span>
                        {favCount > 0 && <span className="absolute top-1 right-3 w-1.5 h-1.5 bg-[#d4af37] rounded-full"></span>}
                    </a>

                    {/* Profile */}
                    <a href="https://dtallesjewelry.myshopify.com/account/login" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center gap-1 group">
                        <span className="material-symbols-outlined text-[#A0A0A0] group-hover:text-[#FAFAF5] transition-colors text-[24px]">person</span>
                        <span className="text-[9px] text-[#A0A0A0] font-medium tracking-wide">Perfil</span>
                    </a>
                </div>
            </nav>

            {/* 3. MENU DRAWER (Off-canvas) */}
            <div className={`fixed inset-0 z-[60] transition-visibility duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>

                {/* Drawer Content */}
                <aside className={`absolute top-0 left-0 w-[85%] max-w-[320px] h-full bg-[#050505] shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {/* Drawer Header */}
                    <div className="px-6 pt-12 pb-4 flex justify-between items-end border-b border-white/5">
                        <div>
                            <p className="text-[#A0A0A0] text-xs uppercase tracking-widest mb-1">Bienvenido</p>
                            <h2 className="text-[#d4af37] font-serif text-2xl">Invitado</h2>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 text-white hover:text-[#d4af37] transition-colors"
                        >
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>

                    {/* Tabs (3 Levels) */}
                    <div className="flex border-b border-white/10">
                        {['HOMBRE', 'MUJER', 'NINOS'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors relative ${activeTab === tab ? 'text-[#d4af37]' : 'text-[#FAFAF5]/50'}`}
                            >
                                {tab === 'NINOS' ? 'NIÑOS' : tab}
                                {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#d4af37]"></span>}
                            </button>
                        ))}
                    </div>

                    {/* Purity Chips (Filter Row) */}
                    <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar border-b border-white/5">
                        {PURITY_CHIPS.map(chip => (
                            <button key={chip} className="px-3 py-1.5 rounded-full border border-white/20 text-[#FCEebb] text-xs font-medium bg-white/5 whitespace-nowrap hover:border-[#d4af37] transition-colors">
                                {chip}
                            </button>
                        ))}
                    </div>

                    {/* List Items */}
                    <div className="overflow-y-auto h-[calc(100%-320px)] animate-fade-in">
                        <ul className="divide-y divide-white/5">
                            {CATEGORIES[activeTab].map((cat) => (
                                <li key={cat.id}>
                                    <a href={cat.href} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-white/10 group-hover:border-[#d4af37] transition-colors">
                                            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900"></div> {/* Placeholder */}
                                        </div>
                                        <span className="flex-1 text-[#FAFAF5] text-sm font-medium">{cat.title}</span>
                                        <span className="material-symbols-outlined text-[#d4af37] text-sm">chevron_right</span>
                                    </a>
                                </li>
                            ))}
                            {/* Static Links */}
                            <li>
                                <a href={resolvePath('/tienda')} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-[#d4af37]">
                                        <span className="material-symbols-outlined text-lg">storefront</span>
                                    </div>
                                    <span className="flex-1 text-[#FAFAF5] text-sm font-medium">Ver Tienda Completa</span>
                                    <span className="material-symbols-outlined text-[#d4af37] text-sm">chevron_right</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Drawer Footer */}
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-[#0a0a0a] border-t border-white/5 space-y-3 z-10">
                        <a href={resolvePath('/rastrear')} className="flex items-center gap-3 text-xs text-[#A0A0A0] uppercase tracking-widest hover:text-white">
                            <span className="material-symbols-outlined text-sm">local_shipping</span>
                            Rastrear Pedido
                        </a>
                        <a href="https://wa.me/17867644952" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xs text-[#A0A0A0] uppercase tracking-widest hover:text-white">
                            <span className="material-symbols-outlined text-sm">chat</span>
                            WhatsApp: +1 (786) 764-4952
                        </a>
                        <a href={resolvePath('/servicios/vender-oro')} className="flex items-center gap-3 text-xs text-[#d4af37] uppercase tracking-widest font-bold">
                            <span className="material-symbols-outlined text-sm">currency_exchange</span>
                            Vender Oro
                        </a>
                    </div>
                </aside>
            </div>


        </div>
    );
}
