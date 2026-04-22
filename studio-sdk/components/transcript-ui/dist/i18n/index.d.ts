import { Ref } from 'vue';
import { default as fr } from './locales/fr';
export type Locale = 'fr' | 'en';
export type TranslationKey = keyof typeof fr;
interface I18nContext {
    t: (key: TranslationKey) => string;
    locale: Ref<Locale>;
}
export declare function provideI18n(locale: Ref<Locale>): I18nContext;
export declare function useI18n(): I18nContext;
export {};
