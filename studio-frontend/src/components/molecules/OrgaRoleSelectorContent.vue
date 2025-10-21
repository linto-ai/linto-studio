<template>
  <div class="role-selector">
    <label
      :for="`role-selector__name__${role.value}`"
      class="role-selector__line"
      v-for="role in userRoles"
      :selected="role.value <= value">
      <div class="role-selector_input-field">
        <Radio
          :id="`role-selector__name__${role.value}`"
          :radioValue="role.value"
          :disabled="readonly"
          name="role"
          v-model="_value" />
        <label :for="`role-selector__name__${role.value}`">
          {{ role.name }}
        </label>
      </div>
      <div class="role-selector__description flex gap-small">
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
    return {}
  },
  mounted() {},
  methods: {},
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
  display: grid;
  grid-template-columns: auto 1fr;

  .role-selector__line {
    display: contents;

    .role-selector_input-field {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border-right: 1px solid var(--neutral-40);
      gap: 0.5rem;

      label {
        padding: 0;
        margin: 0;
      }
    }

    .role-selector__description {
      padding: 0.5rem;
      align-items: center;
      color: var(--text-disabled);
    }

    .role-selector__selected-icon {
      display: none;
    }

    .role-selector__unselected-icon {
      display: block;
    }

    &[selected] {
      .role-selector__description {
        padding: 0.5rem;
        align-items: center;
        color: var(--text-primary);
      }

      .role-selector__selected-icon {
        display: block;
        color: var(--primary-color) !important;
      }

      .role-selector__unselected-icon {
        display: none;
      }
    }
  }
}
</style>
