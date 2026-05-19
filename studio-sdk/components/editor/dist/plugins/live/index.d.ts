import { EditorPlugin, LivePluginApi } from '../../core/types';
import { LivePartialEvent, LiveFinalEvent, LiveTranslationEvent } from './types';
export type { LivePartialEvent, LiveFinalEvent, LiveTranslationEvent };
export type { LivePluginApi };
export declare function createLivePlugin(): EditorPlugin;
