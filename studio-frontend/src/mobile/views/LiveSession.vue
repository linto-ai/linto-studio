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
        <span class="m-live-session__chip-label">
          {{ $t("mobile.live.on_air") }}
        </span>
      </span>
      <span class="m-grow"></span>
      <!-- No accessibility mode in the mobile app: its own shell has no dark
           values, so opening the editor's sidebar would offer a high-contrast
           switch that darkens the transcript inside a light bar. The wiring
           below stays in place — uncomment when the shell follows.
      <IconButton
        v-if="editorIsMobile"
        icon="sidebar-simple"
        :label="$t('mobile.live.settings')"
        :aria-expanded="String(editorSidebarOpen)"
        @click="toggleEditorSidebar" />
      -->
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
        @sidebar-open="editorSidebarOpen = $event" />
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
      editorSidebarOpen: false,
    }
  },
  methods: {
    toggleEditorSidebar() {
      this.$refs.sessionLiveNG.toggleSidebar()
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

/* Six controls in this bar since the sidebar button joined: without these,
   flexbox takes the missing width out of whatever shrinks, and in French the
   chip wrapped to two lines while the 44px tap targets dropped to 36px on a
   360px phone. Nothing shrinks now — the narrow branch below frees the room
   instead. */
.m-live-session__bar > * {
  flex-shrink: 0;
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
  white-space: nowrap;
}

.m-live-session__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

/* Below ~375px the six controls no longer fit in French (they need 367px of
   a 304px content box). The chip gives up its label — the red dot still says
   "recording", and the text stays for screen readers, same treatment as
   .m-visually-hidden. */
@media (max-width: 374px) {
  .m-live-session__chip {
    gap: 0;
    padding: 4px 6px;
  }

  .m-live-session__chip-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .m-live-session__dot {
    width: 10px;
    height: 10px;
  }
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
