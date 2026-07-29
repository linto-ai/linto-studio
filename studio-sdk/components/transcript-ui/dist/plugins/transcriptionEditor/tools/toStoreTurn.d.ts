import { WireTurn } from '../../../core/types';
import { Turn } from '../../../types/editor';
/** Store Turn from a structural broadcast's wire turn (split/merge halves). */
export declare function toStoreTurn(wire: WireTurn): Turn;
