interface DrawerOptions {
    fontSize?: number;
    lineHeight?: number;
    color?: string;
    font?: string;
    paddingInline?: number;
}
export declare class SubtitleDrawer {
    protected canvas: HTMLCanvasElement;
    protected fontSize: number;
    protected lineHeight: number;
    protected color: string;
    protected font: string;
    protected paddingInline: number;
    protected isResizing: boolean;
    private resizeObserver;
    constructor(canvas: HTMLCanvasElement, { fontSize, lineHeight, color, font, paddingInline, }?: DrawerOptions);
    dispose(): void;
    setFontSize(fontSize: number, lineHeight: number): void;
    resetDrawing(): void;
    protected drawText(text: string, x: number, y: number): void;
    protected drawFirstLine(text: string): void;
    protected drawSecondLine(text: string): void;
    protected onResize(): void;
}
export declare class SubtitleScroller extends SubtitleDrawer {
    private currentState;
    private previousState;
    constructor(canvas: HTMLCanvasElement, options?: DrawerOptions);
    resetAll(): void;
    protected onResize(): void;
    newPartial(text: string): void;
    newFinal(text: string): void;
    private resetState;
    private draw;
    private getLastLineOfState;
    private getSecondLastLineOfState;
    private computeIfTextIsTooLong;
}
export {};
