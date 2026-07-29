/**
 * Compare two language tags ignoring region/subtag — "fr-FR" matches "fr".
 * Returns false when either tag is missing.
 */
export declare function isSameLanguage(a: string | undefined, b: string | undefined): boolean;
