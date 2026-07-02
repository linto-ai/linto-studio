<template>
  <div
    class="quick-session-placeholder flex col flex1 align-center justify-center gap-medium">
    <ph-icon
      :name="isVisio ? 'webcam' : 'microphone'"
      size="48"
      weight="duotone"
      class="quick-session-placeholder__icon" />
    <div class="flex col align-center gap-small">
      <h2 class="quick-session-placeholder__title">{{ title }}</h2>
      <p class="quick-session-placeholder__subtitle">{{ subtitle }}</p>
    </div>
    <Button
      :to="{ name: 'quick session' }"
      :label="continueLabel"
      icon="arrow-right"
      variant="primary" />
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "QuickSessionPlaceholder",
  computed: {
    ...mapGetters("quickSession", ["quickSession", "quickSessionBot"]),
    // A bot means the running session is a videoconference, otherwise it is a
    // plain microphone recording.
    isVisio() {
      return this.quickSessionBot !== null
    },
    variant() {
      return this.isVisio ? "visio" : "audio"
    },
    title() {
      return this.$t(`quick_session.placeholder.${this.variant}.title`)
    },
    subtitle() {
      return this.$t(`quick_session.placeholder.${this.variant}.subtitle`)
    },
    continueLabel() {
      return this.$t(
        `quick_session.placeholder.${this.variant}.continue_button`,
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.quick-session-placeholder {
  min-height: 40vh;
  text-align: center;
  padding: 2rem;
}

.quick-session-placeholder__icon {
  color: var(--primary-color);
}

.quick-session-placeholder__title {
  margin: 0;
}

.quick-session-placeholder__subtitle {
  margin: 0;
  max-width: 40ch;
  color: var(--text-secondary);
}
</style>
