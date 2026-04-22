declare const _default: <T extends {
    value: string;
    label: string;
}>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly "onUpdate:selectedValue"?: ((value: string) => any) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, "onUpdate:selectedValue"> & {
        items: T[];
        selectedValue: string;
        ariaLabel: string;
    } & Partial<{}>> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<{
        item(props: {
            item: T;
        }): unknown;
        trigger(props: {
            item: T | undefined;
        }): unknown;
    }> & {
        item(props: {
            item: T;
        }): unknown;
        trigger(props: {
            item: T | undefined;
        }): unknown;
    };
    emit: (evt: "update:selectedValue", value: string) => void;
}>) => import('vue').VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
