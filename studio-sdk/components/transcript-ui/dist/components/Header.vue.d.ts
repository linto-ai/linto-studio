type __VLS_Props = {
    title: string;
    date: string | number | null;
    duration: number;
    speakerCount: number;
    isMobile: boolean;
    canAsk?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    toggleSidebar: () => any;
    openChat: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onToggleSidebar?: (() => any) | undefined;
    onOpenChat?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLElement>;
export default _default;
