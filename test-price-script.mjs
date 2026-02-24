import fetch from 'node-fetch';

async function run() {
    const url = 'https://dtalles-jewelry.myshopify.com/api/2025-10/graphql.json';
    const token = '851965f8a7e17cf35de22fdcbe44c100';

    const query = `
    query getProductLivePricing($handle: String!) {
      product(handle: $handle) {
        id
        title
        variants(first: 5) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({
                query,
                variables: { handle: 'collar-corazon-abombado-cadena-soga-oro-10k' }
            }),
        });

        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err);
    }
}

run();
