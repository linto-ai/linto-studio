export const DOCUMENT_MIME_ICON_MAP = {
  "application/pdf": "file-pdf",
  "application/msword": "file-doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "file-doc",
  "application/vnd.ms-powerpoint": "file-ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "file-ppt",
  "application/vnd.ms-excel": "file-xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "file-xls",
  "text/plain": "file-text",
  "text/csv": "file-csv",
  "application/rtf": "file-text",
  "application/vnd.oasis.opendocument.text": "file-doc",
  "application/vnd.oasis.opendocument.presentation": "file-ppt",
  "application/vnd.oasis.opendocument.spreadsheet": "file-xls",
}

// Keep in sync with studio-api/lib/dao/conversation/documentMimeTypes.js
export const ACCEPTED_DOCUMENT_MIMETYPES = Object.keys(DOCUMENT_MIME_ICON_MAP)
