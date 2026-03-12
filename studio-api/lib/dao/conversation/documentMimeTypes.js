const DOCUMENT_MIME_TYPES = Object.freeze({
  PDF: "application/pdf",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  PPT: "application/vnd.ms-powerpoint",
  PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  TXT: "text/plain",
  CSV: "text/csv",
  RTF: "application/rtf",
  ODT: "application/vnd.oasis.opendocument.text",
  ODP: "application/vnd.oasis.opendocument.presentation",
  ODS: "application/vnd.oasis.opendocument.spreadsheet",
})

const ALLOWED_SET = new Set(Object.values(DOCUMENT_MIME_TYPES))

DOCUMENT_MIME_TYPES.values = () => [...ALLOWED_SET]
DOCUMENT_MIME_TYPES.isAllowed = (mimetype) => ALLOWED_SET.has(mimetype)

module.exports = DOCUMENT_MIME_TYPES
