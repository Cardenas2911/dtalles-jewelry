# Encuentra tu joya — Quiz de descubrimiento por presupuesto

**Fecha:** 2026-05-24
**Estado:** Diseño aprobado, pendiente plan de implementación
**Stack:** Astro 5 + React 19 + Shopify Storefront API + Tailwind 4

---

## 1. Objetivo

Permitir que un visitante de Dtalles Jewelry descubra joyas alineadas a su presupuesto y preferencias mediante un quiz muy corto (3 preguntas, cero teclado). El sistema debe trabajar con el inventario actual en Shopify, actualizarse automáticamente cuando el catálogo cambie, y ofrecer alternativas inteligentes cuando no haya match exacto en lugar de devolver pantalla vacía.

**Usuarios objetivo:** visitantes que dudan, que llegan sin un producto específico en mente, o que vienen por regalo y no saben qué tipo de joya elegir.

**Métrica de éxito (cualitativa):** cliente termina el quiz con productos relevantes que puede agregar al carrito, marcar como favoritos, o enviar por WhatsApp para iniciar conversación.

---

## 2. Flujo del usuario

1. **Entrada** desde uno de dos puntos:
   - Página dedicada `/encuentra-tu-joya` (ES) y equivalente EN.
   - Modal flotante disparado desde un botón en `Hero.astro` (home) y en `StoreGrid.tsx` (página de tienda).
2. **Bienvenida** — pantalla muy corta: *"Responde 3 preguntas y te mostramos las joyas perfectas para ti."* + botón "Empezar".
3. **Pregunta 1 — ¿Para quién?** Chips: Mujer · Hombre · Niño/a · No estoy seguro.
4. **Pregunta 2 — ¿Qué tipo de joya?** Chips: Anillo · Collar · Arete · Pulsera · Sorpréndeme.
5. **Pregunta 3 — ¿Cuál es tu presupuesto?** Chips: Hasta $50 · $50–$100 · $100–$200 · $200–$500 · Más de $500.
6. **Resultados** — galería curada de 4–8 productos. Si no hay match exacto, se muestra adicionalmente una sección de alternativas claramente marcadas.
7. **Acciones** en resultados: agregar al carrito, favorito, ver detalle, "Recibir mi selección por WhatsApp", editar selección, empezar de nuevo.

**Principios:**

- Cero teclado en todo el flujo. Solo taps en chips grandes (≥48px alto).
- Cada pregunta es una pantalla independiente con barra de progreso (1/3, 2/3, 3/3).
- Botón "atrás" siempre disponible.
- Bilingüe nativo (EN/ES) usando la infra `i18n/utils.ts` existente.
- Inventario en vivo desde Shopify Storefront API en cada submission.

---

## 3. El quiz

### 3.1 Mapeo de respuestas a filtros de Shopify

**Pregunta 1 — ¿Para quién?**

| Chip | Filtro |
|---|---|
| Mujer | `collection: mujer` |
| Hombre | `collection: hombre` |
| Niño/a | `collection: ninos` |
| No estoy seguro | sin filtro |

> Las colecciones se usan en lugar del metafield `shopify.target-gender` porque son más confiables (todos los productos están ya organizados en estas colecciones; el metafield puede estar vacío en productos legacy).

**Pregunta 2 — ¿Qué tipo de joya?**

| Chip | Filtro |
|---|---|
| Anillo | `product_type:Anillo` |
| Collar | `product_type:Collar` |
| Arete | `product_type:Arete` |
| Pulsera | `product_type:Pulsera` |
| Sorpréndeme | sin filtro |

> **Verificación previa a implementación:** ejecutar una query única para enumerar los valores distintos de `productType` en el catálogo. Los nombres pueden ser plurales ("Anillos") o usar variantes ("Cadena" en lugar de "Collar"). El mapeo definitivo se ajusta tras esta verificación y vive en `src/components/react/jewelFinder/config.ts`.

**Pregunta 3 — ¿Cuál es tu presupuesto?**

| Chip | Filtro de precio (USD) |
|---|---|
| Hasta $50 | `0–50` |
| $50 – $100 | `50–100` |
| $100 – $200 | `100–200` |
| $200 – $500 | `200–500` |
| Más de $500 | `500+` |

> Moneda asumida USD basado en `priceRange.minVariantPrice.currencyCode` del fragmento existente.

### 3.2 Opciones "comodín"

"No estoy seguro" y "Sorpréndeme" existen explícitamente para que ningún cliente quede bloqueado. Internamente se traducen a "omitir este filtro".

### 3.3 Navegación

- Tap en chip avanza automáticamente (sin botón "Siguiente").
- Botón "atrás" en esquina superior izquierda permite editar respuesta anterior conservando las posteriores.
- El estado del wizard vive en `useState` local en `JewelFinder.tsx`. No persiste entre sesiones (out of scope).

---

## 4. Algoritmo de filtro y fallback

### 4.1 Query principal

Una sola query a Shopify Storefront API combinando los filtros activos:

```graphql
products(
  query: "product_type:'Collar' AND variants.price:>=50 AND variants.price:<=100 AND tag:Mujer AND available_for_sale:true"
  first: 12
  sortKey: BEST_SELLING
)
```

Si el filtro de género se modela mejor como sub-query sobre colección, se usa:

```graphql
collection(handle: "mujer") {
  products(
    query: "product_type:Collar AND variants.price:>=50 AND variants.price:<=100 AND available_for_sale:true"
    first: 12
    sortKey: BEST_SELLING
  )
}
```

> La elección entre las dos formas se valida durante implementación con queries de prueba. Ambas son válidas; se elige la que produce resultados más limpios.

### 4.2 Lógica de fallback (3 casos)

**Caso 1 — `resultados >= 4`: Match perfecto.**

- Galería única titulada *"Tus joyas perfectas"* con hasta 8 productos.
- No se muestra sección de alternativas.

**Caso 2 — `1 ≤ resultados ≤ 3`: Match parcial.**

- Sección A *"Lo que buscaste"*: los 1–3 productos exactos.
- Sección B *"También te puede interesar"*: query secundaria que relaja el filtro **menos crítico**, en este orden:
  1. Si el tipo era específico → mismo tipo y género, presupuesto ampliado +50% sobre el máximo del rango original.
  2. Si el presupuesto era el rango más bajo y la ampliación previa no aplica → mismo tipo y género, rango inmediato superior.
- Total combinado: hasta 8 productos.

**Caso 3 — `resultados == 0`: Sin match exacto.**

- Banner honesto: *"No encontramos [collares de mujer entre $50–$100] en este momento."*
- Sección *"Te recomendamos"*: ejecuta DOS queries secundarias en paralelo y mezcla resultados, marcando visualmente qué criterio cambió en cada producto:
  1. **Mismo tipo + mismo género, presupuesto ampliado** (+50% sobre máximo) → etiqueta *"Un poco más"*.
  2. **Otros tipos + mismo género + mismo presupuesto** → etiqueta *"Otro tipo"*.
- Total combinado: hasta 8 productos.

### 4.3 Orden y filtros finales

- Excluir productos sin stock: `availableForSale: true` siempre como filtro.
- Orden: primero `BEST_SELLING` que devuelve Shopify, desempate por precio ascendente.
- Lógica pura, sin side effects → vive en `src/lib/jewelFinderLogic.ts` para testabilidad.

---

## 5. Pantalla de resultados

### 5.1 Layout

```
┌─────────────────────────────────────────────────────┐
│  Tu selección: Collar · Mujer · $50–$100   [Editar] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ✨ Tus joyas perfectas                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                       │
│  │ P1 │ │ P2 │ │ P3 │ │ P4 │   ...                 │
│  └────┘ └────┘ └────┘ └────┘                       │
│                                                     │
│  💡 También te puede interesar                      │
│     (solo si se activó fallback)                    │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                       │
│  │ A1 │ │ A2 │ │ A3 │ │ A4 │                       │
│  │"Un │ │"Un │ │"Otro│ │"Otro│                     │
│  │más"│ │más"│ │tipo"│ │tipo"│                     │
│  └────┘ └────┘ └────┘ └────┘                       │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ 📱  Recibir mi selección por WhatsApp        │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  [Empezar de nuevo]   [Ver toda la tienda]         │
└─────────────────────────────────────────────────────┘
```

### 5.2 Tarjeta de producto

Reutiliza el componente existente `ProductCard.tsx` para mantener consistencia visual con el resto del sitio. Hereda automáticamente:

- Tap → navega al PDP del producto.
- Botón corazón → toggle favorito vía `store/favorites.ts`.
- Botón "Agregar" → `AddToCart.tsx`.

### 5.3 Estados auxiliares

- **Loading:** 4 skeleton cards mientras la query principal corre.
- **Error de red:** mensaje *"Ups, hubo un error. ¿Intentas de nuevo?"* + botón retry.
- **Edit selection:** chip arriba abre de nuevo el wizard preservando respuestas previas; el cliente solo cambia las que quiera.

---

## 6. Integración WhatsApp

### 6.1 Comportamiento

- Botón sticky inferior en móvil, inline al final del listado en desktop.
- Genera un `https://wa.me/<numero-cliente>?text=...` con mensaje pre-llenado.
- Número se lee de la misma constante que ya usan `FloatingSupport.tsx` y `ProductWhatsAppSticky.tsx` (sin nueva configuración).
- Productos incluidos en el mensaje según el caso de fallback:
  - **Caso 1 (match exacto):** todos los productos de "Tus joyas perfectas" (máximo 8).
  - **Caso 2 (match parcial):** solo los 1–3 productos de "Lo que buscaste". Las alternativas no se incluyen.
  - **Caso 3 (sin match):** todos los productos de "Te recomendamos" (máximo 8), porque no existe match exacto y el cliente ya entendió que son sugerencias.

### 6.2 Plantilla de mensaje (ES)

```
Hola! Hice el quiz "Encuentra tu joya" y me interesan estas opciones:

• [Título producto 1] – $XX – [URL absoluta]
• [Título producto 2] – $XX – [URL absoluta]
• [Título producto 3] – $XX – [URL absoluta]
...

¿Me pueden dar más info?
```

### 6.3 Plantilla de mensaje (EN)

```
Hi! I just took the "Find Your Jewel" quiz and I'm interested in these options:

• [Product title 1] – $XX – [Absolute URL]
• [Product title 2] – $XX – [Absolute URL]
• [Product title 3] – $XX – [Absolute URL]
...

Can you give me more info?
```

---

## 7. Arquitectura técnica

### 7.1 Estructura de archivos

```
src/
├── components/react/jewelFinder/
│   ├── JewelFinder.tsx              ← Raíz; orquesta el wizard y resultados
│   ├── WelcomeStep.tsx              ← Pantalla de bienvenida
│   ├── QuestionStep.tsx             ← Pregunta genérica con chips (reutilizable)
│   ├── ResultsView.tsx              ← Resultados + fallback + acciones
│   ├── WhatsAppButton.tsx           ← Botón de envío
│   ├── ProgressBar.tsx              ← Barra 1/3, 2/3, 3/3
│   └── config.ts                    ← Chips, brackets de precio, mapeo a Shopify
│
├── components/react/JewelFinderTrigger.tsx  ← Botón + modal para home/store
│
├── lib/queries/
│   └── jewelFinder.ts               ← GraphQL queries (principal + fallback)
│
├── lib/
│   └── jewelFinderLogic.ts          ← Algoritmo de fallback (puro, testeable)
│
└── pages/
    ├── encuentra-tu-joya.astro      ← Página dedicada ES (en `pages/es/` según convención)
    └── find-your-jewel.astro        ← Versión EN
```

### 7.2 Puntos de entrada

1. **Página dedicada:** renderiza `<JewelFinder client:load mode="page" />` dentro del `Layout.astro` existente. SEO completo (meta tags + schema.org).
2. **Modal:** `JewelFinderTrigger.tsx` (botón + modal) se monta en:
   - `Hero.astro` del home — CTA secundario debajo del principal.
   - `StoreGrid.tsx` — badge "¿No sabes qué elegir?" arriba del grid.
   - El modal contiene `<JewelFinder mode="modal" />`. Mismo componente, prop distinto para padding y cierre.

### 7.3 Estado y data

- **Estado del wizard:** `useState` local en `JewelFinder.tsx`. No `nanostores` ni persistencia entre sesiones.
- **Cliente Shopify:** `storefrontLive.ts` existente.
- **Queries:** solo se disparan al terminar pregunta 3, no antes.
- **Caching:** ninguno por ahora — cada submission es una query fresca.

### 7.4 Bilingüe

- Strings en archivos por idioma siguiendo el patrón de `i18n/utils.ts`.
- Convención de rutas EN se confirma durante implementación leyendo `i18n/utils.ts`. Default ES.

---

## 8. Out of scope

Lo siguiente se descarta explícitamente para esta primera versión:

- Analítica / eventos GA4 del quiz.
- A/B testing de copy o flujo.
- Persistencia de respuestas entre sesiones (localStorage).
- Captura de email / teléfono con backend.
- Cupón de bienvenida (descartado al elegir "solo WhatsApp" sin backend).
- Filtro por ocasión (descartado por no estar en la taxonomía actual de Shopify).
- Recomendación con ML / personalización por historial.

Cualquiera de estos puntos puede sumarse en una fase posterior sin reescribir el núcleo.

---

## 9. Decisiones clave y razonamiento

| Decisión | Razón |
|---|---|
| 3 preguntas, no más | Directiva explícita del cliente: "muy básico y corto" |
| Chips en lugar de inputs | Cero teclado en móvil; conversión más alta |
| Colecciones para género (no metafield) | Más confiable: todos los productos ya están organizados |
| Sin "ocasión" | No existe como taxonomía en Shopify hoy; agregarla obligaría a etiquetado manual continuo |
| Galería curada (no carrusel ni 1 producto) | Más opciones aumentan probabilidad de match emocional |
| Fallback siempre visible | El cliente nunca termina con pantalla vacía |
| WhatsApp con `wa.me` link | Stack actual no tiene backend; el patrón ya existe en el sitio |
| Página + modal (mismo componente) | Página da SEO + URL compartible; modal evita perder contexto |
| Sin persistencia entre sesiones | Quiz es desechable; persistir agrega complejidad sin valor claro |
