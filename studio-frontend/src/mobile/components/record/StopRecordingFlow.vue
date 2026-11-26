<template>
  <StopRecordingSheet
    :value="Boolean(recording)"
    :default-name="recording ? recording.name : ''"
    :default-keep-audio="recording ? recording.keepAudio : true"
    :summary="summary"
    :online="online"
    :open-audio="openAudio"
    :quiet="quiet"
    :sharing-summary="sharingSummary"
    @input="onSheetInput"
    @finish="finish"
    @discard="discard" />
</template>

<script>
import StopRecordingSheet from "@/mobile/components/record/StopRecordingSheet.vue"
import { saveKeepAudioPreference } from "@/api/localStorage/keepAudioPreference.js"
import { formatDurationShort } from "@/mobile/tools/formatDurationShort.js"
import { formatFileSize } from "@/mobile/tools/formatFileSize.js"
import { isRecordingQuiet } from "@/mobile/tools/isRecordingQuiet.js"
import { sumGapDurations } from "@/mobile/tools/sumGapDurations.js"
import RIGHTS_LIST from "@/const/rigthsList.js"

// The stop sheet of a recording that just stopped: the user names it and
// says whether the audio stays on the phone, then hands it over to the
// mobileRecordings store (send), which sends it by itself. Dismissing the
// sheet hands it over as it stands; deleting removes it. v-model: the id
// of the stopped recording, null once the sheet is done with.
export default {
  name: "StopRecordingFlow",
  components: { StopRecordingSheet },
  props: {
    value: { type: String, default: null },
  },
  computed: {
    recording() {
      return this.value
        ? this.$store.getters["mobileRecordings/byId"](this.value)
        : null
    },
    online() {
      return this.$store.state.mobileNetwork.online
    },
    quiet() {
      return isRecordingQuiet(this.recording?.audio ?? null)
    },
    summary() {
      switch (true) {
        case !this.recording:
          return ""
        default:
          return this.describeAudio(this.recording.audio)
      }
    },
    // Rights and folder frozen on the recording; nothing to show while
    // they are resolved when sending.
    sharingSummary() {
      const sharing = this.recording?.conversation.sharing
      switch (true) {
        case !sharing:
          return ""
        default:
          return this.describeSharing(sharing)
      }
    },
  },
  methods: {
    async finish({ name, keepAudio }) {
      saveKeepAudioPreference(keepAudio)
      await this.$store.dispatch("mobileRecordings/send", {
        id: this.value,
        name,
        keepAudio,
      })
      this.$emit("input", null)
    },
    // Removed before the sheet closes, so the closing finds nothing left
    // to send.
    async discard() {
      await this.$store.dispatch("mobileRecordings/remove", this.value)
      this.$emit("input", null)
    },
    // Closed without "Send": sent all the same, as it stands. send does
    // nothing once the recording was sent or removed.
    async onSheetInput(open) {
      if (open || !this.recording) return
      await this.$store.dispatch("mobileRecordings/send", {
        id: this.recording.id,
        name: this.recording.name,
        keepAudio: this.recording.keepAudio,
      })
      this.$emit("input", null)
    },
    openAudio() {
      return this.$store.dispatch("mobileRecordings/openAudio", this.value)
    },
    describeAudio({ durationMs, sizeBytes, gaps }) {
      const summary = this.$t("mobile.record.stopped_summary", {
        duration: formatDurationShort(durationMs),
        size: formatFileSize(sizeBytes),
      })
      const gapsSummary = this.$tc("mobile.record.gaps_summary", gaps.length, {
        count: gaps.length,
        duration: formatDurationShort(sumGapDurations(gaps)),
      })
      return gaps.length === 0 ? summary : `${summary} · ${gapsSummary}`
    },
    describeSharing({ membersRight, folderId }) {
      const rights = RIGHTS_LIST((key) => this.$t(key))
      const right = rights.find((item) => item.value === membersRight)
      const folder = this.$store.getters["folders/getFolderById"](folderId)
      return this.$t("mobile.record.sharing_line", {
        right: right?.txt ?? "",
        folder: folder ? folder.name : this.$t("mobile.media.root_folder"),
      })
    },
  },
}
</script>
