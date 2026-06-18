<template>
  <PopoverList
    :asyncSearch="searchUsers"
    :value="value"
    :selectedItems="formattedSelectedUsers"
    @input="onSelect"
    selection
    :overlay="false"
    returnObjects
    :searchPlaceholder="$t('user_selector.search_placeholder')"
    :full-width="block"
    class="user-selector"
    :placeholder="label || $t('user_selector.select_user')"
    placeholderIcon="user"
    :class="{
      'user-selector--block': block,
    }">
    <template #trigger-content>
      <UserInfoInline :user="value" :userId="value._id" compact />
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
      type: Object,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
    block: {
      type: Boolean,
      default: false,
    },
    // Hide the email line so the trigger stays single-line
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    formattedSelectedUsers() {
      return this.value ? [{ ...this.value, id: this.value._id }] : []
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
/*
.user-selector {
  display: inline-flex;

  &--block {
    display: flex;
    width: 100%;
    max-width: 100%;
  }

  &--block .popover-list__trigger {
    min-width: 0;
    overflow: hidden;
    justify-content: space-between;
  }

  &--compact .user-info-inline__email {
    display: none;
  }

  &__placeholder {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    min-width: 0;
  }
}*/
</style>
