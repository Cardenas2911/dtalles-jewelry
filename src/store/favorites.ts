import { persistentMap } from '@nanostores/persistent';

export interface FavoriteItem {
    id: string; // Product ID (gid)
    handle: string;
    title: string;
    price: string;
    image: string;
    addedAt: number;
    variantId?: string;
}

// Key for localStorage
export const favoriteItems = persistentMap<Record<string, FavoriteItem>>(
    'dtalles_favorites',
    {},
    {
        encode: JSON.stringify,
        decode: JSON.parse,
    }
);

export function toggleFavorite(item: Omit<FavoriteItem, 'addedAt'>) {
    const current = favoriteItems.get();
    if (current[item.id]) {
        // Remove if exists
        const newItem = { ...current };
        delete newItem[item.id];
        favoriteItems.set(newItem);
    } else {
        // Add if not exists
        favoriteItems.setKey(item.id, { ...item, addedAt: Date.now() });
    }
}

export function isFavorite(id: string) {
    const current = favoriteItems.get();
    return !!current[id];
}
