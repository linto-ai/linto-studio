export interface FormField {
    label?: string;
    type?: "text" | "email" | "password" | "number" | "search" | "tel" | "url" | "date";
    placeholder?: string;
    autocomplete?: string;
    error?: string | null;
    value?: string;
    /** Additional HTML attributes spread onto the input (v-bind). */
    customParams?: Record<string, unknown>;
    required?: boolean;
    valid?: boolean;
    loading?: boolean;
    name?: string;
    id?: string;
    testField?: (field: FormField, t: (key: string) => string) => boolean;
    disabled?: boolean;
    disabledReason?: string;
}
export declare const EMPTY_FIELD: FormField;
declare const _default: __VLS_WithTemplateSlots<import('vue').DefineComponent<{
    field: FormField;
    modelValue?: string;
    disabled?: boolean;
    readonly?: boolean;
    focus?: boolean;
    withConfirmation?: boolean;
    inline?: boolean;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
    textarea?: boolean;
    code?: boolean;
    inputId?: string;
}, {
    focus: () => void | undefined;
    blur: () => void | undefined;
    select: () => void | undefined;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    input: (value: string) => any;
    "update:modelValue": (value: string) => any;
    keydown: (event: KeyboardEvent) => any;
    blur: (event: FocusEvent) => any;
    focus: (event: FocusEvent) => any;
    "on-confirm": () => any;
    "on-cancel": () => any;
}, string, import('vue').PublicProps, Readonly<{
    field: FormField;
    modelValue?: string;
    disabled?: boolean;
    readonly?: boolean;
    focus?: boolean;
    withConfirmation?: boolean;
    inline?: boolean;
    fullWidth?: boolean;
    size?: "sm" | "md" | "lg";
    textarea?: boolean;
    code?: boolean;
    inputId?: string;
}> & Readonly<{
    onInput?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onKeydown?: ((event: KeyboardEvent) => any) | undefined;
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
    "onOn-confirm"?: (() => any) | undefined;
    "onOn-cancel"?: (() => any) | undefined;
}>, {
    size: "sm" | "md" | "lg";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    input: HTMLInputElement;
}, HTMLDivElement>, Readonly<{
    default?: () => unknown;
    "custom-input"?: (props: {
        id: string;
        disabled: boolean;
    }) => unknown;
    "content-after-label"?: () => unknown;
    "content-after-input"?: () => unknown;
    "content-bottom-input"?: () => unknown;
}> & {
    default?: () => unknown;
    "custom-input"?: (props: {
        id: string;
        disabled: boolean;
    }) => unknown;
    "content-after-label"?: () => unknown;
    "content-after-input"?: () => unknown;
    "content-bottom-input"?: () => unknown;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
