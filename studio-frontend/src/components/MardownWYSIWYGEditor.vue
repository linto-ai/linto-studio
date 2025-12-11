<template>
  <article class="flex col wisiwyg markdown-editor-wrapper">
    <div v-if="showToolbar && !readonly" class="markdown-editor-toolbar">
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isActive('bold') }"
        @click="toggleBold"
        :title="$t('publish.editor.toolbar.bold')">
        <span class="icon bold"></span>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isActive('italic') }"
        @click="toggleItalic"
        :title="$t('publish.editor.toolbar.italic')">
        <span class="icon italic"></span>
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isActive('heading', { level: 1 }) }"
        @click="toggleHeading(1)"
        :title="$t('publish.editor.toolbar.heading1')">
        H1
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isActive('heading', { level: 2 }) }"
        @click="toggleHeading(2)"
        :title="$t('publish.editor.toolbar.heading2')">
        H2
      </button>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isActive('heading', { level: 3 }) }"
        @click="toggleHeading(3)"
        :title="$t('publish.editor.toolbar.heading3')">
        H3
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        :class="{ active: isActive('bulletList') }"
        @click="toggleBulletList"
        :title="$t('publish.editor.toolbar.bullet_list')">
        <span class="icon list"></span>
      </button>
      <span class="toolbar-separator"></span>
      <button
        type="button"
        class="toolbar-btn"
        @click="undo"
        :disabled="!canUndo"
        :title="$t('publish.editor.toolbar.undo')">
        <span class="icon undo"></span>
      </button>
      <button
        type="button"
        class="toolbar-btn"
        @click="redo"
        :disabled="!canRedo"
        :title="$t('publish.editor.toolbar.redo')">
        <span class="icon redo"></span>
      </button>
    </div>
    <div id="markdown-editor-container" class="flex1"></div>
  </article>
</template>
<script>
import { Editor } from "@tiptap/core"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Table from "@tiptap/extension-table"
import { Markdown } from "tiptap-markdown"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import ListItem from "@tiptap/extension-list-item"
import BulletList from "@tiptap/extension-bullet-list"
import Heading from "@tiptap/extension-heading"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import History from "@tiptap/extension-history"

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
  },
  data() {
    return {
      editor: null,
      canUndo: false,
      canRedo: false,
    }
  },
  mounted() {
    this.editor = new Editor({
      element: document.getElementById("markdown-editor-container"),
      extensions: [
        Document,
        Paragraph,
        Text,
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Markdown.configure({
          tightLists: true, // No <p> inside <li> in markdown output
        }),
        ListItem,
        BulletList,
        Heading.configure({
          levels: [1, 2, 3, 4],
        }),
        Bold,
        Italic,
        History,
      ],
      content: "",
      autofocus: true,
      editable: !this.readonly,
      injectCSS: false,
    })
    this.editor.commands.setContent(this.value)
    this.editor.on("update", this.onUpdate.bind(this))
    this.editor.on("transaction", this.onTransaction.bind(this))
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  watch: {
    value(newValue) {
      // Only update if value is different from current editor content
      const currentContent = this.editor?.storage?.markdown?.getMarkdown() || ""
      if (newValue !== currentContent) {
        this.editor?.commands.setContent(newValue)
      }
    },
    readonly(newValue) {
      this.editor?.setEditable(!newValue)
    },
  },
  methods: {
    onUpdate() {
      this.$emit("input", this.editor.storage.markdown.getMarkdown())
    },
    onTransaction() {
      this.canUndo = this.editor?.can().undo() || false
      this.canRedo = this.editor?.can().redo() || false
    },
    isActive(type, options = {}) {
      return this.editor?.isActive(type, options) || false
    },
    toggleBold() {
      this.editor?.chain().focus().toggleBold().run()
    },
    toggleItalic() {
      this.editor?.chain().focus().toggleItalic().run()
    },
    toggleHeading(level) {
      this.editor?.chain().focus().toggleHeading({ level }).run()
    },
    toggleBulletList() {
      this.editor?.chain().focus().toggleBulletList().run()
    },
    undo() {
      this.editor?.chain().focus().undo().run()
    },
    redo() {
      this.editor?.chain().focus().redo().run()
    },
    // Public method to get current markdown content
    getMarkdown() {
      return this.editor?.storage?.markdown?.getMarkdown() || ""
    },
    // Public method to set content programmatically
    setContent(content) {
      this.editor?.commands.setContent(content)
    },
  },
  components: {},
}
</script>
