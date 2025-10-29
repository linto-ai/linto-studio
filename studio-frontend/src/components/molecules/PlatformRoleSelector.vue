<template>
  <div>
    <div class="plaform-role" v-for="role in platformRoles">
      {{ role.label }}
    </div>
  </div>
</template>

<script>
import { platformRoleMixin } from "@/mixins/platformRole"

import SelectorDescription from "./SelectorDescription.vue"
import Chip from "../atoms/Chip.vue"

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
