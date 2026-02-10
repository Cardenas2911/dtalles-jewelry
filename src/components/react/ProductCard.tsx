import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { isFavorite, toggleFavorite, favoriteItems } from '../../store/favorites';
import { addCartItem, setIsCartOpen } from '../../store/cart';

interface Product {
    id: string;
    title: string;
    handle: string;
    availableForSale?: boolean;
    totalInventory?: number;
    tags?: string[];
    productType?: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    featuredImage: {
        url: string;
        altText: string;
        width?: number;
        height?: number;
    };
    images?: {
        edges: Array<{
            node: {
                url: string;
                altText: string;
            };
        }>;
    };
    variants?: {
        edges: Array<{
            node: {
                id: string;
                quantityAvailable?: number;
            };
        }>;
    };
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const $favorites = useStore(favoriteItems);
    const isFav = !!$favorites[product.id];
    const [isHovered, setIsHovered] = useState(false);
    const [adding, setAdding] = useState(false);

    // Logic for Badges
    const isNew = product.tags?.includes('Nuevo') || product.tags?.includes('New');
    const inventory = product.totalInventory || product.variants?.edges?.[0]?.node?.quantityAvailable || 0;
    const isLowStock = inventory > 0 && inventory < 5;

    // Images
    const firstImage = product.featuredImage?.url;
    // Try to find a second image that is NOT the same as the first one, for the hover effect (Human Scale)
    const secondImage = product.images?.edges?.find(e => e.node.url !== firstImage)?.node?.url;

    // Variant ID for Cart
    const variantId = product.variants?.edges?.[0]?.node?.id || product.id;
    const price = parseFloat(product.priceRange.minVariantPrice.amount);

    const handleQuickAdd = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAdding(true);

        // Add to cart store
        addCartItem({
            id: variantId,
            title: product.title,
            price: price,
            image: firstImage,
            handle: product.handle,
            quantity: 1
        });

        // Simulate small delay for feedback/animation then open drawer
        setTimeout(() => {
            setAdding(false);
            setIsCartOpen(true);
        }, 600);
    };

    return (
        <article
            className="group relative flex flex-col h-full bg-transparent transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. THE VITRINE (Image Area) */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#111111] border border-transparent group-hover:border-[#d4af37] transition-colors duration-300">
                <a href={`/producto/${product.handle}`} className="block w-full h-full relative">
                    {/* Primary Image */}
                    <img
                        src={firstImage}
                        alt={product.featuredImage?.altText || product.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered && secondImage ? 'opacity-0' : 'opacity-100'}`}
                        loading="lazy"
                    />
                    {/* Secondary Image (Human Scale) */}
                    {secondImage && (
                        <img
                            src={secondImage}
                            alt={`${product.title} - Puesto`}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                            loading="lazy"
                        />
                    )}
                </a>

                {/* Badges (Top Left) */}
                <div className="absolute top-0 left-0 p-3 flex flex-col gap-1 z-20">
                    {isNew && (
                        <span className="bg-[#d4af37] text-black text-[10px] font-sans font-bold px-2 py-1 uppercase tracking-wider">
                            Nuevo
                        </span>
                    )}
                    {isLowStock && (
                        <span className="bg-[#d4af37] text-black text-[10px] font-sans font-bold px-2 py-1 uppercase tracking-wider">
                            Pocas Piezas
                        </span>
                    )}
                </div>

                {/* Wishlist (Top Right) */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite({
                            id: product.id,
                            handle: product.handle,
                            title: product.title,
                            price: product.priceRange.minVariantPrice.amount,
                            image: firstImage,
                            variantId: variantId
                        });
                    }}
                    className="absolute top-0 right-0 p-3 z-30 group/fav"
                    aria-label="Agregar a favoritos"
                >
                    <span
                        className={`material-symbols-outlined text-[24px] transition-all duration-300 ${isFav ? 'filled text-[#d4af37] animate-pulse-once' : 'text-white group-hover/fav:text-[#d4af37]'}`}
                        style={isFav ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                        favorite
                    </span>
                </button>

                {/* CTA Overlay (Desktop: Slide Up / Mobile: Always Visible icon?) */}
                {/* Implementing Desktop Slide-up Button as requested */}
                <div className={`absolute bottom-0 left-0 w-full p-4 z-20 transition-transform duration-500 ease-out hidden md:block ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
                    <button
                        onClick={handleQuickAdd}
                        disabled={adding}
                        className="w-full py-3 border border-[#d4af37] bg-black/40 backdrop-blur-sm text-[#d4af37] font-sans font-bold text-[11px] uppercase tracking-[2px] hover:bg-[#d4af37] hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        {adding ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <span>Añadir Rápido</span>
                                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 2. INFO AREA */}
            <div className="pt-4 flex flex-col gap-1 px-3 pb-3">
                {/* Quality Label */}
                <div className="text-[10px] text-[#A0A0A0] uppercase tracking-widest font-medium">
                    {/* Heuristic to guess gold karat from title or tags if not explicit meta. Defaulting to general promise */}
                    {product.title.includes('10k') ? 'Oro 10k Garantizado' : product.title.includes('18k') ? 'Oro 18k Garantizado' : 'Oro 14k Garantizado'}
                </div>

                {/* Title */}
                <h3 className="text-[#FAFAF5] font-sans font-semibold text-sm md:text-[15px] leading-tight tracking-wide line-clamp-2 h-[2.4em] mb-1">
                    <a href={`/producto/${product.handle}`} className="hover:text-[#d4af37] transition-colors">
                        {product.title}
                    </a>
                </h3>

                {/* Price Block */}
                <div className="mt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[#d4af37] font-serif text-lg md:text-xl">
                            ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                        {/* Fake 'Compare At' logic if we had it, omitting for clean look unless data exists */}
                    </div>

                    {/* Finance Microcopy */}
                    <div className="text-[9px] text-[#888] mt-0.5 font-light tracking-wide flex items-center gap-1">
                        o 4 pagos de ${(price / 4).toLocaleString('en-US', { maximumFractionDigits: 0 })} con
                        <span className="font-bold text-gray-500">Affirm</span>
                    </div>
                </div>

                {/* Mobile CTA (Always visible button/icon or simplified) */}
                <div className="md:hidden mt-3">
                    <button
                        onClick={handleQuickAdd}
                        className="w-full py-2.5 border border-[#d4af37]/50 text-[#d4af37] text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 active:bg-[#d4af37] active:text-black transition-colors"
                    >
                        Añadir
                    </button>
                </div>
            </div>
        </article>
    );
}
