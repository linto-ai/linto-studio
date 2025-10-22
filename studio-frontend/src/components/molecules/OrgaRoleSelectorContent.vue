<template>
  <div class="role-selector">
    <label
      @click="onClick(role)"
      @mouseenter="onMouseEnter(role)"
      :hovered="role.value == hoverRole"
      :for="`role-selector__name__${role.value}`"
      class="role-selector__line"
      v-for="role in userRoles"
      :selected="role.value <= value">
      <div class="role-selector__line__radio">
        <Radio
          :id="`role-selector__name__${role.value}`"
          :radioValue="role.value"
          :disabled="readonly"
          name="role"
          v-model="_value" />
      </div>

      <div class="role-selector__line__label">
        <div class="flex align-center role-selector__line__name">
          {{ role.name }}
        </div>
      </div>

      <div class="role-selector__line__description">
        <div class="flex gap-small">
          <ph-icon
            name="check"
            weight="bold"
            class="role-selector__selected-icon" />
          <ph-icon
            name="x"
            weight="bold"
            class="role-selector__unselected-icon" />
          <span>{{ role.description }}</span>
        </div>
      </div>

      <!-- <div class="role-selector__description flex gap-small">
        
      </div> -->
    </label>
  </div>
</template>
<script>
import { bus } from "@/main.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"

export default {
  mixins: [orgaRoleMixin],
  props: {
    value: {
      type: Number,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      hoverRole: this.value,
    }
  },
  mounted() {},
  methods: {
    onClick(role) {
      this.$emit("input", role.value)
    },
    onMouseEnter(role) {
      this.hoverRole = role.value
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
.role-selector {
  display: table;
  max-width: 500px;

  .role-selector__line {
    display: table-row;
  }

  .role-selector__line__radio,
  .role-selector__line__label,
  .role-selector__line__description {
    display: table-cell;
  }

  .role-selector__line__radio {
    display: none;
  }

  .role-selector__line__label {
    border-right: 1px solid var(--neutral-40);
    color: var(--text-primary);
  }

  .role-selector__line__label .role-selector__line__name {
    padding: 0.5rem 1rem;
    padding-right: 1.5rem;
  }

  .role-selector__line__description {
    color: var(--text-disabled);
    padding: 0.5rem 1rem;
  }

  .role-selector__selected-icon,
  .role-selector__unselected-icon {
    flex-shrink: 0;
  }

  .role-selector__selected-icon {
    display: none;
  }

  // line hover
  .role-selector__line[hovered] {
    .role-selector__line__label .role-selector__line__name {
      background-color: var(--primary-color);
      color: var(--primary-contrast);
    }
  }

  // lines that have a next one hover
  .role-selector__line:has(~ .role-selector__line[hovered]),
  .role-selector__line[hovered] {
    .role-selector__line__description {
      color: var(--text-secondary);
    }

    .role-selector__selected-icon {
      display: block;
      color: var(--primary-color) !important;
    }

    .role-selector__unselected-icon {
      display: none;
    }
  }

  // general padding
  .role-selector__line:first-child {
    & > * {
      padding-top: 1rem;
    }
  }

  .role-selector__line:last-child {
    & > * {
      padding-bottom: 1rem;
    }
  }
}
</style>
