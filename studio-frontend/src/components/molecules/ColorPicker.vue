<template>
  <Popover position="bottom" v-model="colorPopoverOpen">
    <template #trigger>
      <div
        class="color-picker__trigger"
        :style="{
          borderColor: borderColor,
          backgroundColor: backgroundColor,
        }"></div>
    </template>
    <template #content>
      <div class="color-picker" borderColor="neutral-50">
        <div
          class="color-picker__color"
          v-for="color in TAG_COLORS"
          :key="color"
          :style="{
            backgroundColor: `var(--material-${color}-100)`,
            borderColor: `var(--material-${color}-500)`,
          }"
          @click="handlePickColor(color)"></div>
      </div>
    </template>
  </Popover>
</template>
<script>
const TAG_COLORS = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "blue-grey",
]

export default {
  props: {
    value: {
      type: String,
      default: "teal",
    },
  },
  data() {
    return {
      colorPopoverOpen: false,
      TAG_COLORS,
    }
  },
  mounted() {},
  computed: {
    backgroundColor() {
      return `var(--material-${this.value}-${this.active ? 800 : 100})`
    },
    borderColor() {
      return `var(--material-${this.value}-500)`
    },
  },
  watch: {},
  methods: {
    handlePickColor(color) {
      this.$emit("input", color)
      this.colorPopoverOpen = false
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.color-picker__trigger {
  height: 20px;
  width: 20px;
  background-color: red;
  border-radius: 20px;
  border: 1px solid;
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0.25rem;
  padding: 0.25rem;
}

.color-picker__color {
  height: 20px;
  width: 20px;
  border-radius: 20px;
  border: 1px solid;
  cursor: pointer;
}

.color-picker__color:hover {
  opacity: 0.8;
}
</style>
