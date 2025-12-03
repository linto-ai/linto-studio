<template>
  <div class="media-explorer-chip-status">
    <span class="media-explorer-chip-status__label">{{ statusText }}</span>
    <span
      class="media-explorer-chip-status__percentage"
      v-if="status != 'pending'">
      {{ progressDisplay }}
    </span>
    <span v-else>
      <ph-icon name="circle-notch" class="animate-spin icon" />
    </span>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import VueLoading from "vue-loading-overlay"

export default {
  props: {
    status: {
      type: String,
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {}
  },
  computed: {
    statusText() {
      switch (this.status) {
        case "preprocessing":
          return this.$t("media_explorer.status.preprocessing")
        case "transcription":
          return this.$t("media_explorer.status.transcription")
        case "diarization":
          return this.$t("media_explorer.status.diarization")
        case "punctuation":
          return this.$t("media_explorer.status.punctuation")
        case "postprocessing":
          return this.$t("media_explorer.status.postprocessing")
        case "pending":
          return this.$t("media_explorer.status.pending")
        default:
          // should not happen
          throw new Error(`Unknown status: ${this.status}`)
      }
    },
    progressDisplay() {
      const integer = Math.floor(this.progress)
      // if (integer < 10) {
      //   return `0${integer}%`
      // }
      return `${integer}%`
    },
  },
  mounted() {},
  methods: {},
  components: {
    VueLoading,
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-chip-status {
  border: 1px solid var(--neutral-40);
  padding: 0px 4px;
  padding-left: 8px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 12px;
  color: var(--text-secondary);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
