import React from 'react';
import { getRoute, getClientLocalizedRoute } from '../../../utils/paths';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

interface Product {
    id: string;
    title: string;
    handle: string;
    priceRange: {
        minVariantPrice: { amount: string; currencyCode: string; }
    };
    featuredImage?: { url: string; altText: string; };
    images?: { edges: { node: { url: string; altText: string } }[] };
}

interface MobileProductGridProps {
    products: Product[];
    lang?: 'es' | 'en';
}

export default function MobileProductGrid({ products, lang = 'es' }: MobileProductGridProps) {
    const t = getTranslationFunctionForLang(lang);
    // Tomamos los primeros 4 o 6 para el grid móvil
    const displayProducts = products.slice(0, 4);

    return (
        <section className="px-5 mt-8 mb-8">
            <h2 className="text-xl font-bold mb-4 text-black tracking-tight">{t('ui.product.forYou')}</h2>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {displayProducts.map((product) => {
                    const imageUrl = product.featuredImage?.url || product.images?.edges[0]?.node?.url;
                    const price = parseFloat(product.priceRange.minVariantPrice.amount);

                    const productUrl = lang ? getRoute(`/producto/${product.handle}`, lang) : getClientLocalizedRoute(`/producto/${product.handle}`);

                    return (
                        <a key={product.id} href={productUrl} className="flex flex-col group">
                            {/* Product Image Container */}
                            <div className="aspect-[4/5] bg-[#F9FAFB] rounded-xl overflow-hidden mb-3 relative flex items-center justify-center">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.featuredImage?.altText || product.title}
                                        className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="text-gray-300 text-xs">{t('ui.product.noImage')}</div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex flex-col">
                                <h3 className="text-sm font-medium text-black line-clamp-2 leading-snug">
                                    {product.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 font-sans">
                                    ${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
}
