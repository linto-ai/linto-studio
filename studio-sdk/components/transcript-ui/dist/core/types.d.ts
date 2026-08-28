import { ComputedRef, Ref, ShallowRef } from 'vue';
import { AudioSource, Channel, EditorDocument, Speaker, Turn, Word } from '../types/editor';
export interface CoreCapabilities {
    text: "edit" | "view";
    speakers: "edit" | "view";
}
export interface CoreEventMap {
    /** A new document was loaded via setDocument (channels rebuilt). */
    "document:change": void;
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
    "subtitle:visible": {
        visible: boolean;
        height: number;
    };
    "llmService:regenerate": {
        id: string;
    };
    "llmService:export": {
        id: string;
    };
    "llmService:active": {
        id: string | null;
    };
    "llmService:selectVersion": {
        id: string;
        versionNumber: number;
    };
    "llmService:saveVersion": {
        id: string;
        content: string;
    };
    "llmService:selectGeneration": {
        id: string;
        generationId: string;
    };
    "verbatim:export": {
        format: string;
    };
    "chat:loadDiscussions": void;
    "chat:createDiscussion": void;
    "chat:loadDiscussionMessages": {
        discussionId: string;
    };
    "chat:deleteDiscussion": {
        discussionId: string;
    };
    "chat:renameDiscussion": {
        discussionId: string;
        title: string;
    };
    "chat:send": {
        content: string;
    };
    destroy: void;
}
export type TurnEventKey = "turn:add" | "turn:update" | "turn:remove";
/** Which language track this is, within its channel — the "translation-ness"
 *  of a turn list. Consumers that only route or label tracks (live plugin,
 *  selectors) depend on this, never on the turns. */
export interface TranslationInfo {
    readonly id: string;
    readonly languages: string[];
    readonly isSource: boolean;
}
/** Read-only surface of a translation — satisfied by both real and virtual stores. */
export interface ReadableTranslation extends TranslationInfo {
    readonly audio?: AudioSource;
    readonly turns: Readonly<Ref<Turn[]>>;
    getTurn(turnId: string): Turn | undefined;
}
/** Mutable ordered list of speech turns, identified. What the transcription
 *  editor edits — it doesn't know (or care) which language track it is. */
export interface TurnStore {
    readonly id: string;
    readonly turns: Readonly<Ref<Turn[]>>;
    /** Epoch ms — last time the transcription was modified (host-pushed). */
    readonly lastModifiedAt: Ref<number | null>;
    setLastModifiedAt(ts: number | null): void;
    addTurn(turn: Turn): void;
    prependTurns(turns: Turn[]): void;
    updateTurn(turnId: string, patch: Partial<Turn>): void;
    removeTurn(turnId: string): void;
    updateWords(turnId: string, words: Word[]): void;
    setTurns(turns: Turn[]): void;
    replaceTurns(turns: Turn[]): void;
    updateOrCreateTurnSilent(turn: Turn): void;
    hasTurn(turnId: string): boolean;
    getTurn(turnId: string): Turn | undefined;
}
/** A channel's language track: a turn store situated by its track info. */
export interface TranslationStore extends TurnStore, ReadableTranslation {
}
export interface ChannelStore {
    readonly id: string;
    readonly name: string;
    readonly description?: string;
    readonly duration: number;
    readonly translations: Map<string, TranslationStore>;
    readonly sourceTranslation: TranslationStore;
    /** Virtual bilingual "cross" translation, or null when not applicable. */
    readonly crossTranslation: ReadableTranslation | null;
    /** Real tracks plus the cross entry when available — what the selector lists. */
    readonly selectableTranslations: ReadableTranslation[];
    readonly activeTranslation: ComputedRef<ReadableTranslation>;
    readonly isLoadingHistory: Ref<boolean>;
    readonly hasMoreHistory: Ref<boolean>;
    setActiveTranslation(translationId: string | null): void;
    reset(): void;
    /** Detach internal subscriptions (e.g. the cross-translation relay). */
    dispose(): void;
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
    /**
     * Precomputed waveform peaks for the current source (raw amplitude values,
     * any scale — the player normalizes). Null when unavailable: the player
     * falls back to decoding the audio client-side.
     */
    waveform: Ref<number[] | null>;
    /** Id of the word being played (null without word timestamps or when not playing). */
    activeWordId: Ref<string | null>;
    /** Id of the turn being played (null when out of range or not playing). */
    activeTurnId: Ref<string | null>;
    seekTo(time: number): void;
    setSeekHandler(handler: ((time: number) => void) | null): void;
    pause(): void;
    setPauseHandler(handler: (() => void) | null): void;
}
/** A held edit lock, as broadcast by the server. */
export interface TurnLock {
    translationId: string;
    turnId: string;
    userId: string;
    userName: string;
}
/** A saved turn, as broadcast by the server (editor:turn_updated): the
 *  retimed truth. Words are consumed positionally (no wid on the wire). */
export interface TurnUpdate {
    translationId: string;
    turnId: string;
    text: string;
    words: Array<{
        word: string;
        stime?: number;
        etime?: number;
        confidence?: number;
    }>;
    stime?: number;
    etime?: number;
    /** Per-translation edit version — carried, not consumed yet (resync lot). */
    version?: number;
}
/** A full turn as carried by structural broadcasts (turn_split, turns_merged). */
export interface WireTurn {
    turnId: string;
    text: string;
    words: TurnUpdate["words"];
    stime?: number;
    etime?: number;
    speakerId: string | null;
    language: string;
}
/** A turn split in two, as broadcast by the server (editor:turn_split). */
export interface TurnSplit {
    translationId: string;
    originalTurnId: string;
    /** The two halves, in order — the left one keeps the original turn id. */
    turns: WireTurn[];
    version?: number;
}
/** Two adjacent turns merged, as broadcast by the server (editor:turns_merged). */
export interface TurnsMerged {
    translationId: string;
    /** Id the merged turn carries — the LARGER source turn's id. */
    mergedTurnId: string;
    removedTurnId: string;
    turn: WireTurn;
    version?: number;
}
/** A turn removed (the client committed an emptied text), as broadcast by
 *  the server (editor:turn_deleted). The GC consequence rides along. */
export interface TurnDeleted {
    translationId: string;
    turnId: string;
    removedSpeakerId?: string;
    version?: number;
}
/** A turn pointed at a (possibly freshly created) speaker, as broadcast by
 *  the server (editor:turn_speaker_updated). The GC consequence rides along:
 *  removedSpeakerId is set when the previous speaker lost its last turn. */
export interface TurnSpeakerUpdated {
    translationId: string;
    turnId: string;
    speaker: {
        id: string;
        name: string;
    };
    removedSpeakerId?: string;
    version?: number;
}
export interface SpeakerRenamed {
    translationId: string;
    speakerId: string;
    name: string;
    version?: number;
}
/** From-speaker replaced by to-speaker on every turn — its removal is
 *  implied (it references nothing afterwards). */
export interface SpeakerReplaced {
    translationId: string;
    fromSpeakerId: string;
    toSpeakerId: string;
    version?: number;
}
export interface TranscriptionEditorPluginApi {
    /** Turn currently being edited (single-turn editing), null when none. */
    readonly editingTurnId: Ref<string | null>;
    /** Caret offset requested for the editor when it opens. */
    readonly editingCaretOffset: Ref<number>;
    /** Enter edit mode — resolves once the lock is granted (or refused: the
     *  edit mode is simply not entered). */
    beginEdit(turnId: string, caretOffset?: number): Promise<void>;
    cancelEdit(): void;
    /** Commit the edited text for the turn being edited and leave edit mode. */
    saveTurn(text: string): void;
    /** Commit the edited text, then split the turn at `offset` (Enter gesture).
     *  The split itself lands with the server round-trip. */
    splitTurn(text: string, offset: number): void;
    /** Merge two ADJACENT turns of the active track (both must be lock-free —
     *  the merge button between turns). Applied at the server broadcast. */
    mergeTurns(firstTurnId: string, secondTurnId: string): void;
    /** Point a turn at an existing speaker (speakerId) or create-and-assign
     *  one (speakerName) — exactly one of the two. */
    updateTurnSpeaker(turnId: string, target: {
        speakerId?: string;
        speakerName?: string;
    }): void;
    renameSpeaker(speakerId: string, name: string): void;
    /** Reassign every turn of a speaker to another (speaker merge). */
    replaceSpeaker(fromSpeakerId: string, toSpeakerId: string): void;
    /** Apply a saved turn broadcast by the server (any track, any author). */
    applyTurnUpdate(update: TurnUpdate): void;
    /** Apply a turn split broadcast by the server. */
    applyTurnSplit(split: TurnSplit): void;
    /** Apply a merge broadcast by the server. */
    applyTurnsMerged(merge: TurnsMerged): void;
    /** Apply a deletion broadcast by the server. */
    applyTurnDeleted(deleted: TurnDeleted): void;
    /** Baseline: the version the track's freshly fetched content corresponds
     *  to — host-pushed together with the content (same backend read). */
    setTranslationVersion(translationId: string, version: number): void;
    /** Reconnection check (join re-ack): refetch every loaded track the
     *  server says is ahead of what we hold. */
    reconcileVersions(versions: Record<string, number>): void;
    applyTurnSpeakerUpdated(update: TurnSpeakerUpdated): void;
    applySpeakerRenamed(renamed: SpeakerRenamed): void;
    applySpeakerReplaced(replaced: SpeakerReplaced): void;
    /** Lock held on a turn of the ACTIVE translation, if any. */
    getTurnLock(turnId: string): {
        userId: string;
        userName: string;
    } | undefined;
    /** Full replacement — join ack and reconnection re-ack. */
    setLocks(locks: TurnLock[]): void;
    setTurnLock(lock: TurnLock): void;
    clearTurnLock(ref: {
        translationId: string;
        turnId: string;
    }): void;
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
export type LLMServiceStatus = "idle" | "queued" | "processing" | "complete" | "error";
export interface LLMServiceVersion {
    versionNumber: number;
    createdAt: number;
}
export type LLMServiceGenerationStatus = "completed" | "error" | "processing" | "queued";
export interface LLMServiceGeneration {
    generationId: string;
    createdAt: number;
    status: LLMServiceGenerationStatus;
}
export interface LLMServiceInit {
    id: string;
    label: string;
    description?: string;
    content?: string;
    status?: LLMServiceStatus;
    progress?: number;
    phase?: string | null;
    error?: string | null;
    lastUpdate?: number | null;
    versions?: LLMServiceVersion[];
    activeVersionNumber?: number | null;
    generations?: LLMServiceGeneration[];
    currentGenerationId?: string | null;
}
export interface LLMService {
    readonly id: string;
    readonly label: Ref<string>;
    readonly description: Ref<string | null>;
    readonly content: Ref<string>;
    readonly status: Ref<LLMServiceStatus>;
    readonly progress: Ref<number>;
    readonly phase: Ref<string | null>;
    readonly error: Ref<string | null>;
    readonly lastUpdate: Ref<number | null>;
    readonly versions: Ref<LLMServiceVersion[]>;
    readonly activeVersionNumber: Ref<number | null>;
    readonly generations: Ref<LLMServiceGeneration[]>;
    readonly currentGenerationId: Ref<string | null>;
    readonly busy: Ref<boolean>;
    readonly dirty: Ref<boolean>;
}
export interface LLMServicesPluginApi {
    readonly list: Ref<LLMService[]>;
    readonly activeId: Ref<string | null>;
    readonly active: ComputedRef<LLMService | null>;
    setActive(id: string | null): void;
    register(init: LLMServiceInit): LLMService;
    unregister(id: string): void;
    clear(): void;
    get(id: string): LLMService | undefined;
    setLabel(id: string, label: string): void;
    setStatus(id: string, status: LLMServiceStatus): void;
    setProgress(id: string, percentage: number, phase?: string | null): void;
    setContent(id: string, content: string, lastUpdate?: number | null): void;
    setError(id: string, error: string | null): void;
    setVersions(id: string, versions: LLMServiceVersion[]): void;
    setActiveVersion(id: string, versionNumber: number | null): void;
    setGenerations(id: string, generations: LLMServiceGeneration[]): void;
    setCurrentGeneration(id: string, generationId: string | null): void;
    setBusy(id: string, busy: boolean): void;
    setDirty(id: string, dirty: boolean): void;
}
export interface LivePartialEventData {
    /** Segment this partial belongs to — used to match the opposite-language
     *  translation partial in cross mode. */
    turnId?: string;
    text?: string;
    language: string;
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
export interface LiveTranslationEventData {
    turnId: string;
    language: string;
    /** Original language of the turn (the side being translated from). */
    sourceLanguage: string;
    text: string;
    final: boolean;
    startTime: number;
    endTime: number;
    speakerId: string | null;
}
export interface LivePluginApi {
    partial: ShallowRef<string | null>;
    hasLiveUpdate: Ref<boolean>;
    ttsAvailable: boolean;
    ttsEnabled: Ref<boolean>;
    ttsReady: Ref<boolean>;
    enableTTS(): void;
    disableTTS(): void;
    onPartial(event: LivePartialEventData, channelId: string): void;
    onFinal(event: LiveFinalEventData, channelId: string): void;
    prependFinal(event: LiveFinalEventData, channelId: string): void;
    prependFinalBatch(events: LiveFinalEventData[], channelId: string): void;
    onTranslation(event: LiveTranslationEventData): void;
}
export type ChatRole = "user" | "assistant";
export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    createdAt?: number;
    tokenCount?: number;
    /** True only for the virtual in-flight assistant message during streaming. */
    streaming?: boolean;
}
export interface ChatDiscussion {
    id: string;
    title: string;
}
export interface ChatPluginApi {
    readonly drawerOpen: Ref<boolean>;
    readonly discussions: Ref<ChatDiscussion[]>;
    readonly activeDiscussionId: Ref<string | null>;
    readonly messages: Ref<ChatMessage[]>;
    readonly isStreaming: Ref<boolean>;
    readonly streamingContent: Ref<string>;
    readonly isLoadingDiscussion: Ref<boolean>;
    /** messages plus the in-flight assistant message while streaming */
    readonly allMessages: ComputedRef<ChatMessage[]>;
    setDrawerOpen(open: boolean): void;
    setDiscussions(discussions: ChatDiscussion[]): void;
    setActiveDiscussion(discussionId: string | null): void;
    setMessages(messages: ChatMessage[]): void;
    addMessage(message: ChatMessage): void;
    updateDiscussionTitle(discussionId: string, title: string): void;
    setLoadingDiscussion(loading: boolean): void;
    streamStart(): void;
    streamAppend(token: string): void;
    /** Finalize the streamed text as a permanent assistant message and reset. */
    streamEnd(content: string, meta?: {
        tokenCount?: number;
    }): void;
    /** Abort streaming (error/cancel) without committing a message. */
    streamAbort(): void;
}
export interface Core {
    readonly title: Ref<string>;
    readonly date: Ref<string | number | null>;
    readonly activeChannelId: Ref<string>;
    readonly capabilities: Ref<CoreCapabilities>;
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
    llmServices?: LLMServicesPluginApi;
    chat?: ChatPluginApi;
    on<K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void): () => void;
    off<K extends keyof CoreEventMap>(event: K, handler: (payload: CoreEventMap[K]) => void): void;
    emit<K extends keyof CoreEventMap>(event: K, payload: CoreEventMap[K]): void;
    use(plugin: CorePlugin): void;
    destroy(): void;
}
