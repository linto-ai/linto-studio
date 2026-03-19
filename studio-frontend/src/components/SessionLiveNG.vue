<template>
  <linto-editor ref="editor" locale="en" no-header />
</template>

<script>
import { markRaw } from "vue"
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import sessionToEditorDocument from "@/tools/sessionToEditorDocument.js"
import {
  createLivePlugin,
  createSubtitlePlugin,
} from "@linto/studio-editor/webcomponent"
import computeSessionTurnUniqueId from "@/const/computeSessionTurnUniqueId"
import classifySessionTurn from "@/tools/classifySessionTurn"

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
      activeChannelIndex: null,
    }
  },
  computed: {
    activeChannelObj() {
      return (
        this.session.channels?.find(
          (c) => String(c.id) === String(this.activeChannelIndex),
        ) ?? null
      )
    },
    hasDiarization() {
      return !!this.activeChannelObj?.diarization
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

      editor.use(createSubtitlePlugin())

      const doc = sessionToEditorDocument(this.session)
      console.log(doc)
      editor.setDocument(doc)

      this.activeChannelIndex = this.editor?.activeChannelId.value ?? null

      this.offChannelChange = editor.on("channel:change", ({ channelId }) => {
        this.activeChannelIndex = channelId
        this.subscribeToWebsocket()
      })

      if (this.websocketInstance.state.isConnected) {
        this.subscribeToWebsocket()
      }
    },

    subscribeToWebsocket() {
      console.log(this.activeChannelIndex)
      this.websocketInstance.subscribeSessionRoom(
        this.session.id,
        this.activeChannelIndex,
        this.onPartial,
        this.onFinal,
        this.onTranslation,
      )
    },

    onPartial(content) {
      const type = classifySessionTurn(content, this.hasDiarization)
      if (type === "bot") return

      if (type === "original") {
        this.editor.live.onPartial(
          { text: content.text },
          this.activeChannelIndex,
        )
      } else {
        const translations = Object.entries(content.translations || {})
          .filter(([, text]) => text)
          .map(([lang, text]) => ({ translationId: lang, text }))
        this.editor.live.onPartial({ translations }, this.activeChannelIndex)
      }
    },

    onFinal(content) {
      const type = classifySessionTurn(content, this.hasDiarization)
      if (type === "bot") return

      const activeChannel = this.editor.activeChannel.value
      const baseTurn = {
        turnId: computeSessionTurnUniqueId(content),
        speakerId: content.locutor ?? null,
        words: [],
        startTime: Math.max(
          0,
          (new Date(content.astart).getTime() - this.sessionStartMs) / 1000 +
            content.start,
        ),
        endTime: Math.max(
          0,
          (new Date(content.astart).getTime() - this.sessionStartMs) / 1000 +
            content.end,
        ),
        language:
          content.lang ??
          activeChannel.translations.find((t) => t.isSource)?.languages[0] ??
          "*",
      }

      if (type === "original") {
        this.editor.live.onFinal(
          { ...baseTurn, text: content.text },
          this.activeChannelIndex,
        )
      } else {
        const translations = Object.entries(content.translations || {})
          .filter(([, text]) => text)
          .map(([lang, text]) => ({ translationId: lang, text, language: lang }))
        this.editor.live.onFinal(
          { ...baseTurn, translations },
          this.activeChannelIndex,
        )
      }
    },

    onTranslation(content) {
      this.editor.live.onTranslation({
        turnId: String(content.segmentId),
        language: content.targetLang,
        text: content.text,
      })
    },

    showMobileSubtitles() {
      this.editor.subtitle.enterFullscreen()
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
