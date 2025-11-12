<template>
  <div class="item-selector">
    <label
      @click="onClick(item)"
      @mouseenter="onMouseEnter(item)"
      :hovered="item.value == hoverItem"
      :for="`item-selector__name__${item.value}`"
      class="item-selector__line"
      v-for="item in items"
      :selected="item.value <= value">
      <div class="item-selector__line__radio">
        <Radio
          :id="`item-selector__name__${item.value}`"
          :radioValue="item.value"
          :disabled="readonly"
          name="role"
          v-model="_value" />
      </div>

      <div class="item-selector__line__label" v-if="!readonly">
        <div class="flex align-center item-selector__line__name">
          {{ item.name }}
        </div>
      </div>

      <div class="item-selector__line__description">
        <div class="flex gap-small">
          <ph-icon
            name="check"
            weight="bold"
            class="item-selector__selected-icon" />
          <ph-icon
            name="x"
            weight="bold"
            class="item-selector__unselected-icon" />
          <span>{{ item.description }}</span>
        </div>
      </div>

      <!-- <div class="item-selector__description flex gap-small">
        
      </div> -->
    </label>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    // {name, value, description}
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      hoverItem: this.value,
    }
  },
  mounted() {},
  methods: {
    onClick(item) {
      this.$emit("input", item.value)
    },
    onMouseEnter(item) {
      this.hoverItem = item.value
    },
  },
  components: {},
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.item-selector {
  display: table;
  max-width: 500px;

  .item-selector__line {
    display: table-row;
  }

  .item-selector__line__radio,
  .item-selector__line__label,
  .item-selector__line__description {
    display: table-cell;
  }

  .item-selector__line__radio {
    display: none;
  }

  .item-selector__line__label {
    border-right: 1px solid var(--neutral-40);
    color: var(--text-primary);
  }

  .item-selector__line__label .item-selector__line__name {
    padding: 0.5rem 1rem;
    padding-right: 1.5rem;
  }

  .item-selector__line__description {
    color: var(--text-disabled);
    padding: 0.5rem 1rem;
  }

  .item-selector__selected-icon,
  .item-selector__unselected-icon {
    flex-shrink: 0;
  }

  .item-selector__selected-icon {
    display: none;
  }

  // line hover
  .item-selector__line[hovered] {
    .item-selector__line__label .item-selector__line__name {
      background-color: var(--primary-color);
      color: var(--primary-contrast);
    }
  }

  // lines that have a next one hover
  .item-selector__line:has(~ .item-selector__line[hovered]),
  .item-selector__line[hovered] {
    .item-selector__line__description {
      color: var(--text-secondary);
    }

    .item-selector__selected-icon {
      display: block;
      color: var(--primary-color) !important;
    }

    .item-selector__unselected-icon {
      display: none;
    }
  }

  // general padding
  .item-selector__line:first-child {
    & > * {
      padding-top: 1rem;
    }
  }

  .item-selector__line:last-child {
    & > * {
      padding-bottom: 1rem;
    }
  }
}
</style>
