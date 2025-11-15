/**
 * Common regex patterns for validation
 */

/**
 * Password regex pattern
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 * - Minimum 8 characters
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

/**
 * Email regex pattern (basic validation)
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number regex pattern (Vietnam format)
 * Accepts: 0xxx xxx xxx or +84 xxx xxx xxx
 */
export const PHONE_REGEX = /^(\+84|0)[0-9]{9}$/;

/**
 * Username regex pattern
 * - Alphanumeric characters
 * - Underscores and hyphens allowed
 * - 3-20 characters
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

/**
 * URL regex pattern (basic validation)
 */
export const URL_REGEX = /^https?:\/\/.+/;

/**
 * Slug regex pattern
 * - Lowercase letters, numbers, and hyphens only
 */
export const SLUG_REGEX = /^[a-z0-9-]+$/;
