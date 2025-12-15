<template>
  <div class="relative">
    <PopoverList
      :items="listUsers"
      v-model="selectedUserId"
      class="relative"
      :overlay="false"
      :closeOnClick="false"
      @click="selectUser">
      <template #trigger="{ open }">
        <FormInput :field="fieldUser" v-model="fieldUser.value">
          <template #content-after-input>
            <Button label="Effacer" @click="clear" />
          </template>
        </FormInput>
      </template>
      <template #item="{ item }">
        <UserInfoInline :user="item.user" :userId="item.user._id" />
      </template>
    </PopoverList>
  </div>
</template>
<script>
import { bus } from "@/main.js"
import { apiSearchUser } from "@/api/user.js"
import { debounceMixin } from "@/mixins/debounce"
import EMPTY_FIELD from "@/const/emptyField"

import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import FormInput from "@/components/molecules/FormInput.vue"

export default {
  mixins: [debounceMixin],
  props: {
    value: {
      type: Object,
      default: null,
    },
    label: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      fieldUser: {
        ...EMPTY_FIELD,
        type: "text",
        label: this.label,
      },
      showPopover: false,
      listUsers: [],
      selectedUserId: null, // internal value (user id)
    }
  },
  mounted() {},
  methods: {
    selectUser(item) {
      this.$emit("input", item.user)
    },
    clear() {
      this.fieldUser.value = ""
      this.$emit("input", null)
    },
  },
  watch: {
    "fieldUser.value": async function (data) {
      if (data.length > 0) {
        const request = await this.debouncedSearch(apiSearchUser, data)
        const users = request.data ?? []
        this.listUsers = users.map((user) => ({
          user: user,
          value: user._id,
        }))
      } else {
        this.listUsers = []
      }
    },
    value: function () {
      this.fieldUser.value = this.value?.email ?? ""
    },
  },
  computed: {
    currentUsers() {
      return this.value ? [this.value] : []
    },
  },
  components: {
    UserInfoInline,
    FormInput,
  },
}
</script>
