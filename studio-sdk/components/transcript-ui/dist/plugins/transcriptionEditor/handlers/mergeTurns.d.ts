import { EditorPluginState } from '../types';
/**
 * Merge two adjacent turns of the active track (the merge button). Local
 * pre-checks for instant feedback — the server ack stays the authority
 * (locks, adjacency, rights).
 */
export declare function mergeTurns(state: EditorPluginState, firstTurnId: string, secondTurnId: string): void;
