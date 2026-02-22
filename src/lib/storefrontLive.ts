/**
 * Cliente para obtener precios y disponibilidad en vivo desde la Storefront API.
 * Se ejecuta en el navegador para que los cambios en Shopify se reflejen sin hacer rebuild.
 */

export interface LiveVariant {
  id: string;
  title: string;
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  selectedOptions: { name: string; value: string }[];
}

const LIVE_PRICING_QUERY = `
  query getProductLivePricing($id: ID!) {
    product(id: $id) {
      id
      variants(first: 50) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            quantityAvailable
            price { amount currencyCode }
            compareAtPrice { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

function getStorefrontConfig() {
  const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = import.meta.env.PUBLIC_STOREFRONT_API_VERSION;
  const token = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !version || !token) return null;
  return {
    url: `https://${domain}/api/${version}/graphql.json`,
    token,
  };
}

/**
 * Obtiene precios y disponibilidad actuales del producto desde Shopify (en el navegador).
 * Devuelve null si no hay config o hay error (el front debe usar entonces los datos estáticos).
 */
export async function fetchLivePricing(productId: string): Promise<LiveVariant[] | null> {
  const config = getStorefrontConfig();
  if (!config) return null;

  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.token,
      },
      body: JSON.stringify({
        query: LIVE_PRICING_QUERY,
        variables: { id: productId },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const product = json?.data?.product;
    if (!product?.variants?.edges) return null;

    return product.variants.edges.map((edge: { node: any }) => ({
      id: edge.node.id,
      title: edge.node.title,
      sku: edge.node.sku ?? null,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable ?? null,
      price: edge.node.price,
      compareAtPrice: edge.node.compareAtPrice ?? null,
      selectedOptions: edge.node.selectedOptions ?? [],
    }));
  } catch {
    return null;
  }
}
