/**
 * Validation constants for guest names
 */
export const GUEST_NAME_VALIDATION = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 50,
  PATTERN: /^[a-zA-Z\s'-]+$/,
  PATTERN_DESCRIPTION: 'letters, spaces, hyphens, and apostrophes'
};

/**
 * Error messages for validation
 */
export const VALIDATION_ERRORS = {
  EMPTY: 'Guest name cannot be empty',
  TOO_SHORT: `Guest name must be at least ${GUEST_NAME_VALIDATION.MIN_LENGTH} characters`,
  TOO_LONG: `Guest name must be less than ${GUEST_NAME_VALIDATION.MAX_LENGTH} characters`,
  INVALID_CHARACTERS: `Guest name can only contain ${GUEST_NAME_VALIDATION.PATTERN_DESCRIPTION}`,
  DUPLICATE: 'This guest name already exists'
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  GUESTS: 'volutrack_guests'
};

/**
 * Application constants
 */
export const APP_CONSTANTS = {
  TITLE: 'Volutrack',
  SUBTITLE: 'Rosamond Elementary'
};
