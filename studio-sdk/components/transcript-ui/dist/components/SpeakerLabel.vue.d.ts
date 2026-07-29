import { Speaker } from '../types/editor';
type __VLS_Props = {
    speaker?: Speaker;
    startTime?: number;
    startDate?: number;
    language: string;
    /** The label is wrapped in a clickable trigger (speaker assignment):
     *  show the hover affordance on the name. */
    interactive?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
