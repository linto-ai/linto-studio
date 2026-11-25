import type { NativeFile } from "../types/localRecording.ts"

/**
 * Whether two references point to the same file of the native app.
 */
export function isSameNativeFile(
  a: NativeFile | null | undefined,
  b: NativeFile | null | undefined,
): boolean {
  return Boolean(a && b && a.directory === b.directory && a.path === b.path)
}
