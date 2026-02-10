import React, { useState } from 'react';
import { addCartItem, setIsCartOpen } from '../../../store/cart';
import { toggleFavorite } from '../../../store/favorites';

interface WishlistCardProps {
    item: {
        id: string;
        title: string;
        price: string;
        image: string;
        handle: string;
        variantId?: string;
        availableForSale?: boolean; // Optional for now until store is updated
    };
}

export default function WishlistCard({ item }: WishlistCardProps) {
    const [moving, setMoving] = useState(false);

    const handleMoveToBag = () => {
        setMoving(true);

        // 1. Add to Cart
        addCartItem({
            id: item.variantId || item.id, // Fallback to ID if variantId missing (shouldn't happen with new logic)
            title: item.title,
            price: parseFloat(item.price),
            image: item.image,
            handle: item.handle,
            quantity: 1
        });

        // 2. Remove from Favorites after delay
        setTimeout(() => {
            toggleFavorite(item); // Toggle removes it if present
            setMoving(false);
            setIsCartOpen(true);
        }, 600);
    };

    const handleRemove = () => {
        toggleFavorite(item);
    };

    const isAvailable = item.availableForSale !== false; // Default to true if undefined (legacy items)

    return (
        <article className="group flex flex-col h-full bg-[#111] border border-white/5 relative hover:border-[#d4af37]/30 transition-colors duration-300">
            {/* Remove Button (Top Right) */}
            <button
                onClick={handleRemove}
                className="absolute top-2 right-2 z-20 text-gray-500 hover:text-red-500 transition-colors p-2"
                aria-label="Eliminar de favoritos"
            >
                <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Image */}
            <a href={`/producto/${item.handle}`} className="aspect-[4/5] overflow-hidden relative block bg-[#050505]">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
            </a>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-3">
                {/* Status */}
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-gray-500'}`}></span>
                    <span className={`text-[10px] uppercase tracking-wider font-bold ${isAvailable ? 'text-emerald-500' : 'text-gray-500'}`}>
                        {isAvailable ? 'En Stock' : 'Agotado'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[#FAFAF5] font-serif text-lg leading-tight line-clamp-2">
                    <a href={`/producto/${item.handle}`}>{item.title}</a>
                </h3>

                {/* Price */}
                <div className="mt-auto pt-2">
                    <span className="text-[#d4af37] text-xl font-light">
                        ${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                </div>

                {/* CTA */}
                <button
                    onClick={handleMoveToBag}
                    disabled={moving || !isAvailable}
                    className={`w-full py-3 mt-2 border text-[10px] uppercase font-bold tracking-[2px] transition-all flex items-center justify-center gap-2 ${isAvailable
                            ? 'border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black'
                            : 'border-white/10 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {moving ? 'Moviendo...' : isAvailable ? 'Mover a la Bolsa' : 'Avísame'}
                </button>
            </div>
        </article>
    );
}
