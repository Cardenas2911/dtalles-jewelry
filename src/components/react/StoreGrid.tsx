import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { isFavorite, toggleFavorite, favoriteItems } from '../../store/favorites';
import ProductCard from './ProductCard';
import FilterSidebar from './StoreGrid/FilterSidebar'; // Import new component

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
    compareAtPrice?: {
        amount: string;
        currencyCode: string;
    };
    variants?: {
        edges: Array<{
            node: {
                id: string;
                compareAtPrice?: {
                    amount: string;
                    currencyCode: string;
                };
            };
        }>;
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
    const [sortBy, setSortBy] = useState('featured');

    // Filter States
    const [selectedFilters, setSelectedFilters] = useState({
        category: [] as string[],
        priceRange: '' as string, // Added to match interface, though we use priceRange state object for logic
        collection: [] as string[],
        material: [] as string[]
    });
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer State

    // 1. Extract Filter Options Dynamically
    const filterOptions = useMemo(() => {
        const categories = new Set<string>();
        const collections = new Set<string>();
        const materials = new Set<string>();

        initialProducts.forEach(p => {
            if (p.productType) categories.add(p.productType);

            // Analyze Tags for Collections & Materials
            p.tags.forEach(tag => {
                const t = tag.toLowerCase();
                // Material Heuristics
                if (t.includes('oro 10k') || t.includes('10k')) materials.add('Oro 10k');
                if (t.includes('oro 14k') || t.includes('14k')) materials.add('Oro 14k');
                if (t.includes('silver') || t.includes('plata')) materials.add('Plata');

                // Collection Heuristics (Simple mapping based on tag existence)
                if (t === 'mujer' || t === 'hombre' || t === 'niños' || t === 'niña' || t === 'regalo') {
                    collections.add(tag.charAt(0).toUpperCase() + tag.slice(1));
                }
            });
        });

        return {
            categories: Array.from(categories).sort(),
            collections: Array.from(collections).sort(),
            materials: Array.from(materials).sort()
        };
    }, [initialProducts]);

    // 2. Filter Logic
    // 2. Filter Logic
    useEffect(() => {
        let result = initialProducts;

        // Category Filter (Exact Match)
        if (selectedFilters.category.length > 0) {
            result = result.filter(p => selectedFilters.category.includes(p.productType));
        }

        // Collection Filter (Fuzzy Match - Tag based)
        if (selectedFilters.collection.length > 0) {
            result = result.filter(p => {
                // Check if ANY of the product tags contains ANY of the selected collection keywords
                return p.tags.some(tag => {
                    const t = tag.toLowerCase();
                    return selectedFilters.collection.some(col => t.includes(col.toLowerCase()));
                });
            });
        }

        // Material Filter (Fuzzy Match - Tag based)
        if (selectedFilters.material.length > 0) {
            result = result.filter(p => {
                return p.tags.some(tag => {
                    const t = tag.toLowerCase();
                    return selectedFilters.material.some(mat => t.includes(mat.toLowerCase()));
                });
            });
        }

        // Price Filter
        if (priceRange.max < 5000) {
            result = result.filter(p => {
                const price = parseFloat(p.priceRange.minVariantPrice.amount);
                return price >= priceRange.min && price <= priceRange.max;
            });
        } else {
            // If max is 5000+, we treat it as "5000+" effectively (unbounded upper)
            result = result.filter(p => {
                const price = parseFloat(p.priceRange.minVariantPrice.amount);
                return price >= priceRange.min;
            });
        }

        // Sort Logic
        if (sortBy === 'price-low-high') {
            result = [...result].sort((a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount));
        } else if (sortBy === 'price-high-low') {
            result = [...result].sort((a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount));
        }

        console.log(`Filtered Count: ${result.length} | Filters:`, selectedFilters); // Debug Log
        setProducts(result);
    }, [selectedFilters, priceRange, sortBy, initialProducts]);


    // Handlers
    const handleFilterChange = (type: string, value: string) => {
        setSelectedFilters(prev => {
            const list = prev[type as keyof typeof prev] as string[];
            const newList = list.includes(value)
                ? list.filter(item => item !== value)
                : [...list, value];
            return { ...prev, [type]: newList };
        });
    };

    const clearFilters = () => {
        setSelectedFilters({ category: [], priceRange: '', collection: [], material: [] });
        setPriceRange({ min: 0, max: 5000 });
        setSortBy('featured');
    };

    return (
        <div className="w-full relative min-h-screen flex flex-col lg:flex-row gap-8 px-4 md:px-12 pt-8">

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden w-full flex justify-between items-center mb-6 pb-4 border-b border-[#d4af37]/20">
                <span className="text-gray-400 text-xs uppercase tracking-widest">{products.length} Joyas</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 text-[#d4af37] font-bold text-sm uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined">tune</span>
                    Filtros
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <FilterSidebar
                    filters={filterOptions}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    totalProducts={initialProducts.length}
                    filteredCount={products.length}
                />
            </div>

            {/* Mobile Drawer Sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0a0a0a] border-l border-[#d4af37]/20 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-[#FAFAF5] font-serif text-xl">Filtros</h2>
                        <button onClick={() => setIsSidebarOpen(false)}>
                            <span className="material-symbols-outlined text-gray-400">close</span>
                        </button>
                    </div>
                    <FilterSidebar
                        filters={filterOptions}
                        selectedFilters={selectedFilters}
                        onFilterChange={handleFilterChange}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        totalProducts={initialProducts.length}
                        filteredCount={products.length}
                    />
                    <div className="mt-8 pt-6 border-t border-[#d4af37]/10">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest py-3 hover:bg-white transition-colors"
                        >
                            Ver {products.length} Joyas
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Grid Content */}
            <div className="flex-1 pb-32">
                {/* Desktop Toolbar (Sort) */}
                <div className="hidden lg:flex justify-between items-center mb-8 pb-4 border-b border-[#d4af37]/10">
                    <span className="text-gray-400 text-sm tracking-widest uppercase">Mostrando {products.length} Resultados</span>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 uppercase">Ordenar:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-[#FAFAF5] text-sm border-none focus:ring-0 cursor-pointer"
                        >
                            <option value="featured" className="bg-black">Destacado</option>
                            <option value="price-low-high" className="bg-black">Precio: Bajo a Alto</option>
                            <option value="price-high-low" className="bg-black">Precio: Alto a Bajo</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-4">search_off</span>
                        <h3 className="text-xl font-serif text-[#FAFAF5] mb-2">Sin resultados</h3>
                        <p className="text-gray-400 mb-6 max-w-xs mx-auto">Prueba ajustando tus filtros para encontrar lo que buscas.</p>
                        <button onClick={clearFilters} className="text-[#d4af37] border-b border-[#d4af37] pb-1 hover:text-white hover:border-white transition-colors text-sm uppercase tracking-widest">
                            Limpiar Filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
