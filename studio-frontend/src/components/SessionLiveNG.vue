<template>
  <linto-editor ref="editor" locale="fr" />
</template>

<script>
import { markRaw } from "vue"
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import sessionToEditorDocument from "@/tools/sessionToEditorDocument.js"
import { createLivePlugin } from "@linto/studio-editor/webcomponent"

export default {
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
    websocketInstance: { type: Object, required: true },
  },
  data() {
    return {
      livePlugin: null,
      editor: null,
      offChannelChange: null,
      sessionStartMs: new Date(this.session.startTime).getTime(),
    }
  },
  computed: {
    activeChannelIndex() {
      return this.editor?.activeChannelId.value ?? null
    },
  },
  watch: {
    "websocketInstance.state.isConnected"(connected) {
      if (connected) this.subscribeToWebsocket()
    },
    "websocketInstance.state.connexionRestored"(restored) {
      if (restored) this.subscribeToWebsocket()
    },
  },
  mounted() {
    this.initEditor()
  },
  beforeDestroy() {
    this.offChannelChange?.()
    this.websocketInstance.unSubscribeSessionRoom()
  },
  methods: {
    initEditor() {
      const el = this.$refs.editor
      const { editor } = el
      this.editor = markRaw(editor)

      this.livePlugin = createLivePlugin()
      editor.use(this.livePlugin)

      const doc = sessionToEditorDocument(this.session)
      console.log(doc)
      editor.setDocument(doc)

      this.offChannelChange = editor.on("channel:change", () => {
        this.subscribeToWebsocket()
      })

      if (this.websocketInstance.state.isConnected) {
        this.subscribeToWebsocket()
      }
    },

    subscribeToWebsocket() {
      this.websocketInstance.subscribeSessionRoom(
        this.session.id,
        this.activeChannelIndex,
        this.onPartial,
        this.onFinal,
        this.onTranslation,
      )
    },

    onPartial(content) {
      this.livePlugin.onPartial({
        text: content.text,
      })
    },

    onFinal(content) {
      const activeChannel = this.editor.activeChannel.value
      this.livePlugin.onFinal({
        turnId: String(content.segmentId),
        speakerId: content.locutor ?? null,
        text: content.text,
        words: [],
        startTime: Math.max(0, (new Date(content.astart).getTime() - this.sessionStartMs) / 1000 + content.start),
        endTime: Math.max(0, (new Date(content.astart).getTime() - this.sessionStartMs) / 1000 + content.end),
        language:
          content.lang ??
          activeChannel.translations.find((t) => t.isSource)?.languages[0] ??
          "*",
      })
    },

    onTranslation(content) {
      this.livePlugin.onTranslation({
        turnId: String(content.segmentId),
        language: content.targetLang,
        text: content.text,
      })
    },
  },
}
</script>

<style scoped>
linto-editor {
  display: block;
  flex: 1;
  min-height: 0;
}
</style>
