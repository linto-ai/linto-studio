import { Ref } from 'vue';
import { EditorStore } from '../../../core/types';
export interface UseTranscriptionEditorOptions {
    store: EditorStore;
    editable?: Ref<boolean> | boolean;
}
export declare function useTranscriptionEditor(options: UseTranscriptionEditorOptions): {
    editor: import('vue').ShallowRef<import('@tiptap/vue-3').Editor | undefined, import('@tiptap/vue-3').Editor | undefined>;
};
