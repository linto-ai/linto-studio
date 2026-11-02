<template>
  <!-- Frame shared by the screens of the modal: title, content, actions. -->
  <form class="transcription-frame flex col" @submit.prevent="$emit('submit')">
    <header class="transcription-frame__header flex align-center gap-small">
      <Button
        v-if="withBack"
        type="button"
        variant="text"
        icon="caret-left"
        size="sm"
        :aria-label="$t('transcription_create.back')"
        @click="$emit('back')" />
      <h2 ref="title" class="transcription-frame__title flex1" tabindex="-1">
        {{ title }}
      </h2>
      <Button
        type="button"
        variant="text"
        icon="x"
        size="sm"
        :disabled="locked"
        :aria-label="$t('transcription_create.close')"
        @click="$emit('close')" />
    </header>
    <slot name="context"></slot>
    <div class="transcription-frame__body flex col flex1 gap-medium">
      <slot></slot>
    </div>
    <footer
      v-if="$scopedSlots.footer"
      class="transcription-frame__footer flex col gap-small">
      <slot name="footer-message"></slot>
      <div class="flex align-center gap-small">
        <slot name="footer-start"></slot>
        <div class="flex1"></div>
        <slot name="footer"></slot>
      </div>
    </footer>
  </form>
</template>
<script>
export default {
  name: "TranscriptionCreateFrame",
  props: {
    title: { type: String, required: true },
    withBack: { type: Boolean, default: false },
    // While sending: leaving isn't possible.
    locked: { type: Boolean, default: false },
  },
  // The button that led here is gone: keyboard users carry on from the title.
  mounted() {
    this.$refs.title.focus()
  },
}
</script>
<style lang="scss" scoped>
.transcription-frame {
  min-height: 34rem;
  max-height: calc(100vh - 4rem);
}

.transcription-frame__header {
  padding: var(--medium-gap) var(--large-gap);
  border-bottom: var(--border-block);
}

.transcription-frame__title {
  margin: 0;
  font-size: var(--text-lg);
  outline: none;
}

.transcription-frame__body {
  padding: var(--medium-gap) var(--large-gap);
  overflow-y: auto;
}

.transcription-frame__footer {
  padding: var(--medium-gap) var(--large-gap);
  border-top: var(--border-block);
}
</style>
