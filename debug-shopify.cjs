const https = require('https');

const configs = [
    { domain: 'dtallesjewelry.com', version: '2024-01' },
    { domain: 'dtallesjewelry.myshopify.com', version: '2024-01' },
    { domain: 'dtallesjewelry.com', version: '2023-10' }
];
const accessToken = '851965f8a7e17cf35de22fdcbe44c100';

const queryData = JSON.stringify({
    query: `
    query {
      collections(first: 20) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  `
});

function testConfig(config) {
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
            console.log(`[${config.domain}] Status Code: ${res.statusCode}`);
            if (res.statusCode === 200) {
                try {
                    const json = JSON.parse(data);
                    if (json.errors) {
                        console.error('API Errors:', JSON.stringify(json.errors, null, 2));
                    } else {
                        console.log('--- ÉXITO: COLECCIONES ENCONTRADAS ---');
                        json.data.collections.edges.forEach(edge => {
                            console.log(`"${edge.node.title}" -> ${edge.node.handle}`);
                        });
                    }
                } catch (e) {
                    console.error('Invalid JSON', data);
                }
            } else {
                // console.error('Request failed:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request to ${config.domain}: ${e.message}`);
    });

    req.write(queryData);
    req.end();
}

configs.forEach(conf => testConfig(conf));
