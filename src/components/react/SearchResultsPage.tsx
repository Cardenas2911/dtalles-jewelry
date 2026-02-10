import React, { useState, useEffect } from 'react';
import { client } from '../../lib/shopify';
import { SEARCH_PRODUCTS_QUERY } from '../../lib/queries/search';

export default function SearchResultsPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get query from URL
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get('q') || '';
        setQuery(q);

        if (q) {
            fetchResults(q);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchResults = async (searchQuery: string) => {
        setLoading(true);
        try {
            const response = await client.request(SEARCH_PRODUCTS_QUERY, {
                variables: {
                    query: `title:${searchQuery}* OR tag:${searchQuery}*`
                }
            });
            // @ts-ignore
            const products = response.data?.products || response.products;
            if (products) {
                setResults(products.edges.map((edge: any) => edge.node));
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Search Page error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl font-serif text-[#FAFAF5] mb-8">
                Resultados para: <span className="text-[#d4af37]">"{query}"</span>
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
                    {results.map((product) => (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#121212] mb-3 shadow-md transition-transform duration-500 group-hover:scale-[1.02]">
                                <a href={`/producto/${product.handle}`} className="absolute inset-0 z-0 block">
                                    <img
                                        src={product.featuredImage?.url}
                                        alt={product.featuredImage?.altText || product.title}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                        loading="lazy"
                                    />
                                </a>
                            </div>
                            <div className="text-center px-1 flex flex-col gap-2">
                                <h3 className="text-sm font-medium text-slate-200 line-clamp-1 group-hover:text-[#d4af37] transition-colors tracking-wide">
                                    <a href={`/producto/${product.handle}`}>{product.title}</a>
                                </h3>
                                <p className="text-md font-bold text-[#d4af37]">
                                    ${parseFloat(product.priceRange.minVariantPrice.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                    <span className="material-symbols-outlined text-6xl mb-4 opacity-50">search_off</span>
                    <p className="text-xl">No encontramos resultados para tu búsqueda.</p>
                    <a href="/tienda" className="mt-6 text-[#d4af37] hover:underline">Ver todo el catálogo</a>
                </div>
            )}
        </div>
    );
}
