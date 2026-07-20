<script setup lang="ts">
import { onMounted, useTemplateRef } from "vue"
import { placeCaretAt } from "../../utils/placeCaretAt"
import { computeSelectionOffset } from "../../utils/computeSelectionOffset"
import { useI18n } from "../../i18n"

// Plain-text in-place editor for one turn. Strictly a single text node inside
// a plaintext-only contenteditable — never any markup in editable content
// (hard-learned rule from the ProseMirror era).
const props = defineProps<{
  text: string
  caretOffset?: number
}>()

const emit = defineEmits<{
  save: [text: string]
  cancel: []
  split: [text: string, offset: number]
}>()

const { t } = useI18n()
const editableRef = useTemplateRef<HTMLElement>("editable")

// Set once an explicit outcome (save/cancel/split) was emitted, so the blur
// that follows it — or the one fired during unmount — can't emit a second one.
let settled = false

onMounted(() => {
  const el = editableRef.value
  if (!el) return
  placeCaretAt(el, props.caretOffset ?? props.text.length)
})

function getText(): string {
  return editableRef.value?.innerText ?? ""
}

defineExpose({ getText })

function settle(emitOutcome: () => void): void {
  if (settled) return
  settled = true
  emitOutcome()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    // A turn is a single paragraph: Enter splits it at the caret instead of
    // inserting a line break.
    event.preventDefault()
    const el = editableRef.value
    const text = getText()
    const offset = (el && computeSelectionOffset(el)) ?? text.length
    settle(() => emit("split", text, offset))
  } else if (event.key === "Escape") {
    event.preventDefault()
    settle(() => emit("cancel"))
  }
}

// Leaving the field commits (Notion-like inline editing). Escape is the only
// way out without saving.
function onBlur() {
  settle(() => emit("save", getText()))
}
</script>

<template>
  <p
    ref="editable"
    class="turn-text-editor"
    contenteditable="plaintext-only"
    role="textbox"
    aria-multiline="false"
    :aria-label="t('transcription.turnEditor')"
    spellcheck="true"
    @keydown="onKeydown"
    @blur="onBlur"
    v-text="text" />
</template>

<style scoped>
.turn-text-editor {
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  cursor: text;
  outline: 2px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  padding: 0;
}
</style>
