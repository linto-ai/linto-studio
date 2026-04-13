import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  provide,
  inject,
  type Ref,
  type ComputedRef,
  type InjectionKey,
} from "vue"
import type { Turn, Speaker } from "../types/editor"
import type { EditorStore } from "../core/types"
import { formatTime } from "../utils/time"

export interface TurnSelection {
  readonly selectedIds: Ref<Set<string>>
  readonly count: ComputedRef<number>
  readonly hasSelection: ComputedRef<boolean>
  toggle(turnId: string): void
  selectRange(turnId: string): void
  clear(): void
  copyText(): Promise<void>
  copyWithMetadata(): Promise<void>
}

const turnSelectionKey: InjectionKey<TurnSelection> = Symbol("turnSelection")

function getTurnText(turn: Turn): string {
  if (turn.words.length > 0) {
    return turn.words.map((w) => w.text).join(" ")
  }
  return turn.text ?? ""
}

export function provideTurnSelection(
  turns: Ref<Turn[]> | ComputedRef<Turn[]>,
  speakers: Map<string, Speaker>,
  editor: EditorStore,
): TurnSelection {
  const selectedIds = ref(new Set<string>())
  let lastToggledId: string | null = null

  const count = computed(() => selectedIds.value.size)
  const hasSelection = computed(() => selectedIds.value.size > 0)

  function toggle(turnId: string) {
    const next = new Set(selectedIds.value)
    if (next.has(turnId)) {
      next.delete(turnId)
    } else {
      next.add(turnId)
    }
    selectedIds.value = next
    lastToggledId = turnId
  }

  function selectRange(turnId: string) {
    if (lastToggledId === null) {
      toggle(turnId)
      return
    }
    const ids = turns.value.map((t) => t.id)
    const fromIndex = ids.indexOf(lastToggledId)
    const toIndex = ids.indexOf(turnId)
    if (fromIndex === -1 || toIndex === -1) {
      toggle(turnId)
      return
    }
    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)
    const next = new Set(selectedIds.value)
    for (let i = start; i <= end; i++) {
      const id = ids[i]
      if (id != null) next.add(id)
    }
    selectedIds.value = next
  }

  function clear() {
    selectedIds.value = new Set()
    lastToggledId = null
  }

  async function copyText(): Promise<void> {
    const selected = turns.value.filter((t) => selectedIds.value.has(t.id))
    const text = selected.map(getTurnText).join("\n\n")
    await navigator.clipboard.writeText(text)
  }

  async function copyWithMetadata(): Promise<void> {
    const selected = turns.value.filter((t) => selectedIds.value.has(t.id))
    const blocks = selected.map((turn) => {
      const speaker = turn.speakerId
        ? speakers.get(turn.speakerId)
        : undefined
      const name = speaker?.name ?? ""
      const time = turn.startTime != null ? formatTime(turn.startTime) : ""
      const header = [name, time].filter(Boolean).join(" (") + (time ? ")" : "")
      const text = getTurnText(turn)
      return header ? `${header}\n${text}` : text
    })
    await navigator.clipboard.writeText(blocks.join("\n\n"))
  }

  // Prune stale IDs when turns change
  watch(
    () => turns.value,
    (currentTurns) => {
      if (selectedIds.value.size === 0) return
      const currentIds = new Set(currentTurns.map((t) => t.id))
      const pruned = new Set(
        [...selectedIds.value].filter((id) => currentIds.has(id)),
      )
      if (pruned.size !== selectedIds.value.size) {
        selectedIds.value = pruned
      }
    },
  )

  // Clear selection on channel/translation change
  const unsubChannel = editor.on("channel:change", clear)
  const unsubTranslation = editor.on("translation:change", clear)

  // Escape to clear
  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && selectedIds.value.size > 0) {
      clear()
    }
  }

  onMounted(() => {
    document.addEventListener("keydown", onKeydown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener("keydown", onKeydown)
    unsubChannel()
    unsubTranslation()
  })

  const selection: TurnSelection = {
    selectedIds,
    count,
    hasSelection,
    toggle,
    selectRange,
    clear,
    copyText,
    copyWithMetadata,
  }

  provide(turnSelectionKey, selection)
  return selection
}

export function useTurnSelection(): TurnSelection {
  const sel = inject(turnSelectionKey)
  if (!sel)
    throw new Error("useTurnSelection() requires provideTurnSelection()")
  return sel
}
