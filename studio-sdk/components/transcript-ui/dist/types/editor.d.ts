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
    language: string;
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
    speakers: Map<string, Speaker>;
    channels: Channel[];
}
