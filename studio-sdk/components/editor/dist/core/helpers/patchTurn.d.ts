import { Turn } from '../../types/editor';
export declare function patchTurn(turns: Turn[], turnId: string, patch: Partial<Turn>): {
    turns: Turn[];
    updated: Turn;
} | null;
