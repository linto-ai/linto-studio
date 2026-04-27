import { ComputedRef, Ref, ShallowRef } from 'vue';
import { AnyExtension } from '@tiptap/core';
import { AudioSource, Channel, EditorDocument, Speaker, Turn, Word } from '../types/editor';
export interface CoreCapabilities {
    text: "edit" | "view";
    speakers: "edit" | "view";
}
export interface CoreEventMap {
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
    "speaker:remove": {
        speakerId: string;
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
    "watermark:display": {
        display: boolean;
    };
    "watermark:pin": {
        pinned: boolean;
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
    replaceTurns(turns: Turn[]): void;
    updateOrCreateTurnSilent(turn: Turn): void;
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
    updateOrCreate(speaker: Speaker): void;
    delete(speakerId: string): void;
}
export interface CorePlugin {
    name: string;
    install(core: Core): (() => void) | void;
    /** TipTap extensions contributed by this plugin (e.g. Collaboration, CollaborationCursor) */
    tiptapExtensions?: AnyExtension[];
}
export interface CoreOptions {
    document?: EditorDocument;
    activeChannelId?: string;
    capabilities?: CoreCapabilities;
}
export interface AudioPluginApi {
    currentTime: Ref<number>;
    isPlaying: Ref<boolean>;
    src: ComputedRef<string | null>;
    /** ID du mot en cours de lecture (null si pas de timestamps de mots ou pas en lecture). */
    activeWordId: Ref<string | null>;
    /** ID du turn en cours de lecture (null si hors plage ou pas en lecture). */
    activeTurnId: Ref<string | null>;
    seekTo(time: number): void;
    setSeekHandler(handler: ((time: number) => void) | null): void;
}
export interface YjsUser {
    clientId: number;
    [key: string]: unknown;
}
export interface TranscriptionEditorPluginApi {
    readonly tiptapEditor: ShallowRef<import('@tiptap/vue-3').Editor | undefined>;
    readonly doc: import('yjs').Doc | null;
    readonly fragment: import('yjs').XmlFragment | null;
    readonly speakersMap: import('yjs').Map<{
        name: string;
        color?: string;
    }> | null;
    readonly users: Ref<YjsUser[]>;
    readonly isConnected: Ref<boolean>;
    updateUser(attrs: Record<string, unknown>): void;
}
export interface WatermarkToken {
    src: string;
    alt?: string;
}
export interface WatermarkPluginApi {
    display: Ref<boolean>;
    pinned: Ref<boolean>;
    content: Ref<string>;
    frequency: Ref<number>;
    duration: Ref<number>;
    tokens: Ref<Record<string, WatermarkToken>>;
    readonly: boolean;
}
export interface SubtitlePluginApi {
    fontSize: Ref<number>;
    isVisible: Ref<boolean>;
    isFullscreen: Ref<boolean>;
    enterFullscreen(): void;
    exitFullscreen(): void;
    watermark?: WatermarkPluginApi;
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
    startDate?: number;
    endDate?: number;
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
export interface Core {
    readonly title: Ref<string>;
    readonly activeChannelId: Ref<string>;
    readonly capabilities: Ref<CoreCapabilities>;
    /** TipTap extensions collected from all plugins */
    readonly pluginExtensions: AnyExtension[];
    readonly speakers: SpeakersStore;
    readonly channels: Map<string, ChannelStore>;
    readonly activeChannel: ComputedRef<ChannelStore | undefined>;
    setDocument(doc: EditorDocument): void;
    setActiveChannel(channelId: string): void;
    setChannel(channelId: string, channel: Channel): void;
    onActiveTranslation<K extends TurnEventKey>(event: K, handler: (payload: CoreEventMap[K]) => void): () => void;
    audio?: AudioPluginApi;
    transcriptionEditor?: TranscriptionEditorPluginApi;
    live?: LivePluginApi;
    subtitle?: SubtitlePluginApi;
    on<K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void): () => void;
    off<K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void): void;
    emit<K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]): void;
    use(plugin: CorePlugin): void;
    destroy(): void;
}
