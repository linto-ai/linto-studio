/**
 * Normalize a language tag to its base code, dropping any region/subtag.
 * e.g. "fr-FR" → "fr", "en" → "en".
 */
export declare function extractLangCode(language: string): string;
