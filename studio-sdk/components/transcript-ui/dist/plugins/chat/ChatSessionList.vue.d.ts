import { ChatSession } from '../../core/types';
type __VLS_Props = {
    sessions: ChatSession[];
    activeSessionId: string | null;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    delete: (sessionId: string) => any;
    select: (sessionId: string) => any;
    create: () => any;
    rename: (sessionId: string, title: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: ((sessionId: string) => any) | undefined;
    onSelect?: ((sessionId: string) => any) | undefined;
    onCreate?: (() => any) | undefined;
    onRename?: ((sessionId: string, title: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLElement>;
export default _default;
