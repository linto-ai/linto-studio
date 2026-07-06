import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorState, Transaction } from "@tiptap/pm/state"
import { DOMParser as PMDOMParser } from "@tiptap/pm/model"
import type { Node as PMNode, ParseOptions, Schema } from "@tiptap/pm/model"
import type { DecorationSet, EditorView } from "@tiptap/pm/view"
import { yCursorPluginKey, ySyncPluginKey } from "@tiptap/y-tiptap"

import { RingBuffer } from "./ringBuffer"
import {
  checkDescIntegrity,
  describeNode,
  type IntegrityViolation,
} from "./domIntegrity"

/**
 * Sync flight recorder — diagnostic instrumentation for the readDOMChange
 * crash family ("can't access property nodeType/nextSibling, dom is null").
 *
 * The crash is the aftershock of an earlier viewDesc ↔ DOM desync, so this
 * records the timeline leading to it: every transaction (with its origin),
 * DOM mutations landing in turn content outside ProseMirror's own update
 * windows, remote cursor/selection decoration churn, session lifecycle —
 * and runs a throttled integrity check that fires a loud console.error the
 * FIRST time the desc tree and the real DOM disagree.
 */

const LOG_PREFIX = "[transcript-ui debug]"

// ── Activation flags ─────────────────────────────────────────────────────

export interface DebugFlags {
  /** Record the sync timeline and run integrity checks. */
  enabled: boolean
  /** Kill-switch: drop CollaborationCursor (remote carets AND the inline
   *  selection decoration yCursorPlugin puts inside turn content). */
  disableRemoteCursors: boolean
  /** Kill-switch: drop the CursorTurn node decoration. */
  disableCursorTurn: boolean
}

const LS_KEY = "transcript-ui:debug"

/** Combine explicit plugin options with localStorage overrides, so the
 *  instrumentation can be switched on in production without redeploying the
 *  host app: localStorage["transcript-ui:debug"] = "1" (and the
 *  ":no-remote-cursors" / ":no-cursor-turn" suffixed keys). */
export function resolveDebugFlags(options: {
  debug?: boolean
  debugDisableRemoteCursors?: boolean
  debugDisableCursorTurn?: boolean
}): DebugFlags {
  return {
    enabled: options.debug || lsFlag(LS_KEY),
    disableRemoteCursors:
      options.debugDisableRemoteCursors || lsFlag(`${LS_KEY}:no-remote-cursors`),
    disableCursorTurn:
      options.debugDisableCursorTurn || lsFlag(`${LS_KEY}:no-cursor-turn`),
  }
}

function lsFlag(key: string): boolean {
  try {
    const value = localStorage.getItem(key)
    return value !== null && value !== "0" && value !== "false"
  } catch {
    return false // no storage access (sandboxed iframe…): flags off
  }
}

// ── Recorder ─────────────────────────────────────────────────────────────

export interface FlightEvent {
  /** Epoch ms. */
  t: number
  kind: string
  data: Record<string, unknown>
}

export interface FlightDump {
  userAgent: string
  /** First window error of the session — when the reported crash is a
   *  repeated aftershock, this is the actual quake. */
  firstError: FlightEvent | null
  /** Fresh integrity report, when an editor view is alive. */
  integrity: IntegrityViolation[] | null
  events: FlightEvent[]
}

const CRASH_SIGNATURE = /nodeType|nextSibling|pmViewDesc|readDOMChange/

declare global {
  interface Window {
    /** Console access to the flight dump — the core lives inside the web
     *  component, unreachable from the host page's devtools otherwise. */
    __transcriptUiDebug?: { dump(): FlightDump }
  }
}

/** One instance per plugin install; owns the event buffer and the global
 *  error listener. destroy() releases both. */
export class FlightRecorder {
  private readonly events = new RingBuffer<FlightEvent>(500)
  private firstError: FlightEvent | null = null
  private integrityAlarmed = false
  private lastViolationFingerprint = ""
  private integrityProbe: (() => IntegrityViolation[]) | null = null
  private crashProbe: (() => void) | null = null

  private readonly onWindowError = (event: ErrorEvent): void => {
    const evt: FlightEvent = {
      t: Date.now(),
      kind: "window-error",
      data: {
        message: event.message,
        source: `${event.filename}:${event.lineno}`,
        isFirstErrorOfSession: this.firstError === null,
      },
    }
    if (!this.firstError) this.firstError = evt
    this.events.push(evt)
    if (CRASH_SIGNATURE.test(event.message)) {
      // Freeze the evidence at crash time (pending spy mutations + integrity
      // report) — by the time someone dumps manually, more has happened.
      this.crashProbe?.()
      console.error(
        `${LOG_PREFIX} readDOMChange-family crash caught — flight dump:`,
        this.dump(),
      )
    }
  }

  constructor() {
    window.addEventListener("error", this.onWindowError, true)
    window.__transcriptUiDebug = { dump: () => this.dump() }
    this.record("recorder-started", {})
    console.info(
      `${LOG_PREFIX} sync flight recorder ON — dump via window.__transcriptUiDebug.dump()`,
    )
  }

  destroy(): void {
    window.removeEventListener("error", this.onWindowError, true)
    delete window.__transcriptUiDebug
  }

  record(kind: string, data: Record<string, unknown> = {}): void {
    this.events.push({ t: Date.now(), kind, data })
  }

  /** Registered by the live editor view so dump() can re-check integrity. */
  setIntegrityProbe(probe: (() => IntegrityViolation[]) | null): void {
    this.integrityProbe = probe
  }

  /** Registered by the live editor view: drains its pending spy mutations
   *  and snapshots integrity the instant a crash-signature error fires. */
  setCrashProbe(probe: (() => void) | null): void {
    this.crashProbe = probe
  }

  recordViolations(violations: IntegrityViolation[], context: string): void {
    // With synchronous checks a persistent desync would re-report identically
    // on every keystroke: only record state CHANGES (including recovery —
    // PM reconciling the desync away is itself a timeline event).
    const fingerprint = violations
      .map((v) => `${v.kind}|${v.turnId}|${v.detail}`)
      .join("\n")
    if (fingerprint === this.lastViolationFingerprint) return
    this.lastViolationFingerprint = fingerprint
    if (violations.length === 0) {
      this.record("integrity-recovered", { context })
      return
    }
    this.record("integrity-violation", { context, violations })
    // The first divergence is the root event the eventual crash stems from —
    // shout once with the full timeline instead of flooding the console.
    if (!this.integrityAlarmed) {
      this.integrityAlarmed = true
      console.error(
        `${LOG_PREFIX} FIRST viewDesc↔DOM integrity violation (the desync a ` +
          `later readDOMChange flush crashes on) — flight dump:`,
        this.dump(),
      )
    }
  }

  dump(): FlightDump {
    return {
      userAgent: navigator.userAgent,
      firstError: this.firstError,
      integrity: this.integrityProbe ? this.integrityProbe() : null,
      events: this.events.toArray(),
    }
  }
}

// ── ProseMirror extension ────────────────────────────────────────────────

const syncDebugKey = new PluginKey("syncDebug")

export interface SyncDebugOptions {
  recorder: FlightRecorder
}

/**
 * readDOMChange's parseBetween uses someProp("domParser") when present: this
 * subclass IS the parser it crashes in, so the catch sees the exact
 * arguments and DOM of the fatal call — no post-mortem re-derivation (which
 * proved misleading: a post-crash parseRange replay showed sane offsets).
 */
class RecordingDOMParser extends PMDOMParser {
  private recorder: FlightRecorder | null = null

  static forDebug(schema: Schema, recorder: FlightRecorder): PMDOMParser {
    const parser = new RecordingDOMParser(
      schema,
      PMDOMParser.fromSchema(schema).rules,
    )
    parser.recorder = recorder
    return parser
  }

  parse(dom: Node, options?: ParseOptions): PMNode {
    try {
      return super.parse(dom, options)
    } catch (error) {
      this.recorder?.record("dom-parse-crashed", {
        error: String(error),
        from: options?.from,
        to: options?.to,
        topNode: options?.topNode?.type.name,
        childCount: dom.childNodes.length,
        parent: describeNode(dom),
        walk: walkLikeAddAll(dom, options?.from, options?.to),
      })
      throw error
    }
  }
}

/** Replicate addAll's exact iteration and report what it walks over —
 *  including whether it runs past the last sibling into null. */
function walkLikeAddAll(
  parent: Node,
  startIndex: number | undefined,
  endIndex: number | undefined,
): Record<string, unknown> {
  const start = startIndex
    ? parent.childNodes[startIndex]
    : parent.firstChild
  const end = endIndex == null ? null : (parent.childNodes[endIndex] ?? null)
  const visited: string[] = []
  const base = {
    start: start ? describeNode(start) : String(start),
    end: end ? describeNode(end) : String(end),
  }
  // Loose equality on purpose: mirrors addAll's `dom != end` exactly
  // (undefined ends compare equal to a null walker there too).
  let dom: Node | null = start ?? null
  for (let steps = 0; steps < 300; steps++) {
    if (dom == end) {
      return { verdict: "terminates", ...base, visited: visited.slice(0, 20) }
    }
    if (dom === null) {
      return {
        verdict: "WALKED PAST LAST SIBLING INTO NULL (end never met)",
        ...base,
        visited: visited.slice(-20),
      }
    }
    visited.push(describeNode(dom))
    dom = dom.nextSibling
  }
  return {
    verdict: "no termination within 300 steps",
    ...base,
    visited: visited.slice(-20),
  }
}

export const SyncDebug = Extension.create<SyncDebugOptions>({
  name: "syncDebug",

  addProseMirrorPlugins() {
    const { recorder } = this.options
    const domParser = RecordingDOMParser.forDebug(
      this.editor.schema,
      recorder,
    )
    return [
      new Plugin<null>({
        key: syncDebugKey,
        props: { domParser },
        state: {
          init: () => null,
          apply: (tr, prev, _oldState, newState) => {
            recorder.record("transaction", summarizeTransaction(tr, newState))
            return prev
          },
        },
        view: (view) => new SyncDebugView(view, recorder),
      }),
    ]
  },
})

function summarizeTransaction(
  tr: Transaction,
  state: EditorState,
): Record<string, unknown> {
  return {
    remote: tr.getMeta(ySyncPluginKey) !== undefined,
    awareness: tr.getMeta(yCursorPluginKey) !== undefined,
    // Literal duplicated from storeSync.ts (private constant there).
    normalized: tr.getMeta("transcriptionEditor/storeSyncNormalized") === true,
    addToHistory: tr.getMeta("addToHistory") as unknown,
    // Every meta key names the transaction's author (plugin-keyed metas
    // stringify as "pluginName$") — identifies otherwise-anonymous empty
    // transactions. Private field, debug-only read.
    metaKeys: Object.keys(
      (tr as unknown as { meta: Record<string, unknown> }).meta,
    ),
    steps: tr.steps.length,
    docChanged: tr.docChanged,
    selectionSet: tr.selectionSet,
    docSize: state.doc.content.size,
    selection: `${state.selection.from}-${state.selection.to}`,
  }
}

// ── Per-view instrumentation ─────────────────────────────────────────────

const INTEGRITY_THROTTLE_MS = 300
/** Below this doc size a full integrity walk is microseconds: run it
 *  synchronously after every doc change instead of throttled — a fatal
 *  desync can live for less than the throttle window. */
const SMALL_DOC_SIZE = 20_000
const PATCHED_METHODS = ["updateState", "update"] as const

type PatchedMethod = (typeof PATCHED_METHODS)[number]
type PatchableView = Record<PatchedMethod, (...args: unknown[]) => void>

/** Plugin view: spy MutationObserver, PM-update-window marking, throttled
 *  integrity checks, remote-selection decoration tracking. */
class SyncDebugView {
  private readonly view: EditorView
  private readonly recorder: FlightRecorder
  private readonly observer: MutationObserver
  /** > 0 while ProseMirror itself is updating the DOM: mutations seen then
   *  are PM's own and are not recorded. */
  private pmUpdateDepth = 0
  private lastCheck = 0
  private pendingCheck: ReturnType<typeof setTimeout> | null = null
  private lastRemoteSelections = 0
  private restoreHandleDOMChange: (() => void) | null = null

  constructor(view: EditorView, recorder: FlightRecorder) {
    this.view = view
    this.recorder = recorder

    // Shadow updateState/update with instance wrappers marking PM's own
    // DOM-update windows (deleting the own property restores the prototype).
    // MutationObserver delivery is async, so window state at callback time
    // says nothing about mutation time: drain records synchronously at both
    // window edges instead — before PM runs they are external, after it ran
    // they are PM's own and get discarded.
    const patchable = view as unknown as PatchableView
    for (const method of PATCHED_METHODS) {
      const original = patchable[method].bind(view)
      patchable[method] = (...args: unknown[]): void => {
        if (this.pmUpdateDepth === 0) {
          this.onMutations(this.observer.takeRecords())
        }
        this.pmUpdateDepth++
        try {
          original(...args)
        } catch (error) {
          // The records normally discarded as "PM's own" ARE the evidence
          // when PM's update itself blew up — capture before rethrowing.
          this.recorder.record("pm-update-crashed", { error: String(error) })
          this.onMutations(this.observer.takeRecords(), true)
          throw error
        } finally {
          this.pmUpdateDepth--
          if (this.pmUpdateDepth === 0) {
            this.observer.takeRecords()
            // PM just rewrote the DOM: on small docs, verify it immediately.
            this.scheduleIntegrityCheck("pm-window-close")
          }
        }
      }
    }

    this.observer = new MutationObserver((records) => {
      // Depth > 0 means delivery raced into an open PM window; those records
      // are drained and discarded at window close.
      if (this.pmUpdateDepth === 0) this.onMutations(records)
    })
    this.observer.observe(view.dom, {
      subtree: true,
      childList: true,
      characterData: true,
    })

    // Wrap the DOMObserver → readDOMChange entry point: when the re-read of
    // a browser mutation crashes (the addDOM(null) family), replay the same
    // range through docView.parseRange and record the exact offsets — the
    // smoking gun the stack trace never shows. Private API; debug-only.
    const observerHost = view as unknown as {
      domObserver?: { handleDOMChange?: (...args: unknown[]) => void }
    }
    const domObserver = observerHost.domObserver
    const originalHandle = domObserver?.handleDOMChange?.bind(domObserver)
    if (domObserver && originalHandle) {
      // handleDOMChange is an own instance property (set in DOMObserver's
      // constructor) — restore by reassigning, not deleting.
      this.restoreHandleDOMChange = () => {
        domObserver.handleDOMChange = originalHandle
      }
      domObserver.handleDOMChange = (...args: unknown[]): void => {
        try {
          originalHandle(...args)
        } catch (error) {
          this.recorder.record("readDOMChange-crashed", {
            from: args[0],
            to: args[1],
            typeOver: args[2],
            error: String(error),
            parseDiag: this.diagnoseParseRange(args[0], args[1]),
          })
          throw error
        }
      }
    }

    // Control keys and input intents (never printable characters — that
    // would log document content). beforeinput's inputType names exactly
    // what the browser is about to do to the DOM (deleteContentBackward,
    // insertCompositionText…) before PM reads it back.
    view.dom.addEventListener("keydown", this.onKeydown, true)
    view.dom.addEventListener("beforeinput", this.onBeforeInput, true)

    recorder.setIntegrityProbe(() =>
      view.isDestroyed ? [] : checkDescIntegrity(view),
    )
    recorder.setCrashProbe(() => {
      this.onMutations(this.observer.takeRecords(), true)
      this.runIntegrityCheck("crash")
    })
    recorder.record("editor-view-created", {})
  }

  /** Replay readDOMChange's range widening + parseRange to expose the DOM
   *  offsets the crashed parse was about to iterate with. Read-only. */
  private diagnoseParseRange(from: unknown, to: unknown): unknown {
    try {
      if (typeof from !== "number" || typeof to !== "number" || from < 0) {
        return { skipped: `non-range change (${String(from)}, ${String(to)})` }
      }
      const doc = this.view.state.doc
      // Same widening as readDOMChange (prosemirror-view).
      const $before = doc.resolve(from)
      const shared = $before.sharedDepth(to)
      const wFrom = $before.before(shared + 1)
      const wTo = doc.resolve(to).after(shared + 1)
      const docView = (
        this.view as unknown as {
          docView: {
            parseRange(f: number, t: number): {
              node: Node
              from: number
              to: number
              fromOffset: number
              toOffset: number
            }
          }
        }
      ).docView
      const r = docView.parseRange(wFrom, wTo)
      return {
        widened: `${wFrom}-${wTo}`,
        parsed: `${r.from}-${r.to}`,
        fromOffset: r.fromOffset,
        toOffset: r.toOffset,
        childCount: r.node.childNodes.length,
        parent: describeNode(r.node),
        // The nodes addAll would walk between the offsets — names the
        // inversion when fromOffset/toOffset cross.
        childrenAround: Array.from(r.node.childNodes)
          .slice(
            Math.max(0, Math.min(r.fromOffset, r.toOffset) - 2),
            Math.max(r.fromOffset, r.toOffset) + 2,
          )
          .map(describeNode),
      }
    } catch (error) {
      return { failed: String(error) }
    }
  }

  private readonly onKeydown = (event: KeyboardEvent): void => {
    if (event.key.length > 1) {
      this.recorder.record("keydown", { key: event.key })
    }
  }

  private readonly onBeforeInput = (event: Event): void => {
    const inputType = (event as InputEvent).inputType
    // insertText per keystroke is pure noise; deletions/compositions are the
    // interesting DOM-rewriting intents.
    if (inputType === "insertText") return
    this.recorder.record("beforeinput", {
      inputType,
      composing: this.view.composing,
    })
  }

  update(view: EditorView, prevState: EditorState): void {
    this.trackRemoteSelections(view)
    if (view.state.doc !== prevState.doc) {
      this.scheduleIntegrityCheck("doc-change")
    }
  }

  destroy(): void {
    this.observer.disconnect()
    if (this.pendingCheck) clearTimeout(this.pendingCheck)
    this.restoreHandleDOMChange?.()
    this.view.dom.removeEventListener("keydown", this.onKeydown, true)
    this.view.dom.removeEventListener("beforeinput", this.onBeforeInput, true)
    const patchable = this.view as unknown as Partial<PatchableView>
    for (const method of PATCHED_METHODS) delete patchable[method]
    this.recorder.setIntegrityProbe(null)
    this.recorder.setCrashProbe(null)
    this.recorder.record("editor-view-destroyed", {})
  }

  /** yCursorPlugin renders remote SELECTIONS as inline decorations inside
   *  turn content — the exact decoration shape wordHighlight.ts documents as
   *  crashing PM reconciliation. Log when they appear/disappear so crashes
   *  can be correlated with a collaborator selecting text. */
  private trackRemoteSelections(view: EditorView): void {
    const decoSet = yCursorPluginKey.getState(view.state) as
      | DecorationSet
      | null
      | undefined
    if (!decoSet) return
    const decorations = decoSet.find()
    // Widget carets are zero-width; a remote selection is a from<to inline deco.
    const selections = decorations.filter((d) => d.from !== d.to).length
    if (selections !== this.lastRemoteSelections) {
      this.recorder.record("remote-selection-decorations", {
        inlineSelections: selections,
        totalDecorations: decorations.length,
      })
      this.lastRemoteSelections = selections
      this.scheduleIntegrityCheck("remote-selection-change")
    }
  }

  private scheduleIntegrityCheck(context: string): void {
    // Small doc: the walk is microseconds — always check synchronously. The
    // fatal desync can live shorter than any throttle window (seen in prod:
    // desync and crash 155ms apart, inside the 300ms throttle).
    if (this.view.state.doc.content.size <= SMALL_DOC_SIZE) {
      this.runIntegrityCheck(context)
      return
    }
    const elapsed = Date.now() - this.lastCheck
    if (elapsed >= INTEGRITY_THROTTLE_MS) {
      this.runIntegrityCheck(context)
      return
    }
    if (this.pendingCheck) return
    this.pendingCheck = setTimeout(() => {
      this.pendingCheck = null
      this.runIntegrityCheck(`${context} (deferred)`)
    }, INTEGRITY_THROTTLE_MS - elapsed)
  }

  private runIntegrityCheck(context: string): void {
    this.lastCheck = Date.now()
    if (this.view.isDestroyed) return
    this.recorder.recordViolations(checkDescIntegrity(this.view), context)
  }

  /** `force` records everything (crash evidence): no caret-turn exemption,
   *  tagged so PM-window mutations are distinguishable in the timeline. */
  private onMutations(records: MutationRecord[], force = false): void {
    if (records.length === 0) return
    const caretTurnId = this.caretTurnId()
    for (const record of records) {
      const turnText = closestTurnText(record.target)
      if (record.type === "characterData") {
        if (!turnText && !force) continue
        const turnId = turnText ? turnIdOf(turnText) : null
        // Text mutated in the caret's turn outside a PM window is normal
        // browser input (PM reads it back via readDOMChange) — skip it.
        if (!force && turnId !== null && turnId === caretTurnId) continue
        this.recorder.record("dom-mutation", {
          type: "characterData",
          forced: force,
          turnId,
          caretTurnId,
          composing: this.view.composing,
          target: describeNode(record.target),
        })
        continue
      }
      // childList: node structure changed outside PM's control — the raw
      // material of every desc↔DOM desync. Recorded wherever it happens
      // (turn content or NodeView header) with the content flag.
      this.recorder.record("dom-mutation", {
        type: "childList",
        forced: force,
        inTurnContent: turnText !== null,
        turnId: turnText
          ? turnIdOf(turnText)
          : turnIdOf(record.target),
        caretTurnId,
        composing: this.view.composing,
        target: describeNode(record.target),
        added: Array.from(record.addedNodes).map(describeNode),
        removed: Array.from(record.removedNodes).map(describeNode),
      })
      if (turnText) this.scheduleIntegrityCheck("external-content-mutation")
    }
  }

  private caretTurnId(): string | null {
    const { $head } = this.view.state.selection
    for (let depth = $head.depth; depth > 0; depth--) {
      const node = $head.node(depth)
      if (node.type.name === "turn") {
        return typeof node.attrs.id === "string" ? node.attrs.id : null
      }
    }
    return null
  }
}

/** Closest turn contentDOM (`<p class="turn-text">`) containing the node. */
function closestTurnText(node: Node): Element | null {
  const el = node instanceof Element ? node : node.parentElement
  return el?.closest("[data-node-view-content]") ?? null
}

function turnIdOf(node: Node): string | null {
  const el = node instanceof Element ? node : node.parentElement
  return el?.closest("[data-turn-id]")?.getAttribute("data-turn-id") ?? null
}
