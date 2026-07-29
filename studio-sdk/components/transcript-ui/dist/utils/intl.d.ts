import { TranslationInfo } from '../core/types';
export declare function getLanguageDisplayName(code: string, locale: string, wildcardLabel?: string, stripRegion?: boolean): string;
export declare function buildTranslationItems(translations: TranslationInfo[], locale: string, originalLabel: string, wildcardLabel?: string, bilingualLabel?: string): {
    value: string;
    label: string;
}[];
