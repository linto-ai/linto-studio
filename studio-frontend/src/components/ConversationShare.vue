<template>
  <div
    class="flex col"
    id="conversation-share-container"
    v-if="dataLoaded"
    ref="conversation-share"
    v-click-outside="close">
    <button
      id="conversation-share-container"
      @click="showShareList = !showShareList"
      :class="showShareList ? 'active' : ''">
      <span class="label">{{ $t("share.button") }}</span>
    </button>
    <div
      :class="[
        showShareList ? 'visible' : 'hidden',
        'flex',
        'col',
        'conversation-share-list',
      ]">
      <!-- Search -->
      <div v-if="userRights.hasRightAccess(userRight, userRights.SHARE)">
        <form
          class="form-field flex col small-padding no-margin"
          @submit="inviteUser">
          <label class="form-label" for="dropdown-search-tags">
            {{ $t("share.search_label") }}
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
              class="btn green"
              :disabled="this.searchMemberValue.valid ? null : true">
              <span class="label">Invite user</span>
            </button>
          </div>
        </form>
        <!-- members right -->
        <div class="flex row small-padding">
          All member (except custom rights setup below):
          <ConversationShareRightSelector
            :value="membersRight"
            :rightsList="rightsList"
            @updateRight="updateOrgaMembersAccess" />
        </div>
        <SearchUsersListComponent
          class="small-padding"
          ref="conversation-share-search"
          v-if="searchMemberValue.value"
          :searchMemberValue="searchMemberValue.value"
          :currentUser="[
            ...conversationUsers.organization_members,
            ...conversationUsers.external_members,
          ]"
          :conversationId="conversationId"
          v-slot:default="slotProps">
          <ConversationShareRightSelector
            :value="slotProps.user.right"
            @updateRight="
              (newRight) => updateUserRights(slotProps.user, newRight)
            "
            :rightsList="rightsList"
            :readOnly="!canUpdateRights(slotProps.user)"
            :isOwner="slotProps.user._id === conversation.owner" />
        </SearchUsersListComponent>
      </div>

      <!-- User list of already add users -->
      <div
        class="flex col gap-small small-padding"
        v-if="!searchMemberValue.value">
        <UserList
          :title="$t('share.organization_members')"
          :usersList="conversationUsers.organization_members"
          :expanded="true"
          v-slot:default="slotProps">
          <ConversationShareRightSelector
            :value="slotProps.user.right"
            @updateRight="
              (newRight) => updateUserRights(slotProps.user, newRight)
            "
            :rightsList="rightsList"
            :readOnly="!canUpdateRights(slotProps.user)"
            :isOwner="slotProps.user._id === conversation.owner" />
        </UserList>

        <UserList
          :title="$t('share.external_members')"
          :usersList="conversationUsers.external_members"
          :expanded="true"
          v-slot:default="slotProps">
          <ConversationShareRightSelector
            :value="slotProps.user.right"
            @updateRight="
              (newRight) => updateUserRights(slotProps.user, newRight)
            "
            :rightsList="rightsList"
            :readOnly="!canUpdateRights(slotProps.user)"
            :isOwner="slotProps.user._id === conversation.owner" />
        </UserList>
      </div>
    </div>
  </div>
</template>
<script>
import SearchUsersListComponent from "@/components/SearchUsersList.vue"
import RIGHTS_LIST from "@/const/rigthsList.js"
import { apiInviteInConversation } from "../api/conversation"
import EMPTY_FIELD from "../const/emptyField"
import { bus } from "../main.js"
import { debounceMixin } from "../mixins/debounce.js"
import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { workerSendMessage } from "../tools/worker-message.js"

import UserInfoInline from "./UserInfoInline.vue"
import UserList from "./UserList.vue"
import ConversationShareRightSelector from "./ConversationShareRightSelector.vue"

export default {
  props: {
    userInfo: { type: Object, required: true },
    conversation: { type: Object, required: true },
    conversationId: { type: String, required: true },
    userRight: { type: Number, required: true },
  },
  mixins: [debounceMixin, orgaRoleMixin],
  data() {
    return {
      convoUsersLoaded: false,
      showShareList: false,
      rightsList: RIGHTS_LIST((key) => this.$i18n.t(key)),
      searchMemberValue: {
        ...EMPTY_FIELD,
        value: "",
      },
    }
  },
  async mounted() {
    await this.dispatchConversationUsers()
    bus.$on("confirm_unshare_user_conversation", (data) => {
      this.unshareWithUser(data.user)
    })
    bus.$on("conversation-users-update", async () => {
      await this.dispatchConversationUsers()
    })
  },
  beforeDestroy() {
    bus.$off("confirm_unshare_user_conversation")
    bus.$off("conversation-users-update")
  },
  computed: {
    dataLoaded() {
      return this.convoUsersLoaded
    },
    conversationUsers() {
      return this.$store.state.conversationUsers
    },
    userRights() {
      return this.$store.state.userRights
    },
    userInOrganization() {
      return (
        this.conversationUsers.organization_members.filter(
          (user) => user._id === this.userInfo._id
        ).length > 0
      )
    },
    membersRight() {
      return this.conversation.organization.membersRight
    },
  },
  watch: {
    "searchMemberValue.value"(value) {
      this.$options.filters.testEmail(this.searchMemberValue)
    },
  },
  methods: {
    close() {
      this.showShareList = false
    },
    validateUnsharing(user) {
      bus.$emit("show_modal", {
        title: "Unshare conversation",
        content: `Are you sure you want to remove "${user.email} from the conversation ?"`,
        actionBtnLabel: "Unshare",
        actionName: "unshare_user_conversation",
        conversation: this.conversation,
        user,
      })
    },
    async unshareWithUser(user) {
      let userInfo = user
      userInfo.right = 0

      await this.updateUserRights(user)
    },
    async shareWithUser(user) {
      let userInfo = user
      userInfo.right = 1
      userInfo.visibility = "public"
      await this.updateUserRights(user)
    },
    async updateUserRights(user, newRight = null) {
      if (newRight !== null) {
        user.right = newRight
      }
      workerSendMessage("update_conversation_users", {
        conversationId: this.conversationId,
        userId: user._id,
        right: user.right,
      })
    },
    async updateOrgaMembersAccess(value) {
      workerSendMessage("update_organization_right", value)
      //await this.dispatchConversationUsers()
    },
    async dispatchConversationUsers() {
      this.convoUsersLoaded = await this.$options.filters.dispatchStore(
        "getUsersByConversationId",
        { conversationId: this.conversation._id }
      )
    },
    getUserRightTxt(right) {
      return this.$store.getters.getUserRightTxt(right)
    },
    canUpdateRights(user) {
      return (
        (this.userRights.hasRightAccess(
          this.userRight,
          this.userRights.SHARE
        ) ||
          this.isAtLeastMaintainer) &&
        user._id !== this.conversation.owner &&
        user._id !== this.userInfo._id &&
        user.role !== 4
      )
    },
    async inviteUser(e) {
      e.preventDefault()
      try {
        this.$options.filters.testEmail(this.searchMemberValue)
        if (this.searchMemberValue.valid) {
          this.inviteBtnEnabled = false
          const invite = await apiInviteInConversation(
            this.conversationId,
            this.searchMemberValue.value,
            {}
          )
          this.inviteBtnEnabled = true
          if (invite.status === "success") {
            this.$emit("inviteUser")
            this.dispatchConversationUsers()
          } else {
            throw invite
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.searchMemberValue.value = ""
        this.inviteBtnEnabled = true
        return false
      }
    },
  },
  components: {
    SearchUsersListComponent,
    UserInfoInline,
    UserList,
    ConversationShareRightSelector,
  },
}
</script>
