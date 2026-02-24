import https from 'node:https';

const data = JSON.stringify({
    query: `
    query getProductLivePricing($handle: String!) {
      product(handle: $handle) {
        id
        title
        variants(first: 5) {
          edges {
            node {
              id
              title
              sku
              price { amount currencyCode }
            }
          }
        }
      }
    }
  `,
    variables: { handle: "collar-corazon-abombado-cadena-soga-oro-10k" }
});

const options = {
    hostname: 'dtalles-jewelry.myshopify.com',
    port: 443,
    path: `/api/2025-10/graphql.json?nocache=${Date.now()}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': '851965f8a7e17cf35de22fdcbe44c100',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => body += d);
    res.on('end', () => console.log(JSON.stringify(JSON.parse(body), null, 2)));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
