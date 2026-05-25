import type { BudgetBracket, JewelryType, Recipient, PriceRange } from './types';

export const RECIPIENT_TO_COLLECTION: Record<Recipient, string | null> = {
  women: 'mujer',
  men: 'hombre',
  kids: 'ninos',
  unsure: null,
};

// Una opción de UI puede cubrir varios productTypes del catálogo Shopify.
// Array vacío = sin filtro de tipo.
export const JEWELRY_TYPE_TO_PRODUCT_TYPES: Record<JewelryType, string[]> = {
  ring: ['Anillo'],
  necklace: ['Collar', 'Collar con Dije', 'Cadena'],
  earring: ['Aretes'],
  bracelet: ['Pulsera'],
  any: [],
};

export const BUDGET_RANGES: Record<BudgetBracket, PriceRange> = {
  under_500: { min: 0, max: 500 },
  '500_1000': { min: 500, max: 1000 },
  '1000_2000': { min: 1000, max: 2000 },
  over_2000: { min: 2000, max: null },
};

export const PRICE_RELAX_MULTIPLIER = 1.5;

export const MAX_PRIMARY_RESULTS = 8;
export const MAX_ALTERNATIVE_RESULTS = 8;

export const PARTIAL_MATCH_THRESHOLD = 4;

export const WHATSAPP_NUMBER = '17867644952';

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
  { value: 'under_500', i18nKey: 'finder.budget.under_500' },
  { value: '500_1000', i18nKey: 'finder.budget.500_1000' },
  { value: '1000_2000', i18nKey: 'finder.budget.1000_2000' },
  { value: 'over_2000', i18nKey: 'finder.budget.over_2000' },
];
