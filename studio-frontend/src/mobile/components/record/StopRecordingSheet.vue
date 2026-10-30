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
    <NotificationBanner
      v-if="quiet"
      variant="warning"
      icon="warning"
      align="start"
      role="status">
      {{ $t("mobile.record.quiet_warning") }}
    </NotificationBanner>
    <NotificationBanner
      v-if="!online"
      variant="warning"
      icon="warning"
      align="start"
      role="status">
      {{ $t("mobile.record.offline_send") }}
    </NotificationBanner>
    <!-- The recording is sent by itself once the sheet closes, unless it is
         deleted: here the user names it and says whether the audio stays
         on the phone. Enter in the name field sends too, so the keyboard
         covering the button does not block anything. -->
    <form class="m-stop" @submit.prevent="finish">
      <label class="m-stop__field">
        <span>{{ $t("mobile.record.name") }}</span>
        <input
          v-model="name"
          type="text"
          required
          maxlength="200"
          enterkeyhint="send" />
      </label>
      <ToggleRow
        v-model="keepAudio"
        :label="$t('mobile.library.keep_audio')"
        :hint="$t('mobile.library.keep_audio_hint')" />
      <p v-if="sharingSummary" class="m-muted m-stop__sharing">
        {{ sharingSummary }}
      </p>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        block
        icon="upload-simple"
        :label="$t('mobile.record.finish')" />
    </form>
    <div v-if="confirmingDiscard" class="m-stop__discard">
      <Button
        ref="confirmDiscard"
        variant="primary"
        intent="destructive"
        icon="trash"
        :label="$t('mobile.record.discard_confirm')"
        @click="$emit('discard')" />
      <Button
        variant="transparent"
        :label="$t('mobile.common.cancel')"
        @click="confirmingDiscard = false" />
    </div>
    <div v-else class="m-stop__discard">
      <Button
        variant="transparent"
        intent="destructive"
        icon="trash"
        :label="$t('mobile.record.discard')"
        @click="askDiscard" />
    </div>
  </BottomSheet>
</template>

<script>
import BottomSheet from "@/mobile/components/BottomSheet.vue"
import NotificationBanner from "@/components/atoms/NotificationBanner.vue"
import ToggleRow from "@/mobile/components/ToggleRow.vue"
import RecordingPlayer from "@/mobile/components/record/RecordingPlayer.vue"

export default {
  name: "StopRecordingSheet",
  components: { BottomSheet, NotificationBanner, ToggleRow, RecordingPlayer },
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
    return {
      name: this.defaultName,
      keepAudio: this.defaultKeepAudio,
      confirmingDiscard: false,
    }
  },
  watch: {
    value(open) {
      if (open) this.confirmingDiscard = false
    },
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
    async askDiscard() {
      this.confirmingDiscard = true
      await this.$nextTick()
      this.$refs.confirmDiscard.$el.focus()
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

.m-stop__sharing {
  margin: 0;
  font-size: var(--m-font-size-sm);
}

.m-stop__discard {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--m-space-2);
}
</style>
