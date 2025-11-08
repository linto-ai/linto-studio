<template>
  <div class="chip" :primary="primary" :red="red">
    <span>{{ value }}</span>
    <!-- <span v-if="removable" class="chip__remove" @click="onRemove">x</span> -->
  </div>
</template>
<script>
export default {
  name: "Chip",
  props: {
    value: { type: String, default: "" },
    removable: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    red: { type: Boolean, default: false },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    onRemove(e) {
      this.$emit("remove", e)
    },
  },
}
</script>
