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

  values: () => Object.values(DOCUMENT_MIME_TYPES).filter((v) => typeof v === "string"),
  isAllowed: (mimetype) => DOCUMENT_MIME_TYPES.values().includes(mimetype),
})

module.exports = DOCUMENT_MIME_TYPES
