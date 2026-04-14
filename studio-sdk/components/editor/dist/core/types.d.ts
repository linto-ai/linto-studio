import { ComputedRef, Ref, ShallowRef } from 'vue';
import { AnyExtension } from '@tiptap/core';
import { AudioSource, Channel, EditorDocument, Speaker, Turn, Word } from '../types/editor';
export interface EditorCapabilities {
    text: "edit" | "view";
    speakers: "edit" | "view";
}
export interface EditorEventMap {
    "channel:change": {
        channelId: string;
    };
    "translation:change": {
        translationId: string | null;
    };
    "turn:add": {
        turn: Turn;
        translationId: string;
    };
    "turn:update": {
        turn: Turn;
        translationId: string;
    };
    "turn:remove": {
        turnId: string;
        translationId: string;
    };
    "speaker:update": {
        speaker: Speaker;
    };
    "speaker:add": {
        speaker: Speaker;
    };
    "scroll:top": {
        translationId: string;
    };
    "translation:sync": {
        translationId: string;
    };
    "channel:sync": {
        channelId: string;
    };
    "channel:reset": {
        channelId: string;
    };
    destroy: void;
}
export type TurnEventKey = "turn:add" | "turn:update" | "turn:remove";
export interface TranslationStore {
    readonly id: string;
    readonly languages: string[];
    readonly isSource: boolean;
    readonly audio?: AudioSource;
    readonly turns: Ref<Turn[]>;
    addTurn(turn: Turn): void;
    prependTurns(turns: Turn[]): void;
    updateTurn(turnId: string, patch: Partial<Turn>): void;
    removeTurn(turnId: string): void;
    updateWords(turnId: string, words: Word[]): void;
    setTurns(turns: Turn[]): void;
    hasTurn(turnId: string): boolean;
}
export interface ChannelStore {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly duration: number;
    readonly translations: Map<string, TranslationStore>;
    readonly sourceTranslation: TranslationStore;
    readonly activeTranslation: ComputedRef<TranslationStore>;
    readonly isLoadingHistory: Ref<boolean>;
    readonly hasMoreHistory: Ref<boolean>;
    setActiveTranslation(translationId: string | null): void;
    reset(): void;
}
export interface SpeakersStore {
    readonly all: Map<string, Speaker>;
    ensure(speakerId: string | null, name?: string): void;
    update(speakerId: string, patch: Partial<Omit<Speaker, "id">>): void;
}
export interface EditorPlugin {
    name: string;
    install(editor: EditorStore): (() => void) | void;
    /** TipTap extensions contributed by this plugin (e.g. Collaboration, CollaborationCursor) */
    tiptapExtensions?: AnyExtension[];
}
export interface EditorStoreOptions {
    document?: EditorDocument;
    activeChannelId?: string;
    capabilities?: EditorCapabilities;
}
export interface AudioPluginApi {
    currentTime: Ref<number>;
    isPlaying: Ref<boolean>;
    src: ComputedRef<string | null>;
    seekTo(time: number): void;
    setSeekHandler(handler: ((time: number) => void) | null): void;
}
export interface SubtitlePluginApi {
    fontSize: Ref<number>;
    isVisible: Ref<boolean>;
    isFullscreen: Ref<boolean>;
    enterFullscreen(): void;
    exitFullscreen(): void;
}
export interface LivePartialEventData {
    text?: string;
    translations?: Array<{
        translationId: string;
        text: string;
    }>;
}
export interface LiveFinalEventData {
    turnId: string;
    speakerId: string | null;
    text?: string;
    words: Array<{
        id: string;
        text: string;
        startTime?: number;
        endTime?: number;
        confidence?: number;
    }>;
    startTime: number;
    endTime: number;
    language: string;
    translations?: Array<{
        translationId: string;
        text: string;
        language: string;
    }>;
}
export interface LivePluginApi {
    partial: ShallowRef<string | null>;
    hasLiveUpdate: Ref<boolean>;
    onPartial(event: LivePartialEventData, channelId: string): void;
    onFinal(event: LiveFinalEventData, channelId: string): void;
    prependFinal(event: LiveFinalEventData, channelId: string): void;
    prependFinalBatch(events: LiveFinalEventData[], channelId: string): void;
    onTranslation(event: {
        turnId: string;
        language: string;
        text: string;
    }): void;
}
export interface EditorStore {
    readonly title: Ref<string>;
    readonly activeChannelId: Ref<string>;
    readonly capabilities: Ref<EditorCapabilities>;
    /** TipTap extensions collected from all plugins */
    readonly pluginExtensions: AnyExtension[];
    readonly speakers: SpeakersStore;
    readonly channels: Map<string, ChannelStore>;
    readonly activeChannel: ComputedRef<ChannelStore>;
    setDocument(doc: EditorDocument): void;
    setActiveChannel(channelId: string): void;
    setChannel(channelId: string, channel: Channel): void;
    onActiveTranslation<K extends TurnEventKey>(event: K, handler: (payload: EditorEventMap[K]) => void): () => void;
    audio?: AudioPluginApi;
    live?: LivePluginApi;
    subtitle?: SubtitlePluginApi;
    on<K extends keyof EditorEventMap>(event: K, handler: (payload: EditorEventMap[K]) => void): () => void;
    off<K extends keyof EditorEventMap>(event: K, handler: (payload: EditorEventMap[K]) => void): void;
    emit<K extends keyof EditorEventMap>(event: K, payload: EditorEventMap[K]): void;
    use(plugin: EditorPlugin): void;
    destroy(): void;
}
