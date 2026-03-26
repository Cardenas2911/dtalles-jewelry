/**
 * Resolves a path relative to the base URL of the site.
 * Essential for GitHub Pages deployment where the site is served from a subdirectory.
 * 
 * @param path The path to resolve (e.g., "/images/logo.png")
 * @returns The resolved path (e.g., "/dtalles-jewelry/images/logo.png")
 */
export const resolvePath = (path: string) => {
    const base = import.meta.env.BASE_URL;
    const cleanBase = base === '/' ? '' : base.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${cleanBase}${cleanPath}`;
};

export const esToEnMap: Record<string, string> = {
    '/tienda': '/store',
    '/hombre': '/men',
    '/mujer': '/women',
    '/ninos': '/kids',
    '/coleccion/religiosa': '/collection/religious',
    '/contacto': '/contact',
    '/cuidado-joyas': '/jewelry-care',
    '/faq': '/faq',
    '/envios': '/shipping',
    '/devoluciones': '/returns',
    '/garantia': '/warranty',
    '/guia-tallas': '/size-guide',
    '/guia-regalos': '/gift-guide',
    '/nosotros': '/about-us',
    '/politicas': '/privacy-policy',
    '/terminos': '/terms',
    '/rastrear': '/track-order',
    '/favoritos': '/wishlist',
    '/busqueda': '/search',
    '/servicios/vender-oro': '/services/sell-gold'
};

export const enToEsMap: Record<string, string> = Object.fromEntries(
    Object.entries(esToEnMap).map(([es, en]) => [en, es])
);

/**
 * Returns a localized route path for navigation links (Spanish to Target).
 */
export const getRoute = (path: string, lang?: string) => {
    const targetLang = lang || 'en';

    const base = import.meta.env.BASE_URL;
    const cleanBase = base === '/' ? '' : base.replace(/\/$/, '');
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
    }
    
    // Check exact match (cleanPath is assumed to be the Spanish path)
    let translatedPath = esToEnMap[cleanPath] || cleanPath;

    // Handle dynamic prefixes
    if (!esToEnMap[cleanPath]) {
        if (cleanPath.startsWith('/coleccion/')) {
            translatedPath = cleanPath.replace('/coleccion/', '/collection/');
        } else if (cleanPath.startsWith('/producto/')) {
            translatedPath = cleanPath.replace('/producto/', '/product/');
        }
    }
    
    if (targetLang === 'en') {
        const langPath = translatedPath === '/' ? '/' : `${translatedPath}`;
        return `${cleanBase}${langPath}`;
    } else {
        // lang === 'es'
        const langPath = cleanPath === '/' ? '/es/' : `/es${cleanPath}`;
        return `${cleanBase}${langPath}`;
    }
};

/**
 * Returns a Spanish route given an English path (for Language Switcher).
 */
export const getSpanishRoute = (path: string) => {
    const base = import.meta.env.BASE_URL;
    let cleanPath = path;
    
    // Remove base url if present
    if (base !== '/') {
        const cleanBase = base.replace(/\/$/, '');
        if (cleanPath.startsWith(cleanBase)) {
            cleanPath = cleanPath.substring(cleanBase.length);
        }
    }

    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
    }

    // Exact match reverse
    let translatedPath = enToEsMap[cleanPath] || cleanPath;

    // Dynamic prefixes reverse
    if (!enToEsMap[cleanPath]) {
        if (cleanPath.startsWith('/collection/')) {
            translatedPath = cleanPath.replace('/collection/', '/coleccion/');
        } else if (cleanPath.startsWith('/product/')) {
            translatedPath = cleanPath.replace('/product/', '/producto/');
        }
    }

    return resolvePath(translatedPath === '/' ? '/es/' : `/es${translatedPath}`);
};

/**
 * Helper for React client components to automatically get the localized route
 * based on the current window.location.pathname.
 */
export const getClientLocalizedRoute = (path: string) => {
    if (typeof window === 'undefined') return resolvePath(path);
    
    const isSpanish = window.location.pathname.startsWith('/es');
    const lang = isSpanish ? 'es' : 'en';
    
    return getRoute(path, lang);
};
