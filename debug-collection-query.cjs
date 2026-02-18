const https = require('https');

const config = { domain: 'dtallesjewelry.com', version: '2025-10' };
const accessToken = '851965f8a7e17cf35de22fdcbe44c100';

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
  id
  title
  handle
  productType
  tags
  availableForSale
  totalInventory
    priceRange {
      minVariantPrice {
      amount
      currencyCode
    }
  }
    featuredImage {
    url
    altText
    width
    height
  }
  images(first: 2) {
      edges {
        node {
        url
        altText
        width
        height
      }
    }
  }
  variants(first: 1) {
      edges {
        node {
        id
        sku
        quantityAvailable
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
}
`;

const query = `
  query getProductsByCollection($handle: String!, $first: Int = 12) {
  collection(handle: $handle) {
    title
    products(first: $first) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
}
${PRODUCT_FRAGMENT}
`;

const queryData = JSON.stringify({
    query: query,
    variables: { handle: "nuevo", first: 5 }
});

const options = {
    hostname: config.domain,
    path: `/api/${config.version}/graphql.json`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
        'Content-Length': queryData.length
    }
};

console.log(`Connecting to https://${options.hostname}${options.path}...`);

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                if (json.errors) {
                    console.error('API Errors:', JSON.stringify(json.errors, null, 2));
                } else {
                    console.log('--- SUCCESS ---');
                    if (!json.data.collection) {
                        console.log("Collection is NULL");
                    } else {
                        console.log(`Collection Title: ${json.data.collection.title}`);
                        console.log(`Products count: ${json.data.collection.products.edges.length}`);
                    }
                }
            } catch (e) {
                console.error('Invalid JSON', data);
            }
        } else {
            console.error('Request failed:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem: ${e.message}`);
});

req.write(queryData);
req.end();
