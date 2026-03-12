import React, { useState } from 'react';
import { useStore } from '@nanostores/react';
import { favoriteItems } from '../../../store/favorites';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';

export default function ShareList({ lang = 'es' }: { lang?: 'es' | 'en' }) {
    const t = getTranslationFunctionForLang(lang);
    const $favorites = useStore(favoriteItems);
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const ids = Object.keys($favorites).join(',');
        if (!ids) return;

        const url = `${window.location.origin}${getRoute('/favoritos', lang)}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: t('ui.favorites.shareTitle'),
                    text: lang === 'en' ? 'Check out the jewelry I saved in my chest.' : 'Mira las joyas que he guardado en mi cofre.',
                    url: url
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
            <span>{copied ? t('ui.favorites.copied') : t('ui.favorites.shareList')}</span>
        </button>
    );
}
