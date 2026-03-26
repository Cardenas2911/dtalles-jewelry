# 🤖 AGENTS.md — Contexto del Proyecto para Asistentes de IA

> **Este archivo existe para que cualquier modelo de IA (Copilot, Gemini, Claude, etc.)
> entienda rápidamente el proyecto al abrir el repositorio.**

---

## 📋 Resumen del Proyecto

| Campo               | Valor                                                    |
| ------------------- | -------------------------------------------------------- |
| **Nombre**          | DTalles Jewelry                                          |
| **Tipo**            | E-commerce de Joyería (Oro 14k/10k)                     |
| **Ubicación**       | Miami, FL                                                |
| **Framework**       | Astro 5 (SSG) + React 19 (Islas Interactivas)           |
| **Estilos**         | Tailwind CSS v4 (vía `@tailwindcss/vite`)                |
| **Backend**         | Shopify Storefront API (GraphQL)                         |
| **Estado**          | Nano-stores (nanostores + @nanostores/react)             |
| **Deploy**          | GitHub Pages via GitHub Actions                          |
| **URL Producción**  | https://dtallesjewelry.com (dominio personalizado)        |
| **Idioma del Código**| Español (comentarios, variables), Inglés (contenido principal SSR) |

---

## 🌍 Internacionalización (i18n)
- **Idioma Principal:** Inglés (`dtallesjewelry.com/`)
- **Idioma Secundario:** Español (`dtallesjewelry.com/es/`)
- **Guía de Traducciones:** Leer y seguir las instrucciones en `GuiaTraducciones.md`. Todos los componentes DEBEN usar `getRoute(path, lang)` de `src/utils/paths.ts` para enlaces dinámicos. NUNCA "hardcodear" URLs de navegación.

---

## 🏗️ Arquitectura

```
src/
├── components/
│   ├── home/           # Componentes Astro del Home (Hero, TrustBar, BentoGrid...)
│   ├── react/          # Componentes React interactivos (Header, Footer, Cart...)
│   │   └── product/    # Componentes del PDP (ProductPage, StickyAddToCart...)
│   ├── Header.astro    # Header principal (Desktop + Mobile menu)
│   └── SEO.astro       # Componente de meta tags SEO
├── layouts/
│   └── Layout.astro    # Layout principal (importa global.css, fonts, Header, Footer)
├── lib/
│   ├── shopify.ts      # Cliente de Shopify Storefront API
│   └── queries/        # Queries GraphQL organizadas por entidad
├── pages/              # Páginas Astro (file-based routing)
├── store/
│   ├── cart.ts          # Store del carrito (nanostores + persistent)
│   └── favorites.ts     # Store de favoritos
├── styles/
│   └── global.css       # Tailwind v4 (@import "tailwindcss") + @theme tokens
└── utils/
    └── paths.ts         # resolvePath() — esencial para GitHub Pages base path
```

---

## ⚙️ Configuración Crítica

### Tailwind CSS v4
- **NO usa** `tailwind.config.js` ni `postcss.config.js`
- Usa `@tailwindcss/vite` como plugin de Vite en `astro.config.mjs`
- Los tokens de diseño están en `src/styles/global.css` bajo `@theme {}`

### GitHub Pages (Dominio personalizado)
- El sitio se despliega en GitHub Pages con **dominio personalizado** (`dtallesjewelry.com`), por lo que se sirve desde la raíz.
- `astro.config.mjs` tiene `site: 'https://dtallesjewelry.com'` y **no** define `base` (rutas desde `/`).
- **Siempre usar `resolvePath()`** de `src/utils/paths.ts` para rutas a assets en componentes React (por si en el futuro se usa un base path).
- Los componentes Astro pueden usar rutas normales (Astro las resuelve automáticamente).

### Variables de Entorno
El proyecto necesita estas variables para funcionar:

| Variable                                    | Descripción                          | Tipo     |
| ------------------------------------------- | ------------------------------------ | -------- |
| `PUBLIC_SHOPIFY_STORE_DOMAIN`               | Dominio de la tienda Shopify         | Pública  |
| `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`    | Token de la Storefront API           | Pública  |
| `PUBLIC_STOREFRONT_API_VERSION`             | Versión de la API (ej: `2025-10`)    | Pública  |

- **Local:** Se configuran en `.env` (en `.gitignore`, no se sube)
- **GitHub Actions:** Se configuran en `.github/workflows/deploy.yml` como `env:`
- Son tokens **públicos** de la Storefront API (solo lectura, diseñados para uso en cliente)

---

## 🎨 Sistema de Diseño

| Token                | Valor        | Uso                        |
| -------------------- | ------------ | -------------------------- |
| `--color-primary`    | `#d4af37`    | Dorado Metálico (CTAs)     |
| `--color-bg-dark`    | `#050505`    | Fondo Onyx Principal       |
| `--color-bg-light`   | `#f8f7f6`    | Fondo Claro (páginas info) |
| `--color-text-light` | `#FAFAF5`    | Texto sobre fondo oscuro   |
| `--color-surface`    | `#121212`    | Superficies/Cards          |

**Fuentes:**
- Títulos: `Playfair Display` (serif)
- Cuerpo: `Manrope` (sans-serif)
- Íconos: `Material Symbols Outlined`

---

## 🚀 Despliegue

### Desarrollo Local
```bash
npm install
npm run dev
# Abre: http://localhost:4321/
```
**Windows (PowerShell):** Si usas `cd ruta; npm run dev`, emplea `;` para encadenar. En PowerShell antiguo `&&` no es válido.

### Producción (Automático)
Cada `git push` a `main` dispara el workflow `.github/workflows/deploy.yml`:
1. Instala dependencias (`npm ci`)
2. Build con Astro (inyecta `--site` y `--base` dinámicamente)
3. Sube artefacto a GitHub Pages
4. Despliega automáticamente

### Despliegue Manual (si es necesario)
```bash
npm run build
# El resultado está en dist/
```

---

## 📁 Páginas Existentes

| Ruta                    | Estado   | Descripción                         |
| ----------------------- | -------- | ----------------------------------- |
| `/`                     | ✅ Lista | Home con Hero, BentoGrid, Bestsellers |
| `/tienda`               | ✅ Lista | Catálogo completo                   |
| `/producto/[handle]`    | ✅ Lista | Página de Producto (PDP)            |
| `/hombre`               | ✅ Lista | Colección Hombre                    |
| `/mujer`                | ✅ Lista | Colección Mujer                     |
| `/ninos`                | ✅ Lista | Colección Niños                     |
| `/coleccion/religiosa`  | ✅ Lista | Colección Religiosa                 |
| `/contacto`             | ✅ Lista | Formulario de Contacto              |
| `/cuidado-joyas`        | ✅ Lista | Guía de Cuidado de Joyas            |
| `/guia-tallas`          | ✅ Lista | Guía de Tallas                      |
| `/guia-regalos`         | ✅ Lista | Guía de Regalos                     |
| `/nosotros`             | ✅ Lista | Sobre DTalles                       |
| `/faq`                  | ✅ Lista | Preguntas Frecuentes                |
| `/garantia`             | ✅ Lista | Política de Garantía                |
| `/envios`               | ✅ Lista | Información de Envíos               |
| `/devoluciones`         | ✅ Lista | Cambios y Devoluciones              |
| `/politicas`            | ✅ Lista | Política de Privacidad              |
| `/terminos`             | ✅ Lista | Términos y Condiciones              |
| `/rastrear`             | ✅ Lista | Rastreo de Pedidos                  |
| `/busqueda`             | ✅ Lista | Búsqueda de Productos               |
| `/favoritos`            | ✅ Lista | Lista de Deseos                     |
| `/servicios/vender-oro` | ✅ Lista | Servicio de Compra de Oro           |

---

## 🔒 Seguridad — Notas Importantes

1. **NUNCA subir `.env` al repositorio** — está en `.gitignore`
2. Los tokens de Storefront API son **públicos por diseño** (Shopify los expone en el cliente)
3. El token privado (`PRIVATE_TOKEN` / `shpat_...`) **NUNCA** debe exponerse públicamente
4. Si se necesita un token privado, usar **GitHub Secrets** (Settings → Secrets → Actions)

---

## 🛠️ Convenciones de Código

- **Idioma:** Todo en español (comentarios, variables, nombres de componentes, contenido)
- **Componentes Astro:** Para contenido estático y SEO
- **Componentes React:** Solo cuando se necesita interactividad (carrito, búsqueda, sliders)
- **Hidratación:** Usar `client:visible` por defecto, `client:load` solo si es crítico
- **Estilos:** Tailwind classes inline, no CSS modules
- **Rutas de Assets:** Siempre usar `resolvePath()` en componentes React
