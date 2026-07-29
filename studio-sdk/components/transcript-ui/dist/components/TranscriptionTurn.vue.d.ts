import { Turn, Speaker } from '../types/editor';
type __VLS_Props = {
    turn: Turn;
    speaker?: Speaker;
    partial?: boolean;
    live?: boolean;
    /** Id of the preceding turn — hosts the merge control above this turn. */
    previousTurnId?: string;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {
    editor: import('vue').CreateComponentPublicInstanceWithMixins<Readonly<{
        text: string;
        caretOffset?: number;
    }> & Readonly<{
        onSave?: ((text: string) => any) | undefined;
        onSplit?: ((text: string, offset: number) => any) | undefined;
        onCancel?: (() => any) | undefined;
    }>, {
        getText: () => string;
    }, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
        save: (text: string) => any;
        split: (text: string, offset: number) => any;
        cancel: () => any;
    }, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {
        editable: HTMLParagraphElement;
    }, HTMLParagraphElement, import('vue').ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        text: string;
        caretOffset?: number;
    }> & Readonly<{
        onSave?: ((text: string) => any) | undefined;
        onSplit?: ((text: string, offset: number) => any) | undefined;
        onCancel?: (() => any) | undefined;
    }>, {
        getText: () => string;
    }, {}, {}, {}, {}> | null;
}, HTMLElement>;
export default _default;
