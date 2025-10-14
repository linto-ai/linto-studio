<template>
  <!-- <select v-model="_value" v-if="!readonly">
    <option
      v-for="role in userRoles"
      :key="role.value"
      :value="role.value"
      :disabled="userRole < role.value && !isAtLeastSystemAdministrator">
      {{ role.name }}
    </option>
  </select> -->
  <PopoverList v-if="!readonly" :items="items" v-model="_value" />
  <span v-else-if="value > maxRoleValue">
    inconsistent role value: {{ value }}
  </span>
  <span v-else>
    <div class="role_name">{{ currentRole.name }}</div>
    <div class="role_description">{{ currentRole.description }}</div>
  </span>
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
    items() {
      return this.userRoles.map((role) => ({
        name: role.name,
        description: role.description,
        value: role.value,
      }))
    },
    currentRole() {
      return this.userRoles.find((ur) => ur.value === this.value)
    },
  },
}
</script>

<style lang="css">
.role_name {
  font-weight: 500;
}

.role_description {
  color: var(--text-secondary);
  font-size: 0.9em;
}
</style>
