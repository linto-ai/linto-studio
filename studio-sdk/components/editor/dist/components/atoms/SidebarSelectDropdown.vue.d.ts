type __VLS_Props = {
    items: {
        value: string;
        label: string;
    }[];
    selectedValue: string;
    ariaLabel: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:selectedValue": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:selectedValue"?: ((value: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    selectEl: HTMLDivElement;
}, HTMLDivElement>;
export default _default;
