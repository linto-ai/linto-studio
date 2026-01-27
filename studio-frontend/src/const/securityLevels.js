/**
 * Security level constants for the application.
 * These values represent the sensitivity levels of conversations and services.
 */

// Individual security levels
export const SECURITY_LEVEL_PUBLIC = 0 // Publicly available
export const SECURITY_LEVEL_COMMISSION = 1 // Commission use
export const SECURITY_LEVEL_SENSITIVE = 2 // Sensitive non-classified

// Array of all valid security levels (for iteration and validation)
export const SECURITY_LEVELS = [
  SECURITY_LEVEL_PUBLIC,
  SECURITY_LEVEL_COMMISSION,
  SECURITY_LEVEL_SENSITIVE,
]

// Security hierarchy mapping (higher value = more restrictive)
export const SECURITY_HIERARCHY = {
  [SECURITY_LEVEL_PUBLIC]: 1, // least restrictive
  [SECURITY_LEVEL_COMMISSION]: 2, // restrictive
  [SECURITY_LEVEL_SENSITIVE]: 3, // most restrictive
}

// Default security level
export const DEFAULT_SECURITY_LEVEL = SECURITY_LEVEL_PUBLIC

// Icon names for each security level
export const SECURITY_LEVEL_ICONS = {
  [SECURITY_LEVEL_PUBLIC]: "shield-slash",
  [SECURITY_LEVEL_COMMISSION]: "shield-warning",
  [SECURITY_LEVEL_SENSITIVE]: "shield-check",
}

export default {
  SECURITY_LEVEL_PUBLIC,
  SECURITY_LEVEL_COMMISSION,
  SECURITY_LEVEL_SENSITIVE,
  SECURITY_LEVELS,
  SECURITY_HIERARCHY,
  DEFAULT_SECURITY_LEVEL,
  SECURITY_LEVEL_ICONS,
}
