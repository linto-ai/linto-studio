import { ChatDiscussion } from '../../core/types';
type __VLS_Props = {
    discussions: ChatDiscussion[];
    activeDiscussionId: string | null;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    delete: (discussionId: string) => any;
    select: (discussionId: string) => any;
    create: () => any;
    rename: (discussionId: string, title: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onDelete?: ((discussionId: string) => any) | undefined;
    onSelect?: ((discussionId: string) => any) | undefined;
    onCreate?: (() => any) | undefined;
    onRename?: ((discussionId: string, title: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLElement>;
export default _default;
