<template>
  <label class="filter-chip">
    <span class="filter-chip__label">
      {{ label }}
    </span>
    <span class="filter-chip__count">
       {{ count }}
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
    count: {
      type: Number,
      required: false,
    }
  },
  data() {
    return {
      // use with v-model, selected or not
    }
  },
  mounted() {
  },
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
  padding-right: 0;
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

.filter-chip__count {
  border-radius: 15px;
  min-width: 16px;
  text-align: center;
  padding: 3px;
  //border: var(--border-button);
  margin: 0px;
  margin-left: 0.25rem;
  background-color: var(--neutral-20);
  margin-right: 1px;
  height: calc(100% - 1px);
  color: var(--text-secondary);
}

.filter-chip:has(input[type=radio]:checked) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
