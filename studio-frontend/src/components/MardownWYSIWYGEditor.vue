<template>
  <div class="flex wisiwyg" id="markdown-editor-container"></div>
</template>
<script>
import { bus } from "@/main.js"

// import { EditorView } from "prosemirror-view"
// import { EditorState } from "prosemirror-state"
// import {
//   schema,
//   defaultMarkdownParser,
//   defaultMarkdownSerializer,
// } from "prosemirror-markdown"

import { Editor } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
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
  },
  data() {
    return {
      editor: null,
    }
  },
  mounted() {
    // const mySchema = new Schema({
    //   nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
    //   marks: schema.spec.marks,
    // })
    // this.editor = new EditorView(
    //   document.getElementById("markdown-editor-container"),
    //   {
    //     state: EditorState.create({
    //       doc: defaultMarkdownParser.parse(this.value),
    //       schema,
    //     }),
    //   },
    // )
    this.editor = new Editor({
      // bind Tiptap to the `.element`
      element: document.getElementById("markdown-editor-container"),
      // register extensions
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
        //Markdown,
        Markdown.configure({
          tightLists: true, // No <p> inside <li> in markdown output
          //tightListClass: "tight", // Add class to <ul> allowing you to remove <p> margins when tight
          //bulletListMarker: "* ", // <li> prefix in markdown output
        }),
        ListItem,
        BulletList,
        Heading.configure({
          levels: [1, 2, 3, 4],
        }),
      ],
      // set the initial content
      content: "",
      // place the cursor in the editor after initialization
      autofocus: true,
      // make the text editable (default is true)
      editable: true,
      // prevent loading the default CSS (which isn't much anyway)
      injectCSS: false,
    })
    console.log(this.value)
    this.editor.commands.setContent(this.value)
  },
  methods: {},
  components: {},
}
</script>
