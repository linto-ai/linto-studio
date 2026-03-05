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

/**
 * Check if a user has WRITE access on a conversation.
 */
function hasConversationWriteAccess(conv, userId) {
  if (conv.owner === userId) return true
  const customRight = (conv.organization?.customRights || []).find(
    (r) => r.userId === userId,
  )
  if (customRight && RIGHTS.hasRightAccess(customRight.right, RIGHTS.WRITE))
    return true
  if (RIGHTS.hasRightAccess(conv.organization?.membersRight || 0, RIGHTS.WRITE))
    return true
  return false
}

module.exports = {
  hasConversationWriteAccess,

  /**
   * Verify write access on conversations affected by a folder operation.
   * - If req.body.conversationIds exists (array): checks those conversations.
   * - Else if req.params.folderId exists: checks conversations in that folder.
   * MAINTAINER+ always passes.
   */
  asConversationWriteAccess: async (req, res, next) => {
    try {
      if (req.userRole >= ROLES.MAINTAINER) return next()

      const userId = req.payload.data.userId
      const organizationId = req.params.organizationId
      let conversations = []

      if (req.body.conversationIds && Array.isArray(req.body.conversationIds)) {
        conversations = await model.conversations.getConvsListByIds(
          req.body.conversationIds,
          {
            owner: 1,
            "organization.customRights": 1,
            "organization.membersRight": 1,
            "organization.organizationId": 1,
          },
        )
        if (conversations.length !== req.body.conversationIds.length)
          return next(new FolderForbidden())
        for (const conv of conversations) {
          if (conv.organization?.organizationId !== organizationId)
            return next(new FolderForbidden())
        }
      } else if (req.params.folderId) {
        conversations = await model.conversations.getByFolderIds(
          [req.params.folderId],
          organizationId,
        )
      }

      for (const conv of conversations) {
        if (!hasConversationWriteAccess(conv, userId))
          return next(new FolderForbidden())
      }

      return next()
    } catch (err) {
      next(err)
    }
  },

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

      const organizationId = req.params.organizationId

      // Update/delete/share: check SHARE on the folder itself
      if (req.params.folderId) {
        const folder = await model.folders.getById(req.params.folderId)
        if (folder.length === 0 || folder[0].organizationId !== organizationId)
          return next(new FolderNotFound())

        if (folder[0].owner === userId || hasShareRight(folder[0], userId)) {
          return next()
        }
        return next(new FolderForbidden())
      }

      // Creation: check SHARE on the parent folder
      const parentId = req.body.parentId || null
      if (!parentId) {
        return next(new FolderForbidden())
      }

      const parent = await model.folders.getById(parentId)
      if (parent.length === 0 || parent[0].organizationId !== organizationId)
        return next(new FolderNotFound())

      if (hasShareRight(parent[0], userId)) {
        return next()
      }
      return next(new FolderForbidden())
    } catch (err) {
      next(err)
    }
  },
}
