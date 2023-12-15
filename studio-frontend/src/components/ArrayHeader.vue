<template>
  <th>
    <button
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
      {{ label }}
    </button>
  </th>
</template>
<script>
export default {
  props: {
    eventLabel: { type: String, required: true },
    label: { type: String, required: true },
    sortListKey: { type: String, required: true },
    sortListDirection: { type: String, required: true },
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
}
</script>
