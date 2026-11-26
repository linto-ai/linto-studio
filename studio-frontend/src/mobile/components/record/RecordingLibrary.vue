<template>
  <div>
    <LibraryList
      :recordings="recordings"
      :local-bytes="localBytes"
      :online="online"
      :credit-minutes="creditMinutes"
      :credit-reset-at="creditResetAt"
      @open="openRecording" />
    <RecordingSheet
      :value="sheetOpen && Boolean(selected)"
      :recording="selected"
      :online="online"
      :credit-minutes="creditMinutes"
      :open-audio="openSelectedAudio"
      @input="sheetOpen = $event"
      @retry="retry"
      @rename="rename"
      @share-audio="shareAudio"
      @share-document="shareDocument"
      @remove="remove" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import LibraryList from "@/mobile/components/record/LibraryList.vue"
import RecordingSheet from "@/mobile/components/record/RecordingSheet.vue"
import { fetchDocumentFile } from "@/mobile/services/library/fetchDocumentFile.js"
import { shareFile } from "@/api/device/shareFile.js"

// The phone's recordings on the Record page (mobileRecordings): the list,
// and the sheet of one entry to send it again, rename it, share its audio
// or a document generated from it, or delete it.
export default {
  name: "RecordingLibrary",
  components: { LibraryList, RecordingSheet },
  props: {
    // Transcription minutes available and when the quota renews, null
    // when not counted or unknown
    creditMinutes: { type: Number, default: null },
    creditResetAt: { type: String, default: null },
  },
  data() {
    return { sheetOpen: false, selectedId: null, sharingDocument: false }
  },
  computed: {
    ...mapGetters("mobileRecordings", {
      recordings: "library",
      localBytes: "localBytes",
    }),
    online() {
      return this.$store.state.mobileNetwork.online
    },
    selected() {
      return (
        this.$store.getters["mobileRecordings/byId"](this.selectedId) ?? null
      )
    },
  },
  methods: {
    openRecording(recording) {
      this.selectedId = recording.id
      this.sheetOpen = true
    },
    openSelectedAudio() {
      return this.$store.dispatch("mobileRecordings/openAudio", this.selectedId)
    },
    retry(recording) {
      this.$store.dispatch("mobileRecordings/retry", recording.id)
    },
    rename({ recording, name }) {
      this.$store.dispatch("mobileRecordings/rename", {
        id: recording.id,
        name,
      })
    },
    async remove(recording) {
      this.sheetOpen = false
      await this.$store.dispatch("mobileRecordings/remove", recording.id)
    },
    async shareAudio(recording) {
      const file = await this.$store.dispatch(
        "mobileRecordings/readAudioFile",
        recording.id,
      )
      const outcome = file ? await shareFile(file, recording.name) : "failed"
      if (outcome === "failed") {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.library.share_audio_failed"),
        )
      }
    },
    // The generated document as a PDF through the phone's share sheet (or
    // a download). One at a time.
    async shareDocument({ conversation, document }) {
      if (this.sharingDocument) return
      this.sharingDocument = true
      this.$store.dispatch(
        "system/showInfo",
        this.$t("mobile.media.export_preparing"),
      )
      const file = await fetchDocumentFile(conversation, document)
      const outcome = file ? await shareFile(file, file.name) : "failed"
      this.sharingDocument = false
      if (outcome === "failed") {
        this.$store.dispatch(
          "system/showError",
          this.$t("mobile.media.export_failed"),
        )
      }
    },
  },
}
</script>
