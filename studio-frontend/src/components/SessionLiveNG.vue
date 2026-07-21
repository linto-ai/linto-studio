<template>
  <div class="session-live-ng flex col flex1">
    <SessionStatusBanner
      :websocketStatus="websocketInstance.state.status"
      :microphoneStatus="microphoneStatus"
      @retry-websocket="websocketInstance.retry()"
      @retry-microphone="$emit('retry-microphone')"
      @reconfigure-microphone="$emit('reconfigure-microphone')" />
    <linto-editor ref="editor" :locale="$i18n.locale.split('-')[0]" no-header />
  </div>
</template>

<script>
import { markRaw } from "vue"
import { sessionModelMixin } from "@/mixins/sessionModel.js"
import sessionToEditorDocument from "@/tools/sessionToEditorDocument.js"
import processSessionCaptions from "@/tools/processSessionCaptions.js"
import {
  apiGetSessionChannelTurns,
  apiGetPublicSessionChannelTurns,
  apiPatchSession,
} from "@/api/session.js"
import {
  createLivePlugin,
  createSubtitlePlugin,
} from "@linto/studio-editor/webcomponent"
import computeSessionTurnUniqueId from "@/const/computeSessionTurnUniqueId"
import classifySessionTurn from "@/tools/classifySessionTurn"
import {
  computeTurnStartDate,
  computeTurnEndDate,
} from "@/tools/computeTurnTime.js"
import { getEnv } from "@/tools/getEnv"
import { bus } from "@/main.js"
import SessionStatusBanner from "@/components/molecules/SessionStatusBanner.vue"

const PAGE_SIZE = 50

export default {
  mixins: [sessionModelMixin],
  components: { SessionStatusBanner },
  props: {
    session: { type: Object, required: true },
    initialChannelId: { type: [String, Number], default: null },
    websocketInstance: { type: Object, required: true },
    isFromPublicLink: { type: Boolean, default: false },
    currentOrganizationScope: { type: String, required: false, default: null },
    displaySubtitles: { type: Boolean, default: false },
    // Forwarded to the status banner; "idle" when the host has no microphone.
    microphoneStatus: { type: String, default: "idle" },
  },
  data() {
    return {
      livePlugin: null,
      editor: null,
      offChannelChange: null,
      offScrollTop: null,
      offWatermarkDisplay: null,
      offWatermarkPin: null,
      unwatchWatermarkHost: [],
      activeChannelIndex: null,
      historyOffset: 0,
      usePublicEndpoint: false,
      wakeLock: null,
      // Distinguishes the first connect from a reconnect in the isConnected
      // watcher: only a reconnect needs a content resync.
      wsWasConnected: false,
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
    // Covers both the first connect (socket not ready at mount) and every
    // reconnect (isConnected goes false on disconnect); isConnected is kept
    // in sync with state.status by the ApiEventWebSocket state machine.
    "websocketInstance.state.isConnected"(connected) {
      if (!connected) return
      const isReconnect = this.wsWasConnected
      this.wsWasConnected = true
      this.subscribeToWebsocket()
      if (isReconnect) {
        this.resyncAfterReconnect()
      }
    },
  },
  mounted() {
    this.initEditor()
    this.aquireWakeLock()
    document.addEventListener("visibilitychange", this.renewWakeLock)
    bus.$on(
      `websocket/orga_${this.currentOrganizationScope}_session_cleared`,
      this.clear,
    )
  },
  beforeDestroy() {
    this.offChannelChange?.()
    this.offScrollTop?.()
    this.offSubtitle?.()
    document.documentElement.style.removeProperty("--subtitle-reserve")
    this.offWatermarkDisplay?.()
    this.offWatermarkPin?.()
    this.unwatchWatermarkHost.forEach((stop) => stop())
    this.websocketInstance.unSubscribeSessionRoom()
    this.releaseWakeLock()
    document.removeEventListener("visibilitychange", this.renewWakeLock)
    bus.$off(
      `websocket/orga_${this.currentOrganizationScope}_session_cleared`,
      this.clear,
    )
  },
  methods: {
    clear(sessionId) {
      if (sessionId != this.session.id) {
        return
      }

      const channel = this.editor.activeChannel.value

      if (!channel) {
        return
      }

      this.historyOffset = 0
      channel.reset()
    },
    async renewWakeLock() {
      if (this.wakeLock) {
        await this.wakeLock.release()
      }
      await this.aquireWakeLock()
    },
    async aquireWakeLock() {
      try {
        this.wakeLock = await navigator.wakeLock.request("screen")
        this.wakeLock.addEventListener("release", () => {
          this.wakeLock = null
        })
      } catch (error) {
        console.warn("WakeLock error", error)
      }
    },
    async releaseWakeLock() {
      if (this.wakeLock) {
        await this.wakeLock.release()
      }
    },
    async initEditor() {
      const el = this.$refs.editor
      const { editor } = el
      this.editor = markRaw(editor)

      this.livePlugin = createLivePlugin({
        tts: getEnv("VUE_APP_ENABLE_TTS") === "true",
      })
      editor.use(this.livePlugin)
      editor.use(
        createSubtitlePlugin({
          isVisible: this.displaySubtitles,
          watermark: {
            display: this.displayWatermark,
            pinned: this.watermarkPinned,
            content: this.watermarkContent,
            frequency: this.watermarkFrequency,
            duration: this.watermarkDuration,
            tokens: {
              linto: { src: "/img/linto.svg", alt: "LinTO" },
              linagora: { src: "/img/linagora.png", alt: "Linagora" },
            },
            readonly: this.isFromPublicLink,
          },
        }),
      )
      if (!this.isFromPublicLink) {
        this.bindWatermarkSync()
      }

      const sessionForDoc = {
        ...this.session,
        channels: this.session.channels.map((ch) => ({
          ...ch,
          closedCaptions: [],
          translatedCaptions: [],
        })),
      }
      // The subtitle banner is position:fixed at the viewport bottom and overlaps
      // the bottom of the app. Reserve space via a root CSS variable consumed by
      // #app-view so the whole layout (editor + sidebar) clears the banner.
      // Subscribe before setDocument: the banner mounts (and emits on mount) as
      // soon as channels are populated by setDocument, so the listener must
      // already be registered to catch the initial emit.
      this.offSubtitle = editor.on(
        "subtitle:visible",
        ({ visible, height }) => {
          document.documentElement.style.setProperty(
            "--subtitle-reserve",
            (visible ? height : 0) + "px",
          )
        },
      )

      const doc = sessionToEditorDocument(sessionForDoc)
      editor.setDocument(doc)

      // Apply before the channel:change listener is registered so the
      // initial selection does not trigger a channel reset and refetch.
      const initialId =
        this.initialChannelId != null ? String(this.initialChannelId) : null
      if (initialId && editor.channels.has(initialId)) {
        editor.setActiveChannel(initialId)
      }

      this.activeChannelIndex = this.editor?.activeChannelId.value ?? null

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
        this.wsWasConnected = true
        this.subscribeToWebsocket()
      }
    },

    // Finals emitted while the socket was down are lost (the server does not
    // replay missed room events): reset the channel and reload the latest
    // page — same pattern as channel:change and clear().
    resyncAfterReconnect() {
      const channel = this.editor?.activeChannel?.value
      if (!channel) {
        return
      }
      this.historyOffset = 0
      // Explicit: the user may have scrolled to the very top before the
      // outage, and fetchTurnsPage early-returns when hasMoreHistory is off.
      channel.hasMoreHistory.value = true
      channel.reset()
      this.fetchTurnsPage()
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
        {
          text: content.text,
          turnId: computeSessionTurnUniqueId(content),
          language: content.lang,
        },
        this.activeChannelIndex,
      )
    },

    onFinal(content) {
      const type = classifySessionTurn(content, this.hasDiarization)
      if (type !== "original") return

      const activeChannel = this.editor.activeChannel.value

      const baseTurn = {
        turnId: computeSessionTurnUniqueId(content),
        speakerId: content.locutor ?? null,
        words: [],
        startDate: computeTurnStartDate(content),
        endDate: computeTurnEndDate(content),
        language:
          content.lang ?? activeChannel.sourceTranslation.languages[0] ?? "*",
      }

      this.editor.live.onFinal(
        { ...baseTurn, text: content.text },
        this.activeChannelIndex,
      )
    },

    onTranslation(content) {
      this.editor.live.onTranslation({
        turnId: computeSessionTurnUniqueId(content),
        language: content.targetLang,
        sourceLanguage: content.sourceLang,
        text: content.text,
        final: content.final,
        startDate: computeTurnStartDate(content),
        endDate: computeTurnEndDate(content),
        speakerId: content.locutor,
      })
    },

    showMobileSubtitles() {
      this.editor.subtitle.enterFullscreen()
    },

    async patchWatermark(settings) {
      const next = {
        display: settings.display,
        pinned: settings.pinned,
        content: settings.content,
        frequency: settings.frequency,
        duration: settings.duration,
      }
      const req = await apiPatchSession(
        this.currentOrganizationScope,
        this.session.id,
        {
          meta: { ...this.session.meta, "@watermark": next },
        },
      )
      if (req?.status === "error") {
        console.error("[SessionLiveNG] watermark PATCH failed", req)
        return
      }
      this.session.meta["@watermark"] = next
    },

    bindWatermarkSync() {
      const wm = this.editor.subtitle?.watermark
      if (!wm) return

      const patchAll = (overrides = {}) =>
        this.patchWatermark({
          display: wm.display.value,
          pinned: wm.pinned.value,
          content: wm.content.value,
          frequency: wm.frequency.value,
          duration: wm.duration.value,
          ...overrides,
        })

      this.offWatermarkDisplay = this.editor.on(
        "watermark:display",
        ({ display }) => {
          if (this.displayWatermark === display) return
          patchAll({ display })
        },
      )
      this.offWatermarkPin = this.editor.on("watermark:pin", ({ pinned }) => {
        if (this.watermarkPinned === pinned) return
        patchAll({ pinned })
      })

      this.unwatchWatermarkHost = [
        this.$watch("displayWatermark", (v) => {
          wm.display.value = v
        }),
        this.$watch("watermarkPinned", (v) => {
          wm.pinned.value = v
        }),
        this.$watch("watermarkContent", (v) => {
          wm.content.value = v
        }),
        this.$watch("watermarkFrequency", (v) => {
          wm.frequency.value = v
        }),
        this.$watch("watermarkDuration", (v) => {
          wm.duration.value = v
        }),
      ]
    },
  },
}
</script>

<style scoped>
.session-live-ng {
  min-height: 0;
}

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
