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
    const plan: FallbackStep[] = hasSpecificType ? ['price_relaxed'] : [];
    return { case: 2, runFallback: plan.length > 0, fallbackPlan: plan };
  }

  const plan: FallbackStep[] = [];
  if (hasSpecificType) {
    plan.push('price_relaxed');
    plan.push('type_relaxed');
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
