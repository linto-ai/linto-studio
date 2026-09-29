const MAX_DEPTH = 20

/**
 * Ancestors of a folder, root first, the folder itself last. Empty at the
 * top level or for an unknown id. Stops on cycles.
 * @param {{ _id: string, name: string, parentId?: string|null }[]} folders
 * @param {string|null} folderId
 * @returns {object[]}
 */
export function buildFolderPath(folders, folderId) {
  const path = []
  let current = folders.find((folder) => folder._id === folderId)
  while (current && path.length < MAX_DEPTH) {
    path.unshift(current)
    const parentId = current.parentId
    current = parentId
      ? folders.find((folder) => folder._id === parentId)
      : null
  }
  return path
}
