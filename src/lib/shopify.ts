import { createStorefrontApiClient } from '@shopify/storefront-api-client';

export const client = createStorefrontApiClient({
    storeDomain: import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN,
    apiVersion: import.meta.env.PUBLIC_STOREFRONT_API_VERSION,
    publicAccessToken: import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});
