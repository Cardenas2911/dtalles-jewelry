import React, { useRef } from 'react';
import ProductCard from '../react/ProductCard';

interface BestSellersProps {
    products: any[];
}

export default function BestSellers({ products }: BestSellersProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Approx card width
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <section className="max-w-[1920px] mx-auto py-16 md:py-24 border-b border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6 mb-10 flex items-end justify-between">
                <div>
                    <span className="text-[#d4af37] tracking-[0.2em] text-xs font-bold uppercase block mb-3">
                        Selección Exclusiva
                    </span>
                    <h2 className="text-[#FAFAF5] font-serif text-3xl md:text-5xl">
                        Favoritos en Miami
                    </h2>
                </div>

                {/* Navigation Arrows */}
                <div className="hidden md:flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                        aria-label="Scroll Left"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors"
                        aria-label="Scroll Right"
                    >
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                </div>
            </div>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-6 px-6 md:px-[max(24px,calc((100vw-1280px)/2))]"
                style={{ scrollPaddingLeft: '24px' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}

                {/* View More Card */}
                <div className="min-w-[200px] snap-start flex items-center justify-center">
                    <a href="/tienda" className="group flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-full border border-[#d4af37] flex items-center justify-center group-hover:bg-[#d4af37] transition-colors">
                            <span className="material-symbols-outlined text-[#d4af37] group-hover:text-black transition-colors">arrow_forward</span>
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest text-[#d4af37]">Ver Todo</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
