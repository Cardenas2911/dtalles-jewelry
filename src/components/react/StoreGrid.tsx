import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { isFavorite, toggleFavorite, favoriteItems } from '../../store/favorites';
import ProductCard from './ProductCard';

interface Product {
    id: string;
    title: string;
    handle: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    featuredImage: {
        url: string;
        altText: string;
    };
    productType: string;
    tags: string[];
}

interface StoreGridProps {
    initialProducts: Product[];
}

export default function StoreGrid({ initialProducts }: StoreGridProps) {
    const [products, setProducts] = useState(initialProducts);
    const [filter, setFilter] = useState('All');
    const [sortBy, setSortBy] = useState('featured');
    const $favorites = useStore(favoriteItems);

    // Extract unique categories/tags for filters dynamically from products
    const filters = React.useMemo(() => {
        const uniqueTags = new Set<string>();
        initialProducts.forEach(product => {
            // Add Product Type
            if (product.productType) uniqueTags.add(product.productType);
            // Add Tags
            if (product.tags && Array.isArray(product.tags)) {
                product.tags.forEach(tag => uniqueTags.add(tag));
            }
        });
        // Sort alphabetically and add 'All'
        return ['All', ...Array.from(uniqueTags).sort()];
    }, [initialProducts]);

    useEffect(() => {
        let filtered = [...initialProducts];

        // 1. Filter
        if (filter !== 'All') {
            filtered = filtered.filter(p =>
                p.productType === filter ||
                p.tags.includes(filter) ||
                p.title.toLowerCase().includes(filter.toLowerCase())
            );
        }

        // 2. Sort
        if (sortBy === 'price-low-high') {
            filtered.sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
        } else if (sortBy === 'price-high-low') {
            filtered.sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
        }

        setProducts(filtered);
    }, [filter, sortBy, initialProducts]);

    const [showSort, setShowSort] = useState(false);

    // Toggle Sort Dropdown
    const toggleSort = () => setShowSort(!showSort);
    const closeSort = () => setShowSort(false);

    // Filter Logic
    const clearFilters = () => setFilter('All');

    // Close sort on click outside (simple implementation or use overlay)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (showSort && !(e.target as Element).closest('.sort-dropdown-container')) {
                setShowSort(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showSort]);


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Toggle Drawer
    const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

    // Sort logic handled in drawer or dropdown? Instructions say "Menu de Filtros... slide-in".
    // I will put Sort inside the drawer for cleaner UI, or keep a small sort dropdown in toolbar?
    // "Barra Superior... Derecha: Botón FILTRAR Y ORDENAR" -> Single button for both usually, or two.
    // I'll put everything in the drawer for mobile-first simplicity, or keep sort separate?
    // Let's do: Toolbar -> [Count] [Spacer] [Filter Btn]

    // Dynamic Stats
    const totalProducts = initialProducts.length;
    const currentCount = products.length;

    return (
        <div className="w-full relative min-h-screen">
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-30 bg-[#050505]/95 backdrop-blur-md border-b border-[#d4af37]/20 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
                <span className="text-gray-400 text-xs md:text-sm tracking-widest uppercase font-medium">
                    Mostrando <span className="text-[#FAFAF5]">{currentCount}</span> de {totalProducts} Detalles
                </span>

                <button
                    onClick={toggleDrawer}
                    className="flex items-center gap-2 group hover:opacity-80 transition-opacity"
                >
                    <span className="text-[#d4af37] text-xs md:text-sm font-bold tracking-widest uppercase">Filtrar y Ordenar</span>
                    <span className="material-symbols-outlined text-[#d4af37]">tune</span>
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12 px-3 md:px-12 mt-6 pb-32">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <h3 className="text-2xl font-serif text-[#FAFAF5] mb-4">Una joya muy exclusiva...</h3>
                    <p className="text-gray-400 mb-8 max-w-md">No encontramos exactamente eso, pero tu próxima pieza favorita está cerca.</p>
                    <button onClick={clearFilters} className="px-8 py-3 bg-[#d4af37] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">
                        Ver Colección Completa
                    </button>
                </div>
            )}

            {/* Filter Drawer (Slide-in) */}
            <div className={`fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={toggleDrawer}
                ></div>

                {/* Sidebar */}
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-[#0a0a0a] border-l border-[#d4af37]/20 shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-[#d4af37]/10">
                        <h2 className="text-[#FAFAF5] font-serif text-xl tracking-wide">Refina tu Búsqueda</h2>
                        <button onClick={toggleDrawer} className="text-gray-400 hover:text-[#d4af37] transition-colors">
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Sort Section */}
                        <div>
                            <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-4">Ordenar Por</h3>
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sortBy === 'featured' ? 'border-[#d4af37]' : 'border-gray-600'}`}>
                                        {sortBy === 'featured' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                                    </div>
                                    <input type="radio" name="sort" className="hidden" onChange={() => setSortBy('featured')} checked={sortBy === 'featured'} />
                                    <span className={`${sortBy === 'featured' ? 'text-white' : 'text-gray-400'} group-hover:text-[#d4af37] transition-colors`}>Destacado</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sortBy === 'price-low-high' ? 'border-[#d4af37]' : 'border-gray-600'}`}>
                                        {sortBy === 'price-low-high' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                                    </div>
                                    <input type="radio" name="sort" className="hidden" onChange={() => setSortBy('price-low-high')} checked={sortBy === 'price-low-high'} />
                                    <span className={`${sortBy === 'price-low-high' ? 'text-white' : 'text-gray-400'} group-hover:text-[#d4af37] transition-colors`}>Precio: Bajo a Alto</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sortBy === 'price-high-low' ? 'border-[#d4af37]' : 'border-gray-600'}`}>
                                        {sortBy === 'price-high-low' && <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>}
                                    </div>
                                    <input type="radio" name="sort" className="hidden" onChange={() => setSortBy('price-high-low')} checked={sortBy === 'price-high-low'} />
                                    <span className={`${sortBy === 'price-high-low' ? 'text-white' : 'text-gray-400'} group-hover:text-[#d4af37] transition-colors`}>Precio: Alto a Bajo</span>
                                </label>
                            </div>
                        </div>

                        <div className="h-[1px] bg-[#d4af37]/10 w-full"></div>

                        {/* Filter Categories (Simplifying to Tags/Types for now based on available data) */}
                        <div>
                            <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-4">Colección / Tipo</h3>
                            <div className="flex flex-wrap gap-2">
                                {filters.map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(filter === f ? 'All' : f)}
                                        className={`px-4 py-2 rounded-full text-xs transition-all border ${filter === f
                                            ? 'bg-[#d4af37] text-black border-[#d4af37] font-bold'
                                            : 'bg-transparent text-gray-400 border-gray-700 hover:border-[#d4af37] hover:text-[#d4af37]'}`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-[#d4af37]/10 bg-[#050505]">
                        <button
                            onClick={toggleDrawer}
                            className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest py-4 hover:bg-white transition-colors"
                        >
                            Ver Resultados ({products.length})
                        </button>
                        <button
                            onClick={clearFilters}
                            className="w-full text-gray-500 text-xs uppercase tracking-widest mt-4 hover:text-[#d4af37]"
                        >
                            Limpiar Todo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
