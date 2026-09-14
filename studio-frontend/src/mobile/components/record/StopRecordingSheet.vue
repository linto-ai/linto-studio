<template>
  <BottomSheet
    :value="value"
    :title="$t('mobile.record.finished')"
    @input="$emit('input', $event)">
    <p class="m-muted">{{ summary }}</p>
    <RecordingPlayer
      v-if="value && recordingId"
      :recording-id="recordingId"
      :mime-type="mimeType" />
    <InfoBanner v-if="quiet" tone="warning">
      {{ $t("mobile.record.quiet_warning") }}
    </InfoBanner>
    <form class="m-stop" @submit.prevent="$emit('send', name)">
      <label class="m-stop__field">
        <span>{{ $t("mobile.record.name") }}</span>
        <input v-model="name" type="text" required maxlength="200" />
      </label>
      <InfoBanner v-if="!online" tone="warning">
        {{ $t("mobile.record.offline_send") }}
      </InfoBanner>
      <button type="submit" class="m-stop__send">
        <PhIcon name="upload-simple" size="sm" />
        {{ $t("mobile.record.send") }}
      </button>
      <button type="button" class="m-stop__keep" @click="$emit('keep', name)">
        {{ $t("mobile.record.keep") }}
      </button>
    </form>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import InfoBanner from "@/mobile/components/InfoBanner.vue"
import RecordingPlayer from "@/mobile/components/record/RecordingPlayer.vue"

export default {
  name: "StopRecordingSheet",
  components: { BottomSheet, InfoBanner, PhIcon, RecordingPlayer },
  props: {
    value: { type: Boolean, default: false },
    defaultName: { type: String, required: true },
    summary: { type: String, default: "" },
    online: { type: Boolean, default: true },
    recordingId: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    quiet: { type: Boolean, default: false },
  },
  data() {
    return { name: this.defaultName }
  },
  watch: {
    defaultName(value) {
      this.name = value
    },
  },
}
</script>

<style scoped>
.m-stop {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-3);
}

.m-stop__field {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-1);
  font-size: var(--m-font-size-sm);
  color: var(--m-text-muted);
}

.m-stop__field input {
  font: inherit;
  font-size: var(--m-font-size);
  color: var(--m-text);
  min-height: 48px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
}

.m-stop__send {
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

.m-stop__keep {
  min-height: var(--m-tap);
  border: none;
  background: transparent;
  color: var(--m-primary);
  font-weight: 600;
}
</style>
