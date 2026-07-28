type __VLS_Props = {
    text: string;
    caretOffset?: number;
};
declare function getText(): string;
declare const _default: import('vue').DefineComponent<__VLS_Props, {
    getText: typeof getText;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    save: (text: string) => any;
    split: (text: string, offset: number) => any;
    cancel: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSave?: ((text: string) => any) | undefined;
    onSplit?: ((text: string, offset: number) => any) | undefined;
    onCancel?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    editable: HTMLParagraphElement;
}, HTMLParagraphElement>;
export default _default;
