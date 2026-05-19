<template>
  <div class="share-content">
    <div v-if="loading" class="share-content__loading">
      <Loading />
      <p>{{ $t("share_menu.loading_users") }}</p>
    </div>

    <div
      v-else-if="conversationsInError.length > 0"
      class="share-content__error">
      <h3>{{ $t("share_menu.conversation_error_title") }}</h3>
      <ul>
        <li v-for="conv in conversationsInError" :key="conv._id">
          {{ conv.name }}
        </li>
      </ul>
    </div>

    <div
      v-else-if="normalizedConversations.length === 0"
      class="share-content__empty">
      <h3>{{ $t("share_menu.no_conversation_selected_title") }}</h3>
      <p>{{ $t("share_menu.no_conversation_selected_content") }}</p>
    </div>

    <template v-else>
      <FormInput
        :field="searchField"
        :value="searchValue"
        inputFullWidth
        @input="searchValue = $event" />

      <ShareSearchResults
        v-if="searchValue.trim().length > 0"
        :searchValue="searchValue"
        :sharedUsers="sharedUsers"
        :defaultRight="defaultRight"
        :usersLoading="usersLoading"
        :inviteEnabled="enableInvitation"
        @update:userRight="onUserRightUpdate"
        @invite="onInviteByEmail" />

      <template v-else>
        <ShareOrgSection
          :defaultRight="defaultRight"
          :members="orgMembers"
          :exceptions="orgExceptions"
          :admins="orgAdmins"
          :usersLoading="usersLoading"
          @update:defaultRight="onDefaultRightUpdate"
          @update:userRight="onUserRightUpdate"
          @reset="onResetToDefault" />

        <ShareExternalSection
          :members="externalMembers"
          :usersLoading="usersLoading"
          @update:userRight="onUserRightUpdate"
          @remove="onExternalRemove" />
      </template>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

import {
  apiGetUsersFromMultipleConversation,
  apiUpdateConversation,
} from "@/api/conversation.js"
import { apiUpdateMultipleUsersInMultipleConversations } from "@/api/user.js"

import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import { getUserRightFromConversation } from "@/tools/getUserRightFromConversation.js"
import { indexConversationRightByUsers } from "@/tools/indexConversationRightByUsers.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { ORGANIZATION_ROLES } from "@/const/organizationRoles.js"

import Loading from "@/components/atoms/Loading.vue"
import FormInput from "@/components/molecules/FormInput.vue"
import ShareOrgSection from "./ShareOrgSection.vue"
import ShareExternalSection from "./ShareExternalSection.vue"
import ShareSearchResults from "./ShareSearchResults.vue"

const MULTIPLE_VALUE = -1
const NO_RIGHT = 0
const READ_RIGHT = 1

export default {
  name: "ConversationShareContent",
  components: {
    Loading,
    FormInput,
    ShareOrgSection,
    ShareExternalSection,
    ShareSearchResults,
  },
  mixins: [orgaRoleMixin, convRoleMixin],
  props: {
    selectedConversations: { type: [Array, Map], required: true },
    currentOrganizationScope: { type: String, required: true },
  },
  data() {
    return {
      loading: false,
      conversationsInError: [],
      userRights: { organization_members: [], external_members: [] },
      usersLoading: {},
      searchValue: "",
    }
  },
  computed: {
    ...mapGetters("userInfos", { user: "getUserInfos" }),
    ...mapGetters("organizations", {
      orgUsers: "getCurrentOrganizationUsers",
    }),
    orgUserRoleById() {
      return new Map(this.orgUsers.map((u) => [u._id, u.role]))
    },
    normalizedConversations() {
      if (Array.isArray(this.selectedConversations)) {
        return this.selectedConversations.filter(Boolean)
      }
      return Array.from(this.selectedConversations.values()).filter(Boolean)
    },
    enableInvitation() {
      return getEnv("VUE_APP_DISABLE_USER_INVITATION") !== "true"
    },
    defaultRight() {
      const values = this.normalizedConversations.map(
        (c) => c?.organization?.membersRight ?? NO_RIGHT,
      )
      if (values.length === 0) return NO_RIGHT
      const first = values[0]
      return values.every((v) => v === first) ? first : MULTIPLE_VALUE
    },
    orgMembersWithRole() {
      return this.userRights.organization_members.map((u) => ({
        ...u,
        role: this.orgUserRoleById.get(u._id) ?? null,
      }))
    },
    orgAdmins() {
      return this.orgMembersWithRole.filter(
        (u) => u.role >= ORGANIZATION_ROLES.MAINTAINER,
      )
    },
    orgMembers() {
      return this.orgMembersWithRole.filter(
        (u) => u.role == null || u.role < ORGANIZATION_ROLES.MAINTAINER,
      )
    },
    orgExceptions() {
      return this.orgMembers.filter((u) => u.right !== this.defaultRight)
    },
    externalMembers() {
      return this.userRights.external_members
    },
    searchField() {
      return {
        type: "search",
        placeholder: this.$t("share_menu.search_placeholder"),
        label: this.$t("share_menu.search_label"),
      }
    },
    sharedUsers() {
      return [
        ...this.userRights.organization_members,
        ...this.userRights.external_members,
      ]
    },
  },
  watch: {
    selectedConversations: {
      immediate: true,
      handler() {
        this.refresh()
      },
    },
  },
  methods: {
    async refresh() {
      this.loading = true
      this.verifyConversationsList()
      if (
        this.normalizedConversations.length > 0 &&
        this.conversationsInError.length === 0
      ) {
        await this.loadUsersRights()
      }
      this.loading = false
    },
    verifyConversationsList() {
      this.conversationsInError = this.normalizedConversations.filter(
        (c) => !this.conversationCanBeShared(c),
      )
    },
    conversationCanBeShared(conversation) {
      const userRight = getUserRightFromConversation(conversation)
      return this.hasDeleteRight(userRight) || this.isAtLeastMaintainer
    },
    async loadUsersRights() {
      const convIds = this.normalizedConversations.map((c) => c._id)
      const list = await apiGetUsersFromMultipleConversation(convIds)
      const indexed = indexConversationRightByUsers(list)
      this.userRights = {
        organization_members: Array.from(indexed.organization_members.values()),
        external_members: Array.from(indexed.external_members.values()),
      }
    },
    async onDefaultRightUpdate(newRight) {
      this.loading = true
      try {
        const ids = this.normalizedConversations.map((c) => c._id)
        const results = await Promise.all(
          ids.map((id) =>
            apiUpdateConversation(id, {
              "organization.membersRight": newRight,
            }),
          ),
        )
        const failed = results.some((r) => r?.status === "error")
        if (failed) {
          this.notify(
            "error",
            "conversation_overview.rights.orga_right_update_error",
          )
          return
        }
        this.normalizedConversations.forEach((c) => {
          if (c?.organization) c.organization.membersRight = newRight
        })
        await this.loadUsersRights()
        this.notify(
          "success",
          "conversation_overview.rights.orga_right_update_success",
        )
      } finally {
        this.loading = false
      }
    },
    async onUserRightUpdate({ user, right }) {
      if (right === MULTIPLE_VALUE) return
      await this.applyUserRight(user, right, "share_menu.user_right_updated")
    },
    async onResetToDefault(user) {
      await this.applyUserRight(
        user,
        this.defaultRight === MULTIPLE_VALUE ? NO_RIGHT : this.defaultRight,
        "share_menu.user_right_updated",
      )
    },
    async onExternalRemove(user) {
      await this.applyUserRight(user, NO_RIGHT, "share_menu.user_right_updated")
    },
    async onInviteByEmail(email) {
      const convIds = this.normalizedConversations.map((c) => c._id)
      const res = await apiUpdateMultipleUsersInMultipleConversations(
        convIds,
        [{ email, right: READ_RIGHT }],
        this.currentOrganizationScope,
        { message: this.$t("share_menu.user_has_been_invited") },
      )
      if (res?.status !== "error") {
        this.searchValue = ""
        await this.loadUsersRights()
      }
    },
    async applyUserRight(user, newRight, successKey) {
      if (this.usersLoading[user._id]) return
      this.$set(this.usersLoading, user._id, true)
      const convIds = this.normalizedConversations.map((c) => c._id)
      const res = await apiUpdateMultipleUsersInMultipleConversations(
        convIds,
        [{ id: user._id, right: newRight }],
        this.currentOrganizationScope,
        null,
      )
      if (res?.status === "success") {
        this.notify("success", successKey)
        await this.loadUsersRights()
      }
      this.$set(this.usersLoading, user._id, false)
    },
    notify(status, key) {
      bus.$emit("app_notif", {
        status,
        message: this.$i18n.t(key),
        redirect: false,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.share-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;

  &__loading,
  &__empty,
  &__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 2rem 1rem;
    text-align: center;
  }

  &__error {
    color: var(--danger-color);

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
}
</style>
