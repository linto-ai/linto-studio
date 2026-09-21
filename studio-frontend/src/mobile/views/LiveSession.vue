<template>
  <div class="m-page m-live-session">
    <header class="m-live-session__bar">
      <router-link
        :to="{ name: 'home' }"
        class="m-live-session__back"
        :aria-label="$t('mobile.common.back')">
        <PhIcon name="caret-left" size="md" />
      </router-link>
      <span class="m-live-session__chip">
        <span class="m-live-session__dot"></span>
        {{ $t("mobile.live.on_air") }}
      </span>
      <span class="m-grow"></span>
      <IconButton
        v-if="editorIsMobile"
        :icon="partialsVisible ? 'lightning' : 'lightning-slash'"
        :label="$t('mobile.live.partials')"
        :aria-pressed="String(partialsVisible)"
        @click="togglePartials" />
      <IconButton
        :icon="wantsRecording ? 'microphone' : 'microphone-slash'"
        :label="
          wantsRecording ? $t('mobile.live.mute') : $t('mobile.live.unmute')
        "
        @click="toggleMute" />
      <button
        type="button"
        class="m-live-session__end"
        @click="endSheetOpen = true">
        {{ $t("mobile.live.end") }}
      </button>
    </header>

    <p v-if="!session || !editorReady" class="m-muted m-live-session__state">
      {{ $t("mobile.common.loading") }}
    </p>
    <div v-else class="m-live-session__body">
      <SessionLiveNG
        ref="sessionLiveNG"
        :session="session"
        :websocket-instance="socket"
        :current-organization-scope="organizationId"
        :microphone-status="microphoneStatus"
        @retry-microphone="retryAudioConnection"
        @reconfigure-microphone="restartMicrophone"
        @viewport-change="editorIsMobile = $event"
        @partials-visible="partialsVisible = $event" />
    </div>

    <EndLiveSheet
      v-model="endSheetOpen"
      :default-name="defaultName"
      :busy="ending"
      @confirm="endLive" />
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import SessionLiveNG from "@/components/SessionLiveNG.vue"
import IconButton from "@/mobile/components/IconButton.vue"
import EndLiveSheet from "@/mobile/components/live/EndLiveSheet.vue"
import { liveSessionMixin } from "@/mobile/mixins/liveSession.js"

// The live session inside the app: the same live editor component as the
// classic quick meeting (captions, translations, wake lock), the shared
// microphone streaming mixin, and a mobile bar with mute and end.
export default {
  name: "MobileLiveSession",
  components: { PhIcon, SessionLiveNG, IconButton, EndLiveSheet },
  mixins: [liveSessionMixin],
  data() {
    return {
      // Both pushed by the editor. <linto-editor> is mounted with no-header
      // here, so its sidebar — subtitles, voice playback, live settings,
      // speakers — has no opener of its own and this bar carries it.
      // editorIsMobile is always true on a phone, but it also says the
      // editor is mounted: this bar shows while the session is still
      // loading, and the button must not appear before it can work.
      editorIsMobile: false,
      partialsVisible: true,
    }
  },
  methods: {
    togglePartials() {
      this.$refs.sessionLiveNG.togglePartials()
    },
  },
}
</script>

<style scoped>
.m-live-session {
  max-width: none;
  height: 100dvh;
}

.m-live-session__bar {
  height: var(--m-header-height);
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  padding: 0 var(--m-space-2);
  flex-shrink: 0;
}

.m-live-session__back {
  width: var(--m-tap);
  height: var(--m-tap);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--m-text);
}

.m-live-session__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  padding: 4px var(--m-space-2);
  border-radius: var(--m-radius-round);
  background: var(--m-danger-soft);
  color: var(--m-danger);
  font-size: var(--m-font-size-sm);
  font-weight: 600;
}

.m-live-session__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.m-live-session__end {
  min-height: 40px;
  padding: 0 var(--m-space-3);
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-danger);
  color: var(--m-on-primary);
  font-weight: 600;
}

.m-live-session__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.m-live-session__body :deep(.session-live-ng) {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.m-live-session__body :deep(linto-editor) {
  --color-primary: var(--m-primary);
  --color-background: var(--m-bg);
  --color-surface: var(--m-surface);
  --color-text-primary: var(--m-text);
  --color-border: var(--m-border);
}

.m-live-session__state {
  text-align: center;
  padding: var(--m-space-6);
}
</style>
