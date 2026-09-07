import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { validatePositiveNumber } from "../validators";

// ─── validatePositiveNumber ───────────────────────────────────────────────────

describe("validatePositiveNumber", () => {
  // Feature: recipe-standardization-hpp, Property 5: Validasi Input Numerik Positif

  // ── price: invalid values ──────────────────────────────────────────────────

  it("Property 5 (price): nilai ≤ 0 selalu menghasilkan isValid: false", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ max: 0, noNaN: true, noDefaultInfinity: true }),
          fc.constant(0),
          fc.constant(-0)
        ),
        (value) => {
          const result = validatePositiveNumber(value, "price");
          expect(result.isValid).toBe(false);
          expect(result.message).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 5 (price): nilai > 999.999.999 selalu menghasilkan isValid: false", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 1_000_000_000, max: Number.MAX_SAFE_INTEGER, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const result = validatePositiveNumber(value, "price");
          expect(result.isValid).toBe(false);
          expect(result.message).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 5 (price): NaN, Infinity, null, undefined, string non-numerik selalu isValid: false", () => {
    // Note: booleans are excluded — Number(true) = 1 (valid price) and Number(false) = 0 (rejected
    // by the ≤ 0 rule, not the non-numeric rule). The validator deliberately coerces numeric strings.
    const invalidInputs = [NaN, Infinity, -Infinity, null, undefined, "", "abc", "1e999"];
    for (const input of invalidInputs) {
      const result = validatePositiveNumber(input, "price");
      expect(result.isValid).toBe(false);
      expect(result.message).toBeDefined();
    }
  });

  // ── price: valid values ────────────────────────────────────────────────────

  it("Property 5 (price): nilai dalam rentang (0, 999.999.999] selalu menghasilkan isValid: true", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 999_999_999, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          // Exclude exact 0 edge (covered by invalid test above)
          fc.pre(value > 0);
          const result = validatePositiveNumber(value, "price");
          expect(result.isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── quantity: invalid values ───────────────────────────────────────────────

  it("Property 5 (quantity): nilai < 0,01 selalu menghasilkan isValid: false", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ max: 0.009, noNaN: true, noDefaultInfinity: true }),
          fc.constant(0),
          fc.constant(-1)
        ),
        (value) => {
          const result = validatePositiveNumber(value, "quantity");
          expect(result.isValid).toBe(false);
          expect(result.message).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 5 (quantity): nilai > 99.999,99 selalu menghasilkan isValid: false", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 100_000, max: Number.MAX_SAFE_INTEGER, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const result = validatePositiveNumber(value, "quantity");
          expect(result.isValid).toBe(false);
          expect(result.message).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it("Property 5 (quantity): NaN, Infinity, null, undefined, string non-numerik selalu isValid: false", () => {
    // Note: booleans are excluded — Number(true) = 1 (valid quantity), Number(false) = 0 (rejected
    // by the < 0.01 rule). The validator deliberately coerces numeric strings.
    const invalidInputs = [NaN, Infinity, -Infinity, null, undefined, "", "abc"];
    for (const input of invalidInputs) {
      const result = validatePositiveNumber(input, "quantity");
      expect(result.isValid).toBe(false);
      expect(result.message).toBeDefined();
    }
  });

  // ── quantity: valid values ─────────────────────────────────────────────────

  it("Property 5 (quantity): nilai dalam rentang [0,01; 99.999,99] selalu menghasilkan isValid: true", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.01, max: 99_999.99, noNaN: true, noDefaultInfinity: true }),
        (value) => {
          const result = validatePositiveNumber(value, "quantity");
          expect(result.isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // ── boundary values ────────────────────────────────────────────────────────

  it("boundary: harga batas bawah valid (0,01) dan batas atas valid (999.999.999)", () => {
    expect(validatePositiveNumber(0.01, "price").isValid).toBe(true);
    expect(validatePositiveNumber(999_999_999, "price").isValid).toBe(true);
    expect(validatePositiveNumber(0, "price").isValid).toBe(false);
    expect(validatePositiveNumber(1_000_000_000, "price").isValid).toBe(false);
  });

  it("boundary: takaran batas bawah valid (0,01) dan batas atas valid (99.999,99)", () => {
    expect(validatePositiveNumber(0.01, "quantity").isValid).toBe(true);
    expect(validatePositiveNumber(99_999.99, "quantity").isValid).toBe(true);
    expect(validatePositiveNumber(0.009, "quantity").isValid).toBe(false);
    expect(validatePositiveNumber(100_000, "quantity").isValid).toBe(false);
  });
});
