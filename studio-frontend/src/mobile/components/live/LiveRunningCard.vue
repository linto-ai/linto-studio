<template>
  <section class="m-live-running">
    <PhIcon name="broadcast" size="lg" class="m-live-running__icon" />
    <h2 class="m-live-running__title">{{ $t("mobile.live.running_title") }}</h2>
    <p class="m-muted">{{ $t("mobile.live.running_text") }}</p>
    <Button
      variant="primary"
      size="lg"
      block
      :label="$t('mobile.live.resume')"
      @click="$emit('resume')" />
    <Button
      variant="secondary"
      intent="destructive"
      block
      :label="$t('mobile.live.stop')"
      :loading="stopping"
      @click="$emit('stop')" />
  </section>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

// Shown when the user already has a live session (one per user).
export default {
  name: "LiveRunningCard",
  components: { PhIcon },
  props: {
    stopping: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.m-live-running {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--m-space-3);
  padding: var(--m-space-6) var(--m-space-4);
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-1);
  text-align: center;
}

.m-live-running__icon {
  color: var(--m-danger);
}

.m-live-running__title {
  font-size: var(--m-font-size-lg);
}
</style>
