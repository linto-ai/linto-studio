<template>
  <section class="m-stack">
    <div class="m-library__head">
      <h2 class="m-section-title">{{ $t("mobile.library.title") }}</h2>
      <span v-if="!online" class="m-library__offline">
        <PhIcon name="wifi-slash" size="xs" />
        {{ $t("mobile.common.offline") }}
      </span>
      <span v-else-if="recordings.length > 0" class="m-muted">
        {{ $t("mobile.library.storage", { size: storage }) }}
      </span>
    </div>
    <p v-if="recordings.length === 0" class="m-muted m-library__empty">
      {{ $t("mobile.library.empty") }}
    </p>
    <ul v-else class="m-library__list">
      <LibraryItem
        v-for="recording in recordings"
        :key="recording.id"
        :recording="recording"
        :online="online"
        @open="$emit('open', $event)" />
    </ul>
  </section>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import LibraryItem from "@/mobile/components/record/LibraryItem.vue"
import { formatFileSize } from "@/mobile/tools/formatFileSize.js"

// The phone's recordings: being sent, or sent with their audio kept.
export default {
  name: "LibraryList",
  components: { PhIcon, LibraryItem },
  props: {
    recordings: { type: Array, required: true },
    localBytes: { type: Number, default: 0 },
    online: { type: Boolean, default: true },
  },
  computed: {
    storage() {
      return formatFileSize(this.localBytes)
    },
  },
}
</script>

<style scoped>
.m-library__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--m-space-2);
  font-size: var(--m-font-size-sm);
}

.m-library__offline {
  display: inline-flex;
  align-items: center;
  gap: var(--m-space-1);
  color: var(--m-warning-text);
}

.m-library__empty {
  margin: 0;
}

.m-library__list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: var(--m-radius);
  background: var(--m-surface);
  box-shadow: var(--m-shadow-1);
  overflow: hidden;
}
</style>
