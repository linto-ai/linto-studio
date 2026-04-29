import { TranslationKey } from '../../i18n';
export interface DownloadFormat {
    format: string;
    labelKey: TranslationKey;
}
type __VLS_Props = {
    formats: DownloadFormat[];
    disabled?: boolean;
    loading?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (format: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((format: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
export default _default;
