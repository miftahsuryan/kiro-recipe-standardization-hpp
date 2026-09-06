import type {
  RecipeIngredient,
  HPPResult,
  CostBreakdownItem,
  ProfitSimulation,
  ScaleResult,
  ScaledIngredient,
} from "../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Round a number to exactly 2 decimal places. */
const round2 = (x: number): number => Math.round(x * 100) / 100;

// ─── calculateHPP ─────────────────────────────────────────────────────────────

/**
 * Menghitung HPP per porsi dari daftar bahan resep.
 * HPP = Σ(quantity_i × pricePerUnit_i) / portions
 *
 * Aturan:
 * - `portions` harus > 0; jika tidak, kembalikan `isValid: false`.
 * - Bahan dengan `pricePerUnit = 0` tetap dihitung (biaya 0).
 * - Bahan `isActiveIngredient: false` tetap dihitung tapi dicatat di breakdown.
 */
export function calculateHPP(
  ingredients: RecipeIngredient[],
  portions: number
): HPPResult {
  if (portions <= 0) {
    return {
      hppPerPorsi: 0,
      totalBiaya: 0,
      breakdown: [],
      isValid: false,
    };
  }

  const breakdown: CostBreakdownItem[] = ingredients.map((ing) => ({
    ingredientName: ing.ingredientName,
    quantity: ing.quantity,
    unit: ing.unit,
    pricePerUnit: ing.pricePerUnit,
    totalCost: round2(ing.quantity * ing.pricePerUnit),
  }));

  const totalBiaya = round2(
    breakdown.reduce((sum, item) => sum + item.totalCost, 0)
  );

  const hppPerPorsi = round2(totalBiaya / portions);

  return {
    hppPerPorsi,
    totalBiaya,
    breakdown,
    isValid: true,
  };
}

// ─── calculateSellingPrice ────────────────────────────────────────────────────

/**
 * Menghitung harga jual rekomendasi berdasarkan HPP dan margin keuntungan.
 * Harga Jual = HPP / (1 - margin/100)
 * Syarat: 0 < margin < 100
 */
export function calculateSellingPrice(
  hppPerPorsi: number,
  marginPercentage: number
): ProfitSimulation {
  const hargaJual = round2(hppPerPorsi / (1 - marginPercentage / 100));
  const keuntunganPerPorsi = round2(hargaJual - hppPerPorsi);

  return {
    hppPerPorsi,
    marginPercentage,
    hargaJual,
    keuntunganPerPorsi,
  };
}

// ─── scaleRecipe ──────────────────────────────────────────────────────────────

/**
 * Menghitung skala takaran bahan untuk jumlah porsi target.
 * scaledQuantity = round((origQty / origPortions) × targetPortions, 2)
 */
export function scaleRecipe(
  ingredients: RecipeIngredient[],
  originalPortions: number,
  targetPortions: number
): ScaleResult {
  const scaledIngredients: ScaledIngredient[] = ingredients.map((ing) => {
    const scaledQuantity = round2(
      (ing.quantity / originalPortions) * targetPortions
    );
    const scaledCost = round2(scaledQuantity * ing.pricePerUnit);

    return {
      ingredientName: ing.ingredientName,
      originalQuantity: ing.quantity,
      scaledQuantity,
      unit: ing.unit,
      scaledCost,
    };
  });

  const totalScaledCost = round2(
    scaledIngredients.reduce((sum, ing) => sum + ing.scaledCost, 0)
  );

  return {
    targetPortions,
    scaledIngredients,
    totalScaledCost,
  };
}

// ─── formatCurrency ───────────────────────────────────────────────────────────

/**
 * Memformat nilai numerik menjadi string Rupiah dengan format Indonesia.
 * Contoh: formatCurrency(1500.5) → "Rp 1.500,50"
 *
 * Format: titik sebagai pemisah ribuan, koma sebagai desimal, 2 angka desimal.
 */
export function formatCurrency(value: number): string {
  // Format with Indonesian locale: dot thousands, comma decimal
  const formatted = value.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rp ${formatted}`;
}
