<template>
  <label class="filter-chip">
    <span class="filter-chip__label">
      {{ label }}
    </span>
    <input type="radio" v-model="_value" :value="chipValue"></input>
  </label>
  
</template>
<script>
import { bus } from "@/main.js"
export default {
  name: "FilterChip",
  props: {
    value: {
      type: [String, Object, Number],
      required: true,
    },
    chipValue: { 
      type: [String, Object, Number], 
      default: null 
    },
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // use with v-model, selected or not
    }
  },
  mounted() {},
  methods: {
  },
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(newValue) {
        this.$emit("input", newValue)
      }
    }
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.filter-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25em 0.5em;
  box-sizing: border-box;
  height: 25px;
  // text-transform: capitalize;
  border: var(--border-button);
  border-radius: 50px;
  background-color: var(--background-primary);
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  margin: 0;

  &:hover {
    opacity: 0.8;
  }

  input[type=radio] {
    display: none;
  }
}

.filter-chip:has(input[type=radio]:checked) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
