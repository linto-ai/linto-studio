/**
 * Word identity is positional now that the document is plain text: a word IS
 * the i-th whitespace-delimited token of its turn. Word.id is derived
 * (`turnId#index`) — an opaque, recomputable key for consumers (karaoke,
 * follow-playback), never persisted and never on the wire.
 */
export declare function wordId(turnId: string, index: number): string;
