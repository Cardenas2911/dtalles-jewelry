# 🌍 Guía de Traducciones e Internacionalización (i18n)

DTalles Jewelry es un sitio bilingüe. **El idioma base y principal del sitio es el INGLÉS**, servido en la raíz (`/`). El idioma secundario es el **ESPAÑOL**, servido bajo el prefijo `/es/`.

Esta guía explica cómo agregar nuevos textos, traducir contenido y enlazar páginas correctamente.

---

## 1. Diccionario de Textos (`src/i18n/ui.ts`)

Todos los textos estáticos del sitio (botones, descripciones fijas, menús, etc.) viven en el diccionario `ui` exportado en `src/i18n/ui.ts`.

### Agregar un nuevo texto:
1. Abre `src/i18n/ui.ts`.
2. Busca la sección correspondiente a tu componente o crea un nuevo namespace (ej. `miComponente.titulo`).
3. Agrega la clave y su valor tanto en el objeto `es` como en `en`, conservando el orden para facilitar la lectura.

```typescript
// En src/i18n/ui.ts
export const ui = {
  es: {
    'miComponente.titulo': 'Mi Nuevo Título',
    // ...
  },
  en: {
    'miComponente.titulo': 'My New Title',
    // ...
  }
}
```

---

## 2. Uso de Textos en Componentes (Astro y React)

La forma de obtener la función de traducción `t()` difiere ligeramente si es un componente de servidor (.astro) o componente de cliente (.tsx).

### A) En componentes `.astro`
Astro puede leer el idioma a partir de la URL del request (`Astro.url`).

```astro
---
import { getLangFromUrl, useTranslations } from '../i18n/utils';

const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
---
<!-- Uso en el HTML -->
<h1>{t('miComponente.titulo')}</h1>
```

### B) En componentes de React `.tsx`
Dado que React se ejecuta parcial o totalmente en el cliente sin acceso directo a `Astro.url` durante el request de Astro (a menos que se lo pasemos), **debemos pasarle `lang` como prop al componente.**

```tsx
import { getTranslationFunctionForLang } from '../i18n/utils';

interface Props {
  lang: 'es' | 'en';
}

export default function MiComponente({ lang }: Props) {
  // Obtenemos la función traductora estática para este lenguaje
  const t = getTranslationFunctionForLang(lang);

  return (
    <div>
      <h1>{t('miComponente.titulo')}</h1>
    </div>
  );
}
```

> **IMPORTANTE:** Cuando uses el componente React dentro de un archivo `.astro`, asegúrate de enviarle el prop `lang={lang}`.

---

## 3. Enlazado Interno (Routing Dinámico)

Ya que las rutas de inglés (ej. `/tienda`) no son iguales a las de español (ej. `/es/tienda`), NUNCA uses etiquetas `<a>` con URLs directamente "hardcodeados". 

Siempre usa la función `getRoute()` de `src/utils/paths.ts` pasando la ruta en su versión original (las rutas mapeadas en español) y el parámetro `lang`. El sistema lo traducirá y aplicará el formato del idioma correcto.

### En componentes `.astro` y React (si tienes acceso al `lang`):

```tsx
import { getRoute } from '../utils/paths';

// ...
// Renderizará "/store" si lang es 'en', o "/es/tienda" si lang es 'es'
<a href={getRoute('/tienda', lang)}>
    {t('nav.shop')}
</a>
```

### Componentes de React Puramente del Lado del Cliente:
Si un componente React no recibe `lang` como prop, pero se monta interactivo en el navegador, se puede detectar el idioma automáticamente obteniendo la URL en el cliente usando `getClientLocalizedRoute()`.

```tsx
import { getClientLocalizedRoute } from '../../utils/paths';

// Detecta automáticamente si la Location actual empieza con /es/ y devuelve la ruta correcta
<a href={getClientLocalizedRoute('/tienda')}>Ir a la Tienda</a>
```

---

## 4. Contenido Dinámico (Shopify)

Los componentes que consumen el API de Shopify pueden acceder a descripciones multilingües que se gestionan desde el Panel Admin de Shopify (usando "Translate & Adapt").

Las peticiones de Storefront API de Shopify a través de `storefrontQuery()` (SSR) o `clientStorefrontQuery()` (Cliente JS) detectarán directamente si se les pasa el parámetro (o la URL de la ventana en el cliente) y retornarán los campos de productos traducidos.

Si necesitas inyectar un idioma manualmente, `storefrontQuery` acepta un tercer parámetro:
```typescript
const products = await storefrontQuery(QUERY, variables, lang); 
```
