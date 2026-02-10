import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { isSearchOpen, setIsSearchOpen } from '../../store/search';
import { client } from '../../lib/shopify';
import { SEARCH_PRODUCTS_QUERY } from '../../lib/queries/search';

export default function SearchModal() {
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
                    const response = await client.request(SEARCH_PRODUCTS_QUERY, {
                        variables: {
                            query: `title:${query}* OR tag:${query}*` // Wildcard search
                        }
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
            ></div>

            {/* Modal */}
            <div className="relative w-full h-full md:h-auto md:max-h-[85vh] max-w-3xl bg-white md:rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col">
                {/* Header / Input */}
                <div className="flex items-center p-4 md:p-6 border-b border-gray-100 shrink-0 gap-3">
                    <span className="material-symbols-outlined text-[#d4af37] text-2xl md:text-3xl">search</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar joyas (ej. Cruz, Oro)..."
                        className="flex-1 text-lg md:text-xl outline-none text-gray-900 placeholder:text-gray-400 font-serif bg-transparent"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                window.location.href = `/busqueda?q=${query}`;
                                setIsSearchOpen(false);
                            }
                        }}
                    />
                    <button
                        onClick={() => setIsSearchOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Results - Scrollable Area */}
                <div className="flex-1 overflow-y-auto bg-[#FAFAF5]/50 p-4 md:p-6 min-h-[50vh]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                            <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm tracking-widest uppercase">Buscando...</span>
                        </div>
                    ) : results.length > 0 ? (
                        <div>
                            <h3 className="text-xs font-bold uppercase text-gray-400 mb-4 tracking-wider px-1">Resultados ({results.length})</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                {results.map((product) => (
                                    <a
                                        key={product.id}
                                        href={`/producto/${product.handle}`}
                                        className="bg-white p-2 md:p-3 rounded-lg shadow-sm hover:shadow-md transition-all group flex flex-col gap-3 border border-gray-100"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                                            <img
                                                src={product.featuredImage?.url}
                                                alt={product.featuredImage?.altText || product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="px-1 pb-1">
                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 md:line-clamp-1 group-hover:text-[#d4af37] transition-colors mb-1 leading-tight">{product.title}</h4>
                                            <p className="text-sm font-bold text-[#d4af37]">
                                                ${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : query.length > 2 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                            <span className="material-symbols-outlined text-5xl mb-3 text-gray-400">search_off</span>
                            <p>No encontramos resultados para "{query}"</p>
                            <p className="text-sm mt-2 text-gray-400">Intenta con "Cadena", "Oro" o "Medalla"</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
                            <span className="material-symbols-outlined text-6xl mb-4 text-gray-300">diamond</span>
                            <p className="text-lg font-serif">Empieza a escribir para buscar</p>
                            <p className="text-xs uppercase tracking-widest mt-2 text-gray-400">Explora nuestro catálogo exclusivo</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
