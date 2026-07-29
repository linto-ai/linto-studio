/**
 * THE tokenization contract, shared by contract with the backend
 * (studio-api/components/EditorHandler/words/tokenize.js): a word token is a
 * maximal run of non-whitespace characters. Client and server MUST tokenize
 * identically — word/timestamp payloads are aligned by token index, with no
 * wid and no character offsets on the wire.
 *
 * Offsets are expressed in UTF-16 code units (plain JS string indices),
 * relative to the turn's own text. They never leave the process: each side
 * derives its own from its own copy of the text.
 */
export interface Token {
    text: string;
    charStart: number;
    charEnd: number;
}
export declare function tokenize(text: string): Token[];
