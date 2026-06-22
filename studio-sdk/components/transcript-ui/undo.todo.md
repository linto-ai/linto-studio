# Undo / Redo — design & plan

**Status:** not started. Foundations are in place (all speaker edition actions
are already wrapped in `ydoc.transact(fn, origin)` with typed origins, ready to
be tracked by a `Y.UndoManager`).

---

## 1. Context

The editor supports 4 collaborative speaker actions on top of text editing:

| Action | Entry point | File |
|---|---|---|
| Rename | `SpeakerSidebar` (inline `EditableText`) | `plugins/transcriptionEditor/utils/speakerActions.ts::renameSpeaker` |
| Switch | `SpeakerPopover` on a turn's label | `speakerActions.ts::switchTurnSpeaker` |
| New + assign | `SpeakerPopover` → "+ Nouveau" | `speakerActions.ts::createSpeakerAndAssign` |
| Merge A→B | `SpeakerMenu` kebab → `MergeDialog` | `speakerActions.ts::mergeSpeakers` |

Each action is a single `ydoc.transact(fn, origin)` touching either:
- `fragment` (TipTap XmlFragment) — turn text / turn attributes
- `speakersMap` (Y.Map on the same Y.Doc) — speakers dict
- Both (e.g. merge rewrites turn.speakerId attrs AND deletes from speakersMap)

Today, nothing tracks those transactions — no Ctrl+Z coverage for speaker ops,
and TipTap's built-in history (via `@tiptap/extension-collaboration`) only
knows about the fragment.

---

## 2. Decisions already made (with rationale)

### 2.1 Single `Y.UndoManager` tracking both shared types

One manager, scope = `[fragment, speakersMap]`. A single Ctrl+Z reverses the
last action regardless of whether it was text or speaker.

**Why not two separate stacks?** If Tiptap owns the fragment history and we
own the speakers history, the "last action" becomes ambiguous to the user —
Ctrl+Z's effect depends on what element has focus, which is brittle UX.

**Consequence:** we must *disable* Tiptap's internal history (or pass our own
manager to it) and rebind Ctrl+Z inside the editor view to call
`manager.undo()`.

### 2.2 Actions are silent, UI feedback only on undo/redo

No toast on action. The action's visual effect (name changed, turn reassigned,
speaker merged) IS the feedback. Toasts / panels kick in only when the user
triggers undo or redo, to confirm what was reversed.

**Why this over Gmail-style "Undone [Undo]" toast?** User pushed back on
GAFAM-like UX patterns and preferred a discreet "check mark" + always-visible
undo/redo bar.

### 2.3 UI: undo/redo bar + animated green check

Placement: **top of `SpeakerSidebar`** for v1 (user: "c'est un composant
'atomique' qui sera bougeable"). Two icon-only `Button`s, tooltip, disabled
when stack empty. A small green check pops next to the undo button for
~800ms (fade/scale in 200ms, visible 600ms, fade out 200ms) every time a
tagged action lands on the stack.

`prefers-reduced-motion` must be respected (opacity flash only, no scale).

### 2.4 Check only emitted for tagged actions

Plain text typing should NOT trigger the check (would spam). Only actions
whose transaction has an origin of shape `{ type: "speaker:*" | "turn:reassign" }`
bump the `lastTaggedActionAt` ref that the animation watches.

### 2.5 Keyboard for later

User explicitly deferred global Ctrl+Z (outside editor focus) to Phase C.
For Phase B we only:
- Bind undo/redo to the buttons
- Rebind Ctrl+Z inside the editor view (so it calls our manager instead of
  Tiptap's removed internal one)

### 2.6 Merge always has a confirm dialog

Already implemented (`MergeDialog`). The dialog shows the count of affected
turns so the user has context. Post-merge, Ctrl+Z still fully reverses it
(single transaction).

---

## 3. Current state of the code

### 3.1 Typed origins already in place

File: `src/plugins/transcriptionEditor/utils/speakerActions.ts`

```ts
export interface RenameSpeakerOrigin {
  type: "speaker:rename"
  speakerId: string
  from: string
  to: string
}
export interface ReassignTurnOrigin {
  type: "turn:reassign"
  turnId: string
  from: string | null
  to: string
}
export interface CreateAndAssignOrigin {
  type: "speaker:create-and-assign"
  speakerId: string
  name: string
  turnId: string
}
export interface MergeSpeakersOrigin {
  type: "speaker:merge"
  from: string
  to: string
  affectedTurnIds: string[]
}
export type SpeakerActionOrigin = /* union of the 4 */
```

Every action in that file already calls:

```ts
ydoc.transact(() => { /* ... */ }, origin)
```

So when the `Y.UndoManager` lands, we just need to declare these origins as
`trackedOrigins` and attach a `stack-item-added` listener to capture the
metadata per stack item.

### 3.2 Access paths

- `core.transcriptionEditor.doc` — the Y.Doc
- `core.transcriptionEditor.fragment` — the XmlFragment
- `core.transcriptionEditor.speakersMap` — the Y.Map (getter, `null` if no session)
- `core.transcriptionEditor.tiptapEditor.value` — the Tiptap Editor instance

All lifecycled per session in `src/plugins/transcriptionEditor/index.ts`
(`startSession` / `destroyCurrentSession`). The UndoManager will need the
same lifecycle hooks.

### 3.3 What collaborators see via Yjs

Y.UndoManager by default only undoes changes with origin matching the
tracked origins, AND only changes from the local client. Remote collaborators'
edits are NOT reversed by local undo. That's the correct CRDT behavior.

---

## 4. Target architecture

### 4.1 Plugin slot

Extend `TranscriptionEditorPluginApi` (`src/core/types.ts`):

```ts
interface TranscriptionEditorPluginApi {
  // ... existing ...
  readonly history: EditorHistoryApi
}

interface EditorHistoryApi {
  canUndo: Ref<boolean>
  canRedo: Ref<boolean>
  undo(): void
  redo(): void
  /** Bumped when a tagged speaker/turn action is added to the stack — the UI
   *  watches this to trigger the check animation. */
  lastTaggedActionAt: Ref<number>
  /** Minimal log for the future history panel (Phase C). */
  entries: Ref<HistoryEntry[]>
}

interface HistoryEntry {
  at: number               // Date.now()
  origin: SpeakerActionOrigin
  direction: "do" | "undone"
}
```

### 4.2 Setup (pseudocode, inside `startSession`)

```ts
const undoManager = new Y.UndoManager(
  [fragment, speakersMap],
  {
    // Only track our own tagged transactions + Tiptap's own edits.
    // We need to identify Tiptap's origin so typing still lands on the stack.
    trackedOrigins: new Set([/* ySyncPluginKey-like origin(s) + our origins */]),
  },
)

undoManager.on("stack-item-added", (event) => {
  event.stackItem.meta.set("origin", event.origin)
  if (isTaggedOrigin(event.origin)) {
    lastTaggedActionAt.value = Date.now()
    entries.value = [...entries.value, {
      at: Date.now(),
      origin: event.origin,
      direction: "do",
    }]
  }
})

undoManager.on("stack-item-popped", (event) => {
  const origin = event.stackItem.meta.get("origin")
  if (isTaggedOrigin(origin)) {
    entries.value = [...entries.value, {
      at: Date.now(),
      origin,
      direction: event.type === "undo" ? "undone" : "do",
    }]
  }
})
```

### 4.3 Composable

`src/composables/useEditorHistory.ts`:

```ts
export function useEditorHistory() {
  const core = useCore()
  const api = computed(() => core.transcriptionEditor?.history)
  return {
    canUndo: computed(() => api.value?.canUndo.value ?? false),
    canRedo: computed(() => api.value?.canRedo.value ?? false),
    undo: () => api.value?.undo(),
    redo: () => api.value?.redo(),
    lastTaggedActionAt: computed(() => api.value?.lastTaggedActionAt.value ?? 0),
  }
}
```

### 4.4 Component

`src/components/molecules/UndoHistoryControls.vue`:

- 2 `<Button>` icon-only (icons to add in `atoms/icons.ts`: `undo` / `redo`
  from `lucide-vue-next`)
- Bound to `canUndo` / `canRedo` for `:disabled`
- Absolute-positioned `<span class="check">` next to the undo button
- Watches `lastTaggedActionAt` → triggers an animation class that clears
  itself after ~800ms (via `setTimeout` or CSS animation `animation-fill-mode: forwards`)
- `prefers-reduced-motion` media query swaps the scale for a plain opacity flash

Placement in `SpeakerSidebar.vue`: at the top, above the channel/translation
selectors. Gated by `capabilities.speakers === 'edit'` or similar (user to
confirm — maybe also gate by `text === 'edit'`).

---

## 5. Risks / things to demine

### 5.1 Tiptap + `Y.UndoManager` coexistence (HIGH)

`@tiptap/extension-collaboration` internally creates its own `Y.UndoManager`
on the bound fragment. If we create a second one on the same fragment, both
will try to undo the same operations → divergence / double-pop.

**Options to investigate:**

1. **Pass our manager to Tiptap.** Check the current version's API:
   - Recent `@tiptap/extension-collaboration` exposes `undoManager` option?
   - Or a separate `@tiptap/extension-collaboration-history` that accepts an
     external manager?
2. **Disable Tiptap's history entirely** (`Collaboration.configure({ history: false })`
   or equivalent) and bind Ctrl+Z ourselves inside the editor's keymap.
3. **Fork the history extension.** Last resort.

Start by reading the installed version's code:
```
ls node_modules/@tiptap/extension-collaboration/dist/
```

### 5.2 Ctrl+Z inside the editor

Once we replace Tiptap's manager with ours, the default key binding goes
away. We must add a keymap extension:

```ts
Extension.create({
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => { undoManager.undo(); return true },
      "Mod-Shift-z": () => { undoManager.redo(); return true },
      "Mod-y": () => { undoManager.redo(); return true },
    }
  },
})
```

### 5.3 Transactions NOT originating from our wrappers

Plain text typing in Tiptap produces Yjs updates with Tiptap's own origin
(a `ySyncPluginKey`-flavored one). Those MUST be tracked too, else
`Ctrl+Z` does nothing after typing. Finding the right origin identifier
is part of the Tiptap spike.

### 5.4 Remote transactions

By default, `Y.UndoManager` only tracks *local* transactions. That's what
we want — we don't want Alice's Ctrl+Z to undo Bob's edits. Verify this
is still the default in the installed `yjs` version.

### 5.5 Session lifecycle

`Y.UndoManager` holds references to the doc + shared types. It must be
destroyed in `destroyCurrentSession` (via `undoManager.destroy()`) alongside
the doc. Add to `sessionCleanups` in `src/plugins/transcriptionEditor/index.ts`.

---

## 6. Implementation plan (ordered)

### Step 1 — Spike Tiptap compat (~1-2h)

Goal: know how to run a single `Y.UndoManager` without fighting Tiptap.

1. Read `@tiptap/extension-collaboration` source in `node_modules/`
2. Write a minimal local test: create a Y.Doc with a fragment + map,
   a Tiptap editor, a single `Y.UndoManager`, verify Ctrl+Z reverses
   both text edits and map mutations
3. Document the finding (one of: "pass manager to extension", "disable
   history + rebind keymap", "other")

### Step 2 — Wire the UndoManager into the plugin session

1. In `src/plugins/transcriptionEditor/index.ts`:
   - Create the manager in `startSession`, after the fragment + speakersMap
     are available and after Tiptap is configured per step 1 finding
   - Install `stack-item-added` / `stack-item-popped` listeners
   - Push `undoManager.destroy()` to `sessionCleanups`
2. Add `history: EditorHistoryApi` to `TranscriptionEditorPluginApi`
   (`src/core/types.ts`)
3. Expose getters for `canUndo`/`canRedo` that reflect
   `undoManager.undoStack.length > 0` / `redoStack.length > 0` reactively
   (use a small internal ref that the listeners bump)

### Step 3 — Composable

`src/composables/useEditorHistory.ts` per §4.3 above.

### Step 4 — UI component

1. Add `undo` / `redo` icons to `src/components/atoms/icons.ts`
   (from `lucide-vue-next`: `Undo2`, `Redo2`)
2. Create `src/components/molecules/UndoHistoryControls.vue`:
   - Two buttons + animated check
   - Uses `useEditorHistory()` + `useI18n()` (add i18n keys
     `history.undo` / `history.redo`)
3. Mount in `SpeakerSidebar.vue` at the top
4. Ensure `capabilities` gating is correct

### Step 5 — Shadow DOM check

If `UndoHistoryControls` lands inside anything rendered by Tiptap's
NodeViewRenderer (it shouldn't in Phase B — it's in the sidebar), no
style-collection needed. If placement changes, add to
`src/webcomponent.ts`.

### Step 6 — Manual tests

Matrix to walk through:
- Type text → Ctrl+Z reverses typing, check does NOT animate
- Rename speaker → Ctrl+Z reverses, check animates
- Switch turn speaker → Ctrl+Z reverses attr, check animates
- Create + assign new speaker → Ctrl+Z removes speaker + reverts turn attr,
  check animates
- Merge A→B → Ctrl+Z fully reverses in one shot
- Two tabs: local undo does NOT revert remote user's edits
- Session restart (switch translation) → history cleared

---

## 7. Out of scope for v1 (explicitly deferred)

- **Global Ctrl+Z outside editor focus.** User will test and tell us if it
  feels missing. If so, add a document-level keydown listener in `Layout.vue`
  that skips native inputs via `document.activeElement` check.
- **History panel** (the full timeline view). `history.entries` is populated
  from day one for this; the UI comes later. Probably a drawer or a popover
  accessible from the undo/redo bar.
- **Delete speaker** action. Separate from undo but will need its own
  origin type when it lands.
- **Grouping / coalescing** of rapid edits. Y.UndoManager's
  `captureTimeout` default (500ms) already coalesces consecutive edits
  from the same origin. Fine for v1.

---

## 8. Key files for reference

| File | Why |
|---|---|
| `src/plugins/transcriptionEditor/utils/speakerActions.ts` | All origins already defined + transactions already wrapped |
| `src/plugins/transcriptionEditor/index.ts` | Where the Y.Doc / provider / Tiptap editor are lifecycled; add UndoManager next to `speakersMap` |
| `src/plugins/transcriptionEditor/utils/speakersSync.ts` | Bridge core.speakers ↔ Y.Map — DO NOT duplicate a bridge in the UndoManager path; undo flows through Y.Map → speakersSync observer → core.speakers |
| `src/core/types.ts` | Add `EditorHistoryApi` to `TranscriptionEditorPluginApi` |
| `src/components/SpeakerSidebar.vue` | Target mount point for `<UndoHistoryControls>` |
| `node_modules/@tiptap/extension-collaboration/` | Read during the spike to decide manager strategy |

---

## 9. Quick sanity check before starting

Before touching code, verify nothing has drifted:

```bash
grep -n "ydoc.transact" src/plugins/transcriptionEditor/utils/speakerActions.ts
```

Should show 4 call sites, each with a tagged origin. If any action is
missing the origin or the transact wrap, fix that first — the UndoManager
cannot track it otherwise.
