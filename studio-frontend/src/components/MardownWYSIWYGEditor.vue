<template>
  <div class="markdown-editor-wrapper flex col">
    <!-- Mode toggle (hidden when hideHeader is true) -->
    <div v-if="!hideHeader" class="markdown-editor-header flex align-center">
      <button
        type="button"
        class="mode-btn"
        :class="{ active: mode === 'edit' }"
        @click="mode = 'edit'"
        :disabled="readonly">
        <span class="mode-icon">✏️</span>
        <span class="mode-label">{{ $t('publish.editor.edit_mode') }}</span>
      </button>
      <button
        type="button"
        class="mode-btn"
        :class="{ active: mode === 'preview' }"
        @click="mode = 'preview'">
        <span class="mode-icon">👁️</span>
        <span class="mode-label">{{ $t('publish.editor.preview_mode') }}</span>
      </button>
    </div>

    <!-- Edit mode: textarea (always show when hideHeader, otherwise respect mode) -->
    <div v-if="hideHeader || mode === 'edit'" class="markdown-edit-container flex col flex1">
      <div v-if="showToolbar && !readonly" class="markdown-editor-toolbar">
        <button type="button" class="toolbar-btn" @click="insertMarkdown('**', '**')" title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" class="toolbar-btn" @click="insertMarkdown('*', '*')" title="Italic">
          <em>I</em>
        </button>
        <button type="button" class="toolbar-btn" @click="insertMarkdown('~~', '~~')" title="Strikethrough">
          <s>S</s>
        </button>
        <span class="toolbar-separator"></span>
        <button type="button" class="toolbar-btn" @click="insertLineStart('# ')" title="H1">H1</button>
        <button type="button" class="toolbar-btn" @click="insertLineStart('## ')" title="H2">H2</button>
        <button type="button" class="toolbar-btn" @click="insertLineStart('### ')" title="H3">H3</button>
        <span class="toolbar-separator"></span>
        <button type="button" class="toolbar-btn" @click="insertLineStart('- ')" title="Liste à puces">•</button>
        <button type="button" class="toolbar-btn" @click="insertLineStart('1. ')" title="Liste numérotée">1.</button>
        <button type="button" class="toolbar-btn" @click="insertLineStart('> ')" title="Citation">"</button>
        <span class="toolbar-separator"></span>
        <button type="button" class="toolbar-btn" @click="insertMarkdown('`', '`')" title="Code">&lt;/&gt;</button>
        <button type="button" class="toolbar-btn" @click="insertText('\n---\n')" title="Ligne horizontale">―</button>
      </div>
      <textarea
        ref="textarea"
        class="markdown-textarea flex1"
        :value="value"
        :readonly="readonly"
        @input="onInput"
        @keydown.tab.prevent="onTab"
        placeholder="Écrivez en markdown..."
      ></textarea>
    </div>

    <!-- Preview mode: rendered markdown (only when not using hideHeader) -->
    <div v-else-if="!hideHeader" class="markdown-preview-container flex1" v-html="renderedMarkdown"></div>
  </div>
</template>

<script>
import { marked } from "marked"

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    showToolbar: {
      type: Boolean,
      default: true,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mode: "edit", // 'edit' or 'preview'
    }
  },
  computed: {
    renderedMarkdown() {
      if (!this.value) return ""
      return marked.parse(this.value)
    },
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value)
    },
    onTab(e) {
      const textarea = this.$refs.textarea
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = this.value
      const newValue = value.substring(0, start) + "  " + value.substring(end)
      this.$emit("input", newValue)
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    },
    insertMarkdown(before, after) {
      const textarea = this.$refs.textarea
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = this.value
      const selectedText = value.substring(start, end)
      const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end)
      this.$emit("input", newValue)
      this.$nextTick(() => {
        if (selectedText) {
          textarea.selectionStart = start
          textarea.selectionEnd = end + before.length + after.length
        } else {
          textarea.selectionStart = textarea.selectionEnd = start + before.length
        }
        textarea.focus()
      })
    },
    insertLineStart(prefix) {
      const textarea = this.$refs.textarea
      const start = textarea.selectionStart
      const value = this.value
      let lineStart = start
      while (lineStart > 0 && value[lineStart - 1] !== "\n") {
        lineStart--
      }
      const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart)
      this.$emit("input", newValue)
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + prefix.length
        textarea.focus()
      })
    },
    insertText(text) {
      const textarea = this.$refs.textarea
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const value = this.value
      const newValue = value.substring(0, start) + text + value.substring(end)
      this.$emit("input", newValue)
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + text.length
        textarea.focus()
      })
    },
    getMarkdown() {
      return this.value || ""
    },
  },
}
</script>

<style lang="scss" scoped>
.markdown-editor-wrapper {
  flex: 1;
  min-height: 0; // Important for flex scroll
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-primary, white);
}

.markdown-editor-header {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: var(--bg-secondary, #f5f5f5);
  border-bottom: 1px solid var(--border-color, #e0e0e0);

  .mode-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-secondary, #666);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    .mode-icon {
      font-size: 16px;
    }

    &:hover:not(:disabled) {
      background: var(--bg-hover, #e8e8e8);
      color: var(--text-primary, #333);
    }

    &.active {
      background: var(--primary-color, #1976d2);
      color: white;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.markdown-edit-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0; // Important for flex scroll
  overflow: hidden;
}

.markdown-editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 8px;
  background: var(--bg-tertiary, #fafafa);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  flex-shrink: 0;

  .toolbar-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-primary, #333);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background: var(--bg-hover, #e0e0e0);
    }
  }

  .toolbar-separator {
    width: 1px;
    height: 24px;
    margin: 4px 6px;
    background: var(--border-color, #e0e0e0);
    align-self: center;
  }
}

.markdown-textarea {
  flex: 1;
  min-height: 0; // Important for flex scroll
  width: 100%;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  overflow: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: var(--bg-primary, white);
  color: var(--text-primary, #333);

  &::placeholder {
    color: var(--text-secondary, #999);
  }

  &:read-only {
    background: var(--bg-secondary, #f9f9f9);
    cursor: default;
  }
}

.markdown-preview-container {
  flex: 1;
  overflow: auto;
  padding: 16px 24px;
  line-height: 1.7;
  color: var(--text-primary, #333);

  :deep(h1), :deep(h2), :deep(h3), :deep(h4) {
    font-weight: 600;
    margin: 1.5em 0 0.5em;
    line-height: 1.3;
  }
  :deep(h1) { font-size: 1.8em; border-bottom: 1px solid var(--border-color, #e0e0e0); padding-bottom: 0.3em; }
  :deep(h2) { font-size: 1.5em; }
  :deep(h3) { font-size: 1.25em; }
  :deep(h4) { font-size: 1.1em; }

  :deep(p) { margin: 0.8em 0; }

  :deep(ul), :deep(ol) {
    padding-left: 1.5em;
    margin: 0.8em 0;
  }

  :deep(li) {
    margin: 0.3em 0;
  }

  :deep(blockquote) {
    border-left: 4px solid var(--primary-color, #1976d2);
    margin: 1em 0;
    padding: 0.5em 1em;
    background: var(--bg-secondary, #f5f5f5);
    color: var(--text-secondary, #555);
    border-radius: 0 4px 4px 0;
  }

  :deep(code) {
    background: var(--bg-secondary, #f5f5f5);
    border-radius: 3px;
    padding: 0.2em 0.4em;
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.9em;
  }

  :deep(pre) {
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

  :deep(hr) {
    border: none;
    border-top: 2px solid var(--border-color, #e0e0e0);
    margin: 2em 0;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;

    th, td {
      border: 1px solid var(--border-color, #e0e0e0);
      padding: 10px 14px;
      text-align: left;
    }

    th {
      background: var(--bg-secondary, #f5f5f5);
      font-weight: 600;
    }

    tr:nth-child(even) {
      background: var(--bg-tertiary, #fafafa);
    }
  }

  :deep(a) {
    color: var(--primary-color, #1976d2);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  :deep(strong) {
    font-weight: 600;
  }
}
</style>
