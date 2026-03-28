import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { isSearchOpen, setIsSearchOpen } from '../../store/search';
import { clientStorefrontQuery } from '../../lib/shopify';
import { SEARCH_PRODUCTS_QUERY } from '../../lib/queries/search';
import { getTranslationFunctionForLang } from '../../i18n/utils';
import { getRoute } from '../../utils/paths';

export default function SearchModal({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    const $isOpen = useStore(isSearchOpen);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when opened
    useEffect(() => {
        if ($isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [$isOpen]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 2) {
                setLoading(true);
                try {
                    const response = await clientStorefrontQuery(SEARCH_PRODUCTS_QUERY, {
                        query: `title:${query}* OR tag:${query}*`
                    });
                    console.log("Search response:", response);

                    // Handle potential response structure (data vs direct)
                    // @ts-ignore
                    const products = response.data?.products || response.products;

                    if (products) {
                        setResults(products.edges.map((edge: any) => edge.node));
                    } else {
                        setResults([]);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (!$isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-0 md:pt-20 px-0 md:px-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsSearchOpen(false)}
            />

            {/* Modal */}
            <div className="bg-[#121212] w-full max-w-2xl h-full md:h-auto md:max-h-[80vh] md:rounded-2xl z-10 flex flex-col overflow-hidden border border-[#d4af37]/20 shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Search Input Area */}
                <div className="p-4 md:p-6 border-b border-[#d4af37]/10 flex items-center gap-4 sticky top-0 bg-[#121212] z-20">
                    <span className="material-symbols-outlined text-[#d4af37]">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('ui.search.placeholder')}
                        className="flex-1 bg-transparent border-none text-white text-lg md:text-xl focus:ring-0 placeholder-white/20"
                    />
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="text-white/40 hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-8 h-8 border-2 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin"></div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((product) => (
                                <a
                                    key={product.id}
                                    href={getRoute(`/producto/${product.handle}`, lang)}
                                    className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group"
                                    onClick={() => setIsSearchOpen(false)}
                                >
                                    <div className="w-16 h-16 bg-black rounded-lg overflow-hidden shrink-0">
                                        <img
                                            src={product.featuredImage?.url}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white text-sm font-medium truncate group-hover:text-[#d4af37] transition-colors">{product.title}</h3>
                                        <p className="text-[#d4af37] text-sm font-bold mt-1">
                                            ${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString()}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : query.length > 2 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-white/40 gap-4">
                            <span className="material-symbols-outlined text-4xl">inventory_2</span>
                            <p className="text-sm font-light uppercase tracking-widest">{lang === 'en' ? 'No products found' : 'No se encontraron productos'}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-white/20 gap-4">
                            <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                            <p className="text-sm font-light uppercase tracking-widest leading-loose text-center">
                                {lang === 'en' ? 'Search for your favorite jewelry' : 'Busca tus joyas favoritas'}<br />
                                <span className="text-[10px] opacity-60">(ex. Cuban Link, Ring, Gold)</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
