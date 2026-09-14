<template>
  <button type="button" class="m-settings-row" @click="$emit('click')">
    <PhIcon name="sparkle" size="md" class="m-settings-row__icon" />
    <span class="m-settings-row__body">
      <span class="m-muted">{{ $t("mobile.settings.title") }}</span>
      <span class="m-settings-row__summary">{{ summary }}</span>
    </span>
    <PhIcon name="caret-right" size="sm" class="m-settings-row__chevron" />
  </button>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"

export default {
  name: "TranscriptionSettingsRow",
  components: { PhIcon },
  props: {
    summary: { type: String, required: true },
  },
}
</script>

<style scoped>
.m-settings-row {
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  width: 100%;
  min-height: 60px;
  padding: var(--m-space-2) var(--m-space-4);
  border: none;
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-1);
  text-align: left;
  color: var(--m-text);
}

.m-settings-row__icon {
  color: var(--m-primary);
  flex-shrink: 0;
}

.m-settings-row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.m-settings-row__summary {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.m-settings-row__chevron {
  color: var(--m-text-muted);
}
</style>
