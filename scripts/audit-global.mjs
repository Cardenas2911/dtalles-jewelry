import 'dotenv/config';
const domain = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.PUBLIC_STOREFRONT_API_VERSION;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const url = `https://${domain}/api/${version}/graphql.json`;
async function q(query, variables) {
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':token}, body: JSON.stringify({query, variables}) });
  return r.json();
}

console.log('\n=== Sin filtros ===');
const r1 = await q(`{ products(first: 250) { edges { node { title priceRange { minVariantPrice { amount } } } } } }`);
console.log(`Total: ${r1.data.products.edges.length}`);
const prices1 = r1.data.products.edges.map(e => parseFloat(e.node.priceRange.minVariantPrice.amount));
console.log(`Price stats: min $${Math.min(...prices1)} / max $${Math.max(...prices1)} / median ~$${prices1.sort((a,b)=>a-b)[Math.floor(prices1.length/2)]}`);
console.log(`Distribution:`);
const buckets = { 'under_50':0, '50_100':0, '100_200':0, '200_500':0, '500_1000':0, '1000_plus':0 };
prices1.forEach(p => {
  if (p < 50) buckets.under_50++;
  else if (p < 100) buckets['50_100']++;
  else if (p < 200) buckets['100_200']++;
  else if (p < 500) buckets['200_500']++;
  else if (p < 1000) buckets['500_1000']++;
  else buckets['1000_plus']++;
});
console.log(buckets);

console.log('\n=== Con available_for_sale:true ===');
const r2 = await q(`{ products(first: 250, query: "available_for_sale:true") { edges { node { title priceRange { minVariantPrice { amount } } } } } }`);
console.log(`Total disponibles: ${r2.data.products.edges.length}`);
const prices2 = r2.data.products.edges.map(e => parseFloat(e.node.priceRange.minVariantPrice.amount));
if (prices2.length > 0) {
  console.log(`Price stats: min $${Math.min(...prices2)} / max $${Math.max(...prices2)} / median ~$${prices2.sort((a,b)=>a-b)[Math.floor(prices2.length/2)]}`);
  const b = { 'under_100':0, '100_200':0, '200_500':0, '500_1000':0, '1000_2000':0, '2000_plus':0 };
  prices2.forEach(p => {
    if (p < 100) b.under_100++;
    else if (p < 200) b['100_200']++;
    else if (p < 500) b['200_500']++;
    else if (p < 1000) b['500_1000']++;
    else if (p < 2000) b['1000_2000']++;
    else b['2000_plus']++;
  });
  console.log(b);
}
