import https from 'node:https';

async function fetchShopify(query, variables) {
    const data = JSON.stringify({ query, variables });
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

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function run() {
    // 1. Get a valid variant
    const productQuery = `
        query {
            products(first: 1) {
                edges {
                    node {
                        variants(first: 1) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                }
            }
        }
    `;
    const productResult = await fetchShopify(productQuery, {});
    const variantId = productResult.data.products.edges[0].node.variants.edges[0].node.id;
    console.log("Using variant ID:", variantId);

    // 2. Create cart
    const cartMutation = `
        mutation cartCreate($input: CartInput) {
            cartCreate(input: $input) {
                cart {
                    id
                    checkoutUrl
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;
    const cartVariables = {
        input: {
            lines: [
                {
                    merchandiseId: variantId,
                    quantity: 1
                }
            ]
        }
    };

    const cartResult = await fetchShopify(cartMutation, cartVariables);
    console.log("Cart Result:", JSON.stringify(cartResult, null, 2));
}

run();
