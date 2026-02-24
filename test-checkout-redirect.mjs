import https from 'node:https';

const url = 'https://dtalles-jewelry.myshopify.com/cart/c/hWN95alBVwUnmr7eoVVOQrEw?key=065504c0572bc33065e2656967032d71';

https.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
});
