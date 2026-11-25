import { isSameNativeFile } from "./isSameNativeFile.ts"

/**
 * Audio files no recording points to any more (a recording removed while
 * its file could not be deleted, a start that failed before its row was
 * saved). Files modified after `modifiedBefore` are left alone: a recording
 * may be starting while the library loads.
 * @param {{ files: { file: import("../types/localRecording.ts").NativeFile, mtime: number }[],
 *   referencedFiles: (import("../types/localRecording.ts").NativeFile|null)[],
 *   modifiedBefore: number }} input
 * @returns {{ file: import("../types/localRecording.ts").NativeFile, mtime: number }[]}
 */
export function listOrphanAudioFiles({
  files,
  referencedFiles,
  modifiedBefore,
}) {
  return files.filter(
    ({ file, mtime }) =>
      mtime < modifiedBefore &&
      !referencedFiles.some((referenced) => isSameNativeFile(file, referenced)),
  )
}
