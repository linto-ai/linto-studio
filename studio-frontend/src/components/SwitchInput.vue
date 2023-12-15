<template>
  <div class="switch">
    <input
      type="checkbox"
      :id="id"
      :name="name"
      :checked="value"
      @change="$emit('input', $event.target.checked)" />
    <label :for="id">
      <div class="switch__slider"></div>
    </label>
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
export default {
  props: {
    value: { type: Boolean, default: false },
    id: { type: String, default: "" },
    name: { type: String, default: "" },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  components: { Fragment },
}
</script>
