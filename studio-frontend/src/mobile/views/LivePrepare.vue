<template>
  <div class="m-page">
    <PageHeader :title="$t('mobile.home.live_title')" />
    <main class="m-page__content m-live">
      <p v-if="loading || liveCreditLoading" class="m-muted m-live__state">
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

      <LiveCreditExhausted v-else-if="liveCreditExhausted">
        <LivePackPurchaseForm
          v-if="canBuyLivePack"
          :packs="livePacks"
          :buying="buyingPack"
          @buy="buyLivePack" />
        <NotificationBanner
          v-else
          variant="info"
          icon="info"
          align="start"
          role="status"
          >{{ $t("mobile.live.ask_admin") }}</NotificationBanner
        >
      </LiveCreditExhausted>

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
            :hint="$t('mobile.live.keep_audio_hint')" />
          <ToggleRow
            v-if="supportsDiarization"
            v-model="diarization"
            :label="$t('mobile.live.diarization')" />
        </div>

        <LiveCreditBanner
          v-if="meteredLive"
          :live="meteredLive"
          :can-recharge="canBuyLivePack"
          @recharge="packSheetOpen = true" />
        <NotificationBanner
          v-if="!online"
          variant="warning"
          icon="warning"
          align="start"
          role="status"
          >{{ $t("mobile.live.offline") }}</NotificationBanner
        >
        <p v-if="failed" class="m-live__error" role="alert">
          {{ $t("mobile.live.start_failed") }}
        </p>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          icon="broadcast"
          :label="$t('mobile.live.start')"
          :loading="starting"
          :disabled="!online" />
        <p class="m-muted m-live__note">{{ $t("mobile.live.screen_note") }}</p>
      </form>
    </main>

    <BottomSheet
      v-model="packSheetOpen"
      :title="$t('mobile.live.recharge_title')">
      <LivePackPurchaseForm
        :packs="livePacks"
        :buying="buyingPack"
        @buy="buyLivePack" />
    </BottomSheet>
  </div>
</template>

<script>
import PageHeader from "@/mobile/components/PageHeader.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import ToggleRow from "@/mobile/components/ToggleRow.vue"
import TranslationPicker from "@/mobile/components/live/TranslationPicker.vue"
import LiveRunningCard from "@/mobile/components/live/LiveRunningCard.vue"
import LiveCreditBanner from "@/mobile/components/live/LiveCreditBanner.vue"
import LiveCreditExhausted from "@/mobile/components/live/LiveCreditExhausted.vue"
import LivePackPurchaseForm from "@/mobile/components/live/LivePackPurchaseForm.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import { liveCreditMixin } from "@/mobile/mixins/liveCredit.js"
import { livePrepareMixin } from "@/mobile/mixins/livePrepare.js"
import { onlineStatus } from "@/mobile/services/network/onlineStatus.js"

export default {
  name: "MobileLivePrepare",
  components: {
    PageHeader,
    NotificationBanner,
    ToggleRow,
    TranslationPicker,
    LiveRunningCard,
    LiveCreditBanner,
    LiveCreditExhausted,
    LivePackPurchaseForm,
    BottomSheet,
  },
  mixins: [livePrepareMixin, liveCreditMixin],
  computed: {
    online() {
      return onlineStatus.online
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
</style>
