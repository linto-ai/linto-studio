/** Types mirroring the WhisperX JSON output format */
export interface WhisperXWord {
    word: string;
    start: number;
    end: number;
    score: number;
    speaker?: string;
}
export interface WhisperXSegment {
    start: number;
    end: number;
    text: string;
    speaker?: string;
    words: WhisperXWord[];
}
export interface WhisperXDocument {
    segments: WhisperXSegment[];
    language?: string;
}
