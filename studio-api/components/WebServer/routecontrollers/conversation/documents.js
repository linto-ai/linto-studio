const debug = require("debug")(
  `linto:components:WebServer:routecontrollers:conversation:documents`,
)


const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  storeFile,
  deleteDocumentFile,
  getStorageFolder,
} = require(`${process.cwd()}/components/WebServer/controllers/files/store`)

const {
  ConversationIdRequire,
  ConversationNotFound,
  ConversationNoFileUploaded,
  DocumentIdRequire,
  DocumentNotFound,
  DocumentUnsupportedMimeType,
} = require(
  `${process.cwd()}/components/WebServer/error/exception/conversation`,
)
const DOCUMENT_MIME_TYPES = require(
  `${process.cwd()}/lib/dao/conversation/documentMimeTypes`,
)

async function findDocument(conversationId, documentId) {
  const result = await model.conversations.getById(conversationId, [
    "metadata.documents",
  ])
  if (result.length !== 1) throw new ConversationNotFound()

  const documents = result[0]?.metadata?.documents || []
  const document = documents.find((doc) => doc.documentId === documentId)
  return document || null
}

function sanitizeFilename(filename) {
  return filename.replace(/["\\\r\n]/g, "_")
}

async function uploadDocuments(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const conversation = await model.conversations.getById(
      req.params.conversationId,
      ["_id"],
    )
    if (conversation.length !== 1) throw new ConversationNotFound()

    if (!req.files || Object.keys(req.files).length === 0) {
      throw new ConversationNoFileUploaded()
    }

    let files = req.files.file
    if (!Array.isArray(files)) {
      files = [files]
    }

    // Validate all MIME types before storing any file
    for (const file of files) {
      if (!DOCUMENT_MIME_TYPES.isAllowed(file.mimetype)) {
        throw new DocumentUnsupportedMimeType(
          `Unsupported file type: ${file.mimetype}`,
        )
      }
    }

    const uploadedDocuments = []
    for (const file of files) {
      const stored = await storeFile(file, "document")

      uploadedDocuments.push({
        documentId: stored.fileId,
        filename: stored.filename,
        mimetype: stored.mimetype,
        filepath: stored.filePath,
        size: stored.size,
        status: "stored",
        uploadedBy: req.payload.data.userId,
        uploadedAt: new Date().toISOString(),
      })
    }

    await model.conversations.addDocuments(
      req.params.conversationId,
      uploadedDocuments,
    )

    res.status(201).send({
      message: "Documents uploaded",
      documents: uploadedDocuments,
    })
  } catch (err) {
    next(err)
  }
}

async function listDocuments(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    const result = await model.conversations.getById(
      req.params.conversationId,
      ["metadata.documents"],
    )
    if (result.length !== 1) throw new ConversationNotFound()

    res.status(200).send({
      documents: result[0]?.metadata?.documents || [],
    })
  } catch (err) {
    next(err)
  }
}

async function downloadDocument(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    if (!req.params.documentId) throw new DocumentIdRequire()

    const document = await findDocument(
      req.params.conversationId,
      req.params.documentId,
    )
    if (!document) throw new DocumentNotFound()

    const filePath = `${process.cwd()}/${getStorageFolder()}/${document.filepath}`

    res.setHeader("Content-Type", document.mimetype)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${sanitizeFilename(document.filename)}"`,
    )
    res.sendFile(filePath, (err) => {
      if (err && !res.headersSent) {
        next(new DocumentNotFound("Document file not found on disk"))
      }
    })
  } catch (err) {
    next(err)
  }
}

async function deleteDocument(req, res, next) {
  try {
    if (!req.params.conversationId) throw new ConversationIdRequire()
    if (!req.params.documentId) throw new DocumentIdRequire()

    const document = await findDocument(
      req.params.conversationId,
      req.params.documentId,
    )
    if (!document) throw new DocumentNotFound()

    deleteDocumentFile(document.filepath)

    await model.conversations.removeDocument(
      req.params.conversationId,
      req.params.documentId,
    )

    res.status(200).send({ message: "Document deleted" })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  uploadDocuments,
  listDocuments,
  downloadDocument,
  deleteDocument,
}
