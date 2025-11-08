<template>
  <div class="flex col">
    <select :value="valueKey(value)" @input="input">
      <option v-for="o in planOptions" :value="valueKey(o.value)">
        {{ o.text }}
      </option>
    </select>
  </div>
</template>
<script>
/*
Better to use popoverlist or native select
*/
import { bus } from "@/main.js"

import Checkbox from "@/components/atoms/Checkbox.vue"
import Chip from "@/components/atoms/Chip.vue"
import Badge from "@/components/atoms/Badge.vue"
import ContextMenu from "@/components/atoms/ContextMenu.vue"

export default {
  props: {
    valueText: { required: false },
    value: { required: true },
    icon: { type: String, default: "" },
    iconText: { type: String, default: "" },
    iconType: { type: String, default: "icon" }, //can be img (for user menu...)
    options: { required: true }, // { key: [{ text: "", value: "", icon: "" }, ...]}], key2: [{}, ...]}
    menuPosition: { type: String, default: "right" },
    badge: { type: Number, required: false },
    inline: { type: Boolean, default: false },
    buttonClass: { type: String, default: "" },
    id: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    valueKey: { type: Function, default: (value) => value },
  },
  data() {
    return {
      showList: false,
      // find the right index
      highlightedIndex: 0,
      highlightedSection: Object.keys(this.options)[0],
      p_id: this.id || "select-" + Math.floor(Math.random() * 1000000000),
    }
  },
  mounted() {},
  beforeUnmount() {},
  computed: {
    planOptions() {
      let res = []
      const optionsValues = Array.from(Object.values(this.options))
      for (const optionsCat of optionsValues) {
        res = res.concat(optionsCat)
      }

      return res
    },
  },
  methods: {
    input(e) {
      // test if value is number
      const value = e?.target?.value
      if (Number(value)) {
        this.$emit("input", Number(value))
      } else {
        this.$emit("input", value)
      }
    },
  },
  components: { Checkbox, Chip, Badge, ContextMenu },
}
</script>
