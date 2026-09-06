import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import {
  calculateHPP,
  calculateSellingPrice,
  scaleRecipe,
  formatCurrency,
} from "../calculations";
import type { RecipeIngredient, MeasurementUnit } from "../../types";

// ─── Arbitraries ──────────────────────────────────────────────────────────────

const measurementUnits: MeasurementUnit[] = [
  "g", "kg", "ml", "l", "sdt", "sdm", "buah", "butir", "lembar",
];

const arbitraryUnit = (): fc.Arbitrary<MeasurementUnit> =>
  fc.constantFrom(...measurementUnits);

/** Generates a valid RecipeIngredient */
const arbitraryRecipeIngredient = (): fc.Arbitrary<RecipeIngredient> =>
  fc.record({
    ingredientId: fc.uuid(),
    ingredientName: fc.string({ minLength: 1, maxLength: 50 }),
    quantity: fc.double({ min: 0.01, max: 99999.99, noNaN: true }),
    unit: arbitraryUnit(),
    pricePerUnit: fc.double({ min: 0, max: 999999999, noNaN: true }),
    isActiveIngredient: fc.boolean(),
  });

// ─── calculateHPP ─────────────────────────────────────────────────────────────

describe("calculateHPP", () => {
  // Feature: recipe-standardization-hpp, Property 1: Kalkulasi HPP Komprehensif
  it("Property 1: hppPerPorsi = Σ(qty×price)/portions dan breakdown lengkap", () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryRecipeIngredient(), { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 1, max: 9999 }),
        (ingredients, portions) => {
          const result = calculateHPP(ingredients, portions);

          // isValid must be true for valid portions
          expect(result.isValid).toBe(true);

          // breakdown length matches ingredients list
          expect(result.breakdown).toHaveLength(ingredients.length);

          // Each breakdown item has all required fields
          result.breakdown.forEach((item, idx) => {
            expect(item.ingredientName).toBeDefined();
            expect(item.quantity).toBeDefined();
            expect(item.unit).toBeDefined();
            expect(item.pricePerUnit).toBeDefined();
            expect(item.totalCost).toBeDefined();
            // totalCost = quantity × pricePerUnit (rounded)
            const expectedCost =
              Math.round(ingredients[idx].quantity * ingredients[idx].pricePerUnit * 100) / 100;
            expect(item.totalCost).toBeCloseTo(expectedCost, 5);
          });

          // totalBiaya = Σ(quantity_i × pricePerUnit_i)
          const expectedTotal =
            Math.round(
              ingredients.reduce(
                (sum, ing) => sum + ing.quantity * ing.pricePerUnit,
                0
              ) * 100
            ) / 100;
          expect(result.totalBiaya).toBeCloseTo(expectedTotal, 1);

          // hppPerPorsi = totalBiaya / portions (rounded to 2 decimals)
          const expectedHPP =
            Math.round((result.totalBiaya / portions) * 100) / 100;
          expect(result.hppPerPorsi).toBeCloseTo(expectedHPP, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 1 (edge): isValid = false jika portions ≤ 0", () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryRecipeIngredient(), { minLength: 0, maxLength: 10 }),
        fc.oneof(
          fc.integer({ min: -9999, max: 0 }),
          fc.constant(0)
        ),
        (ingredients, portions) => {
          const result = calculateHPP(ingredients, portions);
          expect(result.isValid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── calculateSellingPrice ────────────────────────────────────────────────────

describe("calculateSellingPrice", () => {
  // Feature: recipe-standardization-hpp, Property 2: Kalkulasi Harga Jual dan Invariant Finansial
  it("Property 2: hargaJual = HPP/(1-margin/100) dan keuntungan = hargaJual - HPP", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 9999999, noNaN: true }),
        fc.double({ min: 0.01, max: 99.99, noNaN: true }),
        (hpp, margin) => {
          const result = calculateSellingPrice(hpp, margin);

          // hargaJual = round(HPP / (1 - margin/100), 2)
          const expectedHargaJual =
            Math.round((hpp / (1 - margin / 100)) * 100) / 100;
          expect(result.hargaJual).toBeCloseTo(expectedHargaJual, 5);

          // keuntunganPerPorsi = round(hargaJual - hppPerPorsi, 2)
          const expectedKeuntungan =
            Math.round((result.hargaJual - hpp) * 100) / 100;
          expect(result.keuntunganPerPorsi).toBeCloseTo(expectedKeuntungan, 5);

          // hargaJual must be >= hppPerPorsi when comparing rounded values
          // (rounding at 2 decimal places can make them equal for very small inputs)
          const roundedHpp = Math.round(hpp * 100) / 100;
          expect(result.hargaJual).toBeGreaterThanOrEqual(roundedHpp);

          // hppPerPorsi is echoed back
          expect(result.hppPerPorsi).toBe(hpp);

          // marginPercentage is echoed back
          expect(result.marginPercentage).toBe(margin);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── scaleRecipe ──────────────────────────────────────────────────────────────

describe("scaleRecipe", () => {
  // Feature: recipe-standardization-hpp, Property 3: Kalkulasi Skala Porsi Proporsional
  it("Property 3: scaledQuantity = round((qty/origPortions)×targetPortions, 2)", () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryRecipeIngredient(), { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 1, max: 9999 }),
        fc.integer({ min: 1, max: 10000 }),
        (ingredients, originalPortions, targetPortions) => {
          const result = scaleRecipe(ingredients, originalPortions, targetPortions);

          expect(result.targetPortions).toBe(targetPortions);
          expect(result.scaledIngredients).toHaveLength(ingredients.length);

          result.scaledIngredients.forEach((scaled, idx) => {
            const ing = ingredients[idx];
            const expectedQty =
              Math.round((ing.quantity / originalPortions) * targetPortions * 100) / 100;
            expect(scaled.scaledQuantity).toBeCloseTo(expectedQty, 5);

            // scaledCost = scaledQuantity × pricePerUnit (rounded)
            const expectedCost =
              Math.round(scaled.scaledQuantity * ing.pricePerUnit * 100) / 100;
            expect(scaled.scaledCost).toBeCloseTo(expectedCost, 5);

            expect(scaled.ingredientName).toBe(ing.ingredientName);
            expect(scaled.originalQuantity).toBe(ing.quantity);
            expect(scaled.unit).toBe(ing.unit);
          });

          // totalScaledCost = sum of all scaledCost values
          const expectedTotal =
            Math.round(
              result.scaledIngredients.reduce((sum, s) => sum + s.scaledCost, 0) * 100
            ) / 100;
          expect(result.totalScaledCost).toBeCloseTo(expectedTotal, 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 3 (identity): targetPortions === originalPortions → quantities match rounded original", () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryRecipeIngredient(), { minLength: 1, maxLength: 20 }),
        fc.integer({ min: 1, max: 9999 }),
        (ingredients, portions) => {
          const result = scaleRecipe(ingredients, portions, portions);

          result.scaledIngredients.forEach((scaled, idx) => {
            // scaleRecipe rounds results; when target === original, scaled equals
            // round((qty / portions) × portions, 2) which may differ from raw qty
            // by at most the rounding error. We verify using the same formula.
            const expectedQty =
              Math.round((ingredients[idx].quantity / portions) * portions * 100) / 100;
            expect(scaled.scaledQuantity).toBeCloseTo(expectedQty, 5);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── formatCurrency ───────────────────────────────────────────────────────────

describe("formatCurrency", () => {
  // Feature: recipe-standardization-hpp, Property 18: Format Mata Uang Rupiah Konsisten
  it("Property 18: selalu diawali 'Rp', menggunakan koma desimal, titik ribuan, 2 desimal", () => {
    fc.assert(
      fc.property(
        fc.double({ min: -9999999999, max: 9999999999, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const result = formatCurrency(value);

          // Must start with "Rp"
          expect(result.startsWith("Rp")).toBe(true);

          // Must have exactly 2 digits after the comma (decimal separator)
          const commaIndex = result.lastIndexOf(",");
          expect(commaIndex).toBeGreaterThan(-1);
          const decimalPart = result.slice(commaIndex + 1);
          expect(decimalPart).toMatch(/^\d{2}$/);

          // Uses comma as decimal separator (no dot after last comma)
          const afterRp = result.slice(3); // remove "Rp "
          expect(afterRp).toContain(",");
        }
      ),
      { numRuns: 100 }
    );
  });

  it("formatCurrency — contoh konkret format angka Indonesia", () => {
    expect(formatCurrency(1000)).toBe("Rp 1.000,00");
    expect(formatCurrency(1500.5)).toBe("Rp 1.500,50");
    expect(formatCurrency(0)).toBe("Rp 0,00");
    expect(formatCurrency(1000000)).toBe("Rp 1.000.000,00");
    expect(formatCurrency(1234567.89)).toBe("Rp 1.234.567,89");
  });
});
