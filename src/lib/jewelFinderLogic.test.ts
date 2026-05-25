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
