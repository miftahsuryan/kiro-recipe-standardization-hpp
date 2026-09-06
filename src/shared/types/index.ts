// ─── Enums & Constants ────────────────────────────────────────────────────

export type RecipeCategory =
  | "appetizer"
  | "main_course"
  | "dessert"
  | "beverage"
  | "other";

export type MeasurementUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "sdt"
  | "sdm"
  | "buah"
  | "butir"
  | "lembar";

export type RecipeStatus = "draft" | "published";

// ─── Core Models ─────────────────────────────────────────────────────────

export interface Ingredient {
  id: string;
  name: string;
  unit: MeasurementUnit;
  pricePerUnit: number;     // Harga per satuan (Rp), 0 jika belum diisi
  lastUpdated: string;      // ISO 8601
  isActive: boolean;        // false jika dihapus dari manajemen bahan
}

export interface RecipeIngredient {
  ingredientId: string;
  ingredientName: string;      // snapshot nama saat resep disimpan
  quantity: number;            // 0.01 – 99999.99
  unit: MeasurementUnit;
  pricePerUnit: number;        // snapshot harga saat resep disimpan
  isActiveIngredient: boolean; // false jika bahan induk dihapus
}

export interface CookingStep {
  order: number;      // 1-based, berurutan
  instruction: string;
}

export interface Recipe {
  id: string;
  name: string;                  // max 150 karakter
  category: RecipeCategory;
  portions: number;              // 1 – 9999
  description: string;          // max 500 karakter
  status: RecipeStatus;
  ingredients: RecipeIngredient[];
  steps: CookingStep[];
  currentVersionNumber: number;
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
  updatedBy: string;             // nama pengguna
}

// ─── HPP & Kalkulasi ──────────────────────────────────────────────────────

export interface CostBreakdownItem {
  ingredientName: string;
  quantity: number;
  unit: MeasurementUnit;
  pricePerUnit: number;
  totalCost: number;  // quantity × pricePerUnit
}

export interface HPPResult {
  hppPerPorsi: number;              // totalBiaya / portions, 2 desimal
  totalBiaya: number;               // Σ (quantity × pricePerUnit)
  breakdown: CostBreakdownItem[];
  isValid: boolean;                 // false jika portions ≤ 0
}

// ─── Simulasi Harga Jual ──────────────────────────────────────────────────

export interface ProfitSimulation {
  hppPerPorsi: number;
  marginPercentage: number;       // 0 < margin < 100
  hargaJual: number;              // HPP / (1 - margin/100), 2 desimal
  keuntunganPerPorsi: number;     // hargaJual - hppPerPorsi
}

// ─── Skala Porsi ──────────────────────────────────────────────────────────

export interface ScaledIngredient {
  ingredientName: string;
  originalQuantity: number;
  scaledQuantity: number;  // (originalQty / originalPortions) × targetPortions, 2 desimal
  unit: MeasurementUnit;
  scaledCost: number;
}

export interface ScaleResult {
  targetPortions: number;
  scaledIngredients: ScaledIngredient[];
  totalScaledCost: number;
}

// ─── Versi Resep ─────────────────────────────────────────────────────────

export interface RecipeVersion {
  versionId: string;
  recipeId: string;
  versionNumber: number;
  snapshot: Recipe;  // salinan penuh resep pada saat versi dibuat
  savedAt: string;   // ISO 8601
  savedBy: string;
}

// ─── List / Summary ───────────────────────────────────────────────────────

export interface RecipeSummary {
  id: string;
  name: string;
  category: RecipeCategory;
  portions: number;
  hppPerPorsi: number;
  updatedAt: string;
  hasRecentPriceUpdate: boolean; // true jika ada bahan diperbarui ≤ 7 hari
}

// ─── Filter & Sort ────────────────────────────────────────────────────────

export type RecipeSortField = "name" | "hppPerPorsi" | "updatedAt";
export type SortDirection = "asc" | "desc";

export interface RecipeListFilter {
  searchQuery: string;
  category: RecipeCategory | null;
  sortField: RecipeSortField;
  sortDirection: SortDirection;
  page: number;
  pageSize: 20;
}
