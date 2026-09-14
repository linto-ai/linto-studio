<template>
  <div class="m-page">
    <PageHeader :title="$t('mobile.home.live_title')" />
    <main class="m-page__content m-live">
      <p v-if="loading" class="m-muted m-live__state">
        {{ $t("mobile.common.loading") }}
      </p>

      <LiveRunningCard
        v-else-if="runningSession"
        :stopping="stopping"
        @resume="openLivePage"
        @stop="stopRunning" />

      <p v-else-if="profiles.length === 0" class="m-muted m-live__state">
        {{ $t("mobile.live.no_profile") }}
      </p>

      <form v-else class="m-live__form" @submit.prevent="start">
        <label v-if="profiles.length > 1" class="m-live__field">
          <span>{{ $t("mobile.live.profile") }}</span>
          <select v-model="profileId">
            <option
              v-for="profile in profiles"
              :key="profile.id"
              :value="profile.id">
              {{ profile.config.name }}
            </option>
          </select>
        </label>

        <div class="m-live__field">
          <span>{{ $t("mobile.live.translations") }}</span>
          <TranslationPicker
            v-model="translations"
            :options="translationOptions"
            :suggestions="translationSuggestions" />
          <p v-if="translationOptions.length === 0" class="m-muted">
            {{ $t("mobile.live.no_translation_available") }}
          </p>
        </div>

        <div class="m-live__options">
          <ToggleRow
            v-model="keepAudio"
            :label="$t('mobile.live.keep_audio')"
            :hint="keepAudioHint" />
          <ToggleRow
            v-model="diarization"
            :label="$t('mobile.live.diarization')"
            :disabled="!supportsDiarization" />
        </div>

        <InfoBanner v-if="!online" tone="warning">{{
          $t("mobile.live.offline")
        }}</InfoBanner>
        <p v-if="failed" class="m-live__error" role="alert">
          {{ $t("mobile.live.start_failed") }}
        </p>

        <button
          type="submit"
          class="m-live__start"
          :disabled="starting || !online">
          <PhIcon name="broadcast" size="sm" />
          {{ starting ? $t("mobile.common.loading") : $t("mobile.live.start") }}
        </button>
        <p class="m-muted m-live__note">{{ $t("mobile.live.screen_note") }}</p>
      </form>
    </main>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import PageHeader from "@/mobile/components/PageHeader.vue"
import InfoBanner from "@/mobile/components/InfoBanner.vue"
import ToggleRow from "@/mobile/components/ToggleRow.vue"
import TranslationPicker from "@/mobile/components/live/TranslationPicker.vue"
import LiveRunningCard from "@/mobile/components/live/LiveRunningCard.vue"
import { livePrepareMixin } from "@/mobile/mixins/livePrepare.js"
import { transcriptionSettingsMixin } from "@/mobile/mixins/transcriptionSettings.js"
import { onlineStatus } from "@/mobile/services/network/onlineStatus.js"

export default {
  name: "MobileLivePrepare",
  components: {
    PhIcon,
    PageHeader,
    InfoBanner,
    ToggleRow,
    TranslationPicker,
    LiveRunningCard,
  },
  mixins: [livePrepareMixin, transcriptionSettingsMixin],
  computed: {
    online() {
      return onlineStatus.online
    },
    keepAudioHint() {
      return this.transcriptionSettings
        ? this.transcriptionSummary
        : this.$t("mobile.live.keep_audio_hint")
    },
  },
}
</script>

<style scoped>
.m-live {
  gap: var(--m-space-4);
}

.m-live__state {
  text-align: center;
  padding: var(--m-space-6) 0;
}

.m-live__form {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-4);
}

.m-live__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-live__field select {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-live__options {
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-1);
  overflow: hidden;
}

.m-live__error {
  margin: 0;
  color: var(--m-danger);
}

.m-live__note {
  text-align: center;
}

.m-live__start {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--m-space-2);
  border: none;
  border-radius: var(--m-radius-sm);
  background: var(--m-primary);
  color: var(--m-on-primary);
  font-weight: 600;
}

.m-live__start:disabled {
  opacity: 0.6;
}
</style>
