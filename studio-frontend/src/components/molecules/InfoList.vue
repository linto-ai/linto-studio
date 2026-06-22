<template>
  <section class="info-list">
    <h4 v-if="title" class="info-list__title">{{ title }}</h4>
    <ul class="info-list__rows">
      <InfoRow
        v-for="(row, index) in rows"
        :key="row.id != null ? row.id : index"
        :icon="row.icon"
        :label="row.label"
        :value="row.value"
        :muted="row.muted">
        <!-- Per-row actions: forwarded from an `actions-<row.id>` slot. -->
        <template
          v-if="row.id != null && $scopedSlots[`actions-${row.id}`]"
          #actions>
          <slot :name="`actions-${row.id}`" :row="row" />
        </template>
      </InfoRow>
    </ul>
  </section>
</template>

<script>
import InfoRow from "./InfoRow.vue"

// Generic container that renders a titled, data-driven list of InfoRow.
// `rows` is [{ id, icon, label, value, muted }]; a row can receive action
// buttons through a slot named `actions-<row.id>`.
export default {
  name: "InfoList",
  components: { InfoRow },
  props: {
    title: {
      type: String,
      default: "",
    },
    rows: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style scoped>
.info-list__rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

/* Dividers live in the container: a row doesn't know if it's first. */
.info-list__rows :deep(.info-row) {
  border-top: 1px solid var(--neutral-20);
}

.info-list__rows :deep(.info-row:first-child) {
  border-top: none;
}
</style>
