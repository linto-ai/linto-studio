<template>
  <!-- v-model: a fixed number of speakers, null to leave it automatic. -->
  <div class="flex align-center gap-small">
    <SegmentedControl
      :value="value === null ? 'auto' : 'fixed'"
      :options="modes"
      :ariaLabel="label"
      :disabled="disabled"
      @input="changeMode" />
    <input
      class="speaker-count-field__input"
      type="number"
      step="1"
      :min="minCount"
      :max="maxCount"
      :value="value ?? minCount"
      :aria-label="label"
      :disabled="disabled || value === null"
      @change="commitTyped"
      @keydown.enter.prevent="commitTyped" />
  </div>
</template>
<script>
import {
  MAX_SPEAKER_COUNT,
  MIN_SPEAKER_COUNT,
} from "@/const/transcriptionCreate.js"
import { computeSpeakerCount } from "@/tools/transcriptionCreate/computeSpeakerCount.js"

import SegmentedControl from "@/components/molecules/SegmentedControl.vue"

export default {
  name: "SpeakerCountField",
  components: { SegmentedControl },
  props: {
    value: { type: Number, default: null },
    // Accessible name of the controls
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      minCount: MIN_SPEAKER_COUNT,
      maxCount: MAX_SPEAKER_COUNT,
    }
  },
  computed: {
    modes() {
      return [
        {
          name: "auto",
          label: this.$t("transcription_create.speakers.count_auto"),
        },
        {
          name: "fixed",
          label: this.$t("transcription_create.speakers.count_fixed"),
        },
      ]
    },
  },
  methods: {
    // The active option emits too: a count already fixed stays.
    changeMode(mode) {
      if (mode === "auto") this.$emit("input", null)
      else if (this.value === null) this.$emit("input", MIN_SPEAKER_COUNT)
    },
    // On the field too: the count may be the one already there, with no render
    // to bring back what was typed.
    commitTyped(event) {
      const count = computeSpeakerCount(event.target.value, this.value)
      event.target.value = count
      this.$emit("input", count)
    },
  },
}
</script>
<style lang="scss" scoped>
// Same height as the control next to it.
.speaker-count-field__input {
  box-sizing: border-box;
  width: 4.5rem;
  height: 40.5px;
  border: var(--border-input);
  border-radius: var(--border-radius-sm);

  &:disabled {
    border-color: var(--neutral-20);
    background: var(--neutral-10);
    color: var(--text-secondary);
  }
}
</style>
