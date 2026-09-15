/**
 * Direct sub-folders of a folder (null = top level), sorted by name.
 * @param {{ _id: string, name: string, parentId?: string|null }[]} folders
 * @param {string|null} parentId
 * @returns {object[]}
 */
export function listChildFolders(folders, parentId) {
  return folders
    .filter((folder) => (folder.parentId ?? null) === (parentId ?? null))
    .sort((a, b) => a.name.localeCompare(b.name))
}
