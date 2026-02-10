import React from 'react';
import { useStore } from '@nanostores/react';
import { favoriteItems } from '../../store/favorites';
import ProductCard from './ProductCard';

export default function FavoritesView() {
    const $favorites = useStore(favoriteItems);
    const favoritesList = Object.values($favorites);

    if (favoritesList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-500 mb-6">favorite</span>
                <h2 className="text-2xl font-serif text-[#FAFAF5] mb-2">Tu lista de deseos está vacía</h2>
                <p className="text-gray-400 mb-8 max-w-sm">
                    Guarda tus joyas favoritas aquí para no perderlas de vista.
                </p>
                <a
                    href="/tienda"
                    className="bg-[#d4af37] text-black px-8 py-3 rounded-full font-medium tracking-wide hover:bg-[#b08d29] transition-colors"
                >
                    Explorar Colección
                </a>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 md:gap-x-6 gap-y-10 px-4 md:px-8 mt-6 pb-32">
                {favoritesList.map((fav) => {
                    // Adapt FavoriteItem to Product interface expected by ProductCard
                    const productAdapter = {
                        id: fav.id,
                        title: fav.title,
                        handle: fav.handle,
                        priceRange: {
                            minVariantPrice: {
                                amount: fav.price,
                                currencyCode: 'USD' // Default currency assumption or need to store it
                            }
                        },
                        featuredImage: {
                            url: fav.image,
                            altText: fav.title
                        },
                        productType: '',
                        tags: [],
                        variantId: fav.variantId // Pass stored variant ID
                    };

                    return (
                        <ProductCard key={fav.id} product={productAdapter} />
                    );
                })}
            </div>
        </div>
    );
}
