import { DownloadFormat } from './DownloadMenu.vue';
export type DocumentArticleStatus = "done" | "processing" | "error";
type __VLS_Props = {
    status?: DocumentArticleStatus;
    progress?: number;
    errorMessage?: string;
    showRegenerate?: boolean;
    formats?: DownloadFormat[];
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        default?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    regenerate: () => any;
    export: (format?: string | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRegenerate?: (() => any) | undefined;
    onExport?: ((format?: string | undefined) => any) | undefined;
}>, {
    status: DocumentArticleStatus;
    showRegenerate: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
