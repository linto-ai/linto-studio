<template>
  <div class="summary-files flex col gap-small">
    <!-- Announced when sending starts and at each new file, not at each percent. -->
    <p class="summary-files__title" role="status">
      <strong>{{ title }}</strong>
      <template v-if="details"> · {{ details }}</template>
    </p>

    <HorizontalScroller
      ref="scroller"
      tag="ul"
      :label="$t('transcription_create.summary.files')">
      <SummaryFileCard
        v-for="(file, index) of files"
        :key="file.id"
        :field="file"
        :duration="durations[file.id] ?? null"
        :percent="
          uploadProgress && index === 0 ? uploadProgress.percent : null
        " />
    </HorizontalScroller>
  </div>
</template>
<script>
import { computeFilesDuration } from "@/tools/transcriptionCreate/computeFilesDuration.js"
import { formatMediaDuration } from "@/tools/transcriptionCreate/formatMediaDuration.js"

import HorizontalScroller from "@/components/molecules/HorizontalScroller.vue"
import SummaryFileCard from "./SummaryFileCard.vue"

export default {
  name: "SummaryFiles",
  components: { HorizontalScroller, SummaryFileCard },
  props: {
    // Files still to send: the one being sent comes first.
    files: { type: Array, required: true },
    // Seconds by file id. null when unknown or not read yet.
    durations: { type: Object, required: true },
    // Added to the title line
    details: { type: String, default: "" },
    // { index, total, percent } while files are being sent
    uploadProgress: { type: Object, default: null },
  },
  computed: {
    isSending() {
      return Boolean(this.uploadProgress)
    },
    title() {
      if (this.isSending) {
        return this.$t("transcription_create.summary.sending", {
          index: this.uploadProgress.index,
          total: this.uploadProgress.total,
        })
      }
      return [this.filesCountLabel, this.totalDurationLabel]
        .filter(Boolean)
        .join(" · ")
    },
    filesCountLabel() {
      return this.$tc(
        "conversation.transcription.file_count",
        this.files.length,
        { count: this.files.length },
      )
    },
    totalDurationLabel() {
      const { seconds, isPartial } = computeFilesDuration(
        this.files.map((file) => this.durations[file.id] ?? null),
      )
      if (!seconds) return null
      const duration = formatMediaDuration(seconds, this.$i18n.locale)
      return isPartial
        ? this.$t("transcription_create.summary.files_total_partial", {
            duration,
          })
        : duration
    },
  },
  watch: {
    // The file being sent is the first one: it has to be in view.
    isSending(isSending) {
      if (isSending) this.$refs.scroller.scrollToStart()
    },
  },
}
</script>
<style lang="scss" scoped>
// The row reaches the edges of the block, so the inline padding is on the title
// and inside the row.
.summary-files {
  --horizontal-scroller-fade: var(--neutral-10);
  --horizontal-scroller-inset: var(--large-gap);
}

.summary-files__title {
  margin: 0;
  padding: 0 var(--large-gap);
}
</style>
