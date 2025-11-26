<template>
  <td>
    <slot :value="_value">
      {{ _value }}
    </slot>
    <!-- <component
      v-if="component"
      :is="component"
      v-bind="componentProps"
      :value="_value" />
    <span v-else>{{ _value }}</span> -->
  </td>
</template>
<script>
import { bus } from "@/main.js"
export default {
  props: {
    // { key, label, sortable, width, component, componentProps}
    value: {
      type: [String, Number, Boolean, Object, Array],
      required: false,
    },
    transformValue: {
      type: Function,
      required: false,
      default: (value) => value,
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: {},
  computed: {
    _value() {
      return this.transformValue(this.value) ?? "—"
    },
  },
}
</script>
