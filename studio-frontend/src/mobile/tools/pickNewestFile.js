/**
 * The file modified last: the one a recorder that just started is writing.
 * @template {{ mtime: number }} T
 * @param {T[]} files
 * @returns {T | null} null for an empty list
 */
export function pickNewestFile(files) {
  return files.reduce(
    (newest, file) =>
      newest === null || file.mtime > newest.mtime ? file : newest,
    null,
  )
}
