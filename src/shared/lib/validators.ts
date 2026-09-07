/**
 * Validator pure functions for form inputs.
 * All functions are side-effect-free and return { isValid, message? }.
 */

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// ─── validatePositiveNumber ───────────────────────────────────────────────────

/**
 * Validates a numeric input for either ingredient price or quantity.
 *
 * Price rules  (type === 'price'):
 *   - Must be a finite number
 *   - Must be > 0
 *   - Must be ≤ 999_999_999
 *
 * Quantity rules (type === 'quantity'):
 *   - Must be a finite number
 *   - Must be ≥ 0.01
 *   - Must be ≤ 99_999.99
 */
export function validatePositiveNumber(
  value: unknown,
  type: "price" | "quantity"
): ValidationResult {
  const num = Number(value);

  if (value === null || value === undefined || value === "" || !isFinite(num) || isNaN(num)) {
    return {
      isValid: false,
      message:
        type === "price"
          ? "Harga harus berupa angka yang valid."
          : "Takaran harus berupa angka yang valid.",
    };
  }

  if (type === "price") {
    if (num <= 0) {
      return {
        isValid: false,
        message: "Harga harus berupa angka positif (lebih dari 0).",
      };
    }
    if (num > 999_999_999) {
      return {
        isValid: false,
        message: "Harga tidak boleh melebihi 999.999.999.",
      };
    }
    return { isValid: true };
  }

  // type === 'quantity'
  if (num < 0.01) {
    return {
      isValid: false,
      message: "Takaran minimal adalah 0,01.",
    };
  }
  if (num > 99_999.99) {
    return {
      isValid: false,
      message: "Takaran tidak boleh melebihi 99.999,99.",
    };
  }
  return { isValid: true };
}

// ─── validateMargin ───────────────────────────────────────────────────────────

/**
 * Validates a profit margin percentage.
 * Valid range: 0 < margin < 100 (exclusive on both ends).
 * Rejects non-numeric input, NaN, Infinity, ≤ 0, and ≥ 100.
 */
export function validateMargin(value: unknown): ValidationResult {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    typeof value === "boolean"
  ) {
    return {
      isValid: false,
      message: "Margin keuntungan harus berupa angka.",
    };
  }

  const num = Number(value);

  if (isNaN(num) || !isFinite(num)) {
    return {
      isValid: false,
      message: "Margin keuntungan harus berupa angka.",
    };
  }

  if (num <= 0 || num >= 100) {
    return {
      isValid: false,
      message: "Margin keuntungan harus bernilai lebih dari 0% dan kurang dari 100%.",
    };
  }

  return { isValid: true };
}

// ─── validateTargetPortions ───────────────────────────────────────────────────

/**
 * Validates a target portions input for the portion scale calculator.
 * Valid: positive integer in the range [1, 10_000].
 * Rejects strings, decimals, zero, negatives, NaN, Infinity, and > 10_000.
 */
export function validateTargetPortions(value: unknown): ValidationResult {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    typeof value === "boolean"
  ) {
    return {
      isValid: false,
      message: "Jumlah porsi target harus berupa bilangan bulat positif.",
    };
  }

  const num = Number(value);

  if (isNaN(num) || !isFinite(num)) {
    return {
      isValid: false,
      message: "Jumlah porsi target harus berupa angka.",
    };
  }

  if (!Number.isInteger(num)) {
    return {
      isValid: false,
      message: "Jumlah porsi target harus berupa bilangan bulat.",
    };
  }

  if (num < 1) {
    return {
      isValid: false,
      message: "Jumlah porsi target minimal adalah 1.",
    };
  }

  if (num > 10_000) {
    return {
      isValid: false,
      message: "Jumlah porsi target tidak boleh melebihi 10.000.",
    };
  }

  return { isValid: true };
}
