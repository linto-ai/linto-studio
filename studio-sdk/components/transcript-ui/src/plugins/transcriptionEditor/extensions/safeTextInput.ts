import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"

const safeTextInputKey = new PluginKey("safeTextInput")

/** Marks transactions produced by this plugin — visible in the debug flight
 *  recorder's metaKeys, so prod logs can confirm the interception works. */
export const SAFE_TEXT_INPUT_META = "transcriptionEditor/safeTextInput"

/**
 * Perform plain text edits (typing and deletions) as ProseMirror
 * transactions instead of letting the browser mutate the DOM.
 *
 * HISTORICAL context: every word used to render as `<span data-wid>` (word
 * marks), making turn content a dense chain of spans and bare whitespace
 * text nodes — a shape browsers' native contenteditable editing mishandled.
 * The debug flight recorder proved it end to end, twice: during Chrome's
 * native deleteContentBackward AND during native typing at a word boundary,
 * the parent's live childNodes index and its nextSibling chain transiently
 * disagreed, crashing prosemirror-view's readDOMChange re-read (addDOM(null)
 * in parseBetween) and corrupting the viewDesc tree (Firefox had its own
 * variant: it removed bare space nodes outright). The document is plain text
 * now; this extension stays as a safety net until native editing has proven
 * itself on the new structure, then may be removed.
 *
 * Intercepting `beforeinput` (not keydown) covers physical keyboards, key
 * repeat, Ctrl+Backspace word deletion AND virtual mobile keyboards (which
 * emit keyCode 229 without a usable keydown). `getTargetRanges()` preserves
 * the browser's exact edit semantics. Compositions are left native:
 * cancelling beforeinput during IME breaks input, and every recorded crash
 * had composing:false.
 *
 * Paste, cut, drop and typing over a selection are already transaction-based
 * in ProseMirror and never take the native-mutation path. Enter is handled
 * by the TurnNode keymap (splitTurn).
 */
export const SafeTextInput = Extension.create({
  name: "safeTextInput",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: safeTextInputKey,
        props: {
          handleDOMEvents: {
            beforeinput: (view, event) => handleBeforeInput(view, event),
          },
        },
      }),
    ]
  },
})

/** Keyboard deletion intents. deleteByCut/deleteByDrag stay out (ProseMirror
 *  already handles cut and drop via transactions), composition types stay
 *  out (cannot be cancelled reliably). */
const DELETE_INPUT_TYPES = new Set([
  "deleteContent",
  "deleteContentBackward",
  "deleteContentForward",
  "deleteWordBackward",
  "deleteWordForward",
  "deleteSoftLineBackward",
  "deleteSoftLineForward",
  "deleteEntireSoftLine",
  "deleteHardLineBackward",
  "deleteHardLineForward",
])

/** Plain typing and autocorrect/spellcheck replacement. Paste/drop variants
 *  stay out (ProseMirror handles them), composition stays out (IME). */
const INSERT_INPUT_TYPES = new Set(["insertText", "insertReplacementText"])

function handleBeforeInput(view: EditorView, event: Event): boolean {
  const input = event as InputEvent
  const isDelete = DELETE_INPUT_TYPES.has(input.inputType)
  const isInsert = INSERT_INPUT_TYPES.has(input.inputType)
  if (!isDelete && !isInsert) return false
  if (!view.editable || view.composing || input.isComposing) return false

  const range = mapTargetRange(view, input)
  if (!range) return false // unmappable range: let the native path run

  if (isDelete) {
    // Nothing to delete (collapsed range at a doc edge): let the browser
    // no-op / ProseMirror commands handle structural joins.
    if (range.from >= range.to) return false
    event.preventDefault()
    view.dispatch(
      view.state.tr
        .deleteRange(range.from, range.to)
        .setMeta(SAFE_TEXT_INPUT_META, true)
        .scrollIntoView(),
    )
    return true
  }

  const text =
    input.data ?? input.dataTransfer?.getData("text/plain") ?? ""
  if (!text) return false
  event.preventDefault()
  view.dispatch(
    view.state.tr
      .insertText(text, range.from, range.to)
      .setMeta(SAFE_TEXT_INPUT_META, true)
      .scrollIntoView(),
  )
  return true
}

/** The document range the browser was about to edit (collapsed = caret), or
 *  null when it can't be mapped safely. */
function mapTargetRange(
  view: EditorView,
  input: InputEvent,
): { from: number; to: number } | null {
  const staticRanges = input.getTargetRanges?.() ?? []

  if (staticRanges.length === 0) {
    // Synthetic events / exotic engines: fall back to the selection.
    const { from, to } = view.state.selection
    return { from, to }
  }

  let from = Infinity
  let to = -Infinity
  for (const range of staticRanges) {
    try {
      const start = view.posAtDOM(range.startContainer, range.startOffset)
      const end = view.posAtDOM(range.endContainer, range.endOffset)
      from = Math.min(from, start, end)
      to = Math.max(to, start, end)
    } catch {
      return null // range outside the editor / unmappable node
    }
  }

  from = Math.max(0, from)
  to = Math.min(view.state.doc.content.size, to)
  return from <= to ? { from, to } : null
}
