export declare function getLanguageDisplayName(code: string, locale: string, wildcardLabel?: string, stripRegion?: boolean): string;
export declare function buildTranslationItems(translations: {
    id: string;
    languages: string[];
    isSource: boolean;
}[], locale: string, originalLabel: string, wildcardLabel?: string, bilingualLabel?: string): {
    value: string;
    label: string;
}[];
