import { fileNameOfUri } from "./fileNameOfUri.js"

/**
 * Audio files no recording points to any more (a recording removed while
 * its file could not be deleted, a start that failed before its entry was
 * saved). Files modified after `modifiedBefore` are left alone: a recording
 * may be starting while the library loads. Files are matched by name, the
 * URI of the same file may be written differently.
 * @param {{ files: { uri: string, mtime: number }[],
 *   referencedUris: (string|null|undefined)[], modifiedBefore: number }} input
 * @returns {{ uri: string, mtime: number }[]}
 */
export function listOrphanAudioFiles({
  files,
  referencedUris,
  modifiedBefore,
}) {
  const referencedNames = new Set(
    referencedUris.filter(Boolean).map((uri) => fileNameOfUri(uri)),
  )
  return files.filter(
    (file) =>
      file.mtime < modifiedBefore &&
      !referencedNames.has(fileNameOfUri(file.uri)),
  )
}
