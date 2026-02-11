
const requiredVars = [
    'PUBLIC_SHOPIFY_STORE_DOMAIN',
    'PUBLIC_STOREFRONT_API_VERSION',
    'PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN'
];

console.log('--- Checking Environment Variables ---');
let missing = false;

requiredVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`❌ MISSING: ${varName}`);
        missing = true;
    } else {
        const val = process.env[varName];
        console.log(`✅ FOUND: ${varName} (Length: ${val.length})`);
        if (varName === 'PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN' && val.length < 10) {
            console.warn(`⚠️ WARNING: Token seems too short!`);
        }
    }
});

if (missing) {
    console.error('Build cannot proceed without required environment variables.');
    process.exit(1);
} else {
    console.log('Environment variables check passed.');
}
