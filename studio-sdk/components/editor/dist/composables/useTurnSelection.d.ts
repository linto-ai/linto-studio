import { Ref, ComputedRef } from 'vue';
import { Turn, Speaker } from '../types/editor';
import { EditorStore } from '../core/types';
export interface TurnSelection {
    readonly selectedIds: Ref<Set<string>>;
    readonly count: ComputedRef<number>;
    readonly hasSelection: ComputedRef<boolean>;
    toggle(turnId: string): void;
    selectRange(turnId: string): void;
    clear(): void;
    copyText(): Promise<void>;
    copyWithMetadata(): Promise<void>;
}
export declare function provideTurnSelection(turns: Ref<Turn[]> | ComputedRef<Turn[]>, speakers: Map<string, Speaker>, editor: EditorStore): TurnSelection;
export declare function useTurnSelection(): TurnSelection;
