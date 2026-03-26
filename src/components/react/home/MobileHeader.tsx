import React from 'react';
import { useStore } from '@nanostores/react';
import { cartItems, setIsCartOpen } from '../../../store/cart';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';
import LanguageSwitcher from '../LanguageSwitcher';

export default function MobileHeader({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    const $cartItems = useStore(cartItems);
    const cartCount = Object.values($cartItems).reduce((acc: number, item: any) => acc + item.quantity, 0);

    return (
        <header className="flex justify-between items-center py-4 px-5 sticky top-0 bg-white z-50 bg-opacity-95 backdrop-blur-sm lg:hidden">
            {/* Left Box (Empty for balance) */}
            <div className="w-8"></div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
                <a href={getRoute('/', lang)} className="font-serif text-2xl font-bold tracking-tight text-black flex flex-col items-center">
                    DTalles
                    <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-light mt-[2px]">Jewelry</span>
                </a>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-4 items-center">
                {/* Switcher para movil en el mismo header compacto */}
                <LanguageSwitcher lang={lang} className="mr-0 text-black hidden sm:flex [&_button]:text-black [&_button]:hover:text-black [&_button.text-\[\#d4af37\]]:text-[#d4af37]" />
                
                {/* Cart Icon */}
                <button
                    className="relative text-black p-1 hover:text-gray-600 transition-colors"
                    onClick={() => setIsCartOpen(true)}
                    aria-label={t('mobile.cart.open')}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* Hamburger (We can tie this to a generic function or drawer later if needed) */}
                <button className="text-black p-1 hover:text-gray-600 transition-colors" aria-label={t('mobile.menu.open')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
