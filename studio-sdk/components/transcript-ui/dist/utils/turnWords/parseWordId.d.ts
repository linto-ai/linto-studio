/** Inverse of wordId: split a `turnId#index` key back into its parts. */
export declare function parseWordId(id: string): {
    turnId: string;
    index: number;
} | null;
