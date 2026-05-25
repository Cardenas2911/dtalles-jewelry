// Audita cuántos productos devuelve cada combo del quiz.
// Ejecutar: node scripts/audit-finder-coverage.mjs
import 'dotenv/config';

const domain = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.PUBLIC_STOREFRONT_API_VERSION;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const url = `https://${domain}/api/${version}/graphql.json`;

async function q(query, variables) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  return r.json();
}

const COLLECTION_Q = `
  query ($handle: String!, $first: Int!, $filters: [ProductFilter!]) {
    collection(handle: $handle) {
      products(first: $first, filters: $filters, sortKey: BEST_SELLING) {
        edges { node { id title productType priceRange { minVariantPrice { amount } } } }
      }
    }
  }
`;

const GLOBAL_Q = `
  query ($productQuery: String!, $first: Int!) {
    products(first: $first, query: $productQuery, sortKey: BEST_SELLING) {
      edges { node { id title productType priceRange { minVariantPrice { amount } } } }
    }
  }
`;

const TYPES = {
  ring: ['Anillo'],
  necklace: ['Collar', 'Collar con Dije', 'Cadena'],
  earring: ['Aretes'],
  bracelet: ['Pulsera'],
};

const COLS = { women: 'mujer', men: 'hombre', kids: 'ninos' };

const BUDGETS = {
  under_50: [0, 50],
  '50_100': [50, 100],
  '100_200': [100, 200],
  '200_500': [200, 500],
  over_500: [500, 999999],
};

console.log('\n=== Auditoría: cuántos productos para cada combo ===\n');

for (const [recipientName, collectionHandle] of Object.entries(COLS)) {
  console.log(`\n--- ${recipientName.toUpperCase()} (collection: ${collectionHandle}) ---`);
  for (const [budgetName, [min, max]] of Object.entries(BUDGETS)) {
    const res = await q(COLLECTION_Q, {
      handle: collectionHandle,
      first: 100,
      filters: [{ available: true }, { price: { min, max } }],
    });
    if (res.errors) { console.log(`  ${budgetName}: ERROR`, res.errors); continue; }
    const products = res.data?.collection?.products?.edges?.map(e => e.node) ?? [];
    console.log(`  ${budgetName} ($${min}-$${max}): ${products.length} total`);
    for (const [typeName, allowedTypes] of Object.entries(TYPES)) {
      const set = new Set(allowedTypes);
      const matching = products.filter(p => set.has(p.productType));
      console.log(`    ${typeName} (${allowedTypes.join('/')}): ${matching.length}`);
    }
  }
}

console.log('\n--- UNSURE (top-level, sin colección) ---');
for (const [budgetName, [min, max]] of Object.entries(BUDGETS)) {
  const res = await q(GLOBAL_Q, {
    productQuery: 'available_for_sale:true',
    first: 100,
  });
  if (res.errors) { console.log(`  ${budgetName}: ERROR`, res.errors); continue; }
  const all = res.data?.products?.edges?.map(e => e.node) ?? [];
  const inRange = all.filter(p => {
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    return price >= min && price <= max;
  });
  console.log(`  ${budgetName} ($${min}-$${max}): ${inRange.length} in range / ${all.length} fetched`);
}
