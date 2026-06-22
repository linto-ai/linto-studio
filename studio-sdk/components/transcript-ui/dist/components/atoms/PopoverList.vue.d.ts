declare const _default: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onSelect?: ((item: T) => any) | undefined;
        readonly "onUpdate:open"?: ((value: boolean) => any) | undefined;
    } & import('vue').VNodeProps & import('vue').AllowedComponentProps & import('vue').ComponentCustomProps, never>, "onSelect" | "onUpdate:open"> & {
        items: T[];
        itemKey?: (item: T) => string | number;
        isCurrent?: (item: T) => boolean;
        align?: "start" | "center" | "end";
        side?: "top" | "right" | "bottom" | "left";
        sideOffset?: number;
        open?: boolean;
    } & Partial<{}>> & import('vue').PublicProps;
    expose(exposed: import('vue').ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: Readonly<{
        trigger?: () => unknown;
        item: (slotProps: {
            item: T;
        }) => unknown;
        footer?: () => unknown;
    }> & {
        trigger?: () => unknown;
        item: (slotProps: {
            item: T;
        }) => unknown;
        footer?: () => unknown;
    };
    emit: ((evt: "select", item: T) => void) & ((evt: "update:open", value: boolean) => void);
}>) => import('vue').VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
