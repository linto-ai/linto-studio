const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:folders",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)

const {
  FolderError,
  FolderNotFound,
  FolderConflict,
  FolderCycleDetected,
  FolderForbidden,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/folder`,
)

function checkBody(req, res, next) {
  if (req.body.name !== undefined) {
    if (typeof req.body.name !== "string" || req.body.name.trim().length === 0)
      throw new FolderError("name must be a non-empty string")
    if (req.body.name.length > 255)
      throw new FolderError("name must be less than 255 characters")
  }
  if (req.body.color !== undefined && req.body.color !== null) {
    if (!req.body.color.match(/^#([0-9a-fA-F]{6})$/))
      throw new FolderError("color must be a valid hex color")
  }
  if (req.body.emoji !== undefined && req.body.emoji !== null) {
    if (typeof req.body.emoji !== "string")
      throw new FolderError("emoji must be a string")
  }
  if (req.body.position !== undefined && req.body.position !== null) {
    if (typeof req.body.position !== "number")
      throw new FolderError("position must be a number")
  }
  if (req.body.visibility !== undefined) {
    if (req.body.visibility !== "public" && req.body.visibility !== "private")
      throw new FolderError("visibility must be 'public' or 'private'")
  }
  if (req.body.members !== undefined) {
    if (!Array.isArray(req.body.members))
      throw new FolderError("members must be an array")
    for (const member of req.body.members) {
      if (!member.userId || typeof member.userId !== "string")
        throw new FolderError("each member must have a userId string")
      if (member.right === undefined || !RIGHTS.validRight(member.right))
        throw new FolderError("each member must have a valid right")
    }
  }
  next()
}

function filterFoldersByAccess(folders, userId, userRole) {
  if (userRole >= ROLES.MAINTAINER) return folders
  return folders.filter((f) =>
    f.visibility !== "private" ||
    f.owner === userId ||
    (f.members && f.members.some((m) => m.userId === userId))
  )
}

function filterTreeByAccess(tree, userId, userRole) {
  if (userRole >= ROLES.MAINTAINER) return tree
  return tree.reduce((acc, node) => {
    const hasAccess =
      node.visibility !== "private" ||
      node.owner === userId ||
      (node.members && node.members.some((m) => m.userId === userId))
    if (!hasAccess) return acc
    const filtered = { ...node }
    if (filtered.descendants) {
      filtered.descendants = filtered.descendants.filter((d) =>
        d.visibility !== "private" ||
        d.owner === userId ||
        (d.members && d.members.some((m) => m.userId === userId))
      )
    }
    acc.push(filtered)
    return acc
  }, [])
}

function checkFolderAccess(folder, userId, userRole) {
  if (folder.visibility !== "private") return
  if (userRole >= ROLES.MAINTAINER) return
  const hasAccess =
    folder.owner === userId ||
    (folder.members && folder.members.some((m) => m.userId === userId))
  if (!hasAccess) throw new FolderNotFound()
}

async function syncFolderVisibility(folderId, organizationId, visibility, owner, members) {
  const descendants = await model.folders.getDescendants(folderId, organizationId)
  const descendantIds = descendants.map((d) => d._id.toString())

  if (descendantIds.length > 0) {
    await model.folders.updateDescendantsVisibility(descendantIds, visibility, owner, members)
  }

  const allFolderIds = [folderId, ...descendantIds]
  const membersRight = visibility === "private" ? RIGHTS.UNDEFINED : RIGHTS.READ
  const customRights = visibility === "private" ? members : []

  for (const id of allFolderIds) {
    await model.conversations.updateRightsBatchByFolderId(
      id,
      organizationId,
      membersRight,
      customRights,
    )
  }
}

async function listFolders(req, res, next) {
  try {
    const organizationId = req.params.organizationId
    const userId = req.payload.data.userId
    const userRole = req.userRole

    if (req.query.tree === "true") {
      let tree = await model.folders.getTree(organizationId)
      tree = filterTreeByAccess(tree, userId, userRole)
      return res.status(200).send(tree)
    }

    let folders
    if (req.query.parentId !== undefined) {
      const parentId = req.query.parentId === "null" ? null : req.query.parentId
      folders = await model.folders.getByParentId(organizationId, parentId)
    } else {
      folders = await model.folders.getByOrganizationId(organizationId)
    }

    folders = filterFoldersByAccess(folders, userId, userRole)

    if (req.query.withConversationCount === "true" && folders.length > 0) {
      const folderIds = folders.map((f) => f._id.toString())
      const counts =
        await model.folders.countConversationsByFolderIds(folderIds)
      folders = folders.map((f) => ({
        ...f,
        conversationCount: counts[f._id.toString()] || 0,
      }))
    }

    res.status(200).send(folders)
  } catch (err) {
    next(err)
  }
}

async function getFolder(req, res, next) {
  try {
    const folder = await model.folders.getById(req.params.folderId)
    if (folder.length === 0) throw new FolderNotFound()

    checkFolderAccess(folder[0], req.payload.data.userId, req.userRole)

    res.status(200).send(folder[0])
  } catch (err) {
    next(err)
  }
}

async function createFolder(req, res, next) {
  try {
    if (!req.body.name) throw new FolderError("name is required")

    const parentId = req.body.parentId || null
    const userId = req.payload.data.userId

    let visibility = req.body.visibility || "public"
    let owner = userId
    let members = req.body.members || []

    if (parentId) {
      const parent = await model.folders.getById(parentId)
      if (parent.length === 0) throw new FolderNotFound("Parent folder not found")
      if (parent[0].organizationId !== req.params.organizationId)
        throw new FolderError("Parent folder belongs to another organization")

      if (parent[0].visibility === "private") {
        visibility = "private"
        owner = parent[0].owner
        members = parent[0].members || []
      }
    }

    if (visibility === "private" && members.length === 0) {
      members = [{ userId: owner, right: RIGHTS.adminRight() }]
    }

    const payload = {
      name: req.body.name.trim(),
      organizationId: req.params.organizationId,
      parentId: parentId,
      color: req.body.color || null,
      emoji: req.body.emoji || null,
      position: req.body.position ?? 0,
      visibility,
      owner,
      members,
    }

    const result = await model.folders.create(payload)
    if (result.insertedCount !== 1)
      throw new FolderError("Error during the creation of the folder")

    const folder = await model.folders.getById(result.insertedId.toString())
    res.status(201).send(folder[0])
  } catch (err) {
    next(err)
  }
}

async function updateFolder(req, res, next) {
  try {
    const folder = await model.folders.getById(req.params.folderId)
    if (folder.length === 0) throw new FolderNotFound()

    if (folder[0].organizationId !== req.params.organizationId)
      throw new FolderError("Folder belongs to another organization")

    const organizationId = req.params.organizationId
    const userId = req.payload.data.userId
    const userRole = req.userRole
    const currentVisibility = folder[0].visibility || "public"
    const newVisibility = req.body.visibility
    const newMembers = req.body.members

    // Only MAINTAINER+ or folder owner/member with SHARE right can change visibility/members
    if (newVisibility !== undefined || newMembers !== undefined) {
      const isMaintainer = userRole >= ROLES.MAINTAINER
      const isOwner = folder[0].owner === userId
      const hasShareRight = folder[0].members && folder[0].members.some(
        (m) => m.userId === userId && RIGHTS.hasRightAccess(m.right, RIGHTS.SHARE),
      )
      if (!isMaintainer && !isOwner && !hasShareRight)
        throw new FolderForbidden("Only maintainers, admins, or members with share access can manage folder access")
    }

    // Check for cycle if parentId is being changed
    let newParent = null
    if (
      req.body.parentId !== undefined &&
      req.body.parentId !== folder[0].parentId
    ) {
      const newParentId = req.body.parentId

      if (newParentId !== null) {
        // Cannot move a folder into itself
        if (newParentId === req.params.folderId)
          throw new FolderCycleDetected("Cannot move a folder into itself")

        // Check that new parent exists
        const parentResult = await model.folders.getById(newParentId)
        if (parentResult.length === 0)
          throw new FolderNotFound("Parent folder not found")
        newParent = parentResult[0]

        // Check that new parent is not a descendant of this folder
        const descendants = await model.folders.getDescendants(
          req.params.folderId,
          organizationId,
        )
        const descendantIds = descendants.map((d) => d._id.toString())
        if (descendantIds.includes(newParentId))
          throw new FolderCycleDetected(
            "Cannot move a folder into one of its descendants",
          )
      }
    }

    // Private -> Public: verify parent is not private
    if (currentVisibility === "private" && newVisibility === "public") {
      if (folder[0].parentId) {
        const parentResult = await model.folders.getById(folder[0].parentId)
        if (parentResult.length > 0 && parentResult[0].visibility === "private")
          throw new FolderError("Cannot make a folder public when its parent is private")
      }
    }

    const updatePayload = { _id: req.params.folderId }
    if (req.body.name !== undefined) updatePayload.name = req.body.name.trim()
    if (req.body.parentId !== undefined)
      updatePayload.parentId = req.body.parentId
    if (req.body.color !== undefined) updatePayload.color = req.body.color
    if (req.body.emoji !== undefined) updatePayload.emoji = req.body.emoji
    if (req.body.position !== undefined)
      updatePayload.position = req.body.position

    // Handle visibility fields in update payload
    if (newVisibility !== undefined) updatePayload.visibility = newVisibility
    if (newMembers !== undefined) updatePayload.members = newMembers
    if (req.body.owner !== undefined) updatePayload.owner = req.body.owner

    const result = await model.folders.update(updatePayload)
    if (result.matchedCount === 0) throw new FolderError("Nothing to update")

    // Handle parentId change to a private parent: force inherit visibility
    if (newParent && newParent.visibility === "private") {
      const inheritPayload = {
        _id: req.params.folderId,
        visibility: "private",
        owner: newParent.owner,
        members: newParent.members || [],
      }
      await model.folders.update(inheritPayload)
      await syncFolderVisibility(
        req.params.folderId,
        organizationId,
        "private",
        newParent.owner,
        newParent.members || [],
      )
    }
    // Public -> Private
    else if (currentVisibility !== "private" && newVisibility === "private") {
      const effectiveMembers = newMembers || [{ userId: req.payload.data.userId, right: RIGHTS.adminRight() }]
      if (!updatePayload.members) {
        await model.folders.update({ _id: req.params.folderId, members: effectiveMembers })
      }
      await syncFolderVisibility(
        req.params.folderId,
        organizationId,
        "private",
        folder[0].owner || req.payload.data.userId,
        effectiveMembers,
      )
    }
    // Private -> Public
    else if (currentVisibility === "private" && newVisibility === "public") {
      await syncFolderVisibility(
        req.params.folderId,
        organizationId,
        "public",
        null,
        [],
      )
    }
    // Members changed while staying private
    else if (
      currentVisibility === "private" &&
      newVisibility !== "public" &&
      newMembers !== undefined
    ) {
      await syncFolderVisibility(
        req.params.folderId,
        organizationId,
        "private",
        folder[0].owner || req.payload.data.userId,
        newMembers,
      )
    }

    const updated = await model.folders.getById(req.params.folderId)
    res.status(200).send(updated[0])
  } catch (err) {
    next(err)
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folder = await model.folders.getById(req.params.folderId)
    if (folder.length === 0) throw new FolderNotFound()

    if (folder[0].organizationId !== req.params.organizationId)
      throw new FolderError("Folder belongs to another organization")

    const strategy = req.query.strategy || "move_to_parent"
    const parentId = folder[0].parentId || null
    const organizationId = req.params.organizationId

    if (strategy === "move_to_parent") {
      // Reparent child folders to the deleted folder's parent
      await model.folders.reparentChildren(
        req.params.folderId,
        parentId,
      )

      // Reparent conversations to the deleted folder's parent
      await model.conversations.unsetFolderReferences(
        req.params.folderId,
        parentId,
      )

      // If private folder and parent is public/null: reset conversation rights
      if (folder[0].visibility === "private") {
        let parentIsPublic = true
        if (parentId) {
          const parentResult = await model.folders.getById(parentId)
          if (parentResult.length > 0 && parentResult[0].visibility === "private") {
            parentIsPublic = false
          }
        }
        if (parentIsPublic) {
          await model.conversations.updateRightsBatchByFolderId(
            req.params.folderId,
            organizationId,
            RIGHTS.READ,
            [],
          )
        }
      }
    }

    const result = await model.folders.delete(req.params.folderId)
    if (result.deletedCount !== 1)
      throw new FolderError("Error during the deletion of the folder")

    res.status(200).send({ message: "Folder deleted" })
  } catch (err) {
    next(err)
  }
}

async function moveConversations(req, res, next) {
  try {
    if (
      !req.body.conversationIds ||
      !Array.isArray(req.body.conversationIds) ||
      req.body.conversationIds.length === 0
    )
      throw new FolderError("conversationIds must be a non-empty array")

    const folder = await model.folders.getById(req.params.folderId)
    if (folder.length === 0) throw new FolderNotFound()

    if (folder[0].organizationId !== req.params.organizationId)
      throw new FolderError("Folder belongs to another organization")

    const result = await model.conversations.updateFolderBatch(
      req.body.conversationIds,
      req.params.folderId,
      req.params.organizationId,
    )

    // Sync rights to destination folder
    if (folder[0].visibility === "private") {
      const customRights = folder[0].members || []
      for (const convId of req.body.conversationIds) {
        await model.conversations.update({
          _id: convId,
          "organization.membersRight": RIGHTS.UNDEFINED,
          "organization.customRights": customRights,
        })
      }
    } else {
      for (const convId of req.body.conversationIds) {
        await model.conversations.update({
          _id: convId,
          "organization.membersRight": RIGHTS.READ,
          "organization.customRights": [],
        })
      }
    }

    res.status(200).send({
      message: "Conversations moved",
      modifiedCount: result.modifiedCount,
    })
  } catch (err) {
    next(err)
  }
}

async function listFolderConversations(req, res, next) {
  try {
    const folder = await model.folders.getById(req.params.folderId)
    if (folder.length === 0) throw new FolderNotFound()

    if (folder[0].organizationId !== req.params.organizationId)
      throw new FolderError("Folder belongs to another organization")

    checkFolderAccess(folder[0], req.payload.data.userId, req.userRole)

    const filter = {
      folderId: req.params.folderId,
      ...req.query,
    }

    const conversations = await model.conversations.listConvFromOrga(
      req.params.organizationId,
      req.payload.data.userId,
      req.payload.data.organizationRole,
      1,
      filter,
    )

    res.status(200).send(conversations)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  checkBody,
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  moveConversations,
  listFolderConversations,
}
