// Endpoint Astro para generar /robots.txt de forma dinámica
// Esto garantiza que Astro genere el archivo con prioridad sobre rutas catch-all

export async function GET() {
  const contenido = `# robots.txt — DTalles Jewelry
# https://dtallesjewelry.com/robots.txt

# Permitir todos los rastreadores en el contenido público
User-agent: *
Allow: /

# Bloquear páginas de cuenta y rutas internas
Disallow: /account/
Disallow: /account
Disallow: /customer_identity/
Disallow: /gracias-compra
Disallow: /gracias-contacto
Disallow: /gracias

# Bloquear parámetros de búsqueda que generan contenido duplicado
Disallow: /*?*sort=
Disallow: /*?*page=

# Referencia al sitemap para facilitar el rastreo
Sitemap: https://dtallesjewelry.com/sitemap-index.xml
`;

  return new Response(contenido, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
