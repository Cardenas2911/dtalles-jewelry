import 'dotenv/config';

const domain = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.PUBLIC_STOREFRONT_API_VERSION;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const url = `https://${domain}/api/${version}/graphql.json`;

async function q(gql) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token },
    body: JSON.stringify({ query: gql }),
  });
  return r.json();
}

const tests = [
  { name: 'just price 50-100', q: 'variants.price:>=50 AND variants.price:<=100' },
  { name: 'with avail, 50-100', q: 'available_for_sale:true AND variants.price:>=50 AND variants.price:<=100' },
  { name: 'product_type Collar only', q: "product_type:Collar" },
  { name: 'Collar + price', q: "product_type:Collar AND variants.price:<=200" },
  { name: 'Aretes + price 50-100', q: "product_type:Aretes AND variants.price:>=50 AND variants.price:<=100" },
  { name: 'collection mujer with product_type', q: null, collection: 'mujer', sub: "product_type:Aretes" },
  { name: 'collection mujer with product_type + price', q: null, collection: 'mujer', sub: "product_type:Aretes AND variants.price:<=100" },
];

for (const t of tests) {
  let gql;
  if (t.collection) {
    gql = `{ collection(handle: "${t.collection}") { products(first: 3, query: "${t.sub}") { edges { node { title productType priceRange { minVariantPrice { amount } } } } } } }`;
  } else {
    gql = `{ products(first: 3, query: "${t.q}") { edges { node { title productType priceRange { minVariantPrice { amount } } } } } }`;
  }
  const res = await q(gql);
  const edges = res.data?.collection?.products?.edges ?? res.data?.products?.edges ?? [];
  console.log(`\n${t.name}: ${edges.length} result(s)`);
  edges.forEach((e) => console.log(`  - ${e.node.title} [${e.node.productType}] $${e.node.priceRange.minVariantPrice.amount}`));
  if (res.errors) console.log('  ERRORS:', JSON.stringify(res.errors));
}
