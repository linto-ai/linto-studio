<template>
  <div class="plaform-role-container">
    <Tooltip v-for="role in platformRoles" :text="role.description">
      <div class="plaform-role" v-if="_value & role.value">
        {{ role.name }}
      </div>
    </Tooltip>
  </div>
</template>

<script>
import { platformRoleMixin } from "@/mixins/platformRole"

import SelectorDescription from "./SelectorDescription.vue"
import Chip from "../atoms/Chip.vue"
import Tooltip from "../atoms/Tooltip.vue"

export default {
  mixins: [platformRoleMixin],
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
  computed: {
    _value: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
    items() {
      console.log(
        this.platformRoles.map((role) => ({
          name: role.name,
          description: role.description,
          value: role.value,
        })),
      )
      return this.platformRoles.map((role) => ({
        name: role.name,
        description: role.description,
        value: role.value,
      }))
    },
  },
  components: {
    SelectorDescription,
  },
}
</script>

<style lang="scss" scoped>
.plaform-role-container {
  width: 100%;
}

.plaform-role {
  display: inline-block;
  border: 1px solid var(--neutral-30);
  margin-left: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 50px;
  padding: 0 0.5rem;
  background-color: var(--background-primary);
  color: var(--text-secondary);
  font-weight: 500;
  white-space: nowrap;
}
</style>
