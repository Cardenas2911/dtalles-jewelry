import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { favoriteItems } from '../../store/favorites';
import ProductCard from './ProductCard';
import FilterSidebar from './StoreGridShared/FilterSidebar';
import { getTranslationFunctionForLang } from '../../i18n/utils';

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
    lang?: 'es' | 'en';
}

// -------------------------------------------------------
// Helper: Obtener materiales normalizados de los tags
// -------------------------------------------------------
function getProductMaterials(tags: string[]): string[] {
    const mats = new Set<string>();
    tags.forEach(tag => {
        const t = tag.toLowerCase().trim();
        if (t.includes('10k')) mats.add('Oro 10k');
        if (t.includes('14k')) mats.add('Oro 14k');
        if (t === 'plata' || t.includes('silver')) mats.add('Plata');
        if (t.includes('tricolor')) mats.add('Tricolor');
    });
    return Array.from(mats);
}

export default function StoreGrid({ initialProducts, lang }: StoreGridProps) {
    const [products, setProducts] = useState(initialProducts);
    const [sortBy, setSortBy] = useState('featured');
    const [selectedFilters, setSelectedFilters] = useState({
        category: [] as string[],
        priceRange: '' as string,
        collection: [] as string[],
        material: [] as string[]
    });
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // Label descriptivo para el estado vacío cuando viene desde mega menú
    const [filterLabel, setFilterLabel] = useState<string>('');

    // -------------------------------------------------------
    // 0. Leer URL params al montar (desde mega menú links)
    // -------------------------------------------------------
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const productType = params.get('productType');
        const tag = params.get('tag');

        if (productType || tag) {
            // Pre-aplicar filtros basados en URL
            setSelectedFilters(prev => ({
                ...prev,
                category: productType ? [productType] : [],
                collection: tag ? [tag] : [],
            }));
            // Guardar etiqueta para el mensaje de estado vacío
            const parts = [productType, tag].filter(Boolean);
            setFilterLabel(parts.join(' · '));
        }
    }, []); // Solo al montar

    // -------------------------------------------------------
    // 1. Extraer opciones de filtro desde los datos reales
    // -------------------------------------------------------
    const t = getTranslationFunctionForLang(lang || 'es');
    
    // Mapeo dinámico usando llaves de ui.ts
    const translateTag = (term: string) => {
        if (!term) return term;
        const key = term.toLowerCase()
            .replace(/\s+/g, '') // Quitar espacios
            .replace('ñ', 'n')   // Normalizar ñ
            .replace('é', 'e');  // Normalizar tildes si las hay

        // Intentar buscar la llave en el diccionario
        // Mapeo manual de términos a llaves para mayor seguridad
        const tagToKey: Record<string, string> = {
            'anillo': 'taxonomy.ring',
            'arete': 'taxonomy.earring',
            'aretes': 'taxonomy.earrings',
            'cadena': 'taxonomy.chain',
            'cadenas': 'taxonomy.chains',
            'collar': 'taxonomy.necklace',
            'collares': 'taxonomy.necklaces',
            'pulsera': 'taxonomy.bracelet',
            'pulseras': 'taxonomy.bracelets',
            'dije': 'taxonomy.pendant',
            'dijes': 'taxonomy.pendants',
            'hombre': 'taxonomy.men',
            'mujer': 'taxonomy.women',
            'niños': 'taxonomy.kids',
            'niño': 'taxonomy.boy',
            'niña': 'taxonomy.girl',
            'bebe': 'taxonomy.baby',
            'bebé': 'taxonomy.baby',
            'unisex': 'taxonomy.unisex',
            'religioso': 'taxonomy.religious',
            'religiosos': 'taxonomy.religious',
            'oro 10k': 'taxonomy.gold10k',
            'oro 14k': 'taxonomy.gold14k',
            'oro 18k': 'taxonomy.gold18k',
            'plata': 'taxonomy.silver',
            'plata 925': 'taxonomy.silver925',
            'tricolor': 'taxonomy.tricolor'
        };

        const taxonomyKey = tagToKey[term.toLowerCase().trim()];
        return taxonomyKey ? t(taxonomyKey as any) : term;
    };

    const filterOptions = useMemo(() => {
        const categories = new Set<string>();
        const collections = new Set<string>();
        const materials = new Set<string>();

        // Keywords para detectar colecciones (género/audiencia)
        const collectionKeywords = ['mujer', 'hombre', 'niños', 'niña', 'regalo', 'bebé', 'bebe', 'unisex', 'pareja'];

        initialProducts.forEach(p => {
            // Categorías desde productType
            if (p.productType) categories.add(p.productType);

            p.tags.forEach(tag => {
                const tagNorm = tag.trim().toLowerCase();

                // Detectar colecciones por coincidencia exacta con keywords
                if (collectionKeywords.includes(tagNorm)) {
                    // Usar el tag original con trim para mantener capitalización
                    collections.add(tag.trim());
                }

                // Detectar materiales
                if (tagNorm.includes('10k')) materials.add('Oro 10k');
                if (tagNorm.includes('14k')) materials.add('Oro 14k');
                if (tagNorm === 'plata' || tagNorm.includes('silver')) materials.add('Plata');
                if (tagNorm.includes('tricolor')) materials.add('Tricolor');
            });
        });

        return {
            categories: Array.from(categories).sort(),
            collections: Array.from(collections).sort(),
            materials: Array.from(materials).sort()
        };
    }, [initialProducts]);

    // -------------------------------------------------------
    // 2. Lógica de Filtrado — AND entre grupos, OR dentro del grupo
    // -------------------------------------------------------
    useEffect(() => {
        let result = initialProducts;

        // Paso 1: Categoría (productType) — OR interno
        if (selectedFilters.category.length > 0) {
            result = result.filter(p => selectedFilters.category.includes(p.productType));
        }

        // Paso 2: Colección (tag exacto) — OR interno
        if (selectedFilters.collection.length > 0) {
            result = result.filter(p => {
                const productTagsLower = p.tags.map(t => t.trim().toLowerCase());
                return selectedFilters.collection.some(col =>
                    productTagsLower.includes(col.trim().toLowerCase())
                );
            });
        }

        // Paso 3: Material (normalizado) — OR interno
        if (selectedFilters.material.length > 0) {
            result = result.filter(p => {
                const productMaterials = getProductMaterials(p.tags);
                return selectedFilters.material.some(mat => productMaterials.includes(mat));
            });
        }

        // Paso 4: Precio (solo si el usuario movió el slider)
        if (priceRange.min > 0 || priceRange.max < 5000) {
            result = result.filter(p => {
                const price = parseFloat(p.priceRange.minVariantPrice.amount);
                return price >= priceRange.min && (priceRange.max >= 5000 ? true : price <= priceRange.max);
            });
        }

        // Paso 5: Ordenar
        if (sortBy === 'price-low-high') {
            result = [...result].sort((a, b) =>
                parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
            );
        } else if (sortBy === 'price-high-low') {
            result = [...result].sort((a, b) =>
                parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
            );
        }

        setProducts(result);
    }, [selectedFilters, priceRange, sortBy, initialProducts]);

    // -------------------------------------------------------
    // Handlers
    // -------------------------------------------------------
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

    const handleSort = (value: string) => {
        setSortBy(value);
    };

    const hasActiveFilters =
        selectedFilters.category.length > 0 ||
        selectedFilters.collection.length > 0 ||
        selectedFilters.material.length > 0 ||
        priceRange.min > 0 ||
        priceRange.max < 5000;

    // -------------------------------------------------------
    // Render
    // -------------------------------------------------------
    return (
        <div className="w-full relative min-h-screen flex flex-col lg:flex-row gap-8 px-4 md:px-12 pt-8">

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden w-full flex justify-between items-center mb-6 pb-4 border-b border-[#d4af37]/20">
                <span className="text-gray-400 text-xs uppercase tracking-widest">{products.length} {t('store.jewelry')}</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 text-[#d4af37] font-bold text-sm uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined">tune</span>{t('store.filters')} {hasActiveFilters && <span className="bg-[#d4af37] text-black rounded-full w-4 h-4 text-[10px] flex items-center justify-center ml-1">
                        {selectedFilters.category.length + selectedFilters.collection.length + selectedFilters.material.length}
                    </span>}
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
                    lang={lang}
                />
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="mt-4 w-full flex items-center justify-center gap-2 border border-[#d4af37]/40 text-[#d4af37] text-xs uppercase tracking-widest font-bold py-2.5 hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-sm"
                    >
                        <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                        {t('store.clearFilters')}
                    </button>
                )}
            </div>

            {/* Mobile Drawer Sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
                {/* Drawer: flex-col — header fijo + scroll + botones siempre visibles */}
                <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#0a0a0a] border-l border-[#d4af37]/20 flex flex-col">
                    {/* Header fijo */}
                    <div className="flex justify-between items-center p-6 border-b border-[#d4af37]/10 flex-shrink-0">
                        <h2 className="text-[#FAFAF5] font-serif text-xl">{t('store.filters')}</h2>

                        <button onClick={() => setIsSidebarOpen(false)}>
                            <span className="material-symbols-outlined text-gray-400 hover:text-[#d4af37] transition-colors">close</span>
                        </button>
                    </div>

                    {/* Área de filtros scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <FilterSidebar
                            filters={filterOptions}
                            selectedFilters={selectedFilters}
                            onFilterChange={handleFilterChange}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            totalProducts={initialProducts.length}
                            filteredCount={products.length}
                            lang={lang}
                        />
                    </div>

                    {/* Botones SIEMPRE visibles — pb-[84px] para no taparlos con la bottom nav de 64px */}
                    <div className="flex-shrink-0 px-4 pt-4 pb-[84px] border-t border-[#d4af37]/10 space-y-3 bg-[#0a0a0a]">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest py-3.5 hover:bg-white transition-colors rounded-sm text-sm"
                        >
                            {t('store.viewJewelry')} {products.length} {t('store.jewelry')}

                        </button>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="w-full flex items-center justify-center gap-2 border border-[#d4af37]/40 text-[#d4af37] text-xs uppercase tracking-widest font-bold py-2.5 hover:bg-[#d4af37] hover:text-black transition-all duration-300 rounded-sm"
                            >
                                <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
                                {t('store.clearFilters')}

                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Grid Content */}
            <div className="flex-1 pb-32">
                {/* Desktop Toolbar (Sort + Active Filter Chips) */}
                <div className="hidden lg:flex flex-col gap-4 mb-8 pb-4 border-b border-[#d4af37]/10">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-xs hidden lg:block">
                            {t('store.showing')} <span className="text-[#FAFAF5]">{products.length}</span> {t('store.of')} {initialProducts.length} {t('store.results')}
                        </p>

                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-xs uppercase tracking-widest hidden md:inline-block">{t('store.sort')}</span>
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSort(e.target.value)}
                                    className="appearance-none bg-transparent border border-[#d4af37]/20 text-[#FAFAF5] text-xs font-bold uppercase tracking-widest py-2 pl-4 pr-10 rounded-none cursor-pointer hover:border-[#d4af37] transition-colors focus:outline-none focus:border-[#d4af37]"
                                >
                                    <option value="featured" className="bg-black">{t('store.sort.featured')}</option>
                                    <option value="price-low-high" className="bg-black">{t('store.sort.priceLowHigh')}</option>
                                    <option value="price-high-low" className="bg-black">{t('store.sort.priceHighLow')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Chips de filtros activos */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                            {[...selectedFilters.category, ...selectedFilters.collection, ...selectedFilters.material].map(f => (
                                <span key={f} className="flex items-center gap-1 px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-xs rounded-full">
                                    {translateTag(f)}
                                    <button
                                        onClick={() => {
                                            if (selectedFilters.category.includes(f)) handleFilterChange('category', f);
                                            else if (selectedFilters.collection.includes(f)) handleFilterChange('collection', f);
                                            else handleFilterChange('material', f);
                                        }}
                                        className="ml-1 hover:text-white"
                                    >✕</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} lang={lang} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-5xl text-[#d4af37]/30 mb-4">diamond</span>
                        <h3 className="text-xl font-serif text-[#FAFAF5] mb-2">
                            {filterLabel
                                ? t('store.emptyState.noStyleTitle')
                                : t('store.emptyState.noResultsTitle')
                            }
                        </h3>
                        <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
                            {filterLabel
                                ? `${t('store.emptyState.noStyleDesc')} "${filterLabel}"${t('store.emptyState.noStyleDescEnd')}`
                                : t('store.emptyState.noResultsDesc')
                            }
                        </p>
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                            <button
                                onClick={clearFilters}
                                className="text-[#d4af37] border-b border-[#d4af37] pb-1 hover:text-white hover:border-white transition-colors text-sm uppercase tracking-widest"
                            >
                                {t('store.emptyState.viewAll')}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
