<template>
  <NotificationBanner
    v-if="banner === 'websocket_reconnecting'"
    variant="warning"
    icon="wifi-slash"
    align="start"
    role="alert"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("websocket.live_feed_interrupted") }}
    </span>
    <PhIcon name="spinner" animation="spin" size="sm" />
  </NotificationBanner>

  <NotificationBanner
    v-else-if="banner === 'websocket_failed'"
    variant="error"
    icon="wifi-slash"
    align="start"
    role="alert"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("websocket.live_feed_failed") }}
    </span>
    <Button
      variant="primary"
      size="sm"
      :label="$t('websocket.action_retry')"
      @click="$emit('retry-websocket')" />
  </NotificationBanner>

  <NotificationBanner
    v-else-if="banner === 'websocket_restored'"
    variant="success"
    icon="wifi-high"
    align="start"
    role="status"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("websocket.restored") }}
    </span>
  </NotificationBanner>

  <MicrophoneStatusBanner
    v-else-if="banner === 'microphone'"
    :status="microphoneStatus"
    @retry="$emit('retry-microphone')"
    @reconfigure="$emit('reconfigure-microphone')" />

  <NotificationBanner
    v-else-if="banner === 'live_credit_exhausted'"
    variant="error"
    icon="warning-circle"
    align="start"
    role="alert"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{ $t("session.live_credit_banner.exhausted") }}
      <template v-if="!canBuyLivePack">
        {{ $t("quick_session.creation.live_pack_ask_admin") }}
      </template>
    </span>
    <template v-if="canBuyLivePack" #actions>
      <Button
        variant="primary"
        size="sm"
        icon="plus"
        :label="$t('billing.settings.buy_pack')"
        @click="$emit('buy-live-pack')" />
    </template>
  </NotificationBanner>

  <NotificationBanner
    v-else-if="banner === 'live_credit_low'"
    variant="warning"
    icon="warning"
    align="start"
    role="status"
    class="session-status-banner">
    <span class="session-status-banner__message">
      {{
        $t("session.live_credit_banner.low", {
          minutes: liveCredit.balance,
        })
      }}
      <template v-if="!canBuyLivePack">
        {{ $t("quick_session.creation.live_pack_ask_admin") }}
      </template>
    </span>
    <template v-if="canBuyLivePack" #actions>
      <Button
        variant="secondary"
        size="sm"
        icon="plus"
        :label="$t('billing.settings.buy_pack')"
        @click="$emit('buy-live-pack')" />
    </template>
  </NotificationBanner>
</template>

<script>
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import MicrophoneStatusBanner from "@/components/molecules/MicrophoneStatusBanner.vue"
import { resolveSessionBanner } from "@/tools/resolveSessionBanner.js"
import { computeLiveCreditLevel } from "@/tools/computeLiveCreditLevel.js"
import { createRestoredFlashMixin } from "@/mixins/restoredFlash.js"

// Single banner slot for a live session view: websocket outage first,
// microphone trouble second, live credit last (see resolveSessionBanner for
// the rationale).
export default {
  name: "SessionStatusBanner",
  components: { NotificationBanner, MicrophoneStatusBanner },
  mixins: [createRestoredFlashMixin("websocketStatus", 3000)],
  props: {
    // ApiEventWebSocket status: idle | connecting | connected | reconnecting | failed
    websocketStatus: { type: String, required: true },
    // microphoneStatus value from sessionMicrophoneMixin ("idle" when the
    // view has no microphone at all).
    microphoneStatus: { type: String, default: "idle" },
    // live block of the org usage summary (null when unknown or not watched).
    liveCredit: { type: Object, default: null },
    // Whether the viewer may buy live minutes: offers the shortcut (emits
    // buy-live-pack), or else tells who can.
    canBuyLivePack: { type: Boolean, default: false },
  },
  computed: {
    banner() {
      const banner = resolveSessionBanner(
        this.websocketStatus,
        this.microphoneStatus,
        computeLiveCreditLevel(this.liveCredit),
      )
      if (banner) return banner
      return this.showRestored ? "websocket_restored" : null
    },
  },
}
</script>

<style scoped>
.session-status-banner {
  margin: 0.5rem;
  width: calc(100% - 1rem) !important;
}

.session-status-banner__message {
  flex: 1;
  min-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .session-status-banner :deep(svg) {
    animation: none;
  }
}
</style>
