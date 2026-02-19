/**
 * Análisis completo de productos Shopify — DTalles Jewelry
 * Muestra: productos, colecciones, etiquetas, tipos, campos faltantes
 */
const fs = require('fs');
const path = require('path');
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && !key.startsWith('#')) process.env[key.trim()] = val.join('=').trim();
});

const DOMAIN = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.PUBLIC_STOREFRONT_API_VERSION || '2024-01';
const ENDPOINT = `https://${DOMAIN}/api/${API_VERSION}/graphql.json`;

async function gqlQuery(q) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: q }),
  });
  const json = await res.json();
  return json.data; // Acceso directo a data (no data.data)
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   ANÁLISIS COMPLETO DE PRODUCTOS - DTalles Jewelry');
  console.log(`   API: ${ENDPOINT}`);
  console.log('═══════════════════════════════════════════════════\n');

  // 1. Obtener TODOS los productos
  let allProducts = [];
  let hasNext = true;
  let cursor = null;

  while (hasNext) {
    const afterClause = cursor ? `, after: "${cursor}"` : '';
    const data = await gqlQuery(`{
      products(first: 50${afterClause}) {
        pageInfo { hasNextPage endCursor }
        edges {
          node {
            id
            title
            handle
            productType
            vendor
            tags
            availableForSale
            totalInventory
            description
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            compareAtPriceRange {
              minVariantPrice { amount }
              maxVariantPrice { amount }
            }
            images(first: 5) {
              edges { node { url altText } }
            }
            variants(first: 20) {
              edges {
                node {
                  id
                  title
                  sku
                  price { amount currencyCode }
                  compareAtPrice { amount }
                  availableForSale
                  quantityAvailable
                  selectedOptions { name value }
                }
              }
            }
            collections(first: 10) {
              edges { node { title handle } }
            }
          }
        }
      }
    }`);

    const edges = data?.products?.edges || [];
    allProducts.push(...edges.map(e => e.node));
    hasNext = data?.products?.pageInfo?.hasNextPage || false;
    cursor = data?.products?.pageInfo?.endCursor;
  }

  console.log(`📦 TOTAL PRODUCTOS: ${allProducts.length}\n`);

  // 2. Productos POR TIPO
  const byType = {};
  allProducts.forEach(p => {
    const type = p.productType || '(sin tipo)';
    if (!byType[type]) byType[type] = [];
    byType[type].push(p);
  });

  console.log('─────────────────────────────────');
  console.log('📂 PRODUCTOS POR TIPO (productType)');
  console.log('─────────────────────────────────');
  Object.entries(byType).sort((a, b) => b[1].length - a[1].length).forEach(([type, prods]) => {
    console.log(`\n  📁 ${type} (${prods.length} productos)`);
    prods.forEach(p => {
      const price = `$${parseFloat(p.priceRange.minVariantPrice.amount).toFixed(2)}`;
      const maxPrice = parseFloat(p.priceRange.maxVariantPrice.amount);
      const priceRange = maxPrice > parseFloat(p.priceRange.minVariantPrice.amount) ? ` - $${maxPrice.toFixed(2)}` : '';
      const status = p.availableForSale ? '✅' : '❌';
      const inv = p.totalInventory !== null ? ` (inv: ${p.totalInventory})` : '';
      const variants = p.variants.edges.length;
      console.log(`     ${status} ${p.title} — ${price}${priceRange}${inv} — ${variants} var — Tags: [${p.tags.join(', ')}]`);
    });
  });

  // 3. Colecciones
  const colData = await gqlQuery(`{
    collections(first: 100) {
      edges {
        node {
          title
          handle
          description
          productsCount { count }
        }
      }
    }
  }`);

  const collections = colData?.collections?.edges?.map(e => e.node) || [];

  console.log('\n\n─────────────────────────────────');
  console.log('🏷️  COLECCIONES EN SHOPIFY');
  console.log('─────────────────────────────────');
  collections.forEach(c => {
    const count = c.productsCount?.count || 0;
    const desc = c.description ? c.description.substring(0, 80) + '...' : '(sin descripción)';
    console.log(`  📁 ${c.title} (/${c.handle}) — ${count} productos — ${desc}`);
  });

  // 4. Etiquetas únicas
  const allTags = new Set();
  allProducts.forEach(p => p.tags.forEach(t => allTags.add(t)));

  console.log('\n\n─────────────────────────────────');
  console.log('🔖 ETIQUETAS ÚNICAS (Tags)');
  console.log('─────────────────────────────────');
  [...allTags].sort().forEach(t => {
    const count = allProducts.filter(p => p.tags.includes(t)).length;
    console.log(`  • ${t} (${count})`);
  });

  // 5. Análisis de CAMPOS FALTANTES / PROBLEMAS
  console.log('\n\n─────────────────────────────────');
  console.log('⚠️  ANÁLISIS DE CAMPOS - PROBLEMAS DETECTADOS');
  console.log('─────────────────────────────────');

  const issues = [];

  allProducts.forEach(p => {
    if (!p.productType) issues.push(`❌ "${p.title}" — Sin productType`);
    if (p.tags.length === 0) issues.push(`❌ "${p.title}" — Sin etiquetas (tags)`);
    if (!p.description || p.description.trim().length < 10) issues.push(`⚠️ "${p.title}" — Descripción vacía o muy corta`);
    if (p.images.edges.length === 0) issues.push(`❌ "${p.title}" — Sin imágenes`);
    p.images.edges.forEach((img, i) => {
      if (!img.node.altText) issues.push(`⚠️ "${p.title}" — Imagen ${i + 1} sin alt text (SEO)`);
    });
    if (!p.availableForSale) issues.push(`🔴 "${p.title}" — No disponible para venta`);
    if (p.collections.edges.length === 0) issues.push(`❌ "${p.title}" — No está en ninguna colección`);
    if (p.totalInventory === 0) issues.push(`📦 "${p.title}" — Inventario total: 0`);
  });

  if (issues.length > 0) {
    console.log(`\n  Encontrados ${issues.length} problemas:\n`);
    issues.forEach(i => console.log(`  ${i}`));
  } else {
    console.log('  ✅ No se encontraron problemas.');
  }

  // 6. Vendors
  const vendors = [...new Set(allProducts.map(p => p.vendor))];
  console.log('\n\n─────────────────────────────────');
  console.log('🏢 VENDORS');
  console.log('─────────────────────────────────');
  vendors.forEach(v => {
    const count = allProducts.filter(p => p.vendor === v).length;
    console.log(`  • ${v} (${count} productos)`);
  });

  // 7. Producto → Colecciones
  console.log('\n\n─────────────────────────────────');
  console.log('📊 PRODUCTO → COLECCIONES');
  console.log('─────────────────────────────────');
  allProducts.forEach(p => {
    const cols = p.collections.edges.map(e => e.node.title).join(', ') || '(ninguna)';
    console.log(`  • ${p.title} → [${cols}]`);
  });

  // 8. Variantes detalladas
  console.log('\n\n─────────────────────────────────');
  console.log('🎛️  VARIANTES POR PRODUCTO');
  console.log('─────────────────────────────────');
  allProducts.forEach(p => {
    const variants = p.variants.edges.map(e => e.node);
    console.log(`\n  📦 ${p.title} (${variants.length} variantes):`);
    variants.forEach(v => {
      const options = v.selectedOptions.map(o => `${o.name}: ${o.value}`).join(', ');
      const status = v.availableForSale ? '✅' : '❌';
      const compare = v.compareAtPrice?.amount ? ` (antes: $${parseFloat(v.compareAtPrice.amount).toFixed(2)})` : '';
      const inv = v.quantityAvailable !== null ? ` [inv: ${v.quantityAvailable}]` : '';
      console.log(`     ${status} ${v.title} — $${parseFloat(v.price.amount).toFixed(2)}${compare}${inv} — SKU: ${v.sku || 'N/A'} — ${options}`);
    });
  });

  // 9. Metafields detallados por producto (uno a uno)
  console.log('\n\n─────────────────────────────────');
  console.log('🔬 METAFIELDS POR PRODUCTO');
  console.log('─────────────────────────────────');

  // Consultar metafields de cada producto individualmente
  for (const p of allProducts.slice(0, 10)) { // Limitar a 10 para no agotar cuota
    const metaData = await gqlQuery(`{
      product(id: "${p.id}") {
        metafields(identifiers: [
          { namespace: "custom", key: "peso_real" },
          { namespace: "custom", key: "ancho_mm" },
          { namespace: "custom", key: "material" },
          { namespace: "custom", key: "video_url" },
          { namespace: "shopify", key: "color-pattern" },
          { namespace: "shopify", key: "target-gender" },
          { namespace: "shopify", key: "age-group" },
          { namespace: "shopify", key: "jewelry-material" },
          { namespace: "shopify", key: "jewelry-type" },
          { namespace: "shopify", key: "necklace-design" }
        ]) {
          namespace
          key
          value
          type
        }
      }
    }`);

    const metafields = (metaData?.product?.metafields || []).filter(m => m !== null);
    if (metafields.length > 0) {
      console.log(`\n  📦 ${p.title}:`);
      metafields.forEach(m => {
        console.log(`     • ${m.namespace}.${m.key} = ${m.value} (type: ${m.type})`);
      });
    } else {
      console.log(`  📦 ${p.title}: (sin metafields)`);
    }
  }

  console.log('\n\n═══════════════════════════════════════════════════');
  console.log('   FIN DEL ANÁLISIS');
  console.log('═══════════════════════════════════════════════════');
}

main().catch(console.error);
