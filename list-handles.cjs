
const fetch = require('node-fetch');
require('dotenv').config();

const domain = process.env.PUBLIC_SHOPIFY_SHOP;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function listCollections() {
    const query = `
    {
      collections(first: 50) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }`;

    const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token,
        },
        body: JSON.stringify({ query }),
    });

    const json = await response.json();
    console.log(JSON.stringify(json.data.collections.edges, null, 2));
}

listCollections();
