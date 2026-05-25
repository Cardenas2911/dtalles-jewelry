// Script de un solo uso para verificar nombres exactos de productType y colecciones.
// Ejecutar con: node scripts/inspect-catalog.mjs
// Requiere las mismas env vars que el sitio: PUBLIC_SHOPIFY_STORE_DOMAIN,
// PUBLIC_STOREFRONT_API_VERSION, PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

import 'dotenv/config';

const domain = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.PUBLIC_STOREFRONT_API_VERSION;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !version || !token) {
  console.error('Faltan env vars de Shopify. Revisa .env');
  process.exit(1);
}

const url = `https://${domain}/api/${version}/graphql.json`;

async function query(gql) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query: gql }),
  });
  return res.json();
}

console.log('\n=== productType distintos (primeros 250 productos) ===');
const productsRes = await query(`
  { products(first: 250) { edges { node { productType } } } }
`);
const types = new Set(
  productsRes.data.products.edges.map((e) => e.node.productType).filter(Boolean)
);
console.log([...types].sort());

console.log('\n=== Colecciones (handle + título) ===');
const colsRes = await query(`
  { collections(first: 50) { edges { node { handle title } } } }
`);
console.log(colsRes.data.collections.edges.map((e) => e.node));

console.log('\n=== Sample: collection(handle: "mujer") existe? ===');
const mujerRes = await query(`
  { collection(handle: "mujer") { id title } }
`);
console.log(mujerRes.data.collection);

console.log('\n=== Sample: filtro por precio funciona? ===');
const priceRes = await query(`
  { products(first: 5, query: "variants.price:>=50 AND variants.price:<=100") {
      edges { node { title priceRange { minVariantPrice { amount } } } }
    }
  }
`);
console.log(priceRes.data.products.edges.map((e) => e.node));

console.log('\n=== Sample: filtro combinado (product_type + price + tag) ===');
const combinedRes = await query(`
  { products(first: 5, query: "available_for_sale:true AND variants.price:>=50 AND variants.price:<=200") {
      edges { node { title productType priceRange { minVariantPrice { amount } } } }
    }
  }
`);
console.log(combinedRes.data.products.edges.map((e) => e.node));
