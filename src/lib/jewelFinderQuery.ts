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

export function filterByProductTypes(products: FinderProduct[], allowedTypes: string[]): FinderProduct[] {
  if (allowedTypes.length === 0) return products;
  const set = new Set(allowedTypes);
  return products.filter((p) => set.has(p.productType));
}

export function filterByPriceRange(products: FinderProduct[], range: PriceRange): FinderProduct[] {
  return products.filter((p) => {
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    if (price < range.min) return false;
    if (range.max !== null && price > range.max) return false;
    return true;
  });
}

export function excludeProductTypes(products: FinderProduct[], excluded: string[]): FinderProduct[] {
  if (excluded.length === 0) return products;
  const set = new Set(excluded);
  return products.filter((p) => !set.has(p.productType));
}

async function fetchPrimaryPool(
  config: FetchConfig,
  collectionHandle: string | null,
  allowedTypes: string[],
  priceRange: PriceRange,
  lang: 'es' | 'en'
): Promise<FinderProduct[]> {
  if (collectionHandle) {
    const filters: Array<Record<string, unknown>> = [{ available: true }];
    filters.push({ price: { min: priceRange.min, max: priceRange.max ?? 999999 } });
    const raw = await runRawQuery(config, FINDER_QUERY_BY_COLLECTION, {
      collectionHandle,
      first: SERVER_FETCH_SIZE,
      filters,
    }, lang);
    return filterByProductTypes(raw, allowedTypes);
  }

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

export async function runJewelFinderQuery(answers: QuizAnswers, lang: 'es' | 'en'): Promise<QuizResult> {
  const config = getStorefrontConfig();
  if (!config) throw new Error('Shopify config missing');
  if (!answers.recipient || !answers.jewelryType || !answers.budget) {
    throw new Error('Quiz answers incomplete');
  }

  const collectionHandle = RECIPIENT_TO_COLLECTION[answers.recipient];
  const allowedTypes = JEWELRY_TYPE_TO_PRODUCT_TYPES[answers.jewelryType];
  const priceRange = BUDGET_RANGES[answers.budget];

  const primary = await fetchPrimaryPool(config, collectionHandle, allowedTypes, priceRange, lang);

  const strategy = decideFallbackStrategy(primary, answers);

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
