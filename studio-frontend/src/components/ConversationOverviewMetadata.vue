<template>
  <section class="overview__main-section">
    <h2>
      {{ $t("conversation.transcription_settings_label") }}
    </h2>
    <LabeledValue
      :label="$t('conversation.transcription.diarization_label_inline')"
      :value="isDiarizationEnabledText" />
    <LabeledValue
      :label="$t('conversation.transcription.punctuation_label_inline')"
      :value="isPunctutationEnabledText" />
    <LabeledValue
      :label="$t('conversation.transcription.normalization_label_inline')"
      :value="isNormalizationEnabledText" />
  </section>
</template>
<script>
import { bus } from "@/main.js"

import LabeledValue from "@/components/atoms/LabeledValue.vue"

export default {
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    isDiarizationEnabled() {
      return (
        this.conversation?.metadata?.transcription?.transcriptionConfig
          ?.diarizationConfig?.enableDiarization || false
      )
    },
    isDiarizationEnabledText() {
      return this.isDiarizationEnabled
        ? this.$t("global.enabled")
        : this.$t("global.disabled")
    },
    numberOfSpeaker() {
      return (
        this.conversation?.metadata?.transcription?.transcriptionConfig
          ?.diarizationConfig?.numberOfSpeaker || 0
      )
    },
    isPunctutationEnabled() {
      return (
        this.conversation?.metadata?.transcription?.transcriptionConfig
          ?.punctuationConfig?.enablePunctuation || false
      )
    },
    isPunctutationEnabledText() {
      return this.isPunctutationEnabled
        ? this.$t("global.enabled")
        : this.$t("global.disabled")
    },
    isNormalizationEnabled() {
      return (
        this.conversation?.metadata?.transcription?.transcriptionConfig
          ?.enableNormalization || false
      )
    },
    isNormalizationEnabledText() {
      return this.isNormalizationEnabled
        ? this.$t("global.enabled")
        : this.$t("global.disabled")
    },
  },
  mounted() {},
  methods: {},
  components: { LabeledValue },
}
</script>
