# Snap Finance Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Snap Finance as a complementary lease-to-own financing option alongside the existing Affirm integration, across product page, cart drawer, dedicated `/financing` page, and footer.

**Architecture:** Static Astro component `SnapFinanceBanner.astro` for `.astro` pages + parallel React component `SnapFinanceBanner.tsx` for React trees (product info, cart drawer, footer). Both render the same `<a><img></a>` markup. Reads config from `PUBLIC_SNAP_*` env vars. CDN-hosted Snap banner images with `onError` fallback to ES image. Image fails-soft to text-only CSS button as last resort.

**Tech Stack:** Astro 4, React 18, TypeScript, Tailwind CSS, existing i18n utilities in `src/i18n/ui.ts`.

**Spec reference:** [docs/superpowers/specs/2026-05-21-snap-finance-integration-design.md](../specs/2026-05-21-snap-finance-integration-design.md)

**Testing approach:** This project has no automated test suite. Each task ends with `npm run build` (or `npm run dev` for visual verification) and a manual checklist item. The final task runs the full Testing Checklist from the spec.

---

## Task 1: Configure environment variables

**Files:**
- Create: `.env.example`
- Modify: `.env` (local; do not commit if gitignored)

- [ ] **Step 1: Check if `.env.example` exists**

Run: `Test-Path .env.example`
If `True`, read the file and append the new vars instead of overwriting.

- [ ] **Step 2: Create or extend `.env.example`**

Add these lines (preserve existing content if file exists):

```
# Snap Finance (affiliate financing partner)
PUBLIC_SNAP_PARAM_ID=YOUR_SNAP_PARAM_ID_HERE
PUBLIC_SNAP_ORIGINATION_URL=https://bk.snapfinance.com/origination
PUBLIC_SNAP_MIN_AMOUNT=150
PUBLIC_SNAP_BANNER_CDN=https://assets.snapfinance.com/app/images
```

- [ ] **Step 3: Set real values in local `.env`**

Add to `.env`:

```
PUBLIC_SNAP_PARAM_ID=3w/EWVFzVGcQioSdKn1vuqdr2hNr3A1xiMt4CtG+qOWrqzmK36kLz62lEkK1hZ0tog9ZSjNG2GyQln5HQrzShOzYiaK/nFnEZXfXtyBXVEw=
PUBLIC_SNAP_ORIGINATION_URL=https://bk.snapfinance.com/origination
PUBLIC_SNAP_MIN_AMOUNT=150
PUBLIC_SNAP_BANNER_CDN=https://assets.snapfinance.com/app/images
```

- [ ] **Step 4: Verify Astro reads env vars**

Run: `npm run build 2>&1 | Select-String -Pattern "PUBLIC_SNAP" -SimpleMatch`

Expected: build completes without errors (no output is fine — env vars only fail at runtime if missing where referenced).

- [ ] **Step 5: Commit**

```powershell
git add .env.example
git commit -m "chore(snap): add Snap Finance env var template"
```

(Do not commit `.env` — it is gitignored.)

---

## Task 2: Add i18n strings for Snap

**Files:**
- Modify: `src/i18n/ui.ts`

- [ ] **Step 1: Add Spanish (`es`) keys**

Find the closing `}` of the `es:` object in `src/i18n/ui.ts` (search for the last `'footer.affirmLink': 'Divulgaciones de Affirm',` line — Snap keys go after it).

Insert before the closing `}` of `es:`:

```typescript
    // Snap Finance
    'snap.product.heading': '¿No calificas con Affirm?',
    'snap.product.cta': 'Aplica con Snap Finance — sin crédito →',
    'snap.cart.short': '¿Sin crédito? Aplica con Snap →',
    'snap.footer.link': 'Opciones de Financiamiento',
    'snap.financing.title': 'Opciones de Financiamiento',
    'snap.financing.subtitle': 'Dos formas de llevarte tu joya',
    'snap.financing.affirm_title': 'Affirm',
    'snap.financing.snap_title': 'Snap Finance',
    'snap.financing.affirm_best_for': 'Ideal con crédito establecido',
    'snap.financing.snap_best_for': 'Todos los créditos — sin crédito requerido',
    'snap.financing.affirm_check': 'Consulta blanda de crédito',
    'snap.financing.snap_check': 'Sin verificación tradicional de crédito',
    'snap.financing.affirm_type': 'Paga a plazos',
    'snap.financing.snap_type': 'Arrendamiento con opción a compra',
    'snap.financing.affirm_cta': 'Disponible al pagar',
    'snap.financing.snap_cta': 'Aplica ahora',
    'snap.financing.faq_title': 'Preguntas Frecuentes',
    'snap.financing.faq_q1': '¿Cuál es la diferencia entre Affirm y Snap?',
    'snap.financing.faq_a1': 'Affirm ofrece pagos a plazos sujetos a una consulta blanda de crédito y está orientado a clientes con historial crediticio establecido. Snap Finance ofrece arrendamiento con opción a compra (lease-to-own), no requiere verificación tradicional de crédito y está disponible para todo tipo de perfiles crediticios.',
    'snap.financing.faq_q2': '¿Aplicar afectará mi crédito?',
    'snap.financing.faq_a2': 'Snap Finance utiliza criterios alternativos a la consulta tradicional de crédito al evaluar tu solicitud. Consulta los términos vigentes de Snap Finance para más detalles.',
    'snap.financing.faq_q3': '¿Qué pasa si no me aprueban?',
    'snap.financing.faq_a3': 'Si no calificas con una opción, puedes intentar con la otra o pagar con cualquiera de nuestros métodos tradicionales (tarjeta, PayPal, Apple Pay).',
    'snap.financing.faq_q4': '¿Puedo cancelar el contrato de Snap antes de tiempo?',
    'snap.financing.faq_a4': 'Snap Finance suele ofrecer una opción de pago anticipado dentro de los primeros 100 días con descuento. Consulta los términos completos de tu contrato Snap.',
    'snap.aria.banner': 'Aplica con Snap Finance (abre en pestaña nueva)',
    'snap.img.alt': 'Snap Finance - Aplica Aquí',
    'snap.disclaimer': 'Sujeto a aprobación. Aplican términos de arrendamiento con opción a compra.',
```

- [ ] **Step 2: Add English (`en`) keys**

Find the closing `}` of the `en:` object (mirror of step 1, but on the EN side — search for `'footer.affirmLink': 'Affirm Disclosures',` or the equivalent EN entry).

Insert before the closing `}` of `en:`:

```typescript
    // Snap Finance
    'snap.product.heading': "Don't qualify with Affirm?",
    'snap.product.cta': 'Apply with Snap Finance — no credit needed →',
    'snap.cart.short': 'No credit? Apply with Snap →',
    'snap.footer.link': 'Financing Options',
    'snap.financing.title': 'Financing Options',
    'snap.financing.subtitle': 'Two ways to make your jewelry yours',
    'snap.financing.affirm_title': 'Affirm',
    'snap.financing.snap_title': 'Snap Finance',
    'snap.financing.affirm_best_for': 'Best for established credit',
    'snap.financing.snap_best_for': 'All credit types — no credit needed',
    'snap.financing.affirm_check': 'Soft credit check',
    'snap.financing.snap_check': 'No traditional credit check',
    'snap.financing.affirm_type': 'Pay over time',
    'snap.financing.snap_type': 'Lease-to-own',
    'snap.financing.affirm_cta': 'Available at checkout',
    'snap.financing.snap_cta': 'Apply now',
    'snap.financing.faq_title': 'Frequently Asked Questions',
    'snap.financing.faq_q1': "What's the difference between Affirm and Snap?",
    'snap.financing.faq_a1': 'Affirm offers installment payments with a soft credit check and is best for customers with established credit history. Snap Finance offers lease-to-own financing, requires no traditional credit check, and is available to all credit profiles.',
    'snap.financing.faq_q2': 'Will applying affect my credit?',
    'snap.financing.faq_a2': 'Snap Finance uses alternative criteria rather than a traditional credit pull when evaluating your application. See current Snap Finance terms for details.',
    'snap.financing.faq_q3': "What happens if I'm not approved?",
    'snap.financing.faq_a3': "If you don't qualify with one option, you can try the other or pay with any of our standard methods (card, PayPal, Apple Pay).",
    'snap.financing.faq_q4': 'Can I pay off Snap early?',
    'snap.financing.faq_a4': 'Snap Finance typically offers an early-purchase option within the first 100 days at a discount. See your Snap contract for full terms.',
    'snap.aria.banner': 'Apply with Snap Finance (opens in new tab)',
    'snap.img.alt': 'Snap Finance - Apply Here',
    'snap.disclaimer': 'Subject to approval. Lease-to-own terms apply.',
```

- [ ] **Step 3: Verify build still passes**

Run: `npm run build`
Expected: build succeeds. If TypeScript complains about types in `ui` object, check the `Translations` type in `src/i18n/utils.ts` — it may be inferred from `ui.es`, in which case adding keys to both objects keeps inference correct.

- [ ] **Step 4: Commit**

```powershell
git add src/i18n/ui.ts
git commit -m "i18n(snap): add Snap Finance translation strings (en, es)"
```

---

## Task 3: Add `/financiamiento` ↔ `/financing` route mapping

**Files:**
- Modify: `src/utils/paths.ts`

- [ ] **Step 1: Add entry to `esToEnMap`**

In `src/utils/paths.ts`, find the `esToEnMap` object (around line 16-37). Add this entry before the closing `}`:

```typescript
    '/financiamiento': '/financing',
```

Final state of that block should include the new line alongside `/contacto`, `/faq`, etc.

- [ ] **Step 2: Verify the reverse map auto-includes it**

The `enToEsMap` is generated via `Object.fromEntries(...)` from `esToEnMap`, so no change needed there.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```powershell
git add src/utils/paths.ts
git commit -m "feat(snap): register /financing route mapping for i18n"
```

---

## Task 4: Add Snap logo SVG to public assets

**Files:**
- Create: `public/images/snap/snap-logo.svg`

- [ ] **Step 1: Create directory**

Run: `New-Item -ItemType Directory -Path public\images\snap -Force | Out-Null`

- [ ] **Step 2: Create the SVG**

Save the following to `public/images/snap/snap-logo.svg`. This is a clean text-only logo that works as a fallback when banner images fail and as the payment icon in the footer row.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" role="img" aria-label="Snap Finance">
  <rect width="120" height="32" rx="4" fill="#0078D7"/>
  <text x="60" y="22" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" font-weight="700" fill="#FFFFFF" letter-spacing="0.5">snap</text>
</svg>
```

Note: This is a placeholder mark. When the user obtains the official Snap SVG from the affiliate portal, this file is replaced — no code changes required.

- [ ] **Step 3: Verify file is reachable in dev**

Run: `npm run dev` in a background terminal, then visit `http://localhost:4321/images/snap/snap-logo.svg` in browser.
Expected: SVG renders.

Stop dev server.

- [ ] **Step 4: Commit**

```powershell
git add public/images/snap/snap-logo.svg
git commit -m "feat(snap): add Snap Finance logo placeholder SVG"
```

---

## Task 5: Create the React Snap banner component

**Files:**
- Create: `src/components/react/SnapFinanceBanner.tsx`

This is the canonical component (used in ProductInfo, CartDrawer, Footer, and the Astro wrapper imports the same logic).

- [ ] **Step 1: Create the component file**

Create `src/components/react/SnapFinanceBanner.tsx` with this exact content:

```tsx
import React from 'react';
import { getTranslationFunctionForLang } from '../../i18n/utils';
import { resolvePath } from '../../utils/paths';

type Variant = 'compact' | 'card' | 'hero';

interface SnapFinanceBannerProps {
    variant?: Variant;
    lang?: 'en' | 'es';
    source: 'product' | 'cart' | 'financing' | 'footer';
    className?: string;
}

const env = import.meta.env;
const PARAM_ID: string = env.PUBLIC_SNAP_PARAM_ID ?? '';
const ORIGINATION_URL: string = env.PUBLIC_SNAP_ORIGINATION_URL ?? 'https://bk.snapfinance.com/origination';
const BANNER_CDN: string = env.PUBLIC_SNAP_BANNER_CDN ?? 'https://assets.snapfinance.com/app/images';

const buildHref = () =>
    PARAM_ID ? `${ORIGINATION_URL}?paramId=${PARAM_ID}` : ORIGINATION_URL;

const buildImgSrc = (lang: 'en' | 'es') => `${BANNER_CDN}/${lang}_apply_image_06.jpeg`;
const ES_FALLBACK_SRC = `${BANNER_CDN}/es_apply_image_06.jpeg`;

export default function SnapFinanceBanner({
    variant = 'compact',
    lang = 'en',
    source,
    className = ''
}: SnapFinanceBannerProps) {
    const t = getTranslationFunctionForLang(lang);
    const logoSrc = resolvePath('/images/snap/snap-logo.svg');

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.dataset.fallback !== 'es') {
            img.dataset.fallback = 'es';
            img.src = ES_FALLBACK_SRC;
        } else {
            // Both EN and ES failed — hide the img, the styled link still works
            img.style.display = 'none';
        }
    };

    const commonAnchorProps = {
        href: buildHref(),
        target: '_blank',
        rel: 'noopener noreferrer sponsored',
        'aria-label': t('snap.aria.banner'),
        'data-snap-source': source,
    } as const;

    if (variant === 'compact') {
        return (
            <a
                {...commonAnchorProps}
                className={`group flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 no-underline ${className}`}
            >
                <img
                    src={logoSrc}
                    alt=""
                    aria-hidden="true"
                    width={48}
                    height={20}
                    className="h-5 w-auto shrink-0"
                />
                <span className="flex flex-col leading-tight">
                    <span className="text-[11px] uppercase tracking-wider text-white/50">
                        {t('snap.product.heading')}
                    </span>
                    <span className="text-sm font-medium text-white/90 group-hover:text-[#d4af37] transition-colors">
                        {t('snap.product.cta')}
                    </span>
                </span>
            </a>
        );
    }

    if (variant === 'card') {
        return (
            <a
                {...commonAnchorProps}
                className={`group block p-6 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 no-underline ${className}`}
            >
                <img
                    src={buildImgSrc(lang)}
                    onError={handleImgError}
                    alt={t('snap.img.alt')}
                    loading="lazy"
                    width={300}
                    height={250}
                    className="w-full h-auto rounded shadow-[4px_2px_6px_#010101]"
                />
                <span className="block mt-4 text-sm text-[#d4af37] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    {t('snap.financing.snap_cta')} →
                </span>
            </a>
        );
    }

    // hero variant (reserved for future use, e.g., homepage banner)
    return (
        <a
            {...commonAnchorProps}
            className={`group block ${className}`}
        >
            <img
                src={buildImgSrc(lang)}
                onError={handleImgError}
                alt={t('snap.img.alt')}
                loading="lazy"
                width={728}
                height={90}
                className="w-full h-auto rounded shadow-[4px_2px_6px_#010101]"
            />
        </a>
    );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build`
Expected: build succeeds, no TS errors referring to `SnapFinanceBanner.tsx`.

- [ ] **Step 3: Commit**

```powershell
git add src/components/react/SnapFinanceBanner.tsx
git commit -m "feat(snap): add SnapFinanceBanner React component"
```

---

## Task 6: Create the Astro wrapper for Snap banner

**Files:**
- Create: `src/components/SnapFinanceBanner.astro`

Used by Astro pages (specifically the `/financing` pages in Task 9). Renders the same markup as the React component but without hydration.

- [ ] **Step 1: Create the component**

Create `src/components/SnapFinanceBanner.astro` with this content:

```astro
---
import { ui } from '../i18n/ui';
import { resolvePath } from '../utils/paths';

interface Props {
    variant?: 'compact' | 'card' | 'hero';
    lang?: 'en' | 'es';
    source: 'product' | 'cart' | 'financing' | 'footer';
    class?: string;
}

const { variant = 'card', lang = 'en', source, class: className = '' } = Astro.props;

const t = (key: string): string => {
    const dict = (ui as Record<string, Record<string, string>>)[lang] ?? ui.en;
    return dict[key] ?? key;
};

const PARAM_ID = import.meta.env.PUBLIC_SNAP_PARAM_ID ?? '';
const ORIGINATION_URL = import.meta.env.PUBLIC_SNAP_ORIGINATION_URL ?? 'https://bk.snapfinance.com/origination';
const BANNER_CDN = import.meta.env.PUBLIC_SNAP_BANNER_CDN ?? 'https://assets.snapfinance.com/app/images';

const href = PARAM_ID ? `${ORIGINATION_URL}?paramId=${PARAM_ID}` : ORIGINATION_URL;
const imgSrc = `${BANNER_CDN}/${lang}_apply_image_06.jpeg`;
const esFallback = `${BANNER_CDN}/es_apply_image_06.jpeg`;
const logoSrc = resolvePath('/images/snap/snap-logo.svg');
---

{variant === 'card' && (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={t('snap.aria.banner')}
        data-snap-source={source}
        class:list={['group block p-6 rounded-lg bg-white/5 border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 no-underline', className]}
    >
        <img
            src={imgSrc}
            alt={t('snap.img.alt')}
            loading="lazy"
            width="300"
            height="250"
            class="w-full h-auto rounded shadow-[4px_2px_6px_#010101]"
            onerror={`this.onerror=null; if(this.dataset.fb!=='es'){this.dataset.fb='es'; this.src='${esFallback}';} else { this.style.display='none'; }`}
        />
        <span class="block mt-4 text-sm text-[#d4af37] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            {t('snap.financing.snap_cta')} →
        </span>
    </a>
)}

{variant === 'compact' && (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={t('snap.aria.banner')}
        data-snap-source={source}
        class:list={['group flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 no-underline', className]}
    >
        <img src={logoSrc} alt="" aria-hidden="true" width="48" height="20" class="h-5 w-auto shrink-0" />
        <span class="flex flex-col leading-tight">
            <span class="text-[11px] uppercase tracking-wider text-white/50">{t('snap.product.heading')}</span>
            <span class="text-sm font-medium text-white/90 group-hover:text-[#d4af37] transition-colors">{t('snap.product.cta')}</span>
        </span>
    </a>
)}

{variant === 'hero' && (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        aria-label={t('snap.aria.banner')}
        data-snap-source={source}
        class:list={['group block', className]}
    >
        <img
            src={imgSrc}
            alt={t('snap.img.alt')}
            loading="lazy"
            width="728"
            height="90"
            class="w-full h-auto rounded shadow-[4px_2px_6px_#010101]"
            onerror={`this.onerror=null; if(this.dataset.fb!=='es'){this.dataset.fb='es'; this.src='${esFallback}';} else { this.style.display='none'; }`}
        />
    </a>
)}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```powershell
git add src/components/SnapFinanceBanner.astro
git commit -m "feat(snap): add SnapFinanceBanner Astro wrapper"
```

---

## Task 7: Insert Snap banner on product page

**Files:**
- Modify: `src/components/react/product/ProductInfo.tsx`

- [ ] **Step 1: Add the import**

At top of `src/components/react/product/ProductInfo.tsx`, find the line:

```typescript
import AffirmPromotionalMessage from '../AffirmPromotionalMessage';
```

Add immediately below:

```typescript
import SnapFinanceBanner from '../SnapFinanceBanner';
```

- [ ] **Step 2: Render banner below Affirm widget**

Find line ~129 with `<AffirmPromotionalMessage price={price} pageType="product" className="mb-0 mt-1" />`.

Replace that line with:

```tsx
                        <AffirmPromotionalMessage price={price} pageType="product" className="mb-0 mt-1" />
                        <SnapFinanceBanner variant="compact" lang={lang} source="product" className="mt-2" />
```

(`lang` is already a prop of ProductInfo — verify by reading the function signature near top of file.)

- [ ] **Step 3: Build and visual check**

Run: `npm run build`
Expected: build succeeds.

Then: `npm run dev`, open any product page (e.g., `http://localhost:4321/product/<any-handle>`), and verify the Snap card appears below the Affirm widget and above the Add to Cart button. Open in `/es/producto/<handle>` and verify Spanish strings render.

Stop dev server.

- [ ] **Step 4: Commit**

```powershell
git add src/components/react/product/ProductInfo.tsx
git commit -m "feat(snap): add Snap Finance banner to product page"
```

---

## Task 8: Insert Snap banner in cart drawer (conditional on min amount)

**Files:**
- Modify: `src/components/react/CartDrawer.tsx`

- [ ] **Step 1: Add import**

At top of `src/components/react/CartDrawer.tsx`, find existing `AffirmPromotionalMessage` import. Add below it:

```typescript
import SnapFinanceBanner from './SnapFinanceBanner';
```

- [ ] **Step 2: Add min-amount constant**

Below all imports in `CartDrawer.tsx`, add:

```typescript
const SNAP_MIN_AMOUNT = Number(import.meta.env.PUBLIC_SNAP_MIN_AMOUNT ?? 150);
```

- [ ] **Step 3: Find `lang` source in CartDrawer**

Open `CartDrawer.tsx` and check how `t = getTranslationFunctionForLang(...)` is called — locate which variable holds the current `lang` (likely a prop, hook, or a derived value). The Snap banner needs the same value.

If `lang` is a prop, use it directly. If derived inline via something like `const lang = ...`, use that. Reference it as `<lang-variable-name>` in the next step.

- [ ] **Step 4: Render banner before Checkout button**

Find around line 199-201 of `CartDrawer.tsx`:

```tsx
                        <div className="flex justify-center w-full">
                            <AffirmPromotionalMessage price={total} pageType="cart" className="mb-2 !mt-0 text-center" />
                        </div>
```

Replace with:

```tsx
                        <div className="flex justify-center w-full">
                            <AffirmPromotionalMessage price={total} pageType="cart" className="mb-2 !mt-0 text-center" />
                        </div>

                        {subtotal >= SNAP_MIN_AMOUNT && (
                            <SnapFinanceBanner variant="compact" lang={lang} source="cart" className="!p-2 text-xs" />
                        )}
```

(If `lang` variable is named differently in this file, substitute the correct name. The `lang` reference must match step 3 above.)

- [ ] **Step 5: Build and visual check**

Run: `npm run build`
Expected: build succeeds.

Then: `npm run dev`, add a product worth ≥ $150 to cart, open the drawer, verify Snap mini-card appears between subtotal and Checkout. Remove items so cart < $150 (use a cheap product) — verify the banner disappears.

Stop dev server.

- [ ] **Step 6: Commit**

```powershell
git add src/components/react/CartDrawer.tsx
git commit -m "feat(snap): add Snap Finance banner to cart drawer (gated by min amount)"
```

---

## Task 9: Create `/financing` page (English)

**Files:**
- Create: `src/pages/financing.astro`

- [ ] **Step 1: Identify the layout pattern**

Read one existing simple page like `src/pages/shipping.astro` or `src/pages/warranty.astro` to learn the Layout/SEO/Breadcrumb pattern used in this codebase.

Run: `Get-Content src\pages\shipping.astro | Select-Object -First 30`

- [ ] **Step 2: Create the financing page**

Create `src/pages/financing.astro` with this content (adjust the Layout/SEO imports if step 1 reveals a slightly different pattern in this repo — use the same imports as `shipping.astro`):

```astro
---
import Layout from '../layouts/Layout.astro';
import SnapFinanceBanner from '../components/SnapFinanceBanner.astro';
import { ui } from '../i18n/ui';

const lang = 'en' as const;
const t = (key: string): string => (ui as Record<string, Record<string, string>>)[lang][key] ?? key;

const title = t('snap.financing.title');
const description = t('snap.financing.subtitle');
---

<Layout title={title} description={description} lang={lang}>
    <main class="bg-[#050505] text-[#FAFAF5] min-h-screen pt-32 pb-24">
        <div class="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">

            <!-- Hero -->
            <header class="text-center mb-16">
                <span class="text-[#d4af37] text-xs uppercase tracking-[0.3em] mb-4 block">Dtalles Jewelry</span>
                <h1 class="font-serif text-4xl md:text-6xl text-white mb-6">{title}</h1>
                <p class="text-gray-400 font-light text-lg max-w-2xl mx-auto">{description}</p>
            </header>

            <!-- Comparison -->
            <section class="grid md:grid-cols-2 gap-8 mb-20">
                <!-- Affirm -->
                <div class="p-8 rounded-lg bg-white/5 border border-white/10">
                    <h2 class="font-serif text-2xl text-[#d4af37] mb-6">{t('snap.financing.affirm_title')}</h2>
                    <ul class="space-y-3 text-gray-300 text-sm mb-8">
                        <li>✓ {t('snap.financing.affirm_best_for')}</li>
                        <li>✓ {t('snap.financing.affirm_check')}</li>
                        <li>✓ {t('snap.financing.affirm_type')}</li>
                    </ul>
                    <p class="text-white/50 text-xs uppercase tracking-widest">{t('snap.financing.affirm_cta')}</p>
                </div>

                <!-- Snap -->
                <div class="p-8 rounded-lg bg-white/5 border border-white/10 flex flex-col">
                    <h2 class="font-serif text-2xl text-[#d4af37] mb-6">{t('snap.financing.snap_title')}</h2>
                    <ul class="space-y-3 text-gray-300 text-sm mb-8">
                        <li>✓ {t('snap.financing.snap_best_for')}</li>
                        <li>✓ {t('snap.financing.snap_check')}</li>
                        <li>✓ {t('snap.financing.snap_type')}</li>
                    </ul>
                    <div class="mt-auto">
                        <SnapFinanceBanner variant="card" lang={lang} source="financing" />
                    </div>
                </div>
            </section>

            <!-- FAQ -->
            <section id="faq" class="max-w-3xl mx-auto">
                <h2 class="font-serif text-3xl text-white text-center mb-10">{t('snap.financing.faq_title')}</h2>
                <div class="space-y-6">
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q1')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a1')}</p>
                    </details>
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q2')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a2')}</p>
                    </details>
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q3')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a3')}</p>
                    </details>
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q4')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a4')}</p>
                    </details>
                </div>
                <p class="text-xs text-white/40 text-center mt-10">{t('snap.disclaimer')}</p>
            </section>
        </div>
    </main>
</Layout>
```

- [ ] **Step 3: Build and visual check**

Run: `npm run build`
Expected: build succeeds, `/financing/index.html` is generated.

Then: `npm run dev`, visit `http://localhost:4321/financing`. Verify hero, two-column comparison, FAQ accordion (clicking each `<summary>` opens/closes), and Snap banner card in the Snap column.

Stop dev server.

- [ ] **Step 4: Commit**

```powershell
git add src/pages/financing.astro
git commit -m "feat(snap): add /financing comparison page (en)"
```

---

## Task 10: Create `/es/financiamiento` page (Spanish)

**Files:**
- Create: `src/pages/es/financiamiento.astro`

- [ ] **Step 1: Create the Spanish page**

Create `src/pages/es/financiamiento.astro`. It mirrors Task 9's page exactly, but with `lang = 'es'`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import SnapFinanceBanner from '../../components/SnapFinanceBanner.astro';
import { ui } from '../../i18n/ui';

const lang = 'es' as const;
const t = (key: string): string => (ui as Record<string, Record<string, string>>)[lang][key] ?? key;

const title = t('snap.financing.title');
const description = t('snap.financing.subtitle');
---

<Layout title={title} description={description} lang={lang}>
    <main class="bg-[#050505] text-[#FAFAF5] min-h-screen pt-32 pb-24">
        <div class="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">

            <header class="text-center mb-16">
                <span class="text-[#d4af37] text-xs uppercase tracking-[0.3em] mb-4 block">Dtalles Jewelry</span>
                <h1 class="font-serif text-4xl md:text-6xl text-white mb-6">{title}</h1>
                <p class="text-gray-400 font-light text-lg max-w-2xl mx-auto">{description}</p>
            </header>

            <section class="grid md:grid-cols-2 gap-8 mb-20">
                <div class="p-8 rounded-lg bg-white/5 border border-white/10">
                    <h2 class="font-serif text-2xl text-[#d4af37] mb-6">{t('snap.financing.affirm_title')}</h2>
                    <ul class="space-y-3 text-gray-300 text-sm mb-8">
                        <li>✓ {t('snap.financing.affirm_best_for')}</li>
                        <li>✓ {t('snap.financing.affirm_check')}</li>
                        <li>✓ {t('snap.financing.affirm_type')}</li>
                    </ul>
                    <p class="text-white/50 text-xs uppercase tracking-widest">{t('snap.financing.affirm_cta')}</p>
                </div>

                <div class="p-8 rounded-lg bg-white/5 border border-white/10 flex flex-col">
                    <h2 class="font-serif text-2xl text-[#d4af37] mb-6">{t('snap.financing.snap_title')}</h2>
                    <ul class="space-y-3 text-gray-300 text-sm mb-8">
                        <li>✓ {t('snap.financing.snap_best_for')}</li>
                        <li>✓ {t('snap.financing.snap_check')}</li>
                        <li>✓ {t('snap.financing.snap_type')}</li>
                    </ul>
                    <div class="mt-auto">
                        <SnapFinanceBanner variant="card" lang={lang} source="financing" />
                    </div>
                </div>
            </section>

            <section id="faq" class="max-w-3xl mx-auto">
                <h2 class="font-serif text-3xl text-white text-center mb-10">{t('snap.financing.faq_title')}</h2>
                <div class="space-y-6">
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q1')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a1')}</p>
                    </details>
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q2')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a2')}</p>
                    </details>
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q3')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a3')}</p>
                    </details>
                    <details class="group border-b border-white/10 pb-4">
                        <summary class="cursor-pointer text-[#d4af37] font-medium text-base flex justify-between items-center">
                            <span>{t('snap.financing.faq_q4')}</span>
                            <span class="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <p class="text-gray-300 text-sm mt-3 leading-relaxed">{t('snap.financing.faq_a4')}</p>
                    </details>
                </div>
                <p class="text-xs text-white/40 text-center mt-10">{t('snap.disclaimer')}</p>
            </section>
        </div>
    </main>
</Layout>
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: `/es/financiamiento/index.html` is generated.

Then: `npm run dev`, visit `http://localhost:4321/es/financiamiento`. Verify Spanish strings throughout.

- [ ] **Step 3: Commit**

```powershell
git add src/pages/es/financiamiento.astro
git commit -m "feat(snap): add /es/financiamiento comparison page"
```

---

## Task 11: Add Snap link to footer

**Files:**
- Modify: `src/components/react/Footer.tsx`

- [ ] **Step 1: Insert link in the "Support" column**

In `src/components/react/Footer.tsx`, find the `<ul>` block for the support column (around line 155-163, containing `Track My Order`, `Shipping & Delivery`, etc.).

Right after the line:

```tsx
                            <FooterLink href={getRoute('/garantia', lang)} label={lang === 'en' ? 'Lifetime Warranty' : 'Garantía de Por Vida'} />
```

Insert this line:

```tsx
                            <FooterLink href={getRoute('/financiamiento', lang)} label={lang === 'en' ? 'Financing Options' : 'Opciones de Financiamiento'} highlight={true} />
```

(`highlight={true}` matches the styling of "Track My Order" — gives the link visual emphasis as a high-value action.)

- [ ] **Step 2: Build and visual check**

Run: `npm run build`
Expected: build succeeds.

Then: `npm run dev`, scroll to footer. Verify "Financing Options" link appears in the Support column under "Lifetime Warranty". Click it → should land on `/financing`. Switch to `/es/` route and verify it reads "Opciones de Financiamiento" and links to `/es/financiamiento`.

Stop dev server.

- [ ] **Step 3: Commit**

```powershell
git add src/components/react/Footer.tsx
git commit -m "feat(snap): add Financing Options link to footer"
```

---

## Task 12: Add Snap icon to PaymentIcons row

**Files:**
- Modify: `src/components/react/PaymentIcons.tsx`

- [ ] **Step 1: Update PaymentIcons to include Snap**

Open `src/components/react/PaymentIcons.tsx`. Find the `{/* Affirm */}` block near the end (around line 69-72):

```tsx
            {/* Affirm */}
            <CardWrapper>
                <Affirm {...commonIconProps} />
            </CardWrapper>
```

Right after that closing `</CardWrapper>`, add:

```tsx
            {/* Snap Finance */}
            <CardWrapper bg="bg-[#0078D7]">
                <img
                    src="/images/snap/snap-logo.svg"
                    alt="Snap Finance"
                    style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
                />
            </CardWrapper>
```

Note: We use the SVG directly (not `react-pay-icons`) because the library does not include Snap. The blue background matches the placeholder logo; when the real Snap logo replaces the SVG, also adjust `bg` if the new asset has its own background.

- [ ] **Step 2: Build and visual check**

Run: `npm run build`
Expected: build succeeds.

Then: `npm run dev`, scroll to footer (where PaymentIcons renders large) and open cart drawer (where PaymentIcons renders small). Verify the Snap card appears at the end of the row in both. Check that it lines up in height with the other icons.

Stop dev server.

- [ ] **Step 3: Commit**

```powershell
git add src/components/react/PaymentIcons.tsx
git commit -m "feat(snap): add Snap Finance to payment icons row"
```

---

## Task 13: Full Testing Checklist

This is the spec's testing checklist run end-to-end before declaring done.

- [ ] **Step 1: Final build**

Run: `npm run build`
Expected: build completes with no errors, no new warnings related to Snap files.

- [ ] **Step 2: Start dev server for visual QA**

Run: `npm run dev` (in background terminal)

- [ ] **Step 3: Verify product page banner (EN)**

Open `http://localhost:4321/product/<any-handle>`.
- [ ] Compact Snap card visible below Affirm widget, above Add to Cart.
- [ ] English copy ("Don't qualify with Affirm?" / "Apply with Snap Finance — no credit needed →").
- [ ] Click opens `https://bk.snapfinance.com/origination?paramId=...` in new tab.
- [ ] `paramId` in URL exactly matches `PUBLIC_SNAP_PARAM_ID` from `.env`.

- [ ] **Step 4: Verify product page banner (ES)**

Open `http://localhost:4321/es/producto/<any-handle>`.
- [ ] Spanish copy renders ("¿No calificas con Affirm?" / "Aplica con Snap Finance — sin crédito →").

- [ ] **Step 5: Verify cart drawer banner**

Add product worth ≥ $150 to cart. Open drawer.
- [ ] Compact Snap mini-card visible between subtotal area and Checkout button.
- [ ] Replace cart with product worth < $150 (or remove items until subtotal < $150). Reopen drawer.
- [ ] Snap banner does NOT render.

- [ ] **Step 6: Verify `/financing` page (EN)**

Open `http://localhost:4321/financing`.
- [ ] Hero, two-column comparison, FAQ accordion all render.
- [ ] Snap card on right column shows the JPG banner from Snap CDN (image loads — if 403, fallback to ES image kicks in).
- [ ] All FAQ `<summary>` toggles expand/collapse on click.

- [ ] **Step 7: Verify `/es/financiamiento` page (ES)**

Open `http://localhost:4321/es/financiamiento`. Repeat checks from step 6 in Spanish.

- [ ] **Step 8: Verify footer link**

Scroll to footer. Verify "Financing Options" appears in Support column. Click → lands on `/financing`. Switch site to ES via language switcher (or open `/es/`) → footer reads "Opciones de Financiamiento" → click lands on `/es/financiamiento`.

- [ ] **Step 9: Verify payment icons row**

Footer payment-icons row and cart drawer payment-icons row both show the blue Snap card at the end.

- [ ] **Step 10: Verify fallback image behavior**

In browser DevTools, open Network tab, find request to `en_apply_image_06.jpeg` (on `/financing`). Right-click → "Block request URL". Reload page. Verify the `onError` triggers and the image falls back to `es_apply_image_06.jpeg` (or to hidden state if ES also fails — the styled link remains usable).

- [ ] **Step 11: Lighthouse / CLS check (optional but recommended)**

In DevTools → Lighthouse → run Performance audit on `/financing`. Verify CLS score is unchanged or near 0. Snap images have explicit `width`/`height` so they shouldn't cause shift.

- [ ] **Step 12: Stop dev server**

- [ ] **Step 13: Final cleanup commit (if any tweaks were made during QA)**

If steps 3-11 surfaced any fixes:

```powershell
git add -A
git commit -m "fix(snap): address QA findings"
```

If no changes needed during QA, skip this commit.

- [ ] **Step 14: Mark plan complete**

The feature is ready for PR/merge.

---

## Self-Review Notes

**Spec coverage:**
- ✅ Component architecture (Astro + React parallel) → Tasks 5, 6
- ✅ Env vars → Task 1
- ✅ i18n EN/ES → Task 2
- ✅ Route mapping → Task 3
- ✅ Snap logo asset → Task 4
- ✅ Product page placement → Task 7
- ✅ Cart drawer (with $150 gate) → Task 8
- ✅ `/financing` EN + ES → Tasks 9, 10
- ✅ Footer link → Task 11
- ✅ Snap in PaymentIcons → Task 12
- ✅ Manual QA checklist → Task 13
- ✅ `rel="noopener noreferrer sponsored"`, accessibility attrs, `data-snap-source` → built into Task 5/6 components
- ✅ Fallback chain (EN → ES → hidden) → Task 5/6 components, verified Task 13 step 10

**Open items from spec:**
- "User confirms `en_apply_image_06.jpeg` exists" — verified at runtime via Task 13 step 10. If it doesn't exist, fallback handles it transparently. No plan changes needed.
- "User confirms Snap minimum amount" — env-configurable per Task 1; default $150 ships now, user can update without code change.
- "Draft FAQ answers" — drafted in Task 2 (`faq_a1`–`faq_a4`). User can review at any time and edit `src/i18n/ui.ts` directly.
- "Official Snap brand SVG" — placeholder shipped in Task 4. Drop-in replacement when user has the real SVG.

No placeholders found. Function and prop names consistent across tasks (`SnapFinanceBanner`, `variant`, `lang`, `source`).

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-21-snap-finance-integration.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
