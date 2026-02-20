import React, { useState } from 'react';
import { addCartItem, setIsCartOpen } from '../../../store/cart';
import TrustBadges from './TrustBadges';
import ReviewSnippet from './ReviewSnippet';
import StickyAddToCart from './StickyAddToCart';
import PaymentIcons from '../PaymentIcons';

interface Variant {
    id: string;
    title: string;
    availableForSale: boolean;
    quantityAvailable?: number;
    price: {
        amount: string;
        currencyCode: string;
    };
    compareAtPrice?: {
        amount: string;
        currencyCode: string;
    };
    selectedOptions: {
        name: string;
        value: string;
    }[];
}

interface ProductInfoProps {
    product: {
        id: string;
        title: string;
        handle: string;
        vendor: string;
        priceRange: {
            minVariantPrice: {
                amount: string;
                currencyCode: string;
            };
        };
        pesoReal?: { value: string };
        options?: {
            name: string;
            values: string[];
        }[];
        featuredImage?: { url: string }; // Added to pass image to Sticky
    };
    variants: Variant[];
    selectedVariant: Variant;
    onVariantChange: (variant: Variant) => void;
}

export default function ProductInfo({ product, variants, selectedVariant, onVariantChange }: ProductInfoProps) {
    const [adding, setAdding] = useState(false);

    // Group variants by options (e.g. Size).
    const optionName = selectedVariant.selectedOptions[0]?.name || 'Talla';
    const uniqueOptionValues = Array.from(new Set(variants.map(v => v.selectedOptions[0]?.value))).filter(Boolean);

    const handleAddToCart = () => {
        setAdding(true);
        addCartItem({
            id: selectedVariant.id,
            title: product.title,
            price: parseFloat(selectedVariant.price.amount),
            image: product.featuredImage?.url || '',
            handle: product.handle,
            variantTitle: selectedVariant.title,
            quantity: 1
        });
        setTimeout(() => {
            setAdding(false);
            setIsCartOpen(true);
        }, 600);
    };

    const price = parseFloat(selectedVariant.price.amount);
    const isSoldOut = !selectedVariant.availableForSale || (selectedVariant.quantityAvailable !== undefined && selectedVariant.quantityAvailable <= 0);

    return (
        <>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    {/* Vendor */}
                    <span className="text-[#d4af37] text-[10px] md:text-xs font-bold uppercase tracking-[2px] mb-2 block animate-fade-in">
                        {product.vendor || 'DTalles Gold Collection'}
                    </span>

                    {/* Title */}
                    <h1 className="text-2xl md:text-5xl font-serif text-white mb-2 leading-tight break-words">
                        {product.title}
                    </h1>

                    {/* Price Row */}
                    <div className="flex flex-col items-center md:items-start gap-2 mb-6">
                        <div className="flex items-baseline gap-4 flex-wrap justify-center md:justify-start">
                            <span className="text-3xl md:text-5xl font-serif text-[#d4af37] break-words">
                                ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                            {selectedVariant.compareAtPrice && parseFloat(selectedVariant.compareAtPrice.amount) > price && (
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-lg md:text-xl text-gray-400 line-through decoration-red-500/60 decoration-2">
                                        ${parseFloat(selectedVariant.compareAtPrice.amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </span>
                                    <span className="bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mt-1 animate-pulse-slow">
                                        Ahorras {Math.round(((parseFloat(selectedVariant.compareAtPrice.amount) - price) / parseFloat(selectedVariant.compareAtPrice.amount)) * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {product.pesoReal?.value && (
                            <span className="text-xs text-gray-500 font-mono">
                                ~${(price / parseFloat(product.pesoReal.value)).toLocaleString('en-US', { maximumFractionDigits: 0 })}/gr (Oro Sólido)
                            </span>
                        )}
                    </div>

                    {/* Trust Badges - NEW */}
                    <TrustBadges />

                    {/* Review Snippet - NEW */}
                    <ReviewSnippet />

                    {/* Stock Urgency */}
                    {selectedVariant.quantityAvailable !== undefined && selectedVariant.quantityAvailable > 0 && selectedVariant.quantityAvailable < 5 && (
                        <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-3 py-1.5 rounded-full animate-pulse-slow">
                            <span className="w-2 h-2 rounded-full bg-[#d4af37]"></span>
                            Solo quedan {selectedVariant.quantityAvailable} piezas
                        </div>
                    )}
                </div>

                {/* Variant Selector */}
                {uniqueOptionValues.length > 0 && uniqueOptionValues[0] !== 'Default Title' && (
                    <div>
                        <span className="text-gray-400 text-xs uppercase tracking-widest mb-3 block">
                            Selecciona {optionName}: <span className="text-white font-bold">{selectedVariant.selectedOptions[0]?.value}</span>
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {uniqueOptionValues.map(value => {
                                const variant = variants.find(v => v.selectedOptions[0]?.value === value);
                                const available = variant?.availableForSale;
                                const isSelected = selectedVariant.selectedOptions[0]?.value === value;

                                return (
                                    <button
                                        key={value}
                                        onClick={() => variant && onVariantChange(variant)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center border text-sm font-medium transition-all relative ${isSelected
                                            ? 'border-[#d4af37] bg-[#d4af37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                                            : 'border-white/20 text-gray-400 hover:border-white/60 hover:text-white'
                                            } ${!available ? 'opacity-50 cursor-not-allowed line-through decoration-white/50' : ''}`}
                                    >
                                        {value}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Main CTA */}
                <div className="pt-4">
                    <button
                        id="main-add-to-cart"
                        onClick={handleAddToCart}
                        disabled={isSoldOut || adding}
                        className={`w-full py-5 uppercase font-bold tracking-[2px] transition-all flex items-center justify-center gap-3 ${isSoldOut
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed border border-transparent'
                            : 'bg-[#d4af37] text-black border border-[#d4af37] hover:bg-white hover:border-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                            }`}
                    >
                        {adding ? (
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                        ) : isSoldOut ? (
                            'Agotado - Avísame'
                        ) : (
                            'Agregar a la Bolsa'
                        )}
                    </button>
                </div>

                {/* Secure Checkout Icons */}
                <div className="flex flex-col items-center justify-center gap-2 mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        <span>Pago 100% Seguro y Encriptado</span>
                    </div>
                    <PaymentIcons className="flex flex-wrap justify-center gap-2 opacity-80" iconClassName="h-5 w-auto" />
                </div>

                {/* Affirm info moved to bottom */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-light mt-2">
                    <span>Paga en cuotas con</span>
                    <span className="font-bold text-white">Affirm</span>
                </div>
            </div>

            {/* Sticky Add to Cart (Island) */}
            <StickyAddToCart
                productTitle={product.title}
                price={price}
                compareAtPrice={selectedVariant.compareAtPrice ? parseFloat(selectedVariant.compareAtPrice.amount) : undefined}
                image={product.featuredImage?.url || ''}
                isSoldOut={isSoldOut}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}
