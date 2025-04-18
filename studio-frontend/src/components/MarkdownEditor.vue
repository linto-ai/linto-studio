<template>
  <div class="flex" id="markdown-editor-container">
    <section
      id="markdown-editor-source"
      class="flex col flex1 no-margin no-padding">
      <header>
        <h4>{{ $t("markdown_editor.source") }}</h4>
      </header>
      <div id="markdown-editor-source__content" class="flex1"></div>
    </section>
    <section
      id="markdown-editor-preview"
      class="flex col flex1 no-margin no-padding">
      <header>
        <h4>{{ $t("markdown_editor.preview") }}</h4>
      </header>
      <article
        v-html="htmlFromMarkdown"
        class="flex1"
        id="markdown-editor-preview__content"></article>
    </section>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { markdown, mardownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { Table } from "@lezer/markdown"
import showdown from "showdown"

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
      htmlFromMarkdown: null,
    }
  },
  mounted() {
    this.editor = new EditorView({
      doc: this.value,
      readOnly: true,
      extensions: [
        basicSetup,
        EditorState.readOnly.of(true),
        markdown({
          codeLanguages: languages,
          //extensions: [Table], // does not add anything useful
        }),
        //EditorView.lineWrapping, // it's buggy
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.$emit("input", update.state.doc.toString())
          }
        }),
      ],
      parent: document.getElementById("markdown-editor-source__content"),
    })

    // this.editor.theme({
    //   "&": { height: "300px" },
    //   ".cm-scroller": { overflow: "auto" },
    // })
  },
  watch: {
    value: {
      handler(newValue) {
        const converter = new showdown.Converter({
          headerLevelStart: 1,
          tables: true,
        })
        this.htmlFromMarkdown = converter.makeHtml(newValue)
      },
      immediate: true,
    },
  },
  methods: {},
  components: {},
}
</script>
