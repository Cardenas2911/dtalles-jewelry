import React, { useEffect, useState } from 'react';

interface StickyAddToCartProps {
    productTitle: string;
    price: number;
    compareAtPrice?: number;
    image: string;
    isSoldOut: boolean;
    onAddToCart: () => void;
    mainButtonId?: string; // ID of the main button to observe
}

export default function StickyAddToCart({ productTitle, price, compareAtPrice, image, isSoldOut, onAddToCart, mainButtonId = "main-add-to-cart" }: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const mainButton = document.getElementById(mainButtonId);
        if (!mainButton) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Show sticky bar when main button is NOT visible and we are scrolled DOWN (top is negative bounding rect)
                // Actually simplest logic: if button is above viewport.
                // entry.isIntersecting = true (visible) -> Hide sticky
                // entry.isIntersecting = false (not visible) -> Show sticky IF we are below it

                if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0 }
        );

        observer.observe(mainButton);
        return () => observer.disconnect();
    }, [mainButtonId]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-[64px] lg:bottom-0 left-0 right-0 bg-white border-t border-[#d4af37]/20 p-4 z-50 animate-slide-up shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Product Info (Mobile Hidden or Simplified) */}
                <div className="hidden md:flex items-center gap-3">
                    {image && <img src={image} alt={productTitle} className="w-10 h-10 object-cover rounded-sm border border-gray-200" />}
                    <div>
                        <h4 className="text-black font-serif text-sm truncate max-w-[200px]">{productTitle}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[#bfa15f] text-xs font-bold">${price.toLocaleString()}</span>
                            {compareAtPrice && compareAtPrice > price && (
                                <span className="text-gray-400 text-xs line-through decoration-gray-400">${compareAtPrice.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Info (Just Price maybe?) */}
                <div className="md:hidden flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-black text-sm font-bold">${price.toLocaleString()}</span>
                        {compareAtPrice && compareAtPrice > price && (
                            <span className="text-gray-400 text-xs line-through decoration-gray-400">${compareAtPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={onAddToCart}
                    disabled={isSoldOut}
                    className={`flex-1 md:flex-none md:w-64 py-3 uppercase font-bold text-xs tracking-[2px] transition-all 
            ${isSoldOut
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-[#d4af37] text-black hover:bg-white'}`}
                >
                    {isSoldOut ? 'Agotado' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
    );
}
