const model = require(`${process.cwd()}/lib/mongodb/models`)
const ROLES = require(`${process.cwd()}/lib/dao/organization/roles`)
const RIGHTS = require(`${process.cwd()}/lib/dao/conversation/rights`)

const {
  FolderError,
  FolderNotFound,
  FolderForbidden,
  FolderCycleDetected,
  FolderDepthLimitExceeded,
} = require(`${process.cwd()}/components/WebServer/error/exception/folder`)

const { hasConversationWriteAccess } = require(
  `${process.cwd()}/components/WebServer/middlewares/access/folder`,
)

const { requireParam } = require(`${process.cwd()}/lib/utility/requireParam`)

const MAX_FOLDER_DEPTH = 10

// --- Validation helpers ---

function validateBody(body) {
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0)
      throw new FolderError("name must be a non-empty string")
    if (body.name.length > 255)
      throw new FolderError("name must be less than 255 characters")
  }
  if (body.color !== undefined && body.color !== null) {
    if (
      typeof body.color !== "string" ||
      !body.color.match(/^#([0-9a-fA-F]{6})$/)
    )
      throw new FolderError("color must be a valid hex color")
  }
  if (body.emoji !== undefined && body.emoji !== null) {
    if (typeof body.emoji !== "string")
      throw new FolderError("emoji must be a string")
  }
  if (body.position !== undefined && body.position !== null) {
    if (typeof body.position !== "number")
      throw new FolderError("position must be a number")
  }
  if (body.visibility !== undefined) {
    if (body.visibility !== "public" && body.visibility !== "private")
      throw new FolderError("visibility must be 'public' or 'private'")
  }
  if (body.members !== undefined) {
    if (!Array.isArray(body.members))
      throw new FolderError("members must be an array")
    for (const member of body.members) {
      if (!member.userId || typeof member.userId !== "string")
        throw new FolderError("each member must have a userId string")
      if (member.right === undefined || !RIGHTS.validRight(member.right))
        throw new FolderError("each member must have a valid right")
    }
  }
}

function validateConversationIds(body) {
  if (
    !body.conversationIds ||
    !Array.isArray(body.conversationIds) ||
    body.conversationIds.length === 0
  )
    throw new FolderError("conversationIds must be a non-empty array")
  for (const id of body.conversationIds) {
    if (typeof id !== "string")
      throw new FolderError("each conversationId must be a string")
  }
}

// --- Access helpers ---

function canAccessFolder(folder, userId) {
  return (
    folder.visibility !== "private" ||
    folder.owner === userId ||
    (folder.members && folder.members.some((m) => m.userId === userId))
  )
}

function checkFolderAccess(folder, userId, userRole) {
  if (userRole >= ROLES.MAINTAINER) return
  if (!canAccessFolder(folder, userId)) throw new FolderNotFound()
}

async function getRequiredFolder(folderId, organizationId) {
  if (typeof folderId !== "string" || !/^[0-9a-fA-F]{24}$/.test(folderId))
    throw new FolderNotFound()
  const result = await model.folders.getById(folderId)
  if (result.length === 0) throw new FolderNotFound()
  if (result[0].organizationId !== organizationId) throw new FolderNotFound()
  return result[0]
}

async function verifyFolderConversationsWriteAccess(
  folderIds,
  userId,
  userRole,
  organizationId,
) {
  if (userRole >= ROLES.MAINTAINER) return
  const conversations = await model.conversations.getByFolderIds(
    folderIds,
    organizationId,
  )
  for (const conv of conversations) {
    if (!hasConversationWriteAccess(conv, userId)) throw new FolderForbidden()
  }
}

// --- Access filtering ---

function filterFoldersByAccess(folders, userId, userRole) {
  if (userRole >= ROLES.MAINTAINER) return folders
  return folders.filter((f) => canAccessFolder(f, userId))
}

function filterTreeByAccess(tree, userId, userRole) {
  if (userRole >= ROLES.MAINTAINER) return tree
  return tree.reduce((acc, node) => {
    if (!canAccessFolder(node, userId)) return acc
    acc.push({
      ...node,
      descendants: node.descendants
        ? node.descendants.filter((d) => canAccessFolder(d, userId))
        : [],
    })
    return acc
  }, [])
}

// --- Visibility sync helpers ---

async function syncConversationsRights(
  conversationIds,
  membersRight,
  customRights,
  organizationId,
) {
  for (const convId of conversationIds) {
    await model.conversations.updateRights(
      convId,
      organizationId,
      membersRight,
      customRights,
    )
  }
}

async function syncFolderVisibility(
  folderId,
  organizationId,
  visibility,
  owner,
  members,
) {
  const descendants = await model.folders.getDescendants(
    folderId,
    organizationId,
  )
  const descendantIds = descendants.map((d) => d._id.toString())

  if (descendantIds.length > 0) {
    await model.folders.updateDescendantsVisibility(
      descendantIds,
      visibility,
      owner,
      members,
    )
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

async function makeFolderPublic(folderId, organizationId) {
  await model.folders.update({
    _id: folderId,
    visibility: "public",
    owner: null,
    members: [],
  })
  await syncFolderVisibility(folderId, organizationId, "public", null, [])
}

async function propagateMembersToPrivateAncestors(
  folderId,
  organizationId,
  newMembers,
) {
  const ancestors = await model.folders.getAncestors(folderId, organizationId)

  for (const ancestor of ancestors) {
    if (ancestor.visibility !== "private") continue

    const existingUserIds = new Set(
      (ancestor.members || []).map((m) => m.userId),
    )
    const membersToAdd = newMembers.filter(
      (m) => !existingUserIds.has(m.userId),
    )
    if (membersToAdd.length === 0) continue

    const updatedMembers = [
      ...(ancestor.members || []),
      ...membersToAdd.map((m) => ({ userId: m.userId, right: RIGHTS.READ })),
    ]
    const ancestorId = ancestor._id.toString()
    await model.folders.update({ _id: ancestorId, members: updatedMembers })
    await model.conversations.updateRightsBatchByFolderId(
      ancestorId,
      organizationId,
      RIGHTS.UNDEFINED,
      updatedMembers,
    )
  }
}

// --- Visibility change handlers (used by updateFolder) ---

async function handleInheritFromPrivateParent(
  folderId,
  organizationId,
  parent,
  userId,
) {
  const effectiveOwner = parent.owner || userId
  const members = parent.members || []
  await model.folders.update({
    _id: folderId,
    visibility: "private",
    owner: effectiveOwner,
    members,
  })
  await syncFolderVisibility(
    folderId,
    organizationId,
    "private",
    effectiveOwner,
    members,
  )
}

async function handlePublicToPrivate(
  folderId,
  organizationId,
  folder,
  newMembers,
  userId,
) {
  const effectiveOwner = folder.owner || userId
  const effectiveMembers =
    newMembers && newMembers.length > 0
      ? newMembers
      : [{ userId: effectiveOwner, right: RIGHTS.adminRight() }]

  await model.folders.update({
    _id: folderId,
    owner: effectiveOwner,
    members: effectiveMembers,
  })
  await syncFolderVisibility(
    folderId,
    organizationId,
    "private",
    effectiveOwner,
    effectiveMembers,
  )
}

async function handlePrivateToPublic(
  folderId,
  organizationId,
  forcePublicAncestors,
) {
  for (const ancestor of forcePublicAncestors) {
    await makeFolderPublic(ancestor._id.toString(), organizationId)
  }
  await syncFolderVisibility(folderId, organizationId, "public", null, [])
}

async function handleMembersChanged(
  folderId,
  organizationId,
  folder,
  newMembers,
  userId,
) {
  await syncFolderVisibility(
    folderId,
    organizationId,
    "private",
    folder.owner || userId,
    newMembers,
  )

  const existingUserIds = new Set((folder.members || []).map((m) => m.userId))
  const addedMembers = newMembers.filter((m) => !existingUserIds.has(m.userId))
  if (addedMembers.length > 0) {
    await propagateMembersToPrivateAncestors(
      folderId,
      organizationId,
      addedMembers,
    )
  }
}

// --- ParentId change validation ---

async function validateParentChange(folderId, newParentId, organizationId) {
  if (newParentId === null) return null

  if (newParentId === folderId)
    throw new FolderCycleDetected("Cannot move a folder into itself")

  const parentResult = await model.folders.getById(newParentId)
  if (parentResult.length === 0)
    throw new FolderNotFound("Parent folder not found")

  const descendants = await model.folders.getDescendants(
    folderId,
    organizationId,
  )
  if (descendants.some((d) => d._id.toString() === newParentId))
    throw new FolderCycleDetected(
      "Cannot move a folder into one of its descendants",
    )

  const ancestors = await model.folders.getAncestors(
    newParentId,
    organizationId,
  )
  const subtreeDepth = await model.folders.getSubtreeDepth(
    folderId,
    organizationId,
  )
  if (ancestors.length + 2 + subtreeDepth > MAX_FOLDER_DEPTH)
    throw new FolderDepthLimitExceeded()

  return parentResult[0]
}

// --- Route controllers ---

async function listFolders(req, res, next) {
  try {
    const { organizationId } = req.params
    const userId = req.payload.data.userId
    const userRole = req.userRole

    if (req.query.tree === "true") {
      let tree = await model.folders.getTree(organizationId)
      return res.status(200).send(filterTreeByAccess(tree, userId, userRole))
    }

    let folders
    if (req.query.parentId !== undefined) {
      if (typeof req.query.parentId !== "string")
        throw new FolderError("parentId must be a string")
      const parentId = req.query.parentId === "null" ? null : req.query.parentId
      folders = await model.folders.getByParentId(organizationId, parentId)
    } else {
      folders = await model.folders.getByOrganizationId(organizationId)
    }

    folders = filterFoldersByAccess(folders, userId, userRole)

    if (req.query.withConversationCount === "true" && folders.length > 0) {
      const counts = await model.folders.countConversationsByFolderIds(
        folders.map((f) => f._id.toString()),
        organizationId,
        userId,
        userRole,
      )
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
    const folder = await getRequiredFolder(
      req.params.folderId,
      req.params.organizationId,
    )
    checkFolderAccess(folder, req.payload.data.userId, req.userRole)
    res.status(200).send(folder)
  } catch (err) {
    next(err)
  }
}

async function createFolder(req, res, next) {
  try {
    validateBody(req.body)
    requireParam(req.body.name, FolderError, "name is required")

    const parentId = req.body.parentId || null
    const userId = req.payload.data.userId
    const { organizationId } = req.params

    let visibility = req.body.visibility || "public"
    let owner = userId
    let members = req.body.members || []

    if (parentId) {
      const parent = await getRequiredFolder(parentId, organizationId)

      const ancestors = await model.folders.getAncestors(
        parentId,
        organizationId,
      )
      if (ancestors.length + 1 > MAX_FOLDER_DEPTH)
        throw new FolderDepthLimitExceeded()

      if (parent.visibility === "private") {
        visibility = "private"
        owner = parent.owner || userId
        members = parent.members || []
      }
    }

    if (visibility === "private" && members.length === 0) {
      members = [{ userId: owner, right: RIGHTS.adminRight() }]
    }

    const result = await model.folders.create({
      name: req.body.name.trim(),
      organizationId,
      parentId,
      color: req.body.color || null,
      emoji: req.body.emoji || null,
      position: req.body.position ?? 0,
      visibility,
      owner,
      members,
    })
    if (result.insertedCount !== 1)
      throw new FolderError("Error during the creation of the folder")

    const folder = await model.folders.getById(result.insertedId.toString())

    if (this?.app?.components?.IoHandler) {
      this.app.components.IoHandler.emit("folder_created", organizationId, folder[0])
    }

    res.status(201).send(folder[0])
  } catch (err) {
    next(err)
  }
}

async function updateFolder(req, res, next) {
  try {
    validateBody(req.body)

    const { folderId } = req.params
    const { organizationId } = req.params
    const userId = req.payload.data.userId
    const folder = await getRequiredFolder(folderId, organizationId)

    checkFolderAccess(folder, userId, req.userRole)

    const currentVisibility = folder.visibility || "public"
    const newVisibility = req.body.visibility
    const newMembers = req.body.members

    // Validate parentId change
    let newParent = null
    if (
      req.body.parentId !== undefined &&
      req.body.parentId !== folder.parentId
    ) {
      newParent = await validateParentChange(
        folderId,
        req.body.parentId,
        organizationId,
      )
    }

    // Collect ancestors to force public if needed
    let forcePublicAncestors = []
    if (
      currentVisibility === "private" &&
      newVisibility === "public" &&
      folder.parentId
    ) {
      const parentResult = await model.folders.getById(folder.parentId)
      if (parentResult.length > 0 && parentResult[0].visibility === "private") {
        if (!req.body.force)
          throw new FolderError(
            "Cannot make a folder public when its parent is private",
          )
        const ancestors = await model.folders.getAncestors(
          folderId,
          organizationId,
        )
        forcePublicAncestors = ancestors.filter(
          (a) => a.visibility === "private",
        )
      }
    }

    // Verify write access on affected conversations before visibility/members changes
    const willModifyConversations =
      (newParent && newParent.visibility === "private") ||
      (currentVisibility !== "private" && newVisibility === "private") ||
      (currentVisibility === "private" && newVisibility === "public") ||
      (currentVisibility === "private" &&
        newVisibility !== "public" &&
        newMembers !== undefined)

    if (willModifyConversations) {
      const descendants = await model.folders.getDescendants(
        folderId,
        organizationId,
      )
      const affectedFolderIds = [
        folderId,
        ...descendants.map((d) => d._id.toString()),
      ]
      if (forcePublicAncestors.length > 0) {
        affectedFolderIds.push(
          ...forcePublicAncestors.map((a) => a._id.toString()),
        )
      }
      await verifyFolderConversationsWriteAccess(
        affectedFolderIds,
        userId,
        req.userRole,
        organizationId,
      )
    }

    // Build and apply update payload
    const updatePayload = { _id: folderId }
    if (req.body.name !== undefined) updatePayload.name = req.body.name.trim()
    if (req.body.parentId !== undefined)
      updatePayload.parentId = req.body.parentId
    if (req.body.color !== undefined) updatePayload.color = req.body.color
    if (req.body.emoji !== undefined) updatePayload.emoji = req.body.emoji
    if (req.body.position !== undefined)
      updatePayload.position = req.body.position
    if (newVisibility !== undefined) updatePayload.visibility = newVisibility
    if (newVisibility === "private" && !folder.owner) updatePayload.owner = userId
    if (newMembers !== undefined) updatePayload.members = newMembers

    const result = await model.folders.update(updatePayload)
    if (result.matchedCount === 0) throw new FolderError("Nothing to update")

    // Handle visibility transitions
    let visibilityCascaded = false
    if (newParent && newParent.visibility === "private") {
      await handleInheritFromPrivateParent(folderId, organizationId, newParent, userId)
      visibilityCascaded = true
    } else if (currentVisibility !== "private" && newVisibility === "private") {
      await handlePublicToPrivate(
        folderId,
        organizationId,
        folder,
        newMembers,
        userId,
      )
      visibilityCascaded = true
    } else if (currentVisibility === "private" && newVisibility === "public") {
      await handlePrivateToPublic(
        folderId,
        organizationId,
        forcePublicAncestors,
      )
      visibilityCascaded = true
    } else if (
      currentVisibility === "private" &&
      newVisibility !== "public" &&
      newMembers !== undefined
    ) {
      await handleMembersChanged(
        folderId,
        organizationId,
        folder,
        newMembers,
        userId,
      )
      visibilityCascaded = true
    }

    const updated = await model.folders.getById(folderId)

    if (this?.app?.components?.IoHandler) {
      if (visibilityCascaded) {
        this.app.components.IoHandler.emit("folders_refresh", organizationId)
      } else {
        this.app.components.IoHandler.emit("folder_updated", organizationId, updated[0])
      }
    }

    res.status(200).send(updated[0])
  } catch (err) {
    next(err)
  }
}

async function deleteFolder(req, res, next) {
  try {
    const { folderId } = req.params
    const { organizationId } = req.params
    const folder = await getRequiredFolder(folderId, organizationId)
    checkFolderAccess(folder, req.payload.data.userId, req.userRole)

    const strategy = req.query.strategy || "move_to_parent"
    if (strategy !== "move_to_parent")
      throw new FolderError("Invalid delete strategy")

    const parentId = folder.parentId || null

    await model.folders.reparentChildren(folderId, parentId, organizationId)
    await model.conversations.unsetFolderReferences(
      folderId,
      parentId,
      organizationId,
    )

    if (folder.visibility === "private") {
      let parentIsPublic = true
      if (parentId) {
        const parentResult = await model.folders.getById(parentId)
        if (
          parentResult.length > 0 &&
          parentResult[0].visibility === "private"
        ) {
          parentIsPublic = false
        }
      }
      if (parentIsPublic) {
        await model.conversations.updateRightsBatchByFolderId(
          folderId,
          organizationId,
          RIGHTS.READ,
          [],
        )
      }
    }

    const result = await model.folders.delete(folderId)
    if (result.deletedCount !== 1)
      throw new FolderError("Error during the deletion of the folder")

    if (this?.app?.components?.IoHandler) {
      this.app.components.IoHandler.emit("folder_deleted", organizationId, folderId)
      this.app.components.IoHandler.emit("folders_refresh", organizationId)
    }

    res.status(200).send({ message: "Folder deleted" })
  } catch (err) {
    next(err)
  }
}

async function moveConversation(req, res, next) {
  try {
    const { folderId, organizationId, conversationId } = req.params

    const folder = await getRequiredFolder(folderId, organizationId)
    checkFolderAccess(folder, req.payload.data.userId, req.userRole)

    const conv = await model.conversations.getByIdWithFilter(conversationId, {
      folderId: 1,
    })
    const fromFolderId = conv?.[0]?.folderId ?? null

    const result = await model.conversations.updateFolderBatch(
      [conversationId],
      folderId,
      organizationId,
    )

    const membersRight =
      folder.visibility === "private" ? RIGHTS.UNDEFINED : RIGHTS.READ
    const customRights =
      folder.visibility === "private" ? folder.members || [] : []
    await syncConversationsRights(
      [conversationId],
      membersRight,
      customRights,
      organizationId,
    )

    if (this?.app?.components?.IoHandler) {
      this.app.components.IoHandler.emit("folders_refresh", organizationId)
      this.app.components.IoHandler.emit(
        "conversation_folder_changed",
        organizationId,
        { conversationIds: [conversationId], fromFolderId, toFolderId: folderId },
      )
    }

    res
      .status(200)
      .send({
        message: "Conversation moved",
        modifiedCount: result.modifiedCount,
      })
  } catch (err) {
    next(err)
  }
}

async function listFolderConversations(req, res, next) {
  try {
    const folder = await getRequiredFolder(
      req.params.folderId,
      req.params.organizationId,
    )
    checkFolderAccess(folder, req.payload.data.userId, req.userRole)

    const { folderId: _, ...queryParams } = req.query
    const conversations = await model.conversations.listConvFromOrga(
      req.params.organizationId,
      req.payload.data.userId,
      req.userRole,
      1,
      { ...queryParams, folderId: req.params.folderId },
    )

    res.status(200).send(conversations)
  } catch (err) {
    next(err)
  }
}

async function uncategorizeConversations(req, res, next) {
  try {
    validateConversationIds(req.body)

    const { organizationId } = req.params
    const { conversationIds } = req.body

    await model.conversations.updateFolderBatch(
      conversationIds,
      null,
      organizationId,
    )
    await syncConversationsRights(
      conversationIds,
      RIGHTS.READ,
      [],
      organizationId,
    )

    if (this?.app?.components?.IoHandler) {
      this.app.components.IoHandler.emit("folders_refresh", organizationId)
      this.app.components.IoHandler.emit(
        "conversation_folder_changed",
        organizationId,
        { conversationIds, fromFolderId: undefined, toFolderId: null },
      )
    }

    res.status(200).send({ message: "Conversations removed from folder" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  listFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  moveConversation,
  listFolderConversations,
  uncategorizeConversations,
}
