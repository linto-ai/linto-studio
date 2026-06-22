type __VLS_Props = {
    label?: string;
    icon?: string;
    iconRight?: string;
    variant?: "primary" | "secondary" | "tertiary" | "transparent";
    intent?: "default" | "destructive";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    type?: "button" | "submit";
    ariaLabel?: string;
};
declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        icon?(_: {}): any;
        default?(_: {}): any;
        'icon-right'?(_: {}): any;
    };
    refs: {};
    rootEl: HTMLButtonElement;
};
type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;
declare const __VLS_component: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    size: "sm" | "md" | "lg";
    type: "button" | "submit";
    variant: "primary" | "secondary" | "tertiary" | "transparent";
    intent: "default" | "destructive";
    disabled: boolean;
    loading: boolean;
    block: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLButtonElement>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
