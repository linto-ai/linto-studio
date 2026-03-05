const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)

const {
  FolderForbidden,
  FolderNotFound,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/folder`,
)

/**
 * Check if the user has SHARE right on a folder's members list.
 */
function hasShareRight(folder, userId) {
  return folder.members && folder.members.some(
    (m) => m.userId === userId && RIGHTS.hasRightAccess(m.right, RIGHTS.SHARE),
  )
}

module.exports = {
  /**
   * Folder manager access: MAINTAINER+ can always pass.
   * Otherwise, checks SHARE right on:
   * - req.params.folderId (for update/delete/share operations)
   * - req.body.parentId (for creation of subfolders)
   * If neither is present (root folder creation), only MAINTAINER+ is allowed.
   */
  asManagerAccess: async (req, res, next) => {
    try {
      if (req.userRole >= ROLES.MAINTAINER) return next()

      const userId = req.payload.data.userId

      // Update/delete/share: check SHARE on the folder itself
      if (req.params.folderId) {
        const folder = await model.folders.getById(req.params.folderId)
        if (folder.length === 0) return next(new FolderNotFound())

        if (folder[0].owner === userId || hasShareRight(folder[0], userId)) {
          return next()
        }
        return next(new FolderForbidden("Only maintainers, owners, or members with share access can manage this folder"))
      }

      // Creation: check SHARE on the parent folder
      const parentId = req.body.parentId || null
      if (!parentId) {
        return next(new FolderForbidden("Only maintainers can create root folders"))
      }

      const parent = await model.folders.getById(parentId)
      if (parent.length === 0) return next(new FolderNotFound("Parent folder not found"))

      if (hasShareRight(parent[0], userId)) {
        return next()
      }
      return next(new FolderForbidden("Only maintainers or members with share access can create subfolders"))
    } catch (err) {
      next(err)
    }
  },
}
