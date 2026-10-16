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
      :closeOnClick="false"
      close-on-escape>
      <template #trigger>
        <Button
          :label="$t('invite_user.button')"
          variant="primary"
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
          <div class="flex col gap-small">
            <input
              type="email"
              class="fullwidth"
              autocomplete="off"
              v-model="searchMemberValue.value"
              id="dropdown-search-tags" />
            <div class="flex row gap-small">
              <CustomSelect
                class="flex1"
                fullwidth
                :value="selectedRole"
                :options="roleSelectOptions"
                :aria-label="$t('organisation.user.role_label')"
                @input="role = $event" />
              <Button
                type="submit"
                variant="primary"
                :label="$t('invite_user.invite')"
                :title="
                  enable_invitation
                    ? null
                    : $t('invite_user.inscription_disabled')
                "
                :disabled="
                  searchMemberValue.valid && enable_invitation ? null : true
                " />
            </div>
          </div>
        </form>
        <div class="flex col gap-small small-padding">
          <SearchUsersListComponent
            :searchMemberValue="searchMemberValue.value"
            :expanded="true"
            :currentUser="currentUsers"
            :includeSelf="includeSelf"
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
import { getEnv } from "@/tools/getEnv"
import EMPTY_FIELD from "../const/emptyField"
import SearchUsersListComponent from "@/components/SearchUsersList.vue"
import { testEmail } from "@/tools/fields/testEmail"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"
import Popover from "./atoms/Popover.vue"
import CustomSelect from "@/components/molecules/CustomSelect.vue"
export default {
  props: {
    roleOptions: {
      type: Array,
      default: () => [],
    },
    usersEmailPending: {
      type: Array,
      default: () => [],
    },
    currentUsers: {
      type: Array,
      default: () => [],
    },
    includeSelf: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchMemberValue: {
        ...EMPTY_FIELD,
        value: "",
      },
      showList: false,
      role: ORGANIZATION_ROLES.MEMBER,
    }
  },
  mounted() {},
  watch: {
    "searchMemberValue.value"(value) {
      testEmail(this.searchMemberValue, (key) => this.$t(key))
    },
  },
  computed: {
    enable_invitation() {
      return getEnv("VUE_APP_DISABLE_USER_INVITATION") !== "true"
    },
    // The chosen role falls back to member once it can no longer be granted
    // (the last seat taken by a previous invitation).
    selectedRole() {
      const isGrantable = this.roleOptions.some(
        (option) => option.value === this.role && !option.disabled,
      )
      return isGrantable ? this.role : ORGANIZATION_ROLES.MEMBER
    },
    // The label says why a role is greyed out, not only its color.
    roleSelectOptions() {
      return {
        roles: this.roleOptions.map((option) => ({
          value: option.value,
          disabled: option.disabled,
          text: option.disabled
            ? this.$t("invite_user.role_no_seat", { role: option.name })
            : option.name,
        })),
      }
    },
  },
  methods: {
    inviteUser(event) {
      event.preventDefault()
      this.$emit("inviteUser", {
        email: this.searchMemberValue.value,
        role: this.selectedRole,
      })
      this.showList = false
      return false
    },
    addUser(user) {
      this.$emit("inviteUser", { ...user, role: this.selectedRole })
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
  components: { Fragment, SearchUsersListComponent, CustomSelect },
}
</script>
