<template>
  <div class="chip" :primary="primary" :red="red" :style="style">
    <span>{{ value }}</span>
    <!-- <span v-if="removable" class="chip__remove" @click="onRemove">x</span> -->
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
export default {
  name: "Chip",
  props: {
    value: { type: String, default: "" },
    removable: { type: Boolean, default: false },
    primary: { type: Boolean, default: false },
    red: { type: Boolean, default: false },
    color: { type: String, default: null },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {
    style() {
      const res = {}
      if (this.color) {
        res.color = this.color
      }
      return res
    },
  },
  methods: {
    onRemove(e) {
      this.$emit("remove", e)
    },
  },
  components: { Fragment },
}
</script>

<style lang="scss" scoped>
.chip {
  display: inline-block;
  border: 1px solid var(--neutral-30);
  border-radius: 50px;
  padding: 0 0.5rem;
  background-color: var(--background-primary);
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;

  &[primary] {
    //border: 2px solid;
    background-color: var(--primary-color);
    color: var(--primary-contrast);
  }

  &[red] {
    background-color: var(--red-chart);
    border-color: var(--red-chart);
    color: var(--primary-contrast);
  }
}
</style>
