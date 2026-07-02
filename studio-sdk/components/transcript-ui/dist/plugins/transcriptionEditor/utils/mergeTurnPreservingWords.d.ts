import { Turn } from '../../../types/editor';
/**
 * Merge a freshly-extracted turn (word identities from the doc, no timestamps)
 * with the stored one, carrying over each surviving word's timestamps BY wid.
 *
 * Word identity is authoritative in the doc, so this is a per-wid merge — not a
 * text comparison. Words new to the doc (just typed, or the far half of a split)
 * keep no timestamp until the server broadcasts one for their wid.
 */
export declare function mergeTurnPreservingWords(newTurn: Turn, oldTurn: Turn | undefined): Turn;
