<template>
  <article class="flex wisiwyg" id="markdown-editor-container"></article>
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
  },
  data() {
    return {
      editor: null,
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
      ],
      content: "",
      autofocus: true,
      editable: !this.readonly,
      injectCSS: false,
    })
    this.editor.commands.setContent(this.value)
    this.editor.on("update", this.onUpdate.bind(this))
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  methods: {
    onUpdate() {
      this.$emit("input", this.editor.storage.markdown.getMarkdown())
    },
  },
  components: {},
}
</script>
