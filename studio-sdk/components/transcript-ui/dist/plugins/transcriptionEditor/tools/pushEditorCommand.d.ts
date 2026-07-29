/** Fire-and-forget push of an editor command: the broadcast applies the
 *  result, the ack only reports refusals — logged, host notifications come
 *  with their own iteration. */
export declare function pushEditorCommand(label: string, command: Promise<{
    ok: boolean;
    reason?: string;
}> | undefined): Promise<void>;
