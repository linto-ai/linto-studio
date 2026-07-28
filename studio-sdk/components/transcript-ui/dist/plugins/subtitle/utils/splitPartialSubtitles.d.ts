interface SubtitleState {
    previousText: string;
    previousIndexes: number[];
}
export default function splitPartialSubtitles({ previousText, previousIndexes: oldCutPositions }: SubtitleState, newText: string, computeIfTextIsTooLong: (text: string) => boolean, computeIfTextOverflows?: (text: string) => boolean): SubtitleState;
export declare function getIndexesWhereToCutText(text: string, computeIfTextIsTooLong: (text: string) => boolean): number[];
export {};
