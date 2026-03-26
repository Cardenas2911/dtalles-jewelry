import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const client = createStorefrontApiClient({
    storeDomain: import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN,
    apiVersion: import.meta.env.PUBLIC_STOREFRONT_API_VERSION,
    publicAccessToken: import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

/**
 * Wrapper para el cliente server-side (Astro pages).
 * Inyecta automáticamente la variable `language` del contexto @inContext según el lang recibido.
 * @param query GraphQL query string
 * @param options Object containing variables map
 * @param lang App current language string ('es' | 'en'), default 'es'
 */
export async function storefrontQuery(query: string, options: { variables?: Record<string, any> } = {}, lang: string = 'en') {
    const languageCode = lang.toUpperCase() === 'ES' ? 'ES' : 'EN';
    const variables = {
        ...(options.variables || {}),
        language: languageCode
    };
    return client.request(query, { variables });
}

/**
 * Helper para componentes React del lado cliente (browser).
 * Detecta el idioma del URL del navegador (window.location.pathname) automáticamente
 * y lo inyecta como variable `language` en la query de Shopify.
 * Usar este helper en vez de `client.request()` directamente en componentes React.
 * @param query GraphQL query string
 * @param variables Variables adicionales para la query
 */
export async function clientStorefrontQuery(query: string, variables: Record<string, any> = {}) {
    // Detectar idioma desde el URL del navegador
    const isSpanish = typeof window !== 'undefined' && window.location.pathname.startsWith('/es');
    const languageCode = isSpanish ? 'ES' : 'EN';
    return client.request(query, {
        variables: {
            ...variables,
            language: languageCode
        }
    });
}

