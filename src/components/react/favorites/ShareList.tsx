import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { favoriteItems } from '../../../store/favorites';

export default function ShareList() {
    const $favorites = useStore(favoriteItems);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const ids = Object.keys($favorites).join(',');
        if (!ids) return;

        // Construct a shareable URL (Assuming we have a route that can read ?items=ids)
        // For now, just sharing the store link or current page. 
        // Ideally: /favoritos?items=id1,id2
        const url = `${window.location.origin}/favoritos`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mis Favoritos de DTalles',
                    text: 'Mira las joyas que he guardado en mi cofre.',
                    url: url // + query params if we implement that logic
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    if (Object.keys($favorites).length === 0) return null;

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors"
        >
            <span className="material-symbols-outlined text-lg">share</span>
            <span>{copied ? 'Enlace Copiado' : 'Compartir Lista'}</span>
        </button>
    );
}
