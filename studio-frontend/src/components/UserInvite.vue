<template>
  <div>
    <!-- <div
      class="select__list invite-user-list"
      v-if="showList"
      v-click-outside="close">
      <div class="flex col select__list__inner"> -->
    <Popover
      content-class="invite-user-list"
      overlay
      close-on-click-outside
      close-on-escape>
      <template #trigger>
        <Button
          :label="$t('invite_user.button')"
          variant="secondary"
          size="sm"
          @click="showList = !showList" />
        <!-- <button
          @click="showList = !showList"
          :class="showList ? 'active' : ''"
          class="invite-user-button">
          <span class="icon plus"></span>
          <span class="label">{{ $t("invite_user.button") }}</span>
        </button> -->
      </template>
      <template #content>
        <form
          class="form-field flex col small-padding no-margin"
          @submit="inviteUser">
          <label class="form-label" for="dropdown-search-tags">
            {{ $t("invite_user.search_label") }}
          </label>
          <div class="flex row gap-small">
            <input
              type="search"
              class="flex1"
              autocomplete="off"
              v-model="searchMemberValue.value"
              id="dropdown-search-tags" />
            <button
              type="submit"
              class="btn primary"
              :title="
                enable_inscription
                  ? null
                  : $t('invite_user.inscription_disabled')
              "
              :disabled="
                searchMemberValue.valid && enable_inscription ? null : true
              ">
              <span class="label">{{ $t("invite_user.invite") }}</span>
            </button>
          </div>
        </form>
        <div class="flex col gap-small small-padding">
          <SearchUsersListComponent
            :searchMemberValue="searchMemberValue.value"
            :expanded="true"
            :currentUser="currentUsers"
            v-slot:default="slotProps">
            <Button
              v-if="isPending(slotProps.user)"
              disabled
              loading
              :label="$t('invite_user.pending')" />

            <Button
              v-else-if="isAlreadyInvited(slotProps.user)"
              variant="secondary"
              intent="destructive"
              icon="trash"
              :label="$t('organisation.user.remove_button')"
              @click="removeUser(slotProps.user)"></Button>

            <Button
              v-else
              variant="secondary"
              :label="$t('invite_user.add_user')"
              @click="addUser(slotProps.user)"></Button>
          </SearchUsersListComponent>
        </div>
      </template>
    </Popover>
    <!-- </div>
    </div> -->
  </div>
</template>
<script>
import { Fragment } from "vue-fragment"
import { bus } from "@/main.js"
import EMPTY_FIELD from "../const/emptyField"
import SearchUsersListComponent from "@/components/SearchUsersList.vue"
import { testEmail } from "@/tools/fields/testEmail"
import Popover from "./atoms/Popover.vue"
export default {
  props: {
    usersEmailPending: {
      type: Array,
      default: () => [],
    },
    currentUsers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchMemberValue: {
        ...EMPTY_FIELD,
        value: "",
      },
      showList: false,
    }
  },
  mounted() {},
  watch: {
    "searchMemberValue.value"(value) {
      testEmail(this.searchMemberValue, (key) => this.$t(key))
    },
  },
  computed: {
    enable_inscription() {
      return process.env.VUE_APP_DISABLE_USER_CREATION !== "true"
    },
  },
  methods: {
    inviteUser(event) {
      event.preventDefault()
      this.$emit("inviteUser", { email: this.searchMemberValue.value })
      this.showList = false
      return false
    },
    addUser(user) {
      this.$emit("inviteUser", user)
      return false
    },
    removeUser(user) {
      this.$emit("removeUser", user)
      return false
    },
    close() {
      this.showList = false
    },
    isPending(user) {
      return this.usersEmailPending.includes(user.email)
    },
    isAlreadyInvited(user) {
      return this.currentUsers.find((u) => u.email === user.email)
    },
  },
  components: { Fragment, SearchUsersListComponent },
}
</script>
