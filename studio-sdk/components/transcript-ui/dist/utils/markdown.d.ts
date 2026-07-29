export declare function renderMarkdown(md: string): string;
export type MarkdownSegment = {
    type: "html";
    html: string;
} | {
    type: "code";
    code: string;
    lang: string;
};
export declare function renderMarkdownSegments(md: string): MarkdownSegment[];
