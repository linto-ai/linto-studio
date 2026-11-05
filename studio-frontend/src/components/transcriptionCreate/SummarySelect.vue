<template>
  <!-- One choice among a few, in a row of the summary. -->
  <PopoverList
    fullWidth
    variant="tertiary"
    :items="items"
    :value="value"
    :ariaLabel="label"
    :aria-label="triggerLabel"
    :disabled="disabled"
    @input="$emit('input', $event)" />
</template>
<script>
import PopoverList from "@/components/atoms/PopoverList.vue"

export default {
  name: "SummarySelect",
  components: { PopoverList },
  props: {
    // Label of the row
    label: { type: String, required: true },
    // [{ id or value, name, description? }]
    items: { type: Array, required: true },
    value: { type: [String, Number], default: null },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    // The button shows the value alone: the label is the one of the row.
    triggerLabel() {
      const selected = this.items.find(
        (item) => (item.id ?? item.value) === this.value,
      )
      return selected ? `${this.label} : ${selected.name}` : this.label
    },
  },
}
</script>
