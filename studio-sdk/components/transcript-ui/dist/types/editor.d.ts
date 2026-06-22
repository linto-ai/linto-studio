/** Internal editor types — backend-agnostic */
export interface Word {
    id: string;
    text: string;
    startTime?: number;
    endTime?: number;
    confidence?: number;
}
export interface Turn {
    id: string;
    speakerId: string | null;
    text: string | null;
    words: Word[];
    startTime?: number;
    endTime?: number;
    startDate?: number;
    endDate?: number;
    language: string;
    /** Original language of the turn (the side being translated from); live-only. */
    sourceLanguage?: string;
}
export interface Speaker {
    id: string;
    name: string;
    color: string;
}
export interface AudioSource {
    src: string;
    filename?: string;
}
export interface Translation {
    id: string;
    languages: string[];
    isSource: boolean;
    audio?: AudioSource;
    turns: Turn[];
}
export interface Channel {
    id: string;
    name: string;
    description?: string;
    duration: number;
    translations: Translation[];
}
export interface EditorDocument {
    title: string;
    description?: string;
    /** ISO date string or Unix timestamp (seconds) — date the recording took place */
    date?: string | number;
    speakers: Map<string, Speaker>;
    channels: Channel[];
}
