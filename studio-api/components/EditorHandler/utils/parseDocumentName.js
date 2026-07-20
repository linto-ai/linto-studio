// Document names are "<conversationId>.<editorEpoch>". The epoch makes the
// CRDT history lineage part of the document identity: a client holding a
// Y.Doc from a previous lineage (history rebuilt after an external write)
// targets a different document name and is rejected at authentication,
// instead of merging two incompatible histories.
function parseDocumentName(documentName) {
  const dot = documentName.lastIndexOf(".")
  if (dot === -1) return null
  const conversationId = documentName.slice(0, dot)
  const epoch = Number(documentName.slice(dot + 1))
  if (!conversationId || !Number.isInteger(epoch) || epoch < 0) return null
  return { conversationId, epoch }
}

module.exports = { parseDocumentName }
