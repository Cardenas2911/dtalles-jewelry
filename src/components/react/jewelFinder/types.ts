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
