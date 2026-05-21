# Snap Finance Integration — Design Spec

- **Date:** 2026-05-21
- **Status:** Approved (pending user review of written spec)
- **Owner:** Nicolas Cardenas
- **Project:** Dtalles Jewelry (Astro + React + Shopify)

---

## 1. Context and motivation

Dtalles Jewelry already offers Affirm as a financing option (dynamic widget on product page, icon in payment methods row). Affirm targets customers with established or prime credit. A significant segment of jewelry buyers does not qualify for Affirm — either because they lack credit history or have subprime credit. Snap Finance provides lease-to-own financing for this exact segment, with no traditional credit check required.

**Goal:** Add Snap Finance as a complementary financing option to Affirm — never as a replacement — across the customer journey, to increase conversion from buyers who currently bounce when they don't qualify for Affirm.

**Affiliate URL provided by user:**
```
https://bk.snapfinance.com/origination?paramId=3w/EWVFzVGcQioSdKn1vuqdr2hNr3A1xiMt4CtG+qOWrqzmK36kLz62lEkK1hZ0tog9ZSjNG2GyQln5HQrzShOzYiaK/nFnEZXfXtyBXVEw=
```

**Banner assets (hosted by Snap):**
- ES: `https://assets.snapfinance.com/app/images/es_apply_image_06.jpeg`
- EN: `https://assets.snapfinance.com/app/images/en_apply_image_06.jpeg` (assumed pattern — same image ID, locale prefix swap)

Snap's CDN has anti-hotlink protection (returns 403 to direct GET without valid Referer). Verified during design — images will load correctly when served from production domain. A fallback strategy is included for robustness.

---

## 2. Scope

### In scope

- Reusable Astro component `SnapFinanceBanner.astro` with three visual variants
- i18n strings in EN/ES under `snap.*` namespace
- 4 placement points: product page, cart drawer, dedicated `/financing` page, footer
- New page `/financing` (and `/es/financing`) with Affirm vs Snap comparison + FAQ
- Snap logo added to `PaymentIcons` row in footer
- Environment-variable configuration for `paramId`, origination URL, and minimum cart amount
- Affiliate link semantics (`rel="noopener noreferrer sponsored"`, `target="_blank"`)
- Tracking attribute `data-snap-source="<location>"` on every Snap link

### Out of scope (YAGNI)

- React component with state (banner is static — Astro only)
- Carousel/rotating Snap banners
- Snap installment calculator (Snap exposes no public API for this)
- Country-based auto-detection (Snap is US-only; site already operates US-only)
- Analytics integration beyond the `data-snap-source` attribute
- A/B testing of Snap placements

---

## 3. Architecture

### 3.1 Component

**File:** `src/components/SnapFinanceBanner.astro`

Static Astro component (no hydration, no client JS). Props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `"compact" \| "card" \| "hero"` | `"compact"` | Visual variant |
| `lang` | `"en" \| "es"` | derived from `Astro.currentLocale` | Banner image locale |
| `source` | `string` | required | Tracking source, e.g. `"product"`, `"cart"`, `"financing"` |
| `class` | `string` | `""` | Extra Tailwind classes |

**Output structure:**

```html
<a
  href="{ORIGINATION_URL}?paramId={PARAM_ID}"
  target="_blank"
  rel="noopener noreferrer sponsored"
  aria-label="{aria-label from i18n}"
  data-snap-source="{source}"
  class="snap-card snap-card--{variant}"
>
  <img
    src="{CDN}/{lang}_apply_image_06.jpeg"
    alt="{alt from i18n}"
    width="..." height="..."
    loading="lazy"
    onerror="this.onerror=null; this.src='{CDN}/es_apply_image_06.jpeg'; this.dataset.fallback='es';"
  />
  <!-- Optional copy block for compact variant -->
</a>
```

**Fallback chain:**
1. Primary image: `{lang}_apply_image_06.jpeg`
2. On error: fallback to `es_apply_image_06.jpeg` (known to work)
3. If image element fails completely (CSS rendered no-image), the `<a>` still works as a styled text button (CSS background includes a logo SVG from `/public/images/snap/snap-logo.svg`)

### 3.2 Variants

**`compact`** — used on product page and cart drawer
- Horizontal card, ~64px tall on product, ~40px tall on drawer
- Logo image on left (40px), copy + CTA on right
- Background `bg-white/5`, border `border-white/10`, rounded `rounded-lg`
- Hover: subtle brightness lift, arrow translates 2px right

**`card`** — used on `/financing` comparison columns
- Vertical card, full banner image visible
- Background `bg-white/5`, padding `p-6`
- Title + bullet list above the banner

**`hero`** — reserved for future promotional use (e.g., homepage banner). Not used in initial rollout but defined for completeness.

### 3.3 Environment variables

Added to `.env` (and `.env.example` for documentation):

```
PUBLIC_SNAP_PARAM_ID=3w/EWVFzVGcQioSdKn1vuqdr2hNr3A1xiMt4CtG+qOWrqzmK36kLz62lEkK1hZ0tog9ZSjNG2GyQln5HQrzShOzYiaK/nFnEZXfXtyBXVEw=
PUBLIC_SNAP_ORIGINATION_URL=https://bk.snapfinance.com/origination
PUBLIC_SNAP_MIN_AMOUNT=150
PUBLIC_SNAP_BANNER_CDN=https://assets.snapfinance.com/app/images
```

The `paramId` contains base64 characters (`+ / =`). Astro reads `import.meta.env.PUBLIC_*` as raw strings — no escaping needed. The `<a href>` is constructed via template literal, which preserves these characters; the browser will URL-encode them on navigation if required by Snap's endpoint.

---

## 4. Placements

### 4.1 Product page

**File:** `src/components/react/product/ProductInfo.tsx`

The product page is a React component. Since `SnapFinanceBanner.astro` is Astro-only, we need a React-compatible wrapper. Two options:

- **Option A (chosen):** Create `src/components/react/SnapFinanceBanner.tsx` mirroring the Astro component. It's a static `<a><img></a>` — duplication is trivial (~30 LOC) and avoids forcing Astro hydration in a React tree.
- Option B: Convert `SnapFinanceBanner` to a React component used by both Astro pages (via `client:load`) and React trees. Rejected because it adds unnecessary JS payload to static pages.

**Insertion point:** immediately below the existing `<AffirmPromotionalMessage>` at line ~129, above the Add to Cart button.

**Visual:**
```
$249.00
[Affirm: "as low as $23/mo"]
┌─────────────────────────────────────────────────┐
│ [logo]  Don't qualify with Affirm?              │
│         Apply with Snap Finance — no credit →   │
└─────────────────────────────────────────────────┘
[Add to Cart]
```

Copy explicitly references Affirm to position Snap as complementary, reducing confusion.

### 4.2 `/financing` dedicated page

**Files:**
- `src/pages/financing.astro` (EN)
- `src/pages/es/financing.astro` (ES)

**Sections:**

1. **Hero:** title `snap.financing.title`, subtitle `snap.financing.subtitle`
2. **Comparison table** — two cards side by side:
   - **Affirm card:** Affirm logo, bullets: "Best for established credit", "Soft credit check", "Pay over time", CTA "Available at checkout"
   - **Snap card:** Snap logo, bullets: "All credit types", "No credit history needed", "Lease-to-own", CTA = `SnapFinanceBanner` (variant `card`)
3. **FAQ** — 4 questions:
   - "What's the difference between Affirm and Snap?"
   - "Will applying affect my credit?"
   - "What happens if I'm not approved?"
   - "Can I pay off Snap early?"

   FAQ answers will be drafted from public Snap docs and reviewed by user before going live. Includes disclaimer: "Subject to Snap Finance's current terms and conditions. See snapfinance.com for full details."

**Linked from:** footer link, FAQ page cross-reference, optional "Learn more about financing" link below product page banner.

### 4.3 Cart drawer

**File:** `src/components/react/CartDrawer.tsx`

A React wrapper around `SnapFinanceBanner.tsx`. Inserted between subtotal row and Checkout button.

**Conditional rendering:** only shown when `subtotal >= PUBLIC_SNAP_MIN_AMOUNT` (default $150). If below, no banner. This avoids offering financing where it doesn't apply.

**Visual:**
```
Subtotal:                    $498.00
─────────────────────────────────────
[ 💳 No credit? Apply with Snap → ]
─────────────────────────────────────
[          Checkout              ]
```

Slimmest variant — `text-xs`, ~40px tall.

### 4.4 Footer

**Files:**
- `src/components/react/Footer.tsx` — add link "Financing Options" to useful-links column
- `src/components/react/PaymentIcons.tsx` — append Snap icon after Affirm

**Snap icon implementation:** `react-pay-icons` library does not include Snap. Solution: add `public/images/snap/snap-logo.svg` (vector logo from Snap's brand assets) and render it inside the existing `CardWrapper` in `PaymentIcons.tsx`. Non-clickable, consistent with other payment icons.

**Footer link:** added to existing "Help / Info" column. Localized:
- EN: "Financing Options" → `/financing`
- ES: "Opciones de Financiamiento" → `/es/financing`

---

## 5. i18n

Strings added to `src/i18n/ui.ts` under `snap.*` namespace:

| Key | EN | ES |
|---|---|---|
| `snap.product.heading` | Don't qualify with Affirm? | ¿No calificas con Affirm? |
| `snap.product.cta` | Apply with Snap Finance — no credit needed → | Aplica con Snap Finance — sin crédito → |
| `snap.cart.short` | No credit? Apply with Snap → | ¿Sin crédito? Aplica con Snap → |
| `snap.footer.link` | Financing Options | Opciones de Financiamiento |
| `snap.financing.title` | Financing Options | Opciones de Financiamiento |
| `snap.financing.subtitle` | Two ways to make your jewelry yours | Dos formas de llevarte tu joya |
| `snap.financing.affirm_title` | Affirm | Affirm |
| `snap.financing.snap_title` | Snap Finance | Snap Finance |
| `snap.financing.affirm_best_for` | Best for established credit | Ideal con crédito establecido |
| `snap.financing.snap_best_for` | All credit types — no credit needed | Todos los créditos — sin crédito requerido |
| `snap.financing.faq_title` | Frequently Asked Questions | Preguntas Frecuentes |
| `snap.aria.banner` | Apply with Snap Finance (opens in new tab) | Aplica con Snap Finance (abre en pestaña nueva) |
| `snap.img.alt` | Snap Finance - Apply Here | Snap Finance - Aplica Aquí |
| `snap.disclaimer` | Subject to approval. Lease-to-own terms apply. | Sujeto a aprobación. Aplican términos de arrendamiento. |

---

## 6. Accessibility

- `<img alt>` populated from i18n (`snap.img.alt`)
- `<a aria-label>` from `snap.aria.banner`
- `rel="noopener noreferrer sponsored"` — `sponsored` correctly tags this as an affiliate link for SEO
- Card hover state has 3:1 minimum contrast ratio against background (verified against site's existing dark theme)
- Focus state: visible `outline-2 outline-white/40 outline-offset-2`
- All images have explicit `width` and `height` to prevent CLS

---

## 7. Tracking

No new analytics dependencies added. Every Snap link includes `data-snap-source="<location>"` with values: `product`, `cart`, `financing`, `footer`. If/when an analytics layer is added later, segmenting Snap clicks by placement is a one-line selector. Outbound-link analytics tools (GA4, Plausible) that auto-track external clicks by hostname will see all Snap clicks under `bk.snapfinance.com` automatically.

---

## 8. Testing checklist

Manual verification before merge:

- [ ] Banner renders on product page (EN and ES routes)
- [ ] Banner renders in cart drawer when subtotal ≥ $150
- [ ] Banner does NOT render in cart drawer when subtotal < $150
- [ ] `/financing` and `/es/financing` render with hero, comparison, FAQ
- [ ] Footer shows "Financing Options" link (localized)
- [ ] Footer payment icons row includes Snap logo
- [ ] Clicking any banner opens `bk.snapfinance.com` in new tab with correct `paramId`
- [ ] Image fallback works: simulate failed EN load → ES loads
- [ ] Lighthouse: no CLS regression from new images
- [ ] Build succeeds: `npm run build`
- [ ] No new console errors in browser

---

## 9. Files affected

**New files:**
- `src/components/SnapFinanceBanner.astro`
- `src/components/react/SnapFinanceBanner.tsx`
- `src/pages/financing.astro`
- `src/pages/es/financing.astro`
- `public/images/snap/snap-logo.svg`
- `docs/superpowers/specs/2026-05-21-snap-finance-integration-design.md` (this file)

**Modified files:**
- `src/components/react/product/ProductInfo.tsx` (add banner below Affirm widget)
- `src/components/react/CartDrawer.tsx` (add conditional banner before checkout)
- `src/components/react/Footer.tsx` (add financing link)
- `src/components/react/PaymentIcons.tsx` (add Snap icon)
- `src/i18n/ui.ts` (add `snap.*` keys for EN and ES)
- `.env` and `.env.example` (add 4 new vars)

---

## 10. Open items (resolved before implementation)

- [ ] User confirms `en_apply_image_06.jpeg` exists when first viewed in production (the fallback to ES covers this if not)
- [ ] User confirms actual Snap minimum amount (default $150 used if not provided)
- [ ] User provides or approves draft FAQ answers for `/financing` page
- [ ] User provides Snap brand SVG, or we use a clean text-only "Snap" logo as fallback
