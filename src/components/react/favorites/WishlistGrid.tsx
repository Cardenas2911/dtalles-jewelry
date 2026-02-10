import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { favoriteItems } from '../../../store/favorites';
import WishlistCard from './WishlistCard';
import EmptyState from './EmptyState';

export default function WishlistGrid() {
    const $favorites = useStore(favoriteItems);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by defining initial state or just waiting for mount
    if (!isMounted) return null;

    const favoritesList = Object.values($favorites);

    if (favoritesList.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
            {favoritesList.map((item) => (
                <WishlistCard key={item.id} item={item} />
            ))}
        </div>
    );
}
