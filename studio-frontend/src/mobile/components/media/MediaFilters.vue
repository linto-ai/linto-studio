<template>
  <div class="m-filters">
    <label class="m-filters__search">
      <PhIcon name="magnifying-glass" size="sm" />
      <input
        type="search"
        :value="query"
        :placeholder="$t('mobile.media.search')"
        :aria-label="$t('mobile.media.search')"
        @input="$emit('search', $event.target.value)" />
    </label>
    <div class="m-filters__segments" role="tablist">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="tab"
        class="m-filters__segment"
        :class="{ 'm-filters__segment--active': option.value === status }"
        :aria-selected="option.value === status ? 'true' : 'false'"
        @click="$emit('change-status', option.value)">
        {{ $t(option.label) }}
      </button>
    </div>
  </div>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { MEDIA_STATUS_FILTERS } from "@/mobile/const/mediaStatusFilters.js"

export default {
  name: "MediaFilters",
  components: { PhIcon },
  props: {
    status: { type: String, required: true },
    query: { type: String, default: "" },
  },
  computed: {
    options() {
      return MEDIA_STATUS_FILTERS
    },
  },
}
</script>

<style scoped>
.m-filters {
  display: flex;
  flex-direction: column;
  gap: var(--m-space-2);
}

.m-filters__search {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  min-height: 44px;
  padding: 0 var(--m-space-3);
  border-radius: var(--m-radius-sm);
  background: var(--m-surface);
  border: 1px solid var(--m-border);
  color: var(--m-text-muted);
}

.m-filters__search input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  font: inherit;
  color: var(--m-text);
  outline: none;
}

.m-filters__segments {
  display: flex;
  gap: var(--m-space-2);
}

.m-filters__segment {
  min-height: 36px;
  padding: 0 var(--m-space-3);
  border: 1px solid var(--m-border);
  border-radius: var(--m-radius-round);
  background: var(--m-surface);
  font-size: var(--m-font-size-sm);
  font-weight: 600;
  color: var(--m-text);
}

.m-filters__segment--active {
  background: var(--m-primary);
  border-color: var(--m-primary);
  color: var(--m-on-primary);
}
</style>
