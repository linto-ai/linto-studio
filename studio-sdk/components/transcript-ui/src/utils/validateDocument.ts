import type { EditorDocument } from "../types/editor"

export class DocumentValidationError extends Error {
  path: string
  constructor(path: string, message: string) {
    super(`${path}: ${message}`)
    this.name = "DocumentValidationError"
    this.path = path
  }
}

export function validateEditorDocument(doc: unknown): asserts doc is EditorDocument {
  if (doc == null || typeof doc !== "object") {
    throw new DocumentValidationError("document", "must be a non-null object")
  }

  const d = doc as Record<string, unknown>

  if (typeof d.title !== "string") {
    throw new DocumentValidationError("document.title", "must be a string")
  }

  if (!(d.speakers instanceof Map)) {
    throw new DocumentValidationError("document.speakers", "must be a Map")
  }

  if (!Array.isArray(d.channels)) {
    throw new DocumentValidationError("document.channels", "must be an array")
  }

  for (let ci = 0; ci < d.channels.length; ci++) {
    const ch = d.channels[ci] as Record<string, unknown>
    const cp = `channels[${ci}]`

    if (ch == null || typeof ch !== "object") {
      throw new DocumentValidationError(cp, "must be a non-null object")
    }

    if (typeof ch.id !== "string") {
      throw new DocumentValidationError(`${cp}.id`, "must be a string")
    }

    if (typeof ch.name !== "string") {
      throw new DocumentValidationError(`${cp}.name`, "must be a string")
    }

    if (typeof ch.duration !== "number") {
      throw new DocumentValidationError(`${cp}.duration`, "must be a number")
    }

    if (!Array.isArray(ch.translations)) {
      throw new DocumentValidationError(`${cp}.translations`, "must be an array")
    }

    for (let ti = 0; ti < ch.translations.length; ti++) {
      const tr = ch.translations[ti] as Record<string, unknown>
      const tp = `${cp}.translations[${ti}]`

      if (tr == null || typeof tr !== "object") {
        throw new DocumentValidationError(tp, "must be a non-null object")
      }

      if (typeof tr.id !== "string") {
        throw new DocumentValidationError(`${tp}.id`, "must be a string")
      }

      if (!Array.isArray(tr.languages)) {
        throw new DocumentValidationError(`${tp}.languages`, "must be an array")
      }

      if (typeof tr.isSource !== "boolean") {
        throw new DocumentValidationError(`${tp}.isSource`, "must be a boolean")
      }

      if (!Array.isArray(tr.turns)) {
        throw new DocumentValidationError(`${tp}.turns`, "must be an array")
      }
    }
  }
}
