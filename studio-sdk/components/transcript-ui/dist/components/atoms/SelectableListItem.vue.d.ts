type __VLS_Props = {
    /** Marks the row as selected — sets aria-current and the active style. */
    current?: boolean;
    disabled?: boolean;
    /** Convenience for a plain text label (or use the default slot). */
    label?: string;
    size?: "sm" | "md";
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        leading?(_: {}): any;
        default?(_: {}): any;
        trailing?(_: {}): any;
        actions?(_: {}): any;
    };
    refs: {};
    rootEl: any;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: (() => any) | undefined;
}>, {
    size: "sm" | "md";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
