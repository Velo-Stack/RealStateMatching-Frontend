/**
 * Utility functions for number formatting with thousand separators
 */

/**
 * Format a number with thousand separators (commas)
 * @param {string|number} value - The value to format
 * @returns {string} - Formatted number with commas
 */
export const formatNumberWithCommas = (value) => {
    if (!value) return "";

    // Remove all non-digit characters
    const digitsOnly = String(value).replace(/\D/g, "");

    if (!digitsOnly) return "";

    // Add thousand separators
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Remove commas from a formatted number string
 * @param {string} value - The formatted number string
 * @returns {string} - Number string without commas
 */
export const removeCommas = (value) => {
    if (!value) return "";
    return String(value).replace(/,/g, "");
};

/**
 * Parse a formatted number string to a number
 * @param {string} value - The formatted number string
 * @returns {number|null} - Parsed number or null if invalid
 */
export const parseFormattedNumber = (value) => {
    if (!value) return null;
    const digitsOnly = removeCommas(value);
    const parsed = parseInt(digitsOnly, 10);
    return isNaN(parsed) ? null : parsed;
};
