import React, { useState } from 'react';

interface FilterSidebarProps {
    filters: {
        categories: string[];
        collections: string[];
        materials: string[];
    };
    selectedFilters: {
        category: string[];
        priceRange: string;
        collection: string[];
        material: string[];
    };
    onFilterChange: (type: string, value: string) => void;
    priceRange: { min: number; max: number };
    setPriceRange: (range: { min: number; max: number }) => void;
    totalProducts: number;
    filteredCount: number;
}

export default function FilterSidebar({
    filters,
    selectedFilters,
    onFilterChange,
    priceRange,
    setPriceRange,
    totalProducts,
    filteredCount
}: FilterSidebarProps) {

    // Accordion State
    const [openSections, setOpenSections] = useState<string[]>(['category', 'price', 'collection']);

    const toggleSection = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0 pr-0 lg:pr-8 space-y-8 font-sans">

            {/* Header / Stats */}
            <div className="pb-4 border-b border-[#d4af37]/20">
                <h3 className="text-[#FAFAF5] font-serif text-lg">Filtros</h3>
                <p className="text-gray-500 text-xs mt-1">
                    Mostrando {filteredCount} de {totalProducts} joyas
                </p>
            </div>

            {/* 1. Category Filter */}
            <div className="border-b border-[#d4af37]/10 pb-6">
                <button
                    onClick={() => toggleSection('category')}
                    className="flex justify-between items-center w-full mb-4 group"
                >
                    <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Categoría</span>
                    <span className={`material-symbols-outlined text-gray-500 group-hover:text-[#d4af37] transition-transform ${openSections.includes('category') ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {openSections.includes('category') && (
                    <div className="space-y-2 animate-fade-in">
                        {filters.categories.map(cat => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedFilters.category.includes(cat) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-600 group-hover:border-[#d4af37]'}`}>
                                    {selectedFilters.category.includes(cat) && <span className="material-symbols-outlined text-black text-[10px] font-bold">check</span>}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedFilters.category.includes(cat)}
                                    onChange={() => onFilterChange('category', cat)}
                                />
                                <span className={`text-sm ${selectedFilters.category.includes(cat) ? 'text-white' : 'text-gray-400'} group-hover:text-[#FAFAF5] transition-colors`}>{cat}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. Price Filter */}
            <div className="border-b border-[#d4af37]/10 pb-6">
                <button
                    onClick={() => toggleSection('price')}
                    className="flex justify-between items-center w-full mb-4 group"
                >
                    <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Precio</span>
                    <span className={`material-symbols-outlined text-gray-500 group-hover:text-[#d4af37] transition-transform ${openSections.includes('price') ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {openSections.includes('price') && (
                    <div className="px-2 animate-fade-in">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                            <span>${priceRange.min}</span>
                            <span>${priceRange.max}+</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                            className="w-full accent-[#d4af37] h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <p className="text-center text-[#FAFAF5] text-sm mt-2">
                            Hasta: <span className="font-bold text-[#d4af37]">${priceRange.max}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* 3. Collection Filter */}
            <div className="border-b border-[#d4af37]/10 pb-6">
                <button
                    onClick={() => toggleSection('collection')}
                    className="flex justify-between items-center w-full mb-4 group"
                >
                    <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Colección</span>
                    <span className={`material-symbols-outlined text-gray-500 group-hover:text-[#d4af37] transition-transform ${openSections.includes('collection') ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {openSections.includes('collection') && (
                    <div className="space-y-2 animate-fade-in">
                        {filters.collections.map(col => (
                            <label key={col} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedFilters.collection.includes(col) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-600 group-hover:border-[#d4af37]'}`}>
                                    {selectedFilters.collection.includes(col) && <span className="material-symbols-outlined text-black text-[10px] font-bold">check</span>}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedFilters.collection.includes(col)}
                                    onChange={() => onFilterChange('collection', col)}
                                />
                                <span className={`text-sm ${selectedFilters.collection.includes(col) ? 'text-white' : 'text-gray-400'} group-hover:text-[#FAFAF5] transition-colors`}>{col}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Material Filter (Extracted from Tags usually) */}
            <div>
                <button
                    onClick={() => toggleSection('material')}
                    className="flex justify-between items-center w-full mb-4 group"
                >
                    <span className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">Material</span>
                    <span className={`material-symbols-outlined text-gray-500 group-hover:text-[#d4af37] transition-transform ${openSections.includes('material') ? 'rotate-180' : ''}`}>expand_more</span>
                </button>

                {openSections.includes('material') && (
                    <div className="space-y-2 animate-fade-in">
                        {filters.materials.map(mat => (
                            <label key={mat} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedFilters.material.includes(mat) ? 'bg-[#d4af37] border-[#d4af37]' : 'border-gray-600 group-hover:border-[#d4af37]'}`}>
                                    {selectedFilters.material.includes(mat) && <span className="material-symbols-outlined text-black text-[10px] font-bold">check</span>}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedFilters.material.includes(mat)}
                                    onChange={() => onFilterChange('material', mat)}
                                />
                                <span className={`text-sm ${selectedFilters.material.includes(mat) ? 'text-white' : 'text-gray-400'} group-hover:text-[#FAFAF5] transition-colors`}>{mat}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

        </aside>
    );
}
