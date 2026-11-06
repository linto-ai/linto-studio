<template>
  <li class="summary-file-card flex align-center gap-small">
    <progress
      v-if="percent !== null"
      class="summary-file-card__progress"
      max="100"
      :value="percent"
      :aria-label="progressLabel"></progress>
    <FileThumbnail :file="field.file" size="sm" />
    <div class="flex1 flex col">
      <span class="summary-file-card__name text-cut" :title="field.value">
        {{ field.value }}
      </span>
      <span class="summary-file-card__details">{{ details }}</span>
    </div>
  </li>
</template>
<script>
import { computeSummaryFileDetails } from "@/tools/transcriptionCreate/computeSummaryFileDetails.js"

import FileThumbnail from "./FileThumbnail.vue"

export default {
  name: "SummaryFileCard",
  components: { FileThumbnail },
  props: {
    field: { type: Object, required: true },
    // Seconds. null when unknown or not read yet.
    duration: { type: Number, default: null },
    // How much of the file is sent. null when it isn't being sent.
    percent: { type: Number, default: null },
  },
  computed: {
    details() {
      return computeSummaryFileDetails(
        this.field.file,
        this.duration,
        this.percent,
        this.$i18n.locale,
      )
    },
    progressLabel() {
      return this.$t("transcription_create.summary.sending_file", {
        name: this.field.value,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
// Isolated so that the progress stays behind the content but above the
// background of the card.
.summary-file-card {
  position: relative;
  isolation: isolate;
  width: 10rem;
  padding: var(--small-gap);
  overflow: hidden;
  border: var(--border-block);
  border-radius: var(--border-radius-sm);
  background: var(--background-primary);
}

.summary-file-card__name {
  font-weight: 600;
}

.summary-file-card__details {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

// The secondary color is not readable enough on the progress.
.summary-file-card:has(.summary-file-card__progress)
  .summary-file-card__details {
  color: var(--text-primary);
}

// Takes the primary color of the global progress style, faded for the text.
.summary-file-card__progress {
  position: absolute;
  inset: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  opacity: 0.25;
  appearance: none;

  &::-webkit-progress-bar {
    background: transparent;
  }

  &::-webkit-progress-value {
    transition: width 0.2s ease;
  }
}

@media (prefers-reduced-motion: reduce) {
  .summary-file-card__progress::-webkit-progress-value {
    transition: none;
  }
}
</style>
