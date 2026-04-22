import { Speaker } from '../types/editor';
type __VLS_Props = {
    speakers: Speaker[];
    channels: {
        id: string;
        name: string;
    }[];
    selectedChannelId: string;
    translations: {
        id: string;
        languages: string[];
        isSource: boolean;
    }[];
    selectedTranslationId: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:selectedChannelId": (id: string) => any;
    "update:selectedTranslationId": (id: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:selectedChannelId"?: ((id: string) => any) | undefined;
    "onUpdate:selectedTranslationId"?: ((id: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLElement>;
export default _default;
