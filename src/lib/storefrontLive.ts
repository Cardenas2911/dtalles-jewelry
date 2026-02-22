/**
 * Cliente para obtener datos completos en vivo desde la Storefront API.
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

export interface LiveProductData {
  variants: LiveVariant[];
  title?: string;
  descriptionHtml?: string;
  vendor?: string;
  tags?: string[];
  productType?: string;
  // Metafields
  pesoReal?: any;
  anchoMm?: any;
  material?: any;
  shopifyColor?: any;
  shopifyAgeGroup?: any;
  shopifyGender?: any;
  shopifyMaterial?: any;
  shopifyJewelryType?: any;
  shopifyNecklaceDesign?: any;
}

const LIVE_PRODUCT_QUERY = `
  query getProductLivePricing($id: ID!) {
    product(id: $id) {
      id
      title
      descriptionHtml
      vendor
      tags
      productType
      
      pesoReal: metafield(namespace: "custom", key: "peso_real") { value type }
      anchoMm: metafield(namespace: "custom", key: "ancho_mm") { value type }
      material: metafield(namespace: "custom", key: "material") { value type }
      
      shopifyColor: metafield(namespace: "shopify", key: "color-pattern") {
        value
        reference { ... on Metaobject { fields { key value } } }
        references(first: 10) { nodes { ... on Metaobject { fields { key value } } } }
      }
      shopifyAgeGroup: metafield(namespace: "shopify", key: "age-group") {
        value
        reference { ... on Metaobject { fields { key value } } }
        references(first: 10) { nodes { ... on Metaobject { fields { key value } } } }
      }
      shopifyGender: metafield(namespace: "shopify", key: "target-gender") {
        value
        reference { ... on Metaobject { fields { key value } } }
        references(first: 10) { nodes { ... on Metaobject { fields { key value } } } }
      }
      shopifyMaterial: metafield(namespace: "shopify", key: "jewelry-material") {
        value
        reference { ... on Metaobject { fields { key value } } }
        references(first: 10) { nodes { ... on Metaobject { fields { key value } } } }
      }
      shopifyJewelryType: metafield(namespace: "shopify", key: "jewelry-type") {
        value
        reference { ... on Metaobject { fields { key value } } }
        references(first: 10) { nodes { ... on Metaobject { fields { key value } } } }
      }
      shopifyNecklaceDesign: metafield(namespace: "shopify", key: "necklace-design") {
        value
        reference { ... on Metaobject { fields { key value } } }
        references(first: 10) { nodes { ... on Metaobject { fields { key value } } } }
      }

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
 * Obtiene datos completos actuales del producto desde Shopify (en el navegador).
 * Devuelve null si no hay config o hay error (el front debe usar entonces los datos estáticos).
 */
export async function fetchLiveProductData(productId: string): Promise<LiveProductData | null> {
  const config = getStorefrontConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${config.url}?nocache=${Date.now()}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": config.token,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
      body: JSON.stringify({
        query: LIVE_PRODUCT_QUERY,
        variables: { id: productId },
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    const product = json?.data?.product;
    if (!product?.variants?.edges) return null;

    const variants = product.variants.edges.map((edge: { node: any }) => ({
      id: edge.node.id,
      title: edge.node.title,
      sku: edge.node.sku ?? null,
      availableForSale: edge.node.availableForSale,
      quantityAvailable: edge.node.quantityAvailable ?? null,
      price: edge.node.price,
      compareAtPrice: edge.node.compareAtPrice ?? null,
      selectedOptions: edge.node.selectedOptions ?? [],
    }));

    return {
      variants,
      title: product.title,
      descriptionHtml: product.descriptionHtml,
      vendor: product.vendor,
      tags: product.tags,
      productType: product.productType,
      pesoReal: product.pesoReal,
      anchoMm: product.anchoMm,
      material: product.material,
      shopifyColor: product.shopifyColor,
      shopifyAgeGroup: product.shopifyAgeGroup,
      shopifyGender: product.shopifyGender,
      shopifyMaterial: product.shopifyMaterial,
      shopifyJewelryType: product.shopifyJewelryType,
      shopifyNecklaceDesign: product.shopifyNecklaceDesign,
    };
  } catch {
    return null;
  }
}
