const debug = require("debug")(
  "linto:components:WebServer:routecontrollers:organizations:folders",
)
const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  FolderError,
  FolderNotFound,
  FolderConflict,
  FolderCycleDetected,
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
  next()
}

async function listFolders(req, res, next) {
  try {
    const organizationId = req.params.organizationId

    if (req.query.tree === "true") {
      const tree = await model.folders.getTree(organizationId)
      return res.status(200).send(tree)
    }

    let folders
    if (req.query.parentId !== undefined) {
      const parentId = req.query.parentId === "null" ? null : req.query.parentId
      folders = await model.folders.getByParentId(organizationId, parentId)
    } else {
      folders = await model.folders.getByOrganizationId(organizationId)
    }

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

    res.status(200).send(folder[0])
  } catch (err) {
    next(err)
  }
}

async function createFolder(req, res, next) {
  try {
    if (!req.body.name) throw new FolderError("name is required")

    const parentId = req.body.parentId || null

    if (parentId) {
      const parent = await model.folders.getById(parentId)
      if (parent.length === 0) throw new FolderNotFound("Parent folder not found")
      if (parent[0].organizationId !== req.params.organizationId)
        throw new FolderError("Parent folder belongs to another organization")
    }

    const payload = {
      name: req.body.name.trim(),
      organizationId: req.params.organizationId,
      parentId: parentId,
      color: req.body.color || null,
      emoji: req.body.emoji || null,
      position: req.body.position ?? 0,
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

    // Check for cycle if parentId is being changed
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
        const parent = await model.folders.getById(newParentId)
        if (parent.length === 0)
          throw new FolderNotFound("Parent folder not found")

        // Check that new parent is not a descendant of this folder
        const descendants = await model.folders.getDescendants(
          req.params.folderId,
          req.params.organizationId,
        )
        const descendantIds = descendants.map((d) => d._id.toString())
        if (descendantIds.includes(newParentId))
          throw new FolderCycleDetected(
            "Cannot move a folder into one of its descendants",
          )
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

    const result = await model.folders.update(updatePayload)
    if (result.matchedCount === 0) throw new FolderError("Nothing to update")

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
