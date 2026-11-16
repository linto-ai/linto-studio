/**
 * The file modified last: the one a recorder that just started is writing.
 * @param {{ uri: string, mtime: number }[]} files
 * @returns {{ uri: string, mtime: number } | null} null for an empty list
 */
export function pickNewestFile(files) {
  return files.reduce(
    (newest, file) =>
      newest === null || file.mtime > newest.mtime ? file : newest,
    null,
  )
}
