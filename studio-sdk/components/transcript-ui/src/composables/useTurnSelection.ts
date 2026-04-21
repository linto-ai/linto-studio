import {
  shallowReactive,
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
import type { Core } from "../core/types"
import { formatTime } from "../utils/time"

export interface TurnSelection {
  readonly count: ComputedRef<number>
  readonly hasSelection: ComputedRef<boolean>
  isSelected(turnId: string): boolean
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
  core: Core,
): TurnSelection {
  const selectedIds = shallowReactive(new Map<string, true>())
  let lastToggledId: string | null = null

  const count = computed(() => selectedIds.size)
  const hasSelection = computed(() => selectedIds.size > 0)

  function isSelected(turnId: string): boolean {
    return selectedIds.has(turnId)
  }

  function toggle(turnId: string) {
    if (selectedIds.has(turnId)) {
      selectedIds.delete(turnId)
    } else {
      selectedIds.set(turnId, true)
    }
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
    for (let i = start; i <= end; i++) {
      const id = ids[i]
      if (id != null) selectedIds.set(id, true)
    }
  }

  function clear() {
    selectedIds.clear()
    lastToggledId = null
  }

  async function copyText(): Promise<void> {
    const selected = turns.value.filter((t) => selectedIds.has(t.id))
    const text = selected.map(getTurnText).join("\n\n")
    await navigator.clipboard.writeText(text)
  }

  async function copyWithMetadata(): Promise<void> {
    const selected = turns.value.filter((t) => selectedIds.has(t.id))
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
      if (selectedIds.size === 0) return
      const currentIds = new Set(currentTurns.map((t) => t.id))
      for (const id of [...selectedIds.keys()]) {
        if (!currentIds.has(id)) selectedIds.delete(id)
      }
    },
  )

  // Clear selection on channel/translation change
  const unsubChannel = core.on("channel:change", clear)
  const unsubTranslation = core.on("translation:change", clear)

  // Escape to clear
  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && selectedIds.size > 0) {
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
    count,
    hasSelection,
    isSelected,
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
