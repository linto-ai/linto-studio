import { listChildFolders } from "./listChildFolders.js"

/**
 * Where a folder id stands in the tree: the folder itself (null at the top
 * level), its sub-folders with their child count, and its parent (undefined
 * at the top level, null when the parent is the top level).
 * @param {{ _id: string, name: string, parentId?: string|null }[]} folders
 * @param {string|null} folderId
 * @returns {{ current: object|null, subfolders: object[], parent: object|null|undefined }}
 */
export function describeFolderPosition(folders, folderId) {
  const byId = new Map(folders.map((folder) => [folder._id, folder]))
  const current = folderId ? (byId.get(folderId) ?? null) : null
  const subfolders = listChildFolders(folders, folderId).map((folder) => ({
    ...folder,
    childCount: listChildFolders(folders, folder._id).length,
  }))
  const parent = !folderId
    ? undefined
    : current?.parentId
      ? (byId.get(current.parentId) ?? null)
      : null
  return { current, subfolders, parent }
}
