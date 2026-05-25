import 'dotenv/config';

const domain = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.PUBLIC_STOREFRONT_API_VERSION;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const url = `https://${domain}/api/${version}/graphql.json`;

async function q(gql, variables) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query: gql, variables }),
  });
  return r.json();
}

// Test 1: collection.products with filters arg (productFilter type)
console.log('\n=== Test: collection.products with filters: [{price}, {productType}] ===');
const q1 = `
  query ($filters: [ProductFilter!]) {
    collection(handle: "mujer") {
      products(first: 5, filters: $filters, sortKey: BEST_SELLING) {
        edges { node { title productType priceRange { minVariantPrice { amount } } } }
      }
    }
  }
`;
const r1 = await q(q1, {
  filters: [
    { price: { min: 50, max: 100 } },
    { productType: 'Aretes' },
  ],
});
if (r1.errors) console.log('ERRORS:', JSON.stringify(r1.errors));
else {
  console.log(`Got ${r1.data?.collection?.products?.edges?.length || 0} results:`);
  r1.data?.collection?.products?.edges?.forEach((e) => console.log(`  - ${e.node.title} [${e.node.productType}] $${e.node.priceRange.minVariantPrice.amount}`));
}

// Test 2: only price filter on mujer
console.log('\n=== Test: collection mujer, only price filter ===');
const r2 = await q(q1, { filters: [{ price: { min: 50, max: 200 } }] });
if (r2.errors) console.log('ERRORS:', JSON.stringify(r2.errors));
else {
  console.log(`Got ${r2.data?.collection?.products?.edges?.length || 0} results:`);
  r2.data?.collection?.products?.edges?.slice(0, 5).forEach((e) => console.log(`  - ${e.node.title} [${e.node.productType}] $${e.node.priceRange.minVariantPrice.amount}`));
}

// Test 3: productType filter only on mujer
console.log('\n=== Test: collection mujer, productType Aretes ===');
const r3 = await q(q1, { filters: [{ productType: 'Aretes' }] });
if (r3.errors) console.log('ERRORS:', JSON.stringify(r3.errors));
else {
  console.log(`Got ${r3.data?.collection?.products?.edges?.length || 0} results:`);
  r3.data?.collection?.products?.edges?.slice(0, 5).forEach((e) => console.log(`  - ${e.node.title} [${e.node.productType}] $${e.node.priceRange.minVariantPrice.amount}`));
}

// Test 4: available filter
console.log('\n=== Test: available + price + type on mujer ===');
const r4 = await q(q1, {
  filters: [
    { available: true },
    { price: { min: 0, max: 500 } },
    { productType: 'Aretes' },
  ],
});
if (r4.errors) console.log('ERRORS:', JSON.stringify(r4.errors));
else {
  console.log(`Got ${r4.data?.collection?.products?.edges?.length || 0} results:`);
  r4.data?.collection?.products?.edges?.slice(0, 5).forEach((e) => console.log(`  - ${e.node.title} [${e.node.productType}] $${e.node.priceRange.minVariantPrice.amount}`));
}

// Test 5: top-level products with productType:Aretes AND price (just to confirm price doesn't work top-level)
console.log('\n=== Test: top-level products with product_type:Aretes ===');
const r5 = await q(`{ products(first: 5, query: "product_type:Aretes") { edges { node { title priceRange { minVariantPrice { amount } } } } } }`);
console.log(`Got ${r5.data?.products?.edges?.length || 0} results:`);
r5.data?.products?.edges?.slice(0, 5).forEach((e) => console.log(`  - ${e.node.title} $${e.node.priceRange.minVariantPrice.amount}`));
