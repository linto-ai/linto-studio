export declare function getLanguageDisplayName(code: string, locale: string, wildcardLabel?: string): string;
export declare function buildTranslationItems(translations: {
    id: string;
    languages: string[];
    isSource: boolean;
}[], locale: string, originalLabel: string, wildcardLabel?: string): {
    value: string;
    label: string;
}[];
