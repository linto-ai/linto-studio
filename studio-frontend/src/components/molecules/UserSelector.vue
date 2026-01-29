<template>
  <PopoverList
    :asyncSearch="searchUsers"
    :value="internalValue"
    :selectedItems="formattedSelectedUsers"
    @input="onSelect"
    selection
    :multiple="multiple"
    :closeOnItemClick="!multiple"
    :overlay="false"
    returnObjects
    :searchPlaceholder="$t('user_selector.search_placeholder')"
    class="user-selector">
    <template #trigger="{ open }">
      <slot name="trigger" :open="open" :selectedUsers="selectedUsers">
        <Button
          :iconRight="open ? 'caret-up' : 'caret-down'"
          :icon="value ? null : multiple ? 'users' : 'user'">
          <UserInfoInline
            v-if="value && !multiple"
            :user="value"
            :userId="value._id"
            compact />
          <span v-else>{{ triggerLabel }}</span>
        </Button>
      </slot>
    </template>
    <template #item="{ item }">
      <UserInfoInline :user="item" :userId="item._id" />
    </template>
  </PopoverList>
</template>

<script>
import { apiSearchUser } from "@/api/user.js"
import UserInfoInline from "@/components/molecules/UserInfoInline.vue"

export default {
  name: "UserSelector",
  props: {
    value: {
      type: [Object, Array],
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
  },
  computed: {
    internalValue() {
      if (this.multiple) {
        return Array.isArray(this.value) ? this.value : []
      }
      return this.value
    },
    selectedUsers() {
      if (this.multiple) {
        return Array.isArray(this.value) ? this.value : []
      }
      return this.value ? [this.value] : []
    },
    triggerLabel() {
      if (this.label) return this.label
      if (this.multiple) {
        const count = this.selectedUsers.length
        return count === 0
          ? this.$t("user_selector.select_users")
          : this.$t("user_selector.users_selected", { count })
      }
      return this.value?.email || this.$t("user_selector.select_user")
    },
    formattedSelectedUsers() {
      return this.selectedUsers.map((user) => ({
        ...user,
        id: user._id,
      }))
    },
  },
  methods: {
    async searchUsers(query) {
      const response = await apiSearchUser(query)
      const users = response.data ?? []
      // Format for PopoverList: each item needs id/value for selection
      return users.map((user) => ({
        ...user,
        id: user._id,
      }))
    },
    onSelect(value) {
      this.$emit("input", value)
    },
  },
  components: {
    UserInfoInline,
  },
}
</script>

<style lang="scss">
.user-selector {
  display: inline-flex;
}
</style>
