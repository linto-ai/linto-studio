<template>
  <select v-model="_value" v-if="!readonly">
    <option
      v-for="role in userRoles"
      :key="role.value"
      :value="role.value"
      :disabled="userRole < role.value && !isAtLeastSystemAdministrator">
      {{ role.name }}
    </option>
  </select>
  <span v-else-if="value > maxRoleValue">
    inconsistent role value: {{ value }}
  </span>
  <span v-else>{{ userRoles.find((ur) => ur.value === value).name }}</span>
</template>

<script>
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { platformRoleMixin } from "@/mixins/platformRole.js"
export default {
  mixins: [orgaRoleMixin, platformRoleMixin],
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
  emits: ["update:modelValue", "updateUserRole"],
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
