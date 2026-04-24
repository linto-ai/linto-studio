import { nextTick } from 'vue';
import { FormField } from '../molecules/FormInput.vue';
type __VLS_Props = {
    modelValue: string;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string) => any;
    cancel: () => any;
    commit: (value: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onCancel?: (() => any) | undefined;
    onCommit?: ((value: string) => any) | undefined;
}>, {
    disabled: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    input: ({
        $: import('vue').ComponentInternalInstance;
        $data: {};
        $props: {
            readonly field: FormField;
            readonly modelValue?: string | undefined;
            readonly disabled?: boolean | undefined;
            readonly readonly?: boolean | undefined;
            readonly focus?: boolean | undefined;
            readonly withConfirmation?: boolean | undefined;
            readonly inline?: boolean | undefined;
            readonly fullWidth?: boolean | undefined;
            readonly size?: "sm" | "md" | "lg" | undefined;
            readonly textarea?: boolean | undefined;
            readonly code?: boolean | undefined;
            readonly inputId?: string | undefined;
            readonly onInput?: ((value: string) => any) | undefined;
            readonly "onUpdate:modelValue"?: ((value: string) => any) | undefined;
            readonly onKeydown?: ((event: KeyboardEvent) => any) | undefined;
            readonly onBlur?: ((event: FocusEvent) => any) | undefined;
            readonly onFocus?: ((event: FocusEvent) => any) | undefined;
            readonly "onOn-confirm"?: (() => any) | undefined;
            readonly "onOn-cancel"?: (() => any) | undefined;
        } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        } & {
            input: HTMLInputElement;
        };
        $slots: Readonly<{
            [name: string]: import('vue').Slot<any> | undefined;
        }>;
        $root: import('vue').ComponentPublicInstance | null;
        $parent: import('vue').ComponentPublicInstance | null;
        $host: Element | null;
        $emit: ((event: "input", value: string) => void) & ((event: "update:modelValue", value: string) => void) & ((event: "keydown", event: KeyboardEvent) => void) & ((event: "blur", event: FocusEvent) => void) & ((event: "focus", event: FocusEvent) => void) & ((event: "on-confirm") => void) & ((event: "on-cancel") => void);
        $el: HTMLDivElement;
        $options: import('vue').ComponentOptionsBase<Readonly<{
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
        }, string, {
            size: "sm" | "md" | "lg";
        }, {}, string, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, import('vue').ComponentProvideOptions> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | ((e: import('vue').DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import('vue').ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (...args: [R, R, import('@vue/reactivity').OnCleanup]) => any : (...args: [any, any, import('@vue/reactivity').OnCleanup]) => any, options?: import('vue').WatchOptions): import('vue').WatchStopHandle;
    } & Readonly<{
        size: "sm" | "md" | "lg";
    }> & Omit<Readonly<{
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
    }>, "select" | "size" | "blur" | "focus"> & import('vue').ShallowUnwrapRef<{
        focus: () => void | undefined;
        blur: () => void | undefined;
        select: () => void | undefined;
    }> & {} & import('vue').ComponentCustomProperties & {} & {
        $slots: Readonly<{
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
        };
    }) | null;
}, any>;
export default _default;
