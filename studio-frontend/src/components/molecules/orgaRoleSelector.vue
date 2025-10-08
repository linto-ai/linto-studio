<template>
  <select
    v-model="modelValue"
    v-if="
      (isAtLeastMaintainer &&
        userRole >= modelValue &&
        userInfo._id !== user._id) ||
      (isSystemAdministrator && isBackofficePage)
    "
    @change="updateUserRole">
    <option
      v-for="role in userRoles"
      :key="role.value"
      :value="role.value"
      :disabled="userRole < role.value && !isAtLeastSystemAdministrator">
      {{ role.name }}
    </option>
  </select>
  <span v-else-if="modelValue > maxRoleValue">
    inconsistent role value: {{ modelValue }}</span
  >
  <span v-else>{{ userRoles.find((ur) => ur.value === modelValue).name }}</span>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    userRole: {
      type: Number,
      required: true,
    },
    userRoles: {
      type: Array,
      required: true,
    },
    maxRoleValue: {
      type: Number,
      required: true,
    },
    isAtLeastMaintainer: {
      type: Boolean,
      required: true,
    },
    isSystemAdministrator: {
      type: Boolean,
      required: true,
    },
    isBackofficePage: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:modelValue", "updateUserRole"],
  methods: {
    updateUserRole() {
      this.$emit("update:modelValue", this.modelValue)
      this.$emit("updateUserRole", this.user)
    },
  },
}
</script>
