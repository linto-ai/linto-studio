<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  useTemplateRef,
  watch,
} from "vue"
import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"
import Button from "./Button.vue"
import { useI18n } from "@linto-ai/transcript-ui-i18n"
import { renderMarkdown } from "../utils/markdown"
import { getShadowAwareSelection } from "../utils/shadowAwareSelection"

const props = withDefaults(
  defineProps<{
    modelValue: string
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const { t } = useI18n()

// ── Markdown / HTML converters ────────────────────────────────────────

const turndown = new TurndownService({
  headingStyle: "atx",
  hr: "---",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  strongDelimiter: "**",
})
turndown.use(gfm)

function mdToHtml(md: string): string {
  return renderMarkdown(md)
}

function htmlToMd(html: string): string {
  if (!html) return ""
  return turndown.turndown(html)
}

// ── State ─────────────────────────────────────────────────────────────

const editorRef = useTemplateRef<HTMLDivElement>("editorEl")

const toolbarState = reactive({
  bold: false,
  italic: false,
  strike: false,
  h1: false,
  h2: false,
  h3: false,
  bulletList: false,
  orderedList: false,
  blockquote: false,
  codeBlock: false,
})

let lastEmittedMarkdown: string | null = null
let emitFrame: number | null = null
let selectionListener: (() => void) | null = null

// ── Core ──────────────────────────────────────────────────────────────

function setHtml(html: string): void {
  const el = editorRef.value
  if (!el) return
  el.innerHTML = html
}

function getCurrentMarkdown(): string {
  const el = editorRef.value
  if (!el) return ""
  return htmlToMd(el.innerHTML)
}

// ── Events ────────────────────────────────────────────────────────────

function onInput(): void {
  if (emitFrame !== null) cancelAnimationFrame(emitFrame)
  emitFrame = requestAnimationFrame(() => {
    emitFrame = null
    const md = getCurrentMarkdown()
    lastEmittedMarkdown = md
    if (md !== props.modelValue) emit("update:modelValue", md)
  })
}

function onKeydown(e: KeyboardEvent): void {
  // Shift+Enter → line break (vs new paragraph on plain Enter)
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault()
    document.execCommand("insertLineBreak")
  }
}

function onPaste(e: ClipboardEvent): void {
  e.preventDefault()
  const clipboard = e.clipboardData
  if (!clipboard) return
  const text = clipboard.getData("text/plain")
  if (!text) return

  const looksLikeMd =
    /^#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>|```|\*\*|__|\[.*\]\(/m.test(text)

  if (looksLikeMd) {
    document.execCommand("insertHTML", false, mdToHtml(text))
  } else {
    document.execCommand("insertText", false, text)
  }
}

// ── Toolbar commands ──────────────────────────────────────────────────

function focusEditor(): void {
  editorRef.value?.focus()
}

function execCmd(command: string): void {
  focusEditor()
  document.execCommand(command)
  updateToolbarState()
  onInput()
}

function toggleBlock(tag: "H1" | "H2" | "H3"): void {
  focusEditor()
  const sel = getShadowAwareSelection(editorRef.value)
  const inBlock = sel?.rangeCount && findAncestor(sel.anchorNode, tag)
  document.execCommand("formatBlock", false, inBlock ? "P" : tag)
  updateToolbarState()
  onInput()
}

function toggleBlockquote(): void {
  focusEditor()
  const sel = getShadowAwareSelection(editorRef.value)
  if (!sel || !sel.rangeCount) return

  const block = getParentBlock(sel.anchorNode)
  if (block && block.tagName === "BLOCKQUOTE") {
    const parent = block.parentNode
    if (!parent) return
    while (block.firstChild) {
      parent.insertBefore(block.firstChild, block)
    }
    parent.removeChild(block)
  } else {
    document.execCommand("formatBlock", false, "BLOCKQUOTE")
  }
  updateToolbarState()
  onInput()
}

function toggleCodeBlock(): void {
  focusEditor()
  const sel = getShadowAwareSelection(editorRef.value)
  if (!sel || !sel.rangeCount) return

  const pre = findAncestor(sel.anchorNode, "PRE")
  if (pre) {
    const p = document.createElement("p")
    p.textContent = pre.textContent ?? ""
    pre.parentNode?.replaceChild(p, pre)
    const range = document.createRange()
    range.selectNodeContents(p)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
  } else {
    const range = sel.getRangeAt(0)
    const text = range.toString() || "\n"
    const wrapper = document.createElement("pre")
    const code = document.createElement("code")
    code.textContent = text
    wrapper.appendChild(code)
    range.deleteContents()
    range.insertNode(wrapper)
    const newRange = document.createRange()
    newRange.setStartAfter(wrapper)
    newRange.collapse(true)
    sel.removeAllRanges()
    sel.addRange(newRange)
  }
  updateToolbarState()
  onInput()
}

// ── Selection / toolbar state ─────────────────────────────────────────

function startSelectionListener(): void {
  if (selectionListener) return
  selectionListener = () => updateToolbarState()
  document.addEventListener("selectionchange", selectionListener)
  updateToolbarState()
}

function stopSelectionListener(): void {
  if (selectionListener) {
    document.removeEventListener("selectionchange", selectionListener)
    selectionListener = null
  }
}

function updateToolbarState(): void {
  toolbarState.bold = document.queryCommandState("bold")
  toolbarState.italic = document.queryCommandState("italic")
  toolbarState.strike = document.queryCommandState("strikeThrough")
  toolbarState.h1 = isInAncestor("H1")
  toolbarState.h2 = isInAncestor("H2")
  toolbarState.h3 = isInAncestor("H3")
  toolbarState.bulletList = document.queryCommandState("insertUnorderedList")
  toolbarState.orderedList = document.queryCommandState("insertOrderedList")
  toolbarState.blockquote = isInAncestor("BLOCKQUOTE")
  toolbarState.codeBlock = isInAncestor("PRE")
}

function isInAncestor(tag: string): boolean {
  const sel = getShadowAwareSelection(editorRef.value)
  if (!sel || !sel.rangeCount) return false
  return !!findAncestor(sel.anchorNode, tag)
}

// ── DOM helpers ───────────────────────────────────────────────────────

function getParentBlock(node: Node | null): HTMLElement | null {
  const el = editorRef.value
  let n: Node | null = node
  while (n && n !== el) {
    if (
      n.nodeType === 1 &&
      /^(P|H[1-6]|BLOCKQUOTE|PRE|UL|OL|LI|DIV)$/.test(
        (n as HTMLElement).tagName,
      )
    ) {
      return n as HTMLElement
    }
    n = n.parentNode
  }
  return null
}

function findAncestor(node: Node | null, tag: string): HTMLElement | null {
  const el = editorRef.value
  let n: Node | null = node
  while (n && n !== el) {
    if (n.nodeType === 1 && (n as HTMLElement).tagName === tag) {
      return n as HTMLElement
    }
    n = n.parentNode
  }
  return null
}

function variantFor(active: boolean): "secondary" | "tertiary" {
  return active ? "secondary" : "tertiary"
}

// ── Lifecycle / watchers ──────────────────────────────────────────────

onMounted(() => {
  setHtml(mdToHtml(props.modelValue || ""))
})

onBeforeUnmount(() => {
  stopSelectionListener()
  if (emitFrame !== null) cancelAnimationFrame(emitFrame)
})

watch(
  () => props.modelValue,
  (next) => {
    // Skip echo: the parent re-sent what we just emitted.
    if (next === lastEmittedMarkdown) return
    // Skip if the editor already shows this content.
    if (next === getCurrentMarkdown()) return
    // Genuine external update (version switch, gateway content arrival).
    setHtml(mdToHtml(next || ""))
    lastEmittedMarkdown = null
  },
)
</script>

<template>
  <div class="markdown-editor">
    <div
      v-if="!disabled"
      class="markdown-editor__toolbar"
      role="toolbar"
      :aria-label="t('mdToolbar.label')">
      <Button
        size="sm"
        :variant="variantFor(toolbarState.h1)"
        icon="heading-1"
        :aria-label="t('mdToolbar.h1')"
        :title="t('mdToolbar.h1')"
        @click="toggleBlock('H1')" />
      <Button
        size="sm"
        :variant="variantFor(toolbarState.h2)"
        icon="heading-2"
        :aria-label="t('mdToolbar.h2')"
        :title="t('mdToolbar.h2')"
        @click="toggleBlock('H2')" />
      <Button
        size="sm"
        :variant="variantFor(toolbarState.h3)"
        icon="heading-3"
        :aria-label="t('mdToolbar.h3')"
        :title="t('mdToolbar.h3')"
        @click="toggleBlock('H3')" />

      <span class="markdown-editor__separator" aria-hidden="true" />

      <Button
        size="sm"
        :variant="variantFor(toolbarState.bold)"
        icon="bold"
        :aria-label="t('mdToolbar.bold')"
        :title="t('mdToolbar.bold')"
        @click="execCmd('bold')" />
      <Button
        size="sm"
        :variant="variantFor(toolbarState.italic)"
        icon="italic"
        :aria-label="t('mdToolbar.italic')"
        :title="t('mdToolbar.italic')"
        @click="execCmd('italic')" />

      <span class="markdown-editor__separator" aria-hidden="true" />

      <Button
        size="sm"
        :variant="variantFor(toolbarState.bulletList)"
        icon="list"
        :aria-label="t('mdToolbar.bulletList')"
        :title="t('mdToolbar.bulletList')"
        @click="execCmd('insertUnorderedList')" />
      <Button
        size="sm"
        :variant="variantFor(toolbarState.orderedList)"
        icon="list-ordered"
        :aria-label="t('mdToolbar.orderedList')"
        :title="t('mdToolbar.orderedList')"
        @click="execCmd('insertOrderedList')" />
      <Button
        size="sm"
        :variant="variantFor(toolbarState.blockquote)"
        icon="quote"
        :aria-label="t('mdToolbar.quote')"
        :title="t('mdToolbar.quote')"
        @click="toggleBlockquote" />

      <span class="markdown-editor__separator" aria-hidden="true" />

      <Button
        size="sm"
        :variant="variantFor(toolbarState.codeBlock)"
        icon="code-block"
        :aria-label="t('mdToolbar.codeBlock')"
        :title="t('mdToolbar.codeBlock')"
        @click="toggleCodeBlock" />

      <span class="markdown-editor__separator" aria-hidden="true" />

      <Button
        size="sm"
        variant="tertiary"
        icon="undo"
        :aria-label="t('mdToolbar.undo')"
        :title="t('mdToolbar.undo')"
        @click="execCmd('undo')" />
      <Button
        size="sm"
        variant="tertiary"
        icon="redo"
        :aria-label="t('mdToolbar.redo')"
        :title="t('mdToolbar.redo')"
        @click="execCmd('redo')" />
    </div>

    <div
      ref="editorEl"
      class="markdown-editor__content"
      :contenteditable="!disabled"
      @input="onInput"
      @keydown="onKeydown"
      @paste="onPaste"
      @focus="startSelectionListener"
      @blur="stopSelectionListener" />
  </div>
</template>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  color: var(--color-text-primary);
}

.markdown-editor__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
  position: sticky;
  top: 49px;
  z-index: 1;
}

.markdown-editor__separator {
  width: 1px;
  height: 20px;
  background-color: var(--color-border);
  margin: 0 var(--spacing-xs);
}

.markdown-editor__content {
  padding: 4rem clamp(1.5rem, 6rem, 8%);
  outline: none;
  min-height: 200px;
}

.markdown-editor__content > *:first-child {
  margin-top: 0;
}

.markdown-editor__content :deep(h1),
.markdown-editor__content :deep(h2),
.markdown-editor__content :deep(h3),
.markdown-editor__content :deep(h4) {
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  font-weight: 700;
  color: var(--color-text-primary);
}

.markdown-editor__content :deep(h1) {
  font-size: var(--font-size-xl);
}
.markdown-editor__content :deep(h2) {
  font-size: var(--font-size-lg);
}
.markdown-editor__content :deep(h3) {
  font-size: var(--font-size-base);
}
.markdown-editor__content :deep(h4) {
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

.markdown-editor__content :deep(p) {
  margin: 0 0 var(--spacing-md);
}

.markdown-editor__content :deep(ul),
.markdown-editor__content :deep(ol) {
  margin: 0 0 var(--spacing-md);
  padding-left: var(--spacing-lg);
}

.markdown-editor__content :deep(li) {
  margin: var(--spacing-xs) 0;
}

.markdown-editor__content :deep(blockquote) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-left: 3px solid var(--color-border);
  color: var(--color-text-secondary);
  font-style: italic;
}

.markdown-editor__content :deep(code) {
  font-family: var(--font-family-mono);
  font-size: 0.9em;
  padding: 1px 4px;
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
}

.markdown-editor__content :deep(pre) {
  margin: var(--spacing-md) 0;
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.markdown-editor__content :deep(pre code) {
  padding: 0;
  background: none;
}

.markdown-editor__content :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.markdown-editor__content :deep(hr) {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-lg) 0;
}

.markdown-editor__content :deep(strong) {
  font-weight: 700;
}

.markdown-editor__content :deep(table) {
  border-collapse: collapse;
  margin: var(--spacing-md) 0;
}

.markdown-editor__content :deep(th),
.markdown-editor__content :deep(td) {
  border: 1px solid var(--color-border);
  padding: var(--spacing-xs) var(--spacing-sm);
}

.markdown-editor__content :deep(th) {
  background-color: var(--color-surface);
  font-weight: 600;
}
</style>
