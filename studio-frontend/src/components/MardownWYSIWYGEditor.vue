<template>
  <div class="markdown-editor-wrapper flex col">
    <div v-if="showToolbar && !readonly" class="markdown-editor-toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.bold }"
        @click="execCmd('bold')"
        title="Bold">
        <strong>B</strong>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.italic }"
        @click="execCmd('italic')"
        title="Italic">
        <em>I</em>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.strike }"
        @click="execCmd('strikeThrough')"
        title="Strikethrough">
        <s>S</s>
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.h1 }"
        @click="toggleBlock('H1')"
        title="H1">
        H1
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.h2 }"
        @click="toggleBlock('H2')"
        title="H2">
        H2
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.h3 }"
        @click="toggleBlock('H3')"
        title="H3">
        H3
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.bulletList }"
        @click="execCmd('insertUnorderedList')"
        title="Liste a puces">
        &#8226;
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.orderedList }"
        @click="execCmd('insertOrderedList')"
        title="Liste numerotee">
        1.
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.blockquote }"
        @click="toggleBlockquote()"
        title="Citation">
        &#8220;
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: toolbarState.codeBlock }"
        @click="toggleCodeBlock()"
        title="Code">
        &lt;/&gt;
      </button>
      <button
        type="button"
        class="toolbar-btn"
        @click="execCmd('insertHorizontalRule')"
        title="Ligne horizontale">
        &#8213;
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        @click="execCmd('undo')"
        title="Undo">
        &#8617;
      </button>
      <button
        type="button"
        class="toolbar-btn"
        @click="execCmd('redo')"
        title="Redo">
        &#8618;
      </button>
    </div>
    <div class="markdown-editor-content flex1">
      <div
        ref="editorEl"
        class="native-editor"
        :contenteditable="!readonly"
        @input="onInput"
        @keydown="onKeydown"
        @paste="onPaste"
        @focus="startSelectionListener"
        @blur="stopSelectionListener"></div>
    </div>
  </div>
</template>

<script>
import { marked } from "marked"
import TurndownService from "turndown"
import { gfm } from "turndown-plugin-gfm"

// Configure marked: disable features we don't need
marked.setOptions({
  gfm: true,
  breaks: false,
  async: false,
})

// Configure turndown: HTML → markdown
function createTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    strongDelimiter: "**",
  })
  td.use(gfm) // adds strikethrough support (~~)
  return td
}

const turndown = createTurndown()

function mdToHtml(markdown) {
  if (!markdown) return ""
  return marked.parse(markdown)
}

function htmlToMd(html) {
  if (!html) return ""
  return turndown.turndown(html)
}

export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      toolbarState: {
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
      },
    }
  },
  watch: {
    value(newVal) {
      // Skip echo-back: parent re-sent what we just emitted
      if (newVal === this._lastEmittedMarkdown) return
      // Skip if editor content already matches
      const currentMd = this._getCurrentMarkdown()
      if (newVal === currentMd) return
      // Genuine external update (version switch, generation load)
      this._setHtml(mdToHtml(newVal || ""))
      this._lastEmittedMarkdown = null
    },
    readonly() {
      // contenteditable binding handles this reactively
    },
  },
  created() {
    this._lastEmittedMarkdown = null
    this._emitTimer = null
    this._selectionListener = null
  },
  mounted() {
    this._setHtml(mdToHtml(this.value || ""))
  },
  destroyed() {
    this.stopSelectionListener()
    if (this._emitTimer) cancelAnimationFrame(this._emitTimer)
  },
  methods: {
    // --- Core ---

    _setHtml(html) {
      const el = this.$refs.editorEl
      if (!el) return
      el.innerHTML = html
    },

    _getCurrentMarkdown() {
      const el = this.$refs.editorEl
      if (!el) return ""
      return htmlToMd(el.innerHTML)
    },

    getMarkdown() {
      return this._getCurrentMarkdown() || this.value || ""
    },

    // --- Events ---

    onInput() {
      if (this._emitTimer) cancelAnimationFrame(this._emitTimer)
      this._emitTimer = requestAnimationFrame(() => {
        const md = this._getCurrentMarkdown()
        this._lastEmittedMarkdown = md
        this.$emit("input", md)
      })
    },

    onKeydown(e) {
      // Shift+Enter → line break (not new paragraph)
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault()
        document.execCommand("insertLineBreak")
      }
    },

    onPaste(e) {
      e.preventDefault()
      const clipboard = e.clipboardData
      const text = clipboard.getData("text/plain")
      if (!text) return

      // Check if pasted text looks like markdown
      const looksLikeMd =
        /^#{1,6}\s|^\s*[-*+]\s|^\s*\d+\.\s|^\s*>|```|\*\*|__|\[.*\]\(/.test(
          text
        )

      if (looksLikeMd) {
        // Convert markdown to HTML and insert
        const html = mdToHtml(text)
        document.execCommand("insertHTML", false, html)
      } else {
        // Insert as plain text
        document.execCommand("insertText", false, text)
      }
    },

    // --- Toolbar commands ---

    execCmd(command) {
      this.$refs.editorEl.focus()
      document.execCommand(command)
      this._updateToolbarState()
      this.onInput()
    },

    toggleBlock(tag) {
      this.$refs.editorEl.focus()
      // If already in this block type, revert to paragraph
      const sel = window.getSelection()
      const inBlock = sel.rangeCount && this._findAncestor(sel.anchorNode, tag)
      if (inBlock) {
        document.execCommand("formatBlock", false, "P")
      } else {
        document.execCommand("formatBlock", false, tag)
      }
      this._updateToolbarState()
      this.onInput()
    },

    toggleBlockquote() {
      this.$refs.editorEl.focus()
      const sel = window.getSelection()
      if (!sel.rangeCount) return

      const block = this._getParentBlock(sel.anchorNode)
      if (block && block.tagName === "BLOCKQUOTE") {
        // Unwrap: move children out of blockquote
        const parent = block.parentNode
        while (block.firstChild) {
          parent.insertBefore(block.firstChild, block)
        }
        parent.removeChild(block)
      } else {
        document.execCommand("formatBlock", false, "BLOCKQUOTE")
      }
      this._updateToolbarState()
      this.onInput()
    },

    toggleCodeBlock() {
      this.$refs.editorEl.focus()
      const sel = window.getSelection()
      if (!sel.rangeCount) return

      const pre = this._findAncestor(sel.anchorNode, "PRE")
      if (pre) {
        // Unwrap: replace <pre><code> with <p>
        const p = document.createElement("p")
        p.textContent = pre.textContent
        pre.parentNode.replaceChild(p, pre)
        // Place cursor in new paragraph
        const range = document.createRange()
        range.selectNodeContents(p)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)
      } else {
        // Wrap selection in <pre><code>
        const range = sel.getRangeAt(0)
        const text = range.toString() || "\n"
        const pre = document.createElement("pre")
        const code = document.createElement("code")
        code.textContent = text
        pre.appendChild(code)
        range.deleteContents()
        range.insertNode(pre)
        // Place cursor after
        const newRange = document.createRange()
        newRange.setStartAfter(pre)
        newRange.collapse(true)
        sel.removeAllRanges()
        sel.addRange(newRange)
      }
      this._updateToolbarState()
      this.onInput()
    },

    // --- Selection / toolbar state ---

    startSelectionListener() {
      if (this._selectionListener) return
      this._selectionListener = () => this._updateToolbarState()
      document.addEventListener("selectionchange", this._selectionListener)
      this._updateToolbarState()
    },

    stopSelectionListener() {
      if (this._selectionListener) {
        document.removeEventListener(
          "selectionchange",
          this._selectionListener
        )
        this._selectionListener = null
      }
    },

    _updateToolbarState() {
      this.toolbarState = {
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        strike: document.queryCommandState("strikeThrough"),
        h1: this._isInAncestor("H1"),
        h2: this._isInAncestor("H2"),
        h3: this._isInAncestor("H3"),
        bulletList: document.queryCommandState("insertUnorderedList"),
        orderedList: document.queryCommandState("insertOrderedList"),
        blockquote: this._isInAncestor("BLOCKQUOTE"),
        codeBlock: this._isInAncestor("PRE"),
      }
    },

    _isInAncestor(tag) {
      const sel = window.getSelection()
      if (!sel.rangeCount) return false
      return !!this._findAncestor(sel.anchorNode, tag)
    },

    // --- DOM helpers ---

    _getParentBlock(node) {
      const el = this.$refs.editorEl
      while (node && node !== el) {
        if (
          node.nodeType === 1 &&
          /^(P|H[1-6]|BLOCKQUOTE|PRE|UL|OL|LI|DIV)$/.test(node.tagName)
        ) {
          return node
        }
        node = node.parentNode
      }
      return null
    },

    _findAncestor(node, tag) {
      const el = this.$refs.editorEl
      while (node && node !== el) {
        if (node.nodeType === 1 && node.tagName === tag) return node
        node = node.parentNode
      }
      return null
    },
  },
}
</script>

<style lang="scss" scoped>
.markdown-editor-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.markdown-editor-content {
  flex: 1;
  min-height: 0;
  overflow: auto;

  .native-editor {
    outline: none;
    padding: 16px 24px;
    min-height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-primary, #333);

    > *:first-child {
      margin-top: 0;
    }

    h1,
    h2,
    h3,
    h4 {
      font-weight: 600;
      margin: 1.5em 0 0.5em;
      line-height: 1.3;
    }

    h1 {
      font-size: 1.8em;
      border-bottom: 1px solid var(--border-color, #e0e0e0);
      padding-bottom: 0.3em;
    }

    h2 {
      font-size: 1.5em;
    }

    h3 {
      font-size: 1.25em;
    }

    h4 {
      font-size: 1.1em;
    }

    p {
      margin: 0.8em 0;
    }

    ul,
    ol {
      padding-left: 1.5em;
      margin: 0.8em 0;
    }

    li {
      margin: 0.3em 0;
    }

    blockquote {
      border-left: 4px solid var(--primary-color, #1976d2);
      margin: 1em 0;
      padding: 0.5em 1em;
      background: var(--bg-secondary, #f5f5f5);
      color: var(--text-secondary, #555);
      border-radius: 0 4px 4px 0;
    }

    code {
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 3px;
      padding: 0.2em 0.4em;
      font-family: "Monaco", "Menlo", monospace;
      font-size: 0.9em;
    }

    pre {
      background: var(--bg-secondary, #f5f5f5);
      border-radius: 6px;
      padding: 1em;
      overflow-x: auto;
      margin: 1em 0;

      code {
        background: none;
        padding: 0;
      }
    }

    hr {
      border: none;
      border-top: 2px solid var(--border-color, #e0e0e0);
      margin: 2em 0;
    }

    a {
      color: var(--primary-color, #1976d2);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    strong {
      font-weight: 600;
    }
  }
}
</style>
