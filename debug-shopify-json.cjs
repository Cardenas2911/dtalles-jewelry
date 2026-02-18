const https = require('https');
const fs = require('fs');

// Only testing the known working config
const config = { domain: 'dtallesjewelry.com', version: '2023-10' };
const accessToken = '851965f8a7e17cf35de22fdcbe44c100';

const queryData = JSON.stringify({
    query: `
    query {
      collections(first: 50) {
        edges {
          node {
            title
            handle
            products(first: 1) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      }
    }
  `
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
                    console.log('--- ÉXITO: COLECCIONES ENCONTRADAS ---');
                    fs.writeFileSync('collections.json', JSON.stringify(json.data.collections.edges, null, 2));
                    console.log('Datos guardados en collections.json');
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
