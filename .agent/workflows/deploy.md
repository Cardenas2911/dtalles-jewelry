---
description: Cómo desplegar el sitio a GitHub Pages
---

# Despliegue a GitHub Pages

// turbo-all

## Despliegue Automático (Recomendado)

El sitio se despliega automáticamente con cada `git push` a `main`.

1. Hacer commit de los cambios:
```bash
git add .
git commit -m "descripción del cambio"
```

2. Subir a GitHub:
```bash
git push origin main
```

3. Verificar el estado del workflow en:
   - https://github.com/Cardenas2911/dtalles-jewelry/actions

4. Una vez el workflow termine (✅), el sitio estará disponible en:
   - https://cardenas2911.github.io/dtalles-jewelry/

## Configuración Requerida en GitHub

**Settings → Pages:**
- Source: **GitHub Actions** (NO "Deploy from a branch")

**Variables de Entorno:**
Las variables de Shopify están configuradas directamente en el workflow
(`.github/workflows/deploy.yml`) porque son tokens públicos de la Storefront API.

## Solución de Problemas

### El sitio se ve sin estilos
1. Verificar que `public/.nojekyll` existe (desactiva Jekyll)
2. Verificar que `astro.config.mjs` tiene `base: '/dtalles-jewelry'`
3. Verificar que la fuente de Pages es "GitHub Actions", no "Deploy from a branch"

### El workflow falla
1. Verificar que las variables de Shopify existen en `deploy.yml`
2. Verificar que `package-lock.json` está en el repositorio (requerido por `npm ci`)
3. Revisar los logs del workflow en la pestaña Actions de GitHub

### En local se ve diferente que en producción
- En local el sitio está en: `http://localhost:4321/dtalles-jewelry/`
- Usar `resolvePath()` de `src/utils/paths.ts` para rutas de assets en React
- Los componentes Astro resuelven las rutas automáticamente
