# Encuentra tu joya — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un quiz de 3 preguntas que recomiende joyas alineadas al inventario de Shopify según para quién, tipo y presupuesto, con fallback inteligente cuando no hay match exacto e integración WhatsApp al final.

**Architecture:** Componente React único `JewelFinder` reutilizable en página dedicada (`/encuentra-tu-joya`, `/find-your-jewel`) y en modal disparado desde el home y la tienda. Lógica de fallback en archivo puro testeable. Queries a Shopify Storefront API en vivo desde el navegador. Sin persistencia de estado, sin backend nuevo.

**Tech Stack:** Astro 5 · React 19 · TypeScript · Tailwind 4 · Shopify Storefront API (GraphQL) · Vitest (nuevo, solo para la lógica pura)

**Spec:** `docs/superpowers/specs/2026-05-24-jewel-finder-quiz-design.md`

---

## File Structure

**Nuevos archivos:**

```
src/
├── components/react/jewelFinder/
│   ├── JewelFinder.tsx              ← Orquestador (state machine del wizard + render condicional)
│   ├── WelcomeStep.tsx              ← Pantalla "Empezar"
│   ├── QuestionStep.tsx             ← Pregunta genérica con chips (reutilizable 3 veces)
│   ├── ResultsView.tsx              ← Galería + secciones de fallback + acciones
│   ├── WhatsAppButton.tsx           ← Botón que abre wa.me con mensaje pre-llenado
│   ├── ProgressBar.tsx              ← Barra 1/3, 2/3, 3/3
│   ├── config.ts                    ← Chips, brackets de precio, mapeos Shopify, constantes
│   └── types.ts                     ← Tipos compartidos del wizard
│
├── components/react/JewelFinderTrigger.tsx  ← Botón + modal wrapper para home/tienda
│
├── lib/queries/
│   └── jewelFinder.ts               ← Queries GraphQL (principal + fallback)
│
├── lib/
│   ├── jewelFinderLogic.ts          ← Algoritmo de decisión de fallback (puro)
│   └── jewelFinderLogic.test.ts     ← Tests (vitest)
│
└── pages/
    ├── find-your-jewel.astro        ← Página dedicada EN (default lang)
    └── es/encuentra-tu-joya.astro   ← Página dedicada ES
```

**Modificados:**

- `src/i18n/ui.ts` — agregar ~30 claves nuevas (preguntas, opciones, mensajes, errores)
- `src/components/home/HeroSlider.tsx` o `Hero.astro` — agregar CTA secundario al trigger
- `src/components/react/StoreGrid.tsx` — agregar badge `JewelFinderTrigger` arriba del grid
- `package.json` + `vitest.config.ts` — setup mínimo de vitest

---

## Convenciones del proyecto que el implementador DEBE seguir

- **Bilingüe:** todo string visible vive en `src/i18n/ui.ts` bajo `ui.es` y `ui.en`. Default lang es `en`. Componentes React reciben `lang: 'es' | 'en'` por prop. Usan `getTranslationFunctionForLang(lang)` de `src/i18n/utils.ts`.
- **Rutas:** EN sin prefijo (`/find-your-jewel`), ES bajo `/es/` (`/es/encuentra-tu-joya`). Generadas con `getRoute(path, lang)` de `src/utils/paths.ts`.
- **Estilos:** Tailwind 4 inline. Paleta: fondo negro `#050505`/`#111`, dorado `#d4af37`, blanco hueso `#FAFAF5`, gris claro `#A0A0A0`. Tipografía serif para títulos, sans para UI.
- **Iconos:** `material-symbols-outlined` (web font ya cargada).
- **WhatsApp:** número `17867644952` ya hardcoded en `FloatingSupport.tsx`. Lo extraemos a una constante compartida en Task 11.
- **Cliente Storefront:** `storefrontQuery` server-side (`src/lib/shopify.ts`) o fetch directo client-side siguiendo el patrón de `src/lib/storefrontLive.ts`. Como el quiz se ejecuta enteramente en el navegador, usamos fetch client-side.

---

## Pre-implementation verification

Antes de empezar el código, ejecutar manualmente el script de Task 1 para validar los nombres reales de `productType` y la existencia de las colecciones `mujer`, `hombre`, `ninos` en el catálogo Shopify. El resto del plan asume que estos valores existen tal cual; si difieren, se ajusta `config.ts` (Task 4) sin tocar la lógica.

---

## Task 1: Verificar datos del catálogo Shopify

**Files:**
- Create: `scripts/inspect-catalog.mjs`

- [ ] **Step 1: Crear script de inspección**

Crear `scripts/inspect-catalog.mjs`:

```javascript
// Script de un solo uso para verificar nombres exactos de productType y colecciones.
// Ejecutar con: node scripts/inspect-catalog.mjs
// Requiere las mismas env vars que el sitio: PUBLIC_SHOPIFY_STORE_DOMAIN, PUBLIC_STOREFRONT_API_VERSION, PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN

import 'dotenv/config';

const domain = process.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.PUBLIC_STOREFRONT_API_VERSION;
const token = process.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain || !version || !token) {
  console.error('Faltan env vars de Shopify. Revisa .env');
  process.exit(1);
}

const url = `https://${domain}/api/${version}/graphql.json`;

async function query(gql) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify({ query: gql }),
  });
  return res.json();
}

console.log('\n=== productType distintos (primeros 250 productos) ===');
const productsRes = await query(`
  { products(first: 250) { edges { node { productType } } } }
`);
const types = new Set(
  productsRes.data.products.edges.map((e) => e.node.productType).filter(Boolean)
);
console.log([...types].sort());

console.log('\n=== Colecciones (handle + título) ===');
const colsRes = await query(`
  { collections(first: 50) { edges { node { handle title } } } }
`);
console.log(colsRes.data.collections.edges.map((e) => e.node));

console.log('\n=== Sample: collection(handle: "mujer") existe? ===');
const mujerRes = await query(`
  { collection(handle: "mujer") { id title } }
`);
console.log(mujerRes.data.collection);

console.log('\n=== Sample: filtro por precio funciona? ===');
const priceRes = await query(`
  { products(first: 5, query: "variants.price:>=50 AND variants.price:<=100") {
      edges { node { title priceRange { minVariantPrice { amount } } } }
    }
  }
`);
console.log(priceRes.data.products.edges.map((e) => e.node));
```

- [ ] **Step 2: Ejecutar y registrar resultados**

Run: `node scripts/inspect-catalog.mjs`

Anotar:
- Lista exacta de `productType` (singular/plural, español/inglés).
- Handles exactos de las colecciones de género (puede ser `mujer`, `women`, `for-women`, etc.).
- Si el filtro `variants.price:>=X AND variants.price:<=Y` funciona o requiere otra sintaxis.

Estos valores se usan literalmente en `config.ts` (Task 4) y las queries (Task 7).

- [ ] **Step 3: Commit**

```bash
git add scripts/inspect-catalog.mjs
git commit -m "chore: script para inspeccionar productType y colecciones de Shopify"
```

---

## Task 2: Setup mínimo de vitest

Solo para la lógica pura (`jewelFinderLogic.ts`). No se agregan tests de componentes React por ahora.

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (devDependencies + scripts)

- [ ] **Step 1: Instalar vitest**

Run: `npm install -D vitest @vitest/ui`

- [ ] **Step 2: Crear `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 3: Agregar scripts a `package.json`**

En la sección `"scripts"`, agregar:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Verificar setup con test trivial**

Crear temporal `src/lib/__sanity.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
describe('sanity', () => {
  it('runs', () => { expect(1 + 1).toBe(2); });
});
```

Run: `npm test`
Expected: 1 test passed.

Borrar el archivo temporal.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: agregar vitest para lógica pura"
```

---

## Task 3: Tipos compartidos del wizard

**Files:**
- Create: `src/components/react/jewelFinder/types.ts`

- [ ] **Step 1: Crear `types.ts`**

```typescript
// Respuestas del wizard. null/undefined = "no respondida" o "comodín" (sin filtro)
export type Recipient = 'women' | 'men' | 'kids' | 'unsure';
export type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | 'any';
export type BudgetBracket = 'under_50' | '50_100' | '100_200' | '200_500' | 'over_500';

export interface QuizAnswers {
  recipient: Recipient | null;
  jewelryType: JewelryType | null;
  budget: BudgetBracket | null;
}

export interface PriceRange {
  min: number;
  max: number | null; // null = sin tope
}

// Producto tal como lo necesita ResultsView. Mismo shape que el resto del sitio.
export interface FinderProduct {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  featuredImage: { url: string; altText: string; width?: number; height?: number };
  images?: { edges: Array<{ node: { url: string; altText: string } }> };
  variants?: { edges: Array<{ node: { id: string; quantityAvailable?: number; compareAtPrice?: { amount: string; currencyCode: string } } }> };
}

export type FallbackReason = 'price_relaxed' | 'type_relaxed';

export interface AlternativeProduct extends FinderProduct {
  fallbackReason: FallbackReason;
}

// Resultado completo que ResultsView renderiza.
export interface QuizResult {
  case: 1 | 2 | 3; // 1=match perfecto, 2=match parcial, 3=sin match
  primary: FinderProduct[]; // productos del match exacto (puede estar vacío en caso 3)
  alternatives: AlternativeProduct[]; // productos del fallback (vacío en caso 1)
  answersSnapshot: QuizAnswers; // copia de respuestas para mostrar "Tu selección"
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/types.ts
git commit -m "feat(jewel-finder): tipos compartidos del wizard"
```

---

## Task 4: Configuración (chips, brackets, mapeos)

**Files:**
- Create: `src/components/react/jewelFinder/config.ts`

> **Valores confirmados por Task 1 contra Shopify real:**
> - productTypes existentes: `Anillo · Aretes (plural) · Cadena · Collar · Collar con Dije · Dije · Pulsera`
> - Collection handles: `mujer · hombre · ninos`
> - "Necklace" en UI mapea a 3 productTypes (Collar + Collar con Dije + Cadena) porque el catálogo los separa pero el usuario los concibe como "collar".

- [ ] **Step 1: Crear `config.ts`**

```typescript
import type { BudgetBracket, JewelryType, Recipient, PriceRange } from './types';

// Mapeo de Recipient → handle de colección Shopify. null = sin filtro.
export const RECIPIENT_TO_COLLECTION: Record<Recipient, string | null> = {
  women: 'mujer',
  men: 'hombre',
  kids: 'ninos',
  unsure: null,
};

// Mapeo de JewelryType → ARRAY de valores exactos de productType en Shopify.
// Una opción de UI puede cubrir varios productTypes del catálogo.
// Array vacío = sin filtro de tipo.
export const JEWELRY_TYPE_TO_PRODUCT_TYPES: Record<JewelryType, string[]> = {
  ring: ['Anillo'],
  necklace: ['Collar', 'Collar con Dije', 'Cadena'],
  earring: ['Aretes'],
  bracelet: ['Pulsera'],
  any: [],
};

// Rangos de presupuesto en USD.
export const BUDGET_RANGES: Record<BudgetBracket, PriceRange> = {
  under_50: { min: 0, max: 50 },
  '50_100': { min: 50, max: 100 },
  '100_200': { min: 100, max: 200 },
  '200_500': { min: 200, max: 500 },
  over_500: { min: 500, max: null },
};

// Cuando hacemos fallback "presupuesto ampliado", subimos el techo +50%.
export const PRICE_RELAX_MULTIPLIER = 1.5;

// Máximos por sección de resultados.
export const MAX_PRIMARY_RESULTS = 8;
export const MAX_ALTERNATIVE_RESULTS = 8;

// Umbral debajo del cual activamos caso 2 (match parcial).
export const PARTIAL_MATCH_THRESHOLD = 4;

// Número de WhatsApp del cliente (mismo que FloatingSupport.tsx).
export const WHATSAPP_NUMBER = '17867644952';

// Opciones que se muestran en cada pregunta. El `i18nKey` se resuelve con getTranslationFunctionForLang.
export const RECIPIENT_OPTIONS: Array<{ value: Recipient; i18nKey: string; emoji: string }> = [
  { value: 'women', i18nKey: 'finder.recipient.women', emoji: '👩' },
  { value: 'men', i18nKey: 'finder.recipient.men', emoji: '👨' },
  { value: 'kids', i18nKey: 'finder.recipient.kids', emoji: '🧒' },
  { value: 'unsure', i18nKey: 'finder.recipient.unsure', emoji: '🤔' },
];

export const JEWELRY_TYPE_OPTIONS: Array<{ value: JewelryType; i18nKey: string; emoji: string }> = [
  { value: 'ring', i18nKey: 'finder.type.ring', emoji: '💍' },
  { value: 'necklace', i18nKey: 'finder.type.necklace', emoji: '📿' },
  { value: 'earring', i18nKey: 'finder.type.earring', emoji: '👂' },
  { value: 'bracelet', i18nKey: 'finder.type.bracelet', emoji: '⌚' },
  { value: 'any', i18nKey: 'finder.type.any', emoji: '✨' },
];

export const BUDGET_OPTIONS: Array<{ value: BudgetBracket; i18nKey: string }> = [
  { value: 'under_50', i18nKey: 'finder.budget.under_50' },
  { value: '50_100', i18nKey: 'finder.budget.50_100' },
  { value: '100_200', i18nKey: 'finder.budget.100_200' },
  { value: '200_500', i18nKey: 'finder.budget.200_500' },
  { value: 'over_500', i18nKey: 'finder.budget.over_500' },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/config.ts
git commit -m "feat(jewel-finder): config con mapeos y opciones de chips"
```

---

## Task 5: Lógica de decisión de fallback (TDD)

Esta función pura recibe el resultado de la query principal y decide qué caso aplicar y qué consultar adicionalmente.

**Files:**
- Create: `src/lib/jewelFinderLogic.ts`
- Test: `src/lib/jewelFinderLogic.test.ts`

- [ ] **Step 1: Escribir tests**

Crear `src/lib/jewelFinderLogic.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  decideFallbackStrategy,
  buildExpandedPriceRange,
  combineResults,
} from './jewelFinderLogic';
import type { FinderProduct, QuizAnswers, AlternativeProduct } from '../components/react/jewelFinder/types';

const mkProduct = (id: string, type = 'Anillo', price = '75'): FinderProduct => ({
  id,
  title: `Product ${id}`,
  handle: `product-${id}`,
  availableForSale: true,
  productType: type,
  tags: [],
  priceRange: { minVariantPrice: { amount: price, currencyCode: 'USD' } },
  featuredImage: { url: '', altText: '' },
});

const baseAnswers: QuizAnswers = {
  recipient: 'women',
  jewelryType: 'ring',
  budget: '50_100',
};

describe('decideFallbackStrategy', () => {
  it('returns case 1 (no fallback) when primary has >=4 results', () => {
    const primary = [mkProduct('1'), mkProduct('2'), mkProduct('3'), mkProduct('4')];
    const strategy = decideFallbackStrategy(primary, baseAnswers);
    expect(strategy.case).toBe(1);
    expect(strategy.runFallback).toBe(false);
  });

  it('returns case 2 (partial) when primary has 1-3 results', () => {
    const primary = [mkProduct('1'), mkProduct('2')];
    const strategy = decideFallbackStrategy(primary, baseAnswers);
    expect(strategy.case).toBe(2);
    expect(strategy.runFallback).toBe(true);
    expect(strategy.fallbackPlan).toContain('price_relaxed');
  });

  it('returns case 3 (none) when primary has 0 results', () => {
    const strategy = decideFallbackStrategy([], baseAnswers);
    expect(strategy.case).toBe(3);
    expect(strategy.runFallback).toBe(true);
    expect(strategy.fallbackPlan).toContain('price_relaxed');
    expect(strategy.fallbackPlan).toContain('type_relaxed');
  });

  it('skips price_relaxed in fallback if jewelryType was "any" (no type to keep)', () => {
    const answers = { ...baseAnswers, jewelryType: 'any' as const };
    const strategy = decideFallbackStrategy([], answers);
    // Si no había tipo específico, ampliar precio del mismo tipo no aplica → solo type_relaxed... pero type_relaxed sin tipo tampoco aplica.
    // En este edge case, no hay fallback útil.
    expect(strategy.fallbackPlan).toEqual([]);
  });
});

describe('buildExpandedPriceRange', () => {
  it('multiplies max by 1.5 when max is defined', () => {
    expect(buildExpandedPriceRange({ min: 50, max: 100 })).toEqual({ min: 50, max: 150 });
  });

  it('keeps max as null (no ceiling) when already unbounded', () => {
    expect(buildExpandedPriceRange({ min: 500, max: null })).toEqual({ min: 500, max: null });
  });
});

describe('combineResults', () => {
  it('combines primary and alternatives, capping primary at MAX_PRIMARY_RESULTS', () => {
    const primary = Array.from({ length: 12 }, (_, i) => mkProduct(`p${i}`));
    const result = combineResults(primary, [], baseAnswers);
    expect(result.primary).toHaveLength(8);
    expect(result.alternatives).toHaveLength(0);
    expect(result.case).toBe(1);
  });

  it('deduplicates alternatives that already appear in primary', () => {
    const primary = [mkProduct('1'), mkProduct('2')];
    const alternatives: AlternativeProduct[] = [
      { ...mkProduct('2'), fallbackReason: 'price_relaxed' }, // duplicate
      { ...mkProduct('3'), fallbackReason: 'price_relaxed' },
    ];
    const result = combineResults(primary, alternatives, baseAnswers);
    expect(result.alternatives.map((p) => p.id)).toEqual(['3']);
  });

  it('filters out products without stock', () => {
    const primary = [
      { ...mkProduct('1'), availableForSale: true },
      { ...mkProduct('2'), availableForSale: false },
    ];
    const result = combineResults(primary, [], baseAnswers);
    expect(result.primary.map((p) => p.id)).toEqual(['1']);
  });
});
```

- [ ] **Step 2: Ejecutar tests para confirmar que fallan**

Run: `npm test`
Expected: FAIL — "Cannot find module './jewelFinderLogic'"

- [ ] **Step 3: Implementar `jewelFinderLogic.ts`**

```typescript
import type {
  AlternativeProduct,
  FinderProduct,
  PriceRange,
  QuizAnswers,
  QuizResult,
} from '../components/react/jewelFinder/types';
import {
  MAX_ALTERNATIVE_RESULTS,
  MAX_PRIMARY_RESULTS,
  PARTIAL_MATCH_THRESHOLD,
  PRICE_RELAX_MULTIPLIER,
} from '../components/react/jewelFinder/config';

export type FallbackStep = 'price_relaxed' | 'type_relaxed';

export interface FallbackStrategy {
  case: 1 | 2 | 3;
  runFallback: boolean;
  fallbackPlan: FallbackStep[];
}

export function decideFallbackStrategy(
  primary: FinderProduct[],
  answers: QuizAnswers
): FallbackStrategy {
  const count = primary.filter((p) => p.availableForSale).length;
  const hasSpecificType = answers.jewelryType !== null && answers.jewelryType !== 'any';

  if (count >= PARTIAL_MATCH_THRESHOLD) {
    return { case: 1, runFallback: false, fallbackPlan: [] };
  }

  if (count >= 1) {
    // Caso 2 — match parcial. Ampliar precio si había tipo específico.
    const plan: FallbackStep[] = hasSpecificType ? ['price_relaxed'] : [];
    return { case: 2, runFallback: plan.length > 0, fallbackPlan: plan };
  }

  // Caso 3 — sin match. Ejecutar ambas estrategias si aplican.
  const plan: FallbackStep[] = [];
  if (hasSpecificType) {
    plan.push('price_relaxed'); // mismo tipo, precio ampliado
    plan.push('type_relaxed'); // distinto tipo, mismo presupuesto
  }
  return { case: 3, runFallback: plan.length > 0, fallbackPlan: plan };
}

export function buildExpandedPriceRange(range: PriceRange): PriceRange {
  if (range.max === null) return range;
  return { min: range.min, max: Math.round(range.max * PRICE_RELAX_MULTIPLIER) };
}

export function combineResults(
  primary: FinderProduct[],
  alternatives: AlternativeProduct[],
  answers: QuizAnswers
): QuizResult {
  const availablePrimary = primary.filter((p) => p.availableForSale).slice(0, MAX_PRIMARY_RESULTS);
  const primaryIds = new Set(availablePrimary.map((p) => p.id));
  const dedupedAlternatives = alternatives
    .filter((p) => p.availableForSale && !primaryIds.has(p.id))
    .slice(0, MAX_ALTERNATIVE_RESULTS);

  let resultCase: 1 | 2 | 3;
  if (availablePrimary.length >= PARTIAL_MATCH_THRESHOLD) resultCase = 1;
  else if (availablePrimary.length >= 1) resultCase = 2;
  else resultCase = 3;

  return {
    case: resultCase,
    primary: availablePrimary,
    alternatives: dedupedAlternatives,
    answersSnapshot: answers,
  };
}
```

- [ ] **Step 4: Ejecutar tests para confirmar que pasan**

Run: `npm test`
Expected: All tests PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/jewelFinderLogic.ts src/lib/jewelFinderLogic.test.ts
git commit -m "feat(jewel-finder): lógica pura de fallback con tests"
```

---

## Task 6: Queries GraphQL

**Files:**
- Create: `src/lib/queries/jewelFinder.ts`

> **Estrategia revisada (post-Task 1):** La Storefront API tiene limitaciones:
> - El top-level `products(query: ...)` SÍ acepta `product_type:X` pero NO acepta `variants.price:>=X`.
> - `collection.products(query: ...)` NO existe; usa `filters: [ProductFilter!]` con `{ price: { min, max } }` y `{ available: true }`.
> - El `filters: [{ productType }]` existe pero hace match laxo — no es confiable, **siempre filtraremos productType client-side**.
>
> **Aproximación:** fetch amplio (hasta 100 productos) con los filtros server-side que SÍ funcionan, luego filtramos productType + precio en el cliente con `combineResults`.

- [ ] **Step 1: Crear queries**

```typescript
import { gql } from 'graphql-request';

// Fragmento mínimo que necesita ProductCard.
export const FINDER_PRODUCT_FRAGMENT = gql`
  fragment FinderProductFragment on Product {
    id
    title
    handle
    availableForSale
    productType
    tags
    priceRange {
      minVariantPrice { amount currencyCode }
    }
    featuredImage { url altText width height }
    images(first: 2) {
      edges { node { url altText width height } }
    }
    variants(first: 1) {
      edges {
        node {
          id
          quantityAvailable
          compareAtPrice { amount currencyCode }
        }
      }
    }
  }
`;

// Cuando hay género: usa collection.products con filters (price + available funcionan, productType NO).
export const FINDER_QUERY_BY_COLLECTION = gql`
  query finderByCollection(
    $collectionHandle: String!
    $first: Int!
    $filters: [ProductFilter!]
    $language: LanguageCode
  ) @inContext(language: $language) {
    collection(handle: $collectionHandle) {
      products(first: $first, filters: $filters, sortKey: BEST_SELLING) {
        edges { node { ...FinderProductFragment } }
      }
    }
  }
  ${FINDER_PRODUCT_FRAGMENT}
`;

// Cuando no hay género: usa products top-level con query (product_type + available SÍ, price NO).
export const FINDER_QUERY_GLOBAL = gql`
  query finderGlobal(
    $productQuery: String!
    $first: Int!
    $language: LanguageCode
  ) @inContext(language: $language) {
    products(first: $first, query: $productQuery, sortKey: BEST_SELLING) {
      edges { node { ...FinderProductFragment } }
    }
  }
  ${FINDER_PRODUCT_FRAGMENT}
`;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/queries/jewelFinder.ts
git commit -m "feat(jewel-finder): queries GraphQL (collection con filters, global con query)"
```

---

## Task 7: Orquestador de queries

Función que combina respuestas → fetch desde Shopify (con los filtros server-side que funcionan) → filtra productType + precio client-side → decide fallback → fetch fallback → combineResults.

**Estrategia:**
- **Con género (collection):** `collection.products(filters: [{available:true}, {price:{min,max}}])`. Filtra **productType client-side** porque el filter de Shopify es laxo.
- **Sin género (unsure):** `products(query: "product_type:X AND available_for_sale:true")`. Filtra **precio client-side** porque `variants.price` no funciona en query string. Si tipo es "any" también, query es `available_for_sale:true`.

**Files:**
- Create: `src/lib/jewelFinderQuery.ts`

- [ ] **Step 1: Implementar el orquestador**

```typescript
import type { AlternativeProduct, FinderProduct, PriceRange, QuizAnswers, QuizResult } from '../components/react/jewelFinder/types';
import {
  BUDGET_RANGES,
  JEWELRY_TYPE_TO_PRODUCT_TYPES,
  MAX_PRIMARY_RESULTS,
  MAX_ALTERNATIVE_RESULTS,
  RECIPIENT_TO_COLLECTION,
} from '../components/react/jewelFinder/config';
import {
  FINDER_QUERY_BY_COLLECTION,
  FINDER_QUERY_GLOBAL,
} from './queries/jewelFinder';
import { buildExpandedPriceRange, combineResults, decideFallbackStrategy } from './jewelFinderLogic';

// Cuánto pedir al server para tener margen tras filtrar client-side.
const SERVER_FETCH_SIZE = 100;

interface FetchConfig {
  url: string;
  token: string;
}

function getStorefrontConfig(): FetchConfig | null {
  const domain = import.meta.env.PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = import.meta.env.PUBLIC_STOREFRONT_API_VERSION;
  const token = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!domain || !version || !token) return null;
  return { url: `https://${domain}/api/${version}/graphql.json`, token };
}

async function runRawQuery(
  config: FetchConfig,
  query: string,
  variables: Record<string, unknown>,
  lang: 'es' | 'en'
): Promise<FinderProduct[]> {
  const res = await fetch(`${config.url}?nocache=${Date.now()}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.token,
    },
    body: JSON.stringify({
      query,
      variables: { ...variables, language: lang.toUpperCase() },
    }),
  });
  if (!res.ok) throw new Error(`Shopify query failed: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(`Shopify errors: ${JSON.stringify(json.errors)}`);
  const edges = json.data?.collection?.products?.edges ?? json.data?.products?.edges ?? [];
  return edges.map((e: { node: FinderProduct }) => e.node);
}

/**
 * Filtra una lista de productos por tipos permitidos. Lista vacía = sin filtro.
 */
export function filterByProductTypes(products: FinderProduct[], allowedTypes: string[]): FinderProduct[] {
  if (allowedTypes.length === 0) return products;
  const set = new Set(allowedTypes);
  return products.filter((p) => set.has(p.productType));
}

/**
 * Filtra una lista de productos por rango de precio (precio mínimo de variantes).
 */
export function filterByPriceRange(products: FinderProduct[], range: PriceRange): FinderProduct[] {
  return products.filter((p) => {
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    if (price < range.min) return false;
    if (range.max !== null && price > range.max) return false;
    return true;
  });
}

/**
 * Excluye productos cuyo productType está en la lista.
 */
export function excludeProductTypes(products: FinderProduct[], excluded: string[]): FinderProduct[] {
  if (excluded.length === 0) return products;
  const set = new Set(excluded);
  return products.filter((p) => !set.has(p.productType));
}

/**
 * Fetch principal según género: si hay colección usa filters; si no, usa query top-level.
 */
async function fetchPrimaryPool(
  config: FetchConfig,
  collectionHandle: string | null,
  allowedTypes: string[],
  priceRange: PriceRange,
  lang: 'es' | 'en'
): Promise<FinderProduct[]> {
  if (collectionHandle) {
    // Server: collection + available + price. Client: productType.
    const filters: Array<Record<string, unknown>> = [{ available: true }];
    filters.push({ price: { min: priceRange.min, max: priceRange.max ?? 999999 } });
    const raw = await runRawQuery(config, FINDER_QUERY_BY_COLLECTION, {
      collectionHandle,
      first: SERVER_FETCH_SIZE,
      filters,
    }, lang);
    return filterByProductTypes(raw, allowedTypes);
  }

  // Sin colección: query top-level con productType + available. Client filtra precio.
  const queryParts: string[] = ['available_for_sale:true'];
  if (allowedTypes.length === 1) {
    queryParts.push(`product_type:${JSON.stringify(allowedTypes[0])}`);
  } else if (allowedTypes.length > 1) {
    const ors = allowedTypes.map((t) => `product_type:${JSON.stringify(t)}`).join(' OR ');
    queryParts.push(`(${ors})`);
  }
  const productQuery = queryParts.join(' AND ');
  const raw = await runRawQuery(config, FINDER_QUERY_GLOBAL, {
    productQuery,
    first: SERVER_FETCH_SIZE,
  }, lang);
  return filterByPriceRange(raw, priceRange);
}

/**
 * Punto de entrada principal. Recibe respuestas y devuelve QuizResult listo para ResultsView.
 */
export async function runJewelFinderQuery(answers: QuizAnswers, lang: 'es' | 'en'): Promise<QuizResult> {
  const config = getStorefrontConfig();
  if (!config) throw new Error('Shopify config missing');
  if (!answers.recipient || !answers.jewelryType || !answers.budget) {
    throw new Error('Quiz answers incomplete');
  }

  const collectionHandle = RECIPIENT_TO_COLLECTION[answers.recipient];
  const allowedTypes = JEWELRY_TYPE_TO_PRODUCT_TYPES[answers.jewelryType];
  const priceRange = BUDGET_RANGES[answers.budget];

  // 1. Query principal con filtrado client-side.
  const primary = await fetchPrimaryPool(config, collectionHandle, allowedTypes, priceRange, lang);

  // 2. Decidir fallback.
  const strategy = decideFallbackStrategy(primary, answers);

  // 3. Ejecutar fallback si aplica.
  let alternatives: AlternativeProduct[] = [];
  if (strategy.runFallback) {
    const fallbackPromises: Promise<AlternativeProduct[]>[] = [];
    const hasSpecificType = allowedTypes.length > 0;

    if (strategy.fallbackPlan.includes('price_relaxed') && hasSpecificType) {
      const expanded = buildExpandedPriceRange(priceRange);
      fallbackPromises.push(
        fetchPrimaryPool(config, collectionHandle, allowedTypes, expanded, lang).then((arr) =>
          arr.map((p) => ({ ...p, fallbackReason: 'price_relaxed' as const }))
        )
      );
    }

    if (strategy.fallbackPlan.includes('type_relaxed') && hasSpecificType) {
      // Mismo género, mismo presupuesto, OTROS tipos (todos menos los del usuario).
      // Fetcheamos todo el género + precio, luego excluimos los tipos pedidos.
      fallbackPromises.push(
        fetchPrimaryPool(config, collectionHandle, [], priceRange, lang).then((arr) =>
          excludeProductTypes(arr, allowedTypes).map((p) => ({ ...p, fallbackReason: 'type_relaxed' as const }))
        )
      );
    }

    const results = await Promise.all(fallbackPromises);
    alternatives = results.flat();
  }

  return combineResults(primary, alternatives, answers);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/jewelFinderQuery.ts
git commit -m "feat(jewel-finder): orquestador con fetch híbrido server/client-side"
```

---

## Task 8: i18n strings

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Agregar claves a `ui.es`**

Localizar el objeto `ui.es` en `src/i18n/ui.ts` y agregar (antes del cierre `}`):

```typescript
    // Jewel Finder
    'finder.title': 'Encuentra tu joya',
    'finder.subtitle': 'Responde 3 preguntas y te mostramos las joyas perfectas para ti.',
    'finder.start': 'Empezar',
    'finder.back': 'Atrás',
    'finder.editSelection': 'Editar',
    'finder.startOver': 'Empezar de nuevo',
    'finder.viewStore': 'Ver toda la tienda',
    'finder.progress': 'Pregunta {current} de {total}',
    'finder.loading': 'Buscando tus joyas perfectas...',
    'finder.error': 'Ups, hubo un error. ¿Intentas de nuevo?',
    'finder.retry': 'Reintentar',
    'finder.openCTA': '¿No sabes qué elegir? Encuentra tu joya',
    'finder.closeModal': 'Cerrar',

    // Pregunta 1 — para quién
    'finder.q.recipient': '¿Para quién es?',
    'finder.recipient.women': 'Mujer',
    'finder.recipient.men': 'Hombre',
    'finder.recipient.kids': 'Niño/a',
    'finder.recipient.unsure': 'No estoy seguro',

    // Pregunta 2 — tipo de joya
    'finder.q.type': '¿Qué tipo de joya?',
    'finder.type.ring': 'Anillo',
    'finder.type.necklace': 'Collar',
    'finder.type.earring': 'Arete',
    'finder.type.bracelet': 'Pulsera',
    'finder.type.any': 'Sorpréndeme',

    // Pregunta 3 — presupuesto
    'finder.q.budget': '¿Cuál es tu presupuesto?',
    'finder.budget.under_50': 'Hasta $50',
    'finder.budget.50_100': '$50 – $100',
    'finder.budget.100_200': '$100 – $200',
    'finder.budget.200_500': '$200 – $500',
    'finder.budget.over_500': 'Más de $500',

    // Resultados
    'finder.results.perfect': '✨ Tus joyas perfectas',
    'finder.results.youAsked': 'Lo que buscaste',
    'finder.results.alsoLike': '💡 También te puede interesar',
    'finder.results.weRecommend': 'Te recomendamos',
    'finder.results.noMatch': 'No encontramos coincidencias exactas con tu selección.',
    'finder.results.tagPriceRelaxed': 'Un poco más',
    'finder.results.tagTypeRelaxed': 'Otro tipo',
    'finder.results.summary': 'Tu selección',

    // WhatsApp
    'finder.whatsapp.cta': 'Recibir mi selección por WhatsApp',
    'finder.whatsapp.intro': 'Hola! Hice el quiz "Encuentra tu joya" y me interesan estas opciones:',
    'finder.whatsapp.outro': '¿Me pueden dar más info?',
```

- [ ] **Step 2: Agregar las mismas claves a `ui.en` (en inglés)**

```typescript
    // Jewel Finder
    'finder.title': 'Find your jewel',
    'finder.subtitle': 'Answer 3 questions and we will show you the perfect jewels for you.',
    'finder.start': 'Start',
    'finder.back': 'Back',
    'finder.editSelection': 'Edit',
    'finder.startOver': 'Start over',
    'finder.viewStore': 'See the whole store',
    'finder.progress': 'Question {current} of {total}',
    'finder.loading': 'Finding your perfect jewels...',
    'finder.error': 'Oops, something went wrong. Try again?',
    'finder.retry': 'Retry',
    'finder.openCTA': "Don't know what to pick? Find your jewel",
    'finder.closeModal': 'Close',

    'finder.q.recipient': 'Who is it for?',
    'finder.recipient.women': 'Women',
    'finder.recipient.men': 'Men',
    'finder.recipient.kids': 'Kids',
    'finder.recipient.unsure': 'Not sure',

    'finder.q.type': 'What kind of jewelry?',
    'finder.type.ring': 'Ring',
    'finder.type.necklace': 'Necklace',
    'finder.type.earring': 'Earring',
    'finder.type.bracelet': 'Bracelet',
    'finder.type.any': 'Surprise me',

    'finder.q.budget': "What's your budget?",
    'finder.budget.under_50': 'Up to $50',
    'finder.budget.50_100': '$50 – $100',
    'finder.budget.100_200': '$100 – $200',
    'finder.budget.200_500': '$200 – $500',
    'finder.budget.over_500': 'Over $500',

    'finder.results.perfect': '✨ Your perfect jewels',
    'finder.results.youAsked': 'What you asked for',
    'finder.results.alsoLike': '💡 You might also like',
    'finder.results.weRecommend': 'We recommend',
    'finder.results.noMatch': "We couldn't find exact matches for your selection.",
    'finder.results.tagPriceRelaxed': 'A bit more',
    'finder.results.tagTypeRelaxed': 'Other type',
    'finder.results.summary': 'Your selection',

    'finder.whatsapp.cta': 'Get my selection via WhatsApp',
    'finder.whatsapp.intro': 'Hi! I just took the "Find your jewel" quiz and I\'m interested in these options:',
    'finder.whatsapp.outro': 'Can you give me more info?',
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/ui.ts
git commit -m "feat(jewel-finder): i18n strings ES/EN"
```

---

## Task 9: ProgressBar

**Files:**
- Create: `src/components/react/jewelFinder/ProgressBar.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React from 'react';

interface ProgressBarProps {
  current: number; // 1, 2 o 3
  total: number; // 3
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full flex items-center gap-3 mb-6">
      <div className="flex-1 h-1 bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#d4af37] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] text-[#A0A0A0] uppercase tracking-widest font-medium tabular-nums">
        {current} / {total}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/ProgressBar.tsx
git commit -m "feat(jewel-finder): ProgressBar"
```

---

## Task 10: QuestionStep (chip selector reutilizable)

**Files:**
- Create: `src/components/react/jewelFinder/QuestionStep.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import ProgressBar from './ProgressBar';

interface Option<T extends string> {
  value: T;
  i18nKey: string;
  emoji?: string;
}

interface QuestionStepProps<T extends string> {
  questionI18nKey: string;
  options: Array<Option<T>>;
  onSelect: (value: T) => void;
  onBack?: () => void;
  step: number; // 1, 2 o 3
  totalSteps: number; // 3
  lang: 'es' | 'en';
}

export default function QuestionStep<T extends string>({
  questionI18nKey,
  options,
  onSelect,
  onBack,
  step,
  totalSteps,
  lang,
}: QuestionStepProps<T>) {
  const t = getTranslationFunctionForLang(lang);

  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-4">
      {onBack && (
        <button
          onClick={onBack}
          className="text-[#A0A0A0] hover:text-[#d4af37] text-xs uppercase tracking-widest mb-4 flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          {t('finder.back' as any)}
        </button>
      )}

      <ProgressBar current={step} total={totalSteps} />

      <h2 className="text-[#FAFAF5] font-serif text-2xl md:text-3xl text-center mb-8 leading-tight">
        {t(questionI18nKey as any)}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="
              min-h-[64px] px-4 py-4
              bg-[#111] border border-white/10
              text-[#FAFAF5] text-sm md:text-base font-sans
              flex flex-col items-center justify-center gap-2
              hover:border-[#d4af37] hover:text-[#d4af37]
              active:bg-[#d4af37] active:text-black
              transition-all duration-200
            "
          >
            {opt.emoji && <span className="text-2xl">{opt.emoji}</span>}
            <span>{t(opt.i18nKey as any)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/QuestionStep.tsx
git commit -m "feat(jewel-finder): QuestionStep genérico con chips"
```

---

## Task 11: WelcomeStep

**Files:**
- Create: `src/components/react/jewelFinder/WelcomeStep.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';

interface WelcomeStepProps {
  onStart: () => void;
  lang: 'es' | 'en';
}

export default function WelcomeStep({ onStart, lang }: WelcomeStepProps) {
  const t = getTranslationFunctionForLang(lang);
  return (
    <div className="w-full max-w-xl mx-auto py-12 px-4 text-center flex flex-col items-center gap-6">
      <span className="material-symbols-outlined text-[#d4af37] text-[48px]">diamond</span>
      <h1 className="text-[#FAFAF5] font-serif text-3xl md:text-4xl leading-tight">
        {t('finder.title' as any)}
      </h1>
      <p className="text-[#A0A0A0] text-base md:text-lg max-w-md">
        {t('finder.subtitle' as any)}
      </p>
      <button
        onClick={onStart}
        className="
          mt-4 px-10 py-3
          bg-[#d4af37] text-black
          font-sans font-bold text-sm uppercase tracking-widest
          hover:brightness-110 active:scale-[0.98]
          transition-all duration-200
        "
      >
        {t('finder.start' as any)}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/WelcomeStep.tsx
git commit -m "feat(jewel-finder): WelcomeStep"
```

---

## Task 12: WhatsAppButton

**Files:**
- Create: `src/components/react/jewelFinder/WhatsAppButton.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';
import { WHATSAPP_NUMBER } from './config';
import type { FinderProduct } from './types';

interface WhatsAppButtonProps {
  products: FinderProduct[]; // máximo 8
  lang: 'es' | 'en';
}

function buildMessage(products: FinderProduct[], lang: 'es' | 'en'): string {
  const t = getTranslationFunctionForLang(lang);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const lines = products.map((p) => {
    const price = Math.round(parseFloat(p.priceRange.minVariantPrice.amount));
    const route = getRoute(`/producto/${p.handle}`, lang);
    return `• ${p.title} – $${price} – ${origin}${route}`;
  });

  return `${t('finder.whatsapp.intro' as any)}\n\n${lines.join('\n')}\n\n${t('finder.whatsapp.outro' as any)}`;
}

export default function WhatsAppButton({ products, lang }: WhatsAppButtonProps) {
  const t = getTranslationFunctionForLang(lang);

  const handleClick = () => {
    const message = buildMessage(products, lang);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (products.length === 0) return null;

  return (
    <button
      onClick={handleClick}
      className="
        w-full max-w-2xl mx-auto
        flex items-center justify-center gap-3
        px-6 py-4
        bg-gradient-to-r from-[#20ba5a] via-[#25D366] to-[#2ee66c]
        text-white font-bold text-sm md:text-base uppercase tracking-wide
        shadow-[0_4px_24px_rgba(37,211,102,0.45)]
        hover:brightness-110 active:scale-[0.99]
        transition-all duration-200
      "
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {t('finder.whatsapp.cta' as any)}
    </button>
  );
}
```

> **Nota:** Usamos `getRoute('/producto/{handle}', lang)` que ya traduce la ruta español→inglés (vive en `src/utils/paths.ts:47`). El URL absoluto se construye con `window.location.origin`.

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/WhatsAppButton.tsx
git commit -m "feat(jewel-finder): WhatsAppButton con mensaje pre-llenado"
```

---

## Task 13: ResultsView

**Files:**
- Create: `src/components/react/jewelFinder/ResultsView.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React from 'react';
import ProductCard from '../ProductCard';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { RECIPIENT_OPTIONS, JEWELRY_TYPE_OPTIONS, BUDGET_OPTIONS } from './config';
import WhatsAppButton from './WhatsAppButton';
import type { AlternativeProduct, FinderProduct, QuizResult } from './types';

interface ResultsViewProps {
  result: QuizResult;
  onEdit: () => void;
  onStartOver: () => void;
  onViewStore: () => void;
  lang: 'es' | 'en';
}

function formatSummary(result: QuizResult, lang: 'es' | 'en'): string {
  const t = getTranslationFunctionForLang(lang);
  const parts: string[] = [];
  if (result.answersSnapshot.jewelryType && result.answersSnapshot.jewelryType !== 'any') {
    const opt = JEWELRY_TYPE_OPTIONS.find((o) => o.value === result.answersSnapshot.jewelryType);
    if (opt) parts.push(t(opt.i18nKey as any));
  }
  if (result.answersSnapshot.recipient && result.answersSnapshot.recipient !== 'unsure') {
    const opt = RECIPIENT_OPTIONS.find((o) => o.value === result.answersSnapshot.recipient);
    if (opt) parts.push(t(opt.i18nKey as any));
  }
  if (result.answersSnapshot.budget) {
    const opt = BUDGET_OPTIONS.find((o) => o.value === result.answersSnapshot.budget);
    if (opt) parts.push(t(opt.i18nKey as any));
  }
  return parts.join(' · ');
}

function ProductGrid({
  products,
  showFallbackTag,
  lang,
}: {
  products: Array<FinderProduct | AlternativeProduct>;
  showFallbackTag: boolean;
  lang: 'es' | 'en';
}) {
  const t = getTranslationFunctionForLang(lang);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((p) => (
        <div key={p.id} className="relative">
          <ProductCard product={p as any} lang={lang} />
          {showFallbackTag && 'fallbackReason' in p && (
            <span className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-[#d4af37] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
              {p.fallbackReason === 'price_relaxed'
                ? t('finder.results.tagPriceRelaxed' as any)
                : t('finder.results.tagTypeRelaxed' as any)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ResultsView({ result, onEdit, onStartOver, onViewStore, lang }: ResultsViewProps) {
  const t = getTranslationFunctionForLang(lang);
  const summary = formatSummary(result, lang);

  // Productos para WhatsApp según el caso (ver sección 6.1 del spec):
  // Caso 1: primary completo
  // Caso 2: solo primary (sin alternatives)
  // Caso 3: alternatives (no hay primary)
  const whatsAppProducts = result.case === 3 ? result.alternatives : result.primary;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 md:px-6">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <p className="text-[#A0A0A0] text-sm">
          <span className="font-bold text-[#FAFAF5]">{t('finder.results.summary' as any)}:</span> {summary}
        </p>
        <button onClick={onEdit} className="text-[#d4af37] hover:underline text-sm">
          {t('finder.editSelection' as any)}
        </button>
      </div>

      {/* Caso 3: banner de "no match" */}
      {result.case === 3 && (
        <div className="mb-6 p-4 border border-[#d4af37]/30 bg-[#d4af37]/5 text-center">
          <p className="text-[#FAFAF5] text-sm md:text-base">{t('finder.results.noMatch' as any)}</p>
        </div>
      )}

      {/* Sección primaria */}
      {result.primary.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[#FAFAF5] font-serif text-2xl md:text-3xl mb-6">
            {result.case === 1
              ? t('finder.results.perfect' as any)
              : t('finder.results.youAsked' as any)}
          </h2>
          <ProductGrid products={result.primary} showFallbackTag={false} lang={lang} />
        </section>
      )}

      {/* Sección de alternativas */}
      {result.alternatives.length > 0 && (
        <section className="mb-12">
          <h2 className="text-[#FAFAF5] font-serif text-2xl md:text-3xl mb-6">
            {result.case === 3
              ? t('finder.results.weRecommend' as any)
              : t('finder.results.alsoLike' as any)}
          </h2>
          <ProductGrid products={result.alternatives} showFallbackTag={true} lang={lang} />
        </section>
      )}

      {/* WhatsApp CTA */}
      <div className="mb-8">
        <WhatsAppButton products={whatsAppProducts} lang={lang} />
      </div>

      {/* Acciones secundarias */}
      <div className="flex flex-col md:flex-row gap-3 justify-center">
        <button
          onClick={onStartOver}
          className="px-6 py-3 border border-white/20 text-[#FAFAF5] text-xs uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
        >
          {t('finder.startOver' as any)}
        </button>
        <button
          onClick={onViewStore}
          className="px-6 py-3 border border-white/20 text-[#FAFAF5] text-xs uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors"
        >
          {t('finder.viewStore' as any)}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/ResultsView.tsx
git commit -m "feat(jewel-finder): ResultsView con primary, fallback, summary y CTAs"
```

---

## Task 14: JewelFinder (orquestador raíz)

**Files:**
- Create: `src/components/react/jewelFinder/JewelFinder.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React, { useState } from 'react';
import { getTranslationFunctionForLang } from '../../../i18n/utils';
import { getRoute } from '../../../utils/paths';
import { runJewelFinderQuery } from '../../../lib/jewelFinderQuery';
import { BUDGET_OPTIONS, JEWELRY_TYPE_OPTIONS, RECIPIENT_OPTIONS } from './config';
import QuestionStep from './QuestionStep';
import ResultsView from './ResultsView';
import WelcomeStep from './WelcomeStep';
import type { BudgetBracket, JewelryType, QuizAnswers, QuizResult, Recipient } from './types';

type Phase = 'welcome' | 'q1' | 'q2' | 'q3' | 'loading' | 'results' | 'error';

interface JewelFinderProps {
  lang: 'es' | 'en';
  mode?: 'page' | 'modal';
  onClose?: () => void; // solo aplica si mode = 'modal'
}

const EMPTY_ANSWERS: QuizAnswers = { recipient: null, jewelryType: null, budget: null };

export default function JewelFinder({ lang, mode = 'page', onClose }: JewelFinderProps) {
  const t = getTranslationFunctionForLang(lang);
  const [phase, setPhase] = useState<Phase>('welcome');
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (finalAnswers: QuizAnswers) => {
    setPhase('loading');
    setError(null);
    try {
      const r = await runJewelFinderQuery(finalAnswers, lang);
      setResult(r);
      setPhase('results');
    } catch (err) {
      console.error('JewelFinder query failed:', err);
      setError(err instanceof Error ? err.message : String(err));
      setPhase('error');
    }
  };

  const startOver = () => {
    setAnswers(EMPTY_ANSWERS);
    setResult(null);
    setError(null);
    setPhase('welcome');
  };

  const goToStore = () => {
    window.location.href = getRoute(lang === 'es' ? '/tienda' : '/store', lang);
  };

  return (
    <div className="bg-[#050505] text-[#FAFAF5] min-h-screen md:min-h-0">
      {mode === 'modal' && onClose && (
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-[#A0A0A0] hover:text-[#d4af37] transition-colors"
            aria-label={t('finder.closeModal' as any)}
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>
      )}

      {phase === 'welcome' && <WelcomeStep onStart={() => setPhase('q1')} lang={lang} />}

      {phase === 'q1' && (
        <QuestionStep<Recipient>
          questionI18nKey="finder.q.recipient"
          options={RECIPIENT_OPTIONS}
          step={1}
          totalSteps={3}
          lang={lang}
          onSelect={(v) => {
            setAnswers((prev) => ({ ...prev, recipient: v }));
            setPhase('q2');
          }}
          onBack={() => setPhase('welcome')}
        />
      )}

      {phase === 'q2' && (
        <QuestionStep<JewelryType>
          questionI18nKey="finder.q.type"
          options={JEWELRY_TYPE_OPTIONS}
          step={2}
          totalSteps={3}
          lang={lang}
          onSelect={(v) => {
            setAnswers((prev) => ({ ...prev, jewelryType: v }));
            setPhase('q3');
          }}
          onBack={() => setPhase('q1')}
        />
      )}

      {phase === 'q3' && (
        <QuestionStep<BudgetBracket>
          questionI18nKey="finder.q.budget"
          options={BUDGET_OPTIONS}
          step={3}
          totalSteps={3}
          lang={lang}
          onSelect={(v) => {
            const finalAnswers = { ...answers, budget: v };
            setAnswers(finalAnswers);
            void runQuery(finalAnswers);
          }}
          onBack={() => setPhase('q2')}
        />
      )}

      {phase === 'loading' && (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 md:px-6">
          <p className="text-center text-[#A0A0A0] mb-8">{t('finder.loading' as any)}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#111] animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className="w-full max-w-xl mx-auto py-16 px-4 text-center flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-[48px] text-red-500">error</span>
          <p className="text-[#FAFAF5]">{t('finder.error' as any)}</p>
          {error && <p className="text-xs text-[#A0A0A0]">{error}</p>}
          <button
            onClick={() => void runQuery(answers)}
            className="mt-4 px-6 py-2 border border-[#d4af37] text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors"
          >
            {t('finder.retry' as any)}
          </button>
        </div>
      )}

      {phase === 'results' && result && (
        <ResultsView
          result={result}
          onEdit={() => setPhase('q1')}
          onStartOver={startOver}
          onViewStore={goToStore}
          lang={lang}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/jewelFinder/JewelFinder.tsx
git commit -m "feat(jewel-finder): JewelFinder root orquestando state machine y fases"
```

---

## Task 15: Página dedicada ES

**Files:**
- Create: `src/pages/es/encuentra-tu-joya.astro`

- [ ] **Step 1: Crear página**

```astro
---
import Layout from '../../layouts/Layout.astro';
import JewelFinder from '../../components/react/jewelFinder/JewelFinder';

const lang = 'es';
---

<Layout
  title="Encuentra tu joya - DTalles Jewelry"
  description="Responde 3 preguntas rápidas y descubre las joyas perfectas para ti según tu presupuesto."
>
  <div class="bg-[#050505] min-h-screen pt-28 pb-12">
    <JewelFinder client:load lang={lang} mode="page" />
  </div>
</Layout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/es/encuentra-tu-joya.astro
git commit -m "feat(jewel-finder): página dedicada ES"
```

---

## Task 16: Página dedicada EN

**Files:**
- Create: `src/pages/find-your-jewel.astro`

- [ ] **Step 1: Crear página**

```astro
---
import Layout from '../layouts/Layout.astro';
import JewelFinder from '../components/react/jewelFinder/JewelFinder';

const lang = 'en';
---

<Layout
  title="Find your jewel - DTalles Jewelry"
  description="Answer 3 quick questions and discover the perfect jewels for you based on your budget."
>
  <div class="bg-[#050505] min-h-screen pt-28 pb-12">
    <JewelFinder client:load lang={lang} mode="page" />
  </div>
</Layout>
```

- [ ] **Step 2: Probar manualmente ambas páginas**

Run: `npm run dev`

Abrir `http://localhost:4321/find-your-jewel` y `http://localhost:4321/es/encuentra-tu-joya`. Completar el quiz en ambas. Verificar que devuelve resultados, que el botón de WhatsApp abre con el mensaje correcto en el idioma correspondiente, y que "Empezar de nuevo" funciona.

- [ ] **Step 3: Commit**

```bash
git add src/pages/find-your-jewel.astro
git commit -m "feat(jewel-finder): página dedicada EN"
```

---

## Task 17: JewelFinderTrigger (botón + modal)

**Files:**
- Create: `src/components/react/JewelFinderTrigger.tsx`

- [ ] **Step 1: Implementar**

```typescript
import React, { useEffect, useState } from 'react';
import { getTranslationFunctionForLang } from '../../i18n/utils';
import JewelFinder from './jewelFinder/JewelFinder';

interface JewelFinderTriggerProps {
  lang: 'es' | 'en';
  variant?: 'hero' | 'inline'; // hero = grande para CTA, inline = badge sutil
}

export default function JewelFinderTrigger({ lang, variant = 'inline' }: JewelFinderTriggerProps) {
  const t = getTranslationFunctionForLang(lang);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const triggerClass =
    variant === 'hero'
      ? 'inline-flex items-center gap-2 px-8 py-3 border border-[#d4af37] text-[#d4af37] font-sans font-bold text-xs uppercase tracking-[2px] hover:bg-[#d4af37] hover:text-black transition-all duration-300'
      : 'inline-flex items-center gap-2 px-5 py-2 bg-[#d4af37]/10 border border-[#d4af37]/40 text-[#d4af37] text-xs uppercase tracking-widest hover:bg-[#d4af37] hover:text-black transition-colors';

  return (
    <>
      <button onClick={() => setOpen(true)} className={triggerClass}>
        <span className="material-symbols-outlined text-[18px]">diamond</span>
        {t('finder.openCTA' as any)}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="min-h-screen md:py-8">
            <div className="max-w-5xl mx-auto md:my-8 bg-[#050505] md:rounded shadow-2xl">
              <JewelFinder lang={lang} mode="modal" onClose={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/react/JewelFinderTrigger.tsx
git commit -m "feat(jewel-finder): JewelFinderTrigger con modal"
```

---

## Task 18: Wire trigger en Hero y StoreGrid

**Files:**
- Modify: `src/components/home/Hero.astro`
- Modify: `src/components/react/StoreGrid.tsx`

- [ ] **Step 1: Agregar trigger debajo del Hero**

Editar `src/components/home/Hero.astro`:

```astro
---
import HeroSlider from "./HeroSlider";
import JewelFinderTrigger from "../react/JewelFinderTrigger";
import { getLangFromUrl } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
---

<HeroSlider client:load lang={lang} />

<div class="bg-[#050505] py-6 flex justify-center border-b border-white/5">
  <JewelFinderTrigger client:load lang={lang} variant="hero" />
</div>
```

- [ ] **Step 2: Agregar trigger arriba del StoreGrid**

En `src/components/react/StoreGrid.tsx`, importar y montar el trigger. Localizar el inicio del JSX retornado (debajo de las declaraciones de hooks) y agregar antes del FilterSidebar/grid:

```typescript
import JewelFinderTrigger from './JewelFinderTrigger';
// ... resto de imports

// Dentro del return JSX, como primer hijo del wrapper principal:
<div className="px-4 py-6 flex justify-center border-b border-white/5">
  <JewelFinderTrigger lang={lang || 'es'} variant="inline" />
</div>
```

> El placement exacto depende de la estructura JSX actual del componente. El criterio: que sea visible al cargar la página de tienda, antes del grid de productos.

- [ ] **Step 3: Probar manualmente**

Run: `npm run dev`

Abrir `http://localhost:4321/` y `http://localhost:4321/es/`. Verificar que el botón aparece debajo del hero. Hacer clic → debe abrir modal con el wizard. Cerrar modal con clic fuera o el botón X.

Repetir en `http://localhost:4321/store` y `http://localhost:4321/es/tienda`.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.astro src/components/react/StoreGrid.tsx
git commit -m "feat(jewel-finder): entry points en home y tienda"
```

---

## Task 19: SEO meta + schema.org

**Files:**
- Modify: `src/pages/es/encuentra-tu-joya.astro`
- Modify: `src/pages/find-your-jewel.astro`

- [ ] **Step 1: Agregar JSON-LD a la página ES**

En `src/pages/es/encuentra-tu-joya.astro`, dentro del `<Layout>` agregar antes del div principal:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Encuentra tu joya',
  description: 'Quiz de 3 preguntas para descubrir joyas según presupuesto y preferencias.',
  applicationCategory: 'ShoppingApplication',
  inLanguage: 'es',
  url: `${Astro.site}es/encuentra-tu-joya`,
})} />
```

- [ ] **Step 2: Agregar el equivalente a la página EN**

En `src/pages/find-your-jewel.astro`:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Find your jewel',
  description: '3-question quiz to discover jewels based on budget and preferences.',
  applicationCategory: 'ShoppingApplication',
  inLanguage: 'en',
  url: `${Astro.site}find-your-jewel`,
})} />
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/es/encuentra-tu-joya.astro src/pages/find-your-jewel.astro
git commit -m "feat(jewel-finder): SEO meta + schema.org"
```

---

## Task 20: Smoke test manual end-to-end

**Files:**
- Ninguno (solo verificación)

- [ ] **Step 1: Levantar dev server**

Run: `npm run dev`

- [ ] **Step 2: Caso "match perfecto" (caso 1)**

1. Ir a `http://localhost:4321/es/encuentra-tu-joya`.
2. Empezar → Mujer → Anillo → $50–$100.
3. Esperado: galería titulada *"✨ Tus joyas perfectas"* con 4+ productos. Sin sección de alternativas.
4. Hacer clic en "Recibir mi selección por WhatsApp". Debe abrir WhatsApp en nueva pestaña con mensaje en español que incluya los productos.

- [ ] **Step 3: Caso "match parcial" (caso 2)**

1. Empezar de nuevo. Elegir combinación que probablemente tenga 1-3 resultados (ej. Niño/a → Anillo → $200–$500). Si esa combinación da 4+ o 0, probar otras.
2. Esperado: sección *"Lo que buscaste"* + sección *"💡 También te puede interesar"* con etiquetas *"Un poco más"*.

- [ ] **Step 4: Caso "sin match" (caso 3)**

1. Elegir combinación con alta probabilidad de no tener stock (ej. Niño/a → Collar → Más de $500).
2. Esperado: banner *"No encontramos coincidencias..."* + sección *"Te recomendamos"* con productos etiquetados *"Un poco más"* y/o *"Otro tipo"*.

- [ ] **Step 5: Caso comodín**

1. Empezar de nuevo. Elegir No estoy seguro → Sorpréndeme → $50–$100.
2. Esperado: muestra productos variados de todos los géneros y tipos en ese rango. Caso 1 muy probable.

- [ ] **Step 6: Modal desde home**

1. Ir a `http://localhost:4321/es/`.
2. Hacer clic en "¿No sabes qué elegir? Encuentra tu joya" debajo del hero.
3. Esperado: modal se abre, scroll del body bloqueado, X cierra, clic fuera cierra.

- [ ] **Step 7: EN funciona**

1. Ir a `http://localhost:4321/find-your-jewel`.
2. Verificar todos los textos en inglés.
3. Completar el quiz. WhatsApp message debe estar en inglés.

- [ ] **Step 8: Editar selección**

1. En la pantalla de resultados, hacer clic en "Editar".
2. Esperado: regresa a pregunta 1 con la respuesta previa todavía visible. Cambiar respuesta debe re-ejecutar la query.

- [ ] **Step 9: Volver atrás**

1. En cualquier pregunta, hacer clic en "Atrás".
2. Esperado: regresa a pregunta anterior, conserva respuestas posteriores si las había.

- [ ] **Step 10: Caso de error de red**

1. Abrir DevTools → Network → Throttling: "Offline".
2. Completar el quiz.
3. Esperado: pantalla de error con botón "Reintentar". Reintentar después de volver online debe funcionar.

- [ ] **Step 11: Documentar resultados**

Crear `docs/superpowers/plans/2026-05-24-jewel-finder-quiz-smoke-test.md` con la lista de casos probados, capturas si hay bugs, y "PASS/FAIL" por caso. Commit.

```bash
git add docs/superpowers/plans/2026-05-24-jewel-finder-quiz-smoke-test.md
git commit -m "docs(jewel-finder): registro de smoke test manual"
```

---

## Notas para el implementador

- **No introduzcas comentarios explicativos** en el código a menos que el "por qué" no sea obvio. La regla del proyecto.
- **No agregues error handling defensivo** en código interno. Solo en bordes del sistema (queries de Shopify).
- **Respeta paths existentes.** Si encuentras que `getRoute('/tienda', 'es')` ya hace algo distinto de lo que asumí en `goToStore`, ajusta — la verdad está en `src/utils/paths.ts`.
- **Si el script de Task 1 revela nombres distintos** (ej. `productType` es "Anillos" plural en lugar de "Anillo"), actualiza solo `config.ts` (Task 4). El resto del código no necesita cambios.
- **Las queries asumen sintaxis estándar de Shopify Storefront.** Si `variants.price:>=X` no funciona o devuelve resultados raros, prueba `price:>=X` o usa filtros nativos del schema. Validar en Task 1 step 2.
- **Commit frecuente** — un commit por tarea como mínimo, idealmente uno por step lógico.
