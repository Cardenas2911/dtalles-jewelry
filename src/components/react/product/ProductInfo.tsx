import React, { useState } from 'react';
import { addCartItem, setIsCartOpen } from '../../../store/cart';

interface Variant {
    id: string;
    title: string;
    availableForSale: boolean;
    quantityAvailable?: number;
    price: {
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
        options?: { // Using the raw variants to build options logic manually if needed, or if passed
            name: string;
            values: string[];
        }[];
    };
    variants: Variant[];
    selectedVariant: Variant;
    onVariantChange: (variant: Variant) => void;
}

export default function ProductInfo({ product, variants, selectedVariant, onVariantChange }: ProductInfoProps) {
    const [adding, setAdding] = useState(false);

    // Group variants by options (e.g. Size).
    // Assuming simple structure for now: Single option like "Size" or "Length".
    // If multiple options, logic needs to be more complex (Cartesian product).
    // Let's assume the first option is the main one for buttons (e.g. "Size").
    const optionName = selectedVariant.selectedOptions[0]?.name || 'Talla';

    // Get unique values for this option
    const uniqueOptionValues = Array.from(new Set(variants.map(v => v.selectedOptions[0]?.value))).filter(Boolean);

    const handleAddToCart = () => {
        setAdding(true);
        addCartItem({
            id: selectedVariant.id,
            title: product.title,
            price: parseFloat(selectedVariant.price.amount),
            image: '', // Needs to be passed or handled, but cart stores it. Gallery handles images but addCartItem needs one. 
            // We'll pass empty for now and let the cart logic or Parent handle it? 
            // Actually `addCartItem` needs image. Let's ask Parent to pass it or just use a placeholder/first image logic here if available?
            // Better: Component should receive `featuredImage` prop.
            // For now, I'll update the interface in next step if broken, or let Cart handle fallback.
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
        <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            {/* Header */}
            <div>
                <span className="text-[#d4af37] text-xs font-bold uppercase tracking-[2px] mb-2 block">
                    {product.vendor || 'DTalles Gold Collection'}
                </span>
                <h1 className="main-heading text-left mb-4">
                    {product.title} <span className="text-2xl md:text-3xl block md:inline font-light text-white/80">- Oro 14k Garantizado</span>
                </h1>

                <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-2xl md:text-3xl font-light text-white">
                        ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    {/* Compare At Price logic if needed */}
                </div>

                {/* Affirm / Financing */}
                <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 font-light">
                    <span>o paga 4 cuotas de <strong>${(price / 4).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> con</span>
                    <span className="font-bold text-white">Affirm</span>
                </div>
            </div>

            {/* Variant Selector (Buttons) */}
            {uniqueOptionValues.length > 0 && uniqueOptionValues[0] !== 'Default Title' && (
                <div>
                    <span className="text-gray-400 text-xs uppercase tracking-widest mb-3 block">
                        Selecciona {optionName}: <span className="text-white font-bold">{selectedVariant.selectedOptions[0]?.value}</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {uniqueOptionValues.map(value => {
                            // Find variant for this value
                            const variant = variants.find(v => v.selectedOptions[0]?.value === value);
                            const available = variant?.availableForSale;
                            const isSelected = selectedVariant.selectedOptions[0]?.value === value;

                            return (
                                <button
                                    key={value}
                                    onClick={() => variant && onVariantChange(variant)}
                                    // disabled={!available} // Don't disable, allow selection to see "Out of Stock" message? 
                                    // User said: "Si una talla está agotada, tacharla visualmente pero permitir dejar el email"
                                    className={`px-4 py-3 min-w-[3.5rem] border text-sm font-medium transition-all relative ${isSelected
                                        ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                                        : 'border-white/20 text-gray-400 hover:border-white/40'
                                        } ${!available ? 'opacity-50 cursor-not-allowed line-through decoration-white/50' : ''}`}
                                >
                                    {value}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* CTA */}
            <div className="pt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={isSoldOut || adding}
                    className={`w-full py-4 uppercase font-bold tracking-[2px] transition-all flex items-center justify-center gap-3 ${isSoldOut
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

                {/* Trust Microcopy */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <span className="material-symbols-outlined text-[#d4af37] text-lg">lock</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-500">Envío Asegurado</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <span className="material-symbols-outlined text-[#d4af37] text-lg">verified</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-500">Oro Garantizado</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <span className="material-symbols-outlined text-[#d4af37] text-lg">refresh</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-500">Devoluciones 30 Días</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
