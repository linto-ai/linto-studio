/**
 * Notices not shown yet plus new ones, a key appearing once with its latest
 * content.
 * @param {{ key: string }[]} current
 * @param {{ key: string }[]} next
 * @returns {{ key: string }[]}
 */
export function mergeNotices(current, next) {
  const replaced = next.map((notice) => notice.key)
  return [
    ...current.filter((notice) => !replaced.includes(notice.key)),
    ...next,
  ]
}
