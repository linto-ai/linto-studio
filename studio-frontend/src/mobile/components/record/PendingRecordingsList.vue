<template>
  <section class="m-stack">
    <div class="m-queue__head">
      <h2 class="m-section-title">
        {{ $t("mobile.queue.title", { count: recordings.length }) }}
      </h2>
      <span v-if="!online" class="m-queue__offline">
        <PhIcon name="wifi-slash" size="xs" />
        {{ $t("mobile.common.offline") }}
      </span>
    </div>
    <p v-if="recordings.length === 0" class="m-muted m-queue__empty">
      {{ $t("mobile.queue.empty") }}
    </p>
    <ul v-else class="m-queue__list">
      <PendingRecordingItem
        v-for="recording in recordings"
        :key="recording.id"
        :recording="recording"
        :online="online"
        @open-actions="$emit('open-actions', $event)" />
    </ul>
  </section>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import PendingRecordingItem from "@/mobile/components/record/PendingRecordingItem.vue"

export default {
  name: "PendingRecordingsList",
  components: { PhIcon, PendingRecordingItem },
  props: {
    recordings: { type: Array, required: true },
    online: { type: Boolean, default: true },
  },
}
</script>

<style scoped>
.m-queue__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.m-queue__offline {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  padding: 2px var(--m-space-2);
  border-radius: var(--m-radius-round);
  font-size: 12px;
  font-weight: 600;
  background: var(--m-warning-soft);
  color: var(--m-warning-text);
}

.m-queue__empty {
  padding: var(--m-space-3) 0;
}

.m-queue__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-1);
  overflow: hidden;
}
</style>
