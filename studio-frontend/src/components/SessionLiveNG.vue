<template>
  <linto-editor ref="editor" :locale="$i18n.locale" no-header />
</template>

<script>
import { markRaw } from "vue"
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import sessionToEditorDocument from "@/tools/sessionToEditorDocument.js"
import processSessionCaptions from "@/tools/processSessionCaptions.js"
import {
  apiGetSessionChannelTurns,
  apiGetPublicSessionChannelTurns,
} from "@/api/session.js"
import {
  createLivePlugin,
  createSubtitlePlugin,
} from "@linto/studio-editor/webcomponent"
import computeSessionTurnUniqueId from "@/const/computeSessionTurnUniqueId"
import classifySessionTurn from "@/tools/classifySessionTurn"
import {
  computeTurnStartTime,
  computeTurnEndTime,
} from "@/tools/computeTurnTime.js"

const PAGE_SIZE = 50

export default {
  mixins: [sessionModelMixin],
  props: {
    session: { type: Object, required: true },
    websocketInstance: { type: Object, required: true },
    isFromPublicLink: { type: Boolean, default: false },
  },
  data() {
    return {
      livePlugin: null,
      editor: null,
      offChannelChange: null,
      offScrollTop: null,
      sessionStartMs: new Date(this.session.startTime).getTime(),
      activeChannelIndex: null,
      historyOffset: 0,
      usePublicEndpoint: false,
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
    this.offScrollTop?.()
    this.websocketInstance.unSubscribeSessionRoom()
  },
  methods: {
    async initEditor() {
      const el = this.$refs.editor
      const { editor } = el
      this.editor = markRaw(editor)

      this.livePlugin = createLivePlugin()
      editor.use(this.livePlugin)

      editor.use(createSubtitlePlugin())

      const sessionForDoc = {
        ...this.session,
        channels: this.session.channels.map((ch) => ({
          ...ch,
          closedCaptions: [],
          translatedCaptions: [],
        })),
      }
      const doc = sessionToEditorDocument(sessionForDoc)
      editor.setDocument(doc)

      this.activeChannelIndex = this.editor?.activeChannelId.value ?? null

      // Load initial page of turns
      await this.fetchTurnsPage()

      this.offScrollTop = editor.on("scroll:top", () => this.fetchTurnsPage())

      this.offChannelChange = editor.on("channel:change", ({ channelId }) => {
        this.activeChannelIndex = channelId
        this.historyOffset = 0

        const channel = this.editor.channels.get(channelId)
        if (channel) {
          channel.reset()
        }

        this.subscribeToWebsocket()
        this.fetchTurnsPage()
      })

      if (this.websocketInstance.state.isConnected) {
        this.subscribeToWebsocket()
      }
    },

    async fetchTurnsPage() {
      const channel = this.editor.activeChannel.value
      if (channel.isLoadingHistory.value) return
      if (!channel.hasMoreHistory.value) return

      channel.isLoadingHistory.value = true

      try {
        const paginationParams = {
          limit: PAGE_SIZE,
          offset: this.historyOffset,
        }
        let res = null

        if (this.isFromPublicLink || this.usePublicEndpoint) {
          res = await apiGetPublicSessionChannelTurns(
            this.session.id,
            this.activeChannelIndex,
            paginationParams,
          )
        } else {
          res = await apiGetSessionChannelTurns(
            this.sessionOrganizationId,
            this.session.id,
            this.activeChannelIndex,
            paginationParams,
          )

          if (!res || res.status === "error") {
            this.usePublicEndpoint = true
            res = await apiGetPublicSessionChannelTurns(
              this.session.id,
              this.activeChannelIndex,
              paginationParams,
            )
          }
        }

        const closedCaptions = res?.data?.closedCaptions ?? []
        const translatedCaptions = res?.data?.translatedCaptions ?? {}
        const total = res?.data?.totalClosedCaptions ?? 0
        if (closedCaptions.length === 0) {
          channel.hasMoreHistory.value = false
          return
        }

        const events = processSessionCaptions({
          closedCaptions,
          translatedCaptions,
          sessionStartMs: this.sessionStartMs,
          diarization: this.hasDiarization,
          defaultLanguage: this.activeChannelObj?.languages?.[0] ?? "*",
        })
        if (events.length > 0) {
          this.editor.live.prependFinalBatch(events, this.activeChannelIndex)
        }

        this.historyOffset += closedCaptions.length

        if (this.historyOffset >= total) {
          channel.hasMoreHistory.value = false
        }
      } catch (err) {
        console.error("[SessionLiveNG] Error fetching turns", err)
      } finally {
        channel.isLoadingHistory.value = false
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
      const type = classifySessionTurn(content, this.hasDiarization)
      if (type !== "original") return

      this.editor.live.onPartial(
        { text: content.text },
        this.activeChannelIndex,
      )
    },

    onFinal(content) {
      if (this.sessionStartMs === 0) {
        this.sessionStartMs = new Date().getTime()
      }

      const type = classifySessionTurn(content, this.hasDiarization)
      if (type !== "original") return

      const activeChannel = this.editor.activeChannel.value

      const baseTurn = {
        turnId: computeSessionTurnUniqueId(content),
        speakerId: content.locutor ?? null,
        words: [],
        startTime: computeTurnStartTime(content, this.sessionStartMs),
        endTime: computeTurnEndTime(content, this.sessionStartMs),
        language:
          content.lang ?? activeChannel.sourceTranslation.languages[0] ?? "*",
      }

      this.editor.live.onFinal(
        { ...baseTurn, text: content.text },
        this.activeChannelIndex,
      )

      // } else {
      //   // could be deleted (old format)
      //   const translations = Object.entries(content.translations || {})
      //     .filter(([, text]) => text)
      //     .map(([lang, text]) => ({
      //       translationId: lang,
      //       text,
      //       language: lang,
      //     }))
      //   this.editor.live.onFinal(
      //     {
      //       ...baseTurn,
      //       translations,
      //       text: type == "both" ? content.text : null,
      //     },
      //     this.activeChannelIndex,
      //   )
      // }
    },

    onTranslation(content) {
      this.editor.live.onTranslation({
        turnId: computeSessionTurnUniqueId(content),
        language: content.targetLang,
        text: content.text,
        final: content.final,
        startTime: computeTurnStartTime(content, this.sessionStartMs),
        endTime: computeTurnEndTime(content, this.sessionStartMs),
        speakerId: content.locutor,
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

  /* Map host theme variables to editor tokens */
  --color-primary: var(--primary-color);
  --color-primary-hover: var(--primary-color);
  --color-background: var(--background-app);
  --color-surface: var(--background-primary);
  --color-surface-hover: var(--neutral-20);
  --color-text-primary: var(--text-primary);
  --color-text-secondary: var(--text-secondary);
  --color-text-muted: var(--neutral-60);
  --color-border: var(--neutral-30);
  --color-border-light: var(--neutral-20);
}
</style>
