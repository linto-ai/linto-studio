<template>
  <TranscriptionCreateFrame
    :title="$t('transcription_create.title')"
    @close="$emit('close')">
    <Loading
      block
      class="flex1"
      :background="false"
      :title="$t('transcription_create.loading')" />
  </TranscriptionCreateFrame>
</template>
<script>
import TranscriptionCreateFrame from "./TranscriptionCreateFrame.vue"

export default {
  name: "LoadingStep",
  components: { TranscriptionCreateFrame },
}
</script>
