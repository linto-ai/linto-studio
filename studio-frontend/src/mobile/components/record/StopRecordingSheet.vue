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
    <InfoBanner v-if="!online" tone="warning">
      {{ $t("mobile.record.offline_send") }}
    </InfoBanner>
    <!-- The recording is sent by itself once the sheet closes: here the
         user names it and says whether the audio stays on the phone. The
         button sits right under the name because the keyboard covers the
         bottom of the sheet while the name is edited. -->
    <form class="m-stop" @submit.prevent="finish">
      <label class="m-stop__field">
        <span>{{ $t("mobile.record.name") }}</span>
        <input v-model="name" type="text" required maxlength="200" />
      </label>
      <button type="submit" class="m-stop__finish">
        <PhIcon name="upload-simple" size="sm" />
        {{ $t("mobile.record.finish") }}
      </button>
      <ToggleRow
        v-model="keepAudio"
        :label="$t('mobile.library.keep_audio')"
        :hint="$t('mobile.library.keep_audio_hint')" />
      <p v-if="sharingSummary" class="m-muted m-stop__sharing">
        {{ sharingSummary }}
      </p>
    </form>
  </BottomSheet>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import InfoBanner from "@/mobile/components/InfoBanner.vue"
import ToggleRow from "@/mobile/components/ToggleRow.vue"
import RecordingPlayer from "@/mobile/components/record/RecordingPlayer.vue"

export default {
  name: "StopRecordingSheet",
  components: { BottomSheet, InfoBanner, PhIcon, ToggleRow, RecordingPlayer },
  props: {
    value: { type: Boolean, default: false },
    defaultName: { type: String, required: true },
    defaultKeepAudio: { type: Boolean, default: true },
    summary: { type: String, default: "" },
    online: { type: Boolean, default: true },
    recordingId: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    quiet: { type: Boolean, default: false },
    sharingSummary: { type: String, default: "" },
  },
  data() {
    return { name: this.defaultName, keepAudio: this.defaultKeepAudio }
  },
  watch: {
    defaultName(value) {
      this.name = value
    },
    defaultKeepAudio(value) {
      this.keepAudio = value
    },
  },
  methods: {
    finish() {
      this.$emit("finish", { name: this.name, keepAudio: this.keepAudio })
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

.m-stop__finish {
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

.m-stop__sharing {
  margin: 0;
  font-size: var(--m-font-size-sm);
}
</style>
