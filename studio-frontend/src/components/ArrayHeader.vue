<template>
  <th>
    <button
      v-if="sortable"
      @click="sortBy($event, eventLabel)"
      :class="[
        'table-header-button',
        sortListKey === eventLabel && sortListDirection === 'asc'
          ? 'active asc'
          : '',
        sortListKey === eventLabel && sortListDirection === 'desc'
          ? 'active desc'
          : '',
      ]">
      <slot v-if="hasSlot"></slot>
      <span class="label" v-else>{{ label }}</span>
    </button>
    <template v-else>
      <slot v-if="hasSlot"></slot>
      <span class="label" v-else>{{ label }}</span>
    </template>
  </th>
</template>
<script>
export default {
  props: {
    eventLabel: { type: String, required: true },
    label: { type: String, required: false },
    sortListKey: { type: String, required: true },
    sortListDirection: { type: String, required: true },
    sortable: { type: Boolean, default: true },
  },
  data() {
    return {}
  },
  methods: {
    sortBy(event, key) {
      event.preventDefault()
      this.$emit("list_sort_by", key)
    },
  },
  computed: {
    hasSlot() {
      return !!this.$slots.default
    },
  },
}
</script>
