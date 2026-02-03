<template>
  <Fragment ref="conversation-share" v-click-outside="close">
    <Modal
      v-model="showShareList"
      :title="$t('share_menu.button')"
      :with-actions="false"
      :with-close="true"
      :overlay="true"
      :overlay-close="true"
      size="md"
      custom-modal-class="conversation-share-modal">
      <template #trigger="{ open }">
        <Button
          size="sm"
          :icon="showShareList ? 'x' : 'share-network'"
          variant="secondary"
          :label="$t('share_menu.button')"
          @click="open"></Button>
      </template>

      <template #content>
        <!-- Loading state -->
        <div v-if="loading" class="conversation-share__loading">
          <div class="conversation-share__loading-spinner">
            <span class="icon loading"></span>
          </div>
          <p class="conversation-share__loading-text">
            {{ $t("share_menu.loading_users") }}
          </p>
        </div>

        <!-- Error state -->
        <div
          v-else-if="conversationsInError.length > 0"
          class="conversation-share__error">
          <div class="conversation-share__error-header">
            <span class="icon warning"></span>
            <h3 class="conversation-share__error-title">
              {{ $t("share_menu.conversation_error_title") }}
            </h3>
          </div>
          <div class="conversation-share__error-list">
            <div
              v-for="conversation in conversationsInError"
              :key="conversation._id"
              class="conversation-share__error-item">
              <span class="conversation-share__error-item-name">
                {{ conversation.name }}
              </span>
            </div>
          </div>
        </div>

        <!-- No conversations selected -->
        <div
          v-else-if="selectedConversations.length == 0"
          class="conversation-share__empty">
          <div class="conversation-share__empty-icon">
            <span class="icon users"></span>
          </div>
          <h3 class="conversation-share__empty-title">
            {{ $t("share_menu.no_conversation_selected_title") }}
          </h3>
          <p class="conversation-share__empty-text">
            {{ $t("share_menu.no_conversation_selected_content") }}
          </p>
        </div>

        <!-- Main content -->
        <div v-else class="conversation-share__content">
          <!-- Invite form -->
          <div class="conversation-share__invite-section">
            <h4 class="conversation-share__section-title">
              {{ $t("share_menu.invite_new_user") }}
            </h4>
            <form class="conversation-share__invite-form" @submit="inviteUser">
              <div class="conversation-share__invite-input-group">
                <input
                  type="email"
                  v-model="searchMemberValue.value"
                  :placeholder="$t('share_menu.email_placeholder')"
                  class="conversation-share__invite-input-field"
                  autocomplete="email" />
                <Button
                  type="submit"
                  :icon="'plus'"
                  :label="$t('share_menu.invite_user_button')"
                  :disabled="!isValidEmail || !enable_inscription"
                  :title="
                    enable_inscription
                      ? null
                      : $t('share_menu.inscription_disabled')
                  "
                  color="primary"
                  size="md"
                  class="conversation-share__invite-button" />
              </div>
            </form>
          </div>

          <!-- Search results -->
          <SearchUsersListComponent
            v-if="searchMemberValue.value"
            onlySlot
            ref="conversation-share-search"
            :searchMemberValue="searchMemberValue.value"
            :currentUser="[
              ...userRights.organization_members,
              ...userRights.external_members,
            ]"
            class="conversation-share__search-results">
            <template #default="slotProps">
              <div class="conversation-share__user-item">
                <div class="conversation-share__user-info">
                  <UserInfoInline :user="slotProps.user" />
                </div>
                <div class="conversation-share__user-actions">
                  <select
                    :value="slotProps.user.right"
                    @change="
                      (event) =>
                        updateUserRights(
                          slotProps.user,
                          parseInt(event.target.value),
                        )
                    "
                    class="conversation-share__right-select">
                    <option
                      v-for="right in getRightsList(slotProps.user._id)"
                      :key="right.value"
                      :value="right.value">
                      {{ right.txt }}
                    </option>
                  </select>
                </div>
              </div>
            </template>
          </SearchUsersListComponent>

          <!-- Existing users -->
          <div
            v-if="!searchMemberValue.value"
            class="conversation-share__users-section">
            <!-- Organization members -->
            <div class="conversation-share__user-group">
              <h4 class="conversation-share__section-title">
                {{ $t("share_menu.organization_members") }}
                <span class="conversation-share__user-count">
                  ({{ userRights.organization_members.length }})
                </span>
              </h4>
              <div class="conversation-share__user-list">
                <div
                  v-for="user in userRights.organization_members"
                  :key="user._id"
                  class="conversation-share__user-item">
                  <div class="conversation-share__user-info">
                    <UserInfoInline :user="user" />
                  </div>
                  <div class="conversation-share__user-actions">
                    <div
                      v-if="usersLoading[user._id]"
                      class="conversation-share__loading-indicator">
                      <span class="icon loading"></span>
                    </div>
                    <select
                      v-else
                      :value="user.right"
                      @change="
                        (event) =>
                          updateUserRights(user, parseInt(event.target.value))
                      "
                      class="conversation-share__right-select">
                      <option
                        v-for="right in getRightsList(user._id)"
                        :key="right.value"
                        :value="right.value">
                        {{ right.txt }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- External members -->
            <div class="conversation-share__user-group">
              <h4 class="conversation-share__section-title">
                {{ $t("share_menu.external_members") }}
                <span class="conversation-share__user-count">
                  ({{ userRights.external_members.length }})
                </span>
              </h4>
              <div class="conversation-share__user-list">
                <div
                  v-for="user in userRights.external_members"
                  :key="user._id"
                  class="conversation-share__user-item">
                  <div class="conversation-share__user-info">
                    <UserInfoInline :user="user" />
                  </div>
                  <div class="conversation-share__user-actions">
                    <div
                      v-if="usersLoading[user._id]"
                      class="conversation-share__loading-indicator">
                      <span class="icon loading"></span>
                    </div>
                    <select
                      v-else
                      :value="user.right"
                      @change="
                        (event) =>
                          updateUserRights(user, parseInt(event.target.value))
                      "
                      class="conversation-share__right-select">
                      <option
                        v-for="right in getRightsList(user._id)"
                        :key="right.value"
                        :value="right.value">
                        {{ right.txt }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </Fragment>
</template>

<script>
import { Fragment } from "vue-fragment"
import RIGHTS_LIST from "@/const/rigthsList.js"
import EMPTY_FIELD from "@/const/emptyField.js"
import { mapActions, mapGetters } from "vuex"

import {
  apiGetUsersFromMultipleConversation,
  apiInviteInConversation,
} from "../api/conversation.js"
import { apiUpdateMultipleUsersInMultipleConversations } from "../api/user.js"

import { bus } from "@/main.js"
import { getEnv } from "@/tools/getEnv"
import { getUserRightFromConversation } from "@/tools/getUserRightFromConversation.js"
import { indexConversationRightByUsers } from "@/tools/indexConversationRightByUsers.js"

import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { debounceMixin } from "@/mixins/debounce.js"

import UserInfoInline from "@/components/molecules/UserInfoInline.vue"
import ConversationShareRightSelector from "./ConversationShareRightSelector.vue"
import SearchUsersListComponent from "@/components/SearchUsersList.vue"
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"

export default {
  props: {
    selectedConversations: { type: Array, required: true },
    currentOrganizationScope: { type: String, required: true },
  },
  mixins: [debounceMixin, orgaRoleMixin, convRoleMixin],
  data() {
    return {
      showShareList: false,
      loading: false,
      conversationsInError: [],
      searchMemberValue: {
        ...EMPTY_FIELD,
        value: "",
      },
      usersRightsIndexed: {},
      userRights: {},
      usersRightsFreezed: {},
      usersLoading: {},
    }
  },
  computed: {
    ...mapGetters("userInfos", { user: "getUserInfos" }),
    rightsList() {
      return RIGHTS_LIST((key) => this.$i18n.t(key))
    },
    rightsListWithMultiple() {
      return [
        ...RIGHTS_LIST((key) => this.$i18n.t(key), true),
        {
          value: -1,
          txt: this.$i18n.t("conversation.members_right_txt.mutiple_values"),
        },
      ]
    },
    isValidEmail() {
      return this.searchMemberValue.value.indexOf("@") > 0
    },
    enable_inscription() {
      return getEnv("VUE_APP_DISABLE_USER_CREATION") !== "true"
    },
  },
  watch: {
    async showShareList() {
      if (this.showShareList) {
        this.loading = true
        this.verifyConversationsList()
        if (
          this.selectedConversations.length > 0 &&
          this.conversationsInError.length == 0
        ) {
          await this.loadUsersRights()
        }
        this.loading = false
      }
    },
  },
  methods: {
    close() {
      this.showShareList = false
    },
    verifyConversationsList() {
      this.conversationsInError = []
      for (const conv of this.selectedConversations.values()) {
        if (!this.conversationCanBeShared(conv)) {
          this.conversationsInError.push(conv)
        }
      }
    },
    conversationCanBeShared(conversation) {
      const userRight = getUserRightFromConversation(conversation)

      if (this.hasDeleteRight(userRight)) {
        return true
      }

      if (this.isAtLeastMaintainer) {
        return true
      }

      return false
    },
    async inviteUser(event) {
      event.preventDefault()
      const convIds = this.selectedConversations.map((c) => c._id)
      let res = await apiUpdateMultipleUsersInMultipleConversations(
        convIds,
        [{ email: this.searchMemberValue.value, right: 1 }],
        this.currentOrganizationScope,
        {
          message: this.$t("share_menu.user_has_been_invited"),
        },
      )
      await this.resetSearch()
      return false
    },
    async updateUserRights(user, newRight) {
      if (this.usersLoading?.[user._id]) return

      const convIds = this.selectedConversations.map((c) => c._id)

      this.$set(this.usersLoading, user._id, true)

      let newUser
      if (newRight == -1) {
        return
      } else {
        newUser = {
          id: user._id,
          right: newRight,
        }
      }

      let res = await apiUpdateMultipleUsersInMultipleConversations(
        convIds,
        [newUser],
        this.currentOrganizationScope,
        null,
      )

      if (res.status === "success") {
        bus.$emit("app_notif", {
          status: "success",
          message: this.$t("share_menu.user_right_updated"),
          redirect: false,
        })
        await this.resetSearch()
      } else {
        console.error("error", res)
      }

      this.$set(this.usersLoading, user._id, false)
    },
    async loadUsersRights() {
      const convIds = this.selectedConversations.map((c) => c._id)
      const listOfconvRights =
        await apiGetUsersFromMultipleConversation(convIds)
      this.usersRightsFreezed = Object.freeze(listOfconvRights)
      this.usersRightsIndexed = indexConversationRightByUsers(listOfconvRights)
      this.userRights = {
        organization_members: Array.from(
          this.usersRightsIndexed.organization_members.values(),
        ),
        external_members: Array.from(
          this.usersRightsIndexed.external_members.values(),
        ),
      }
    },
    getRightsList(userId) {
      const userInternal =
        this.usersRightsIndexed.organization_members.get(userId)
      const userExternal = this.usersRightsIndexed.external_members.get(userId)
      if (userExternal?.right == -1 || userInternal?.right == -1) {
        return this.rightsListWithMultiple
      }
      return this.rightsList
    },
    getRightLabel(right) {
      const rightItem = this.rightsList.find((item) => item.value === right)
      return rightItem
        ? rightItem.txt
        : this.$i18n.t("conversation.members_right_txt.mutiple_values")
    },
    canUpdateRights(user) {
      return true // TODO
    },
    async resetSearch() {
      await this.loadUsersRights()
      this.searchMemberValue.value = ""
    },
  },
  components: {
    SearchUsersListComponent,
    UserInfoInline,
    ConversationShareRightSelector,
    Modal,
    Button,
  },
}
</script>

<style lang="scss" scoped>
.conversation-share-modal {
  .modal-content {
    max-width: 700px;
    max-height: 80vh;
    overflow-y: auto;
  }
}

.conversation-share {
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
  }

  &__loading-spinner {
    font-size: 2rem;
    color: var(--primary-color);
  }

  &__loading-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin: 0;
  }

  &__error {
    padding: 1.5rem;
  }

  &__error-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  &__error-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--danger-color);
    margin: 0;
  }

  &__error-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__error-item {
    padding: 0.75rem;
    background-color: var(--danger-soft);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--danger-color);
  }

  &__error-item-name {
    font-size: 0.875rem;
    color: var(--danger-color);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }

  &__empty-icon {
    font-size: 3rem;
    color: var(--neutral-40);
    margin-bottom: 1rem;
  }

  &__empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem 0;
  }

  &__empty-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin: 0;
    max-width: 300px;
  }

  &__content {
    padding: 1.5rem;
  }

  &__invite-section {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--neutral-20);
  }

  &__section-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__invite-form {
    width: 100%;
  }

  &__invite-input-group {
    display: flex;
    gap: 0;
    align-items: stretch;
    width: 100%;
  }

  &__invite-input-field {
    flex: 1;
    min-width: 0;
    padding: 0.5rem 0.75rem;
    // border: 1px solid var(--neutral-30);
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    // border-bottom-left-radius: var(--border-radius-sm);
    border-right: none;
    font-size: 0.875rem;
    color: var(--text-primary);
    background-color: var(--background-primary);
    box-sizing: border-box;
    max-width: 100%;

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-soft);
    }

    &::placeholder {
      color: var(--text-disabled);
    }
  }

  &__invite-button {
    white-space: nowrap;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &__right-select {
    padding: 0.5rem;
    border: 1px solid var(--neutral-50);
    border-radius: var(--border-radius-sm);
    background-color: var(--background-primary);
    color: var(--text-primary);
    font-size: 0.875rem;
    min-width: 120px;
    cursor: pointer;

    &:hover {
      border-color: var(--neutral-40);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px var(--primary-soft);
    }

    &:disabled {
      background-color: var(--neutral-10);
      color: var(--text-disabled);
      cursor: not-allowed;
    }
  }

  &__search-results {
    margin-bottom: 2rem;
  }

  &__users-section {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__user-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__user-count {
    font-weight: 400;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  &__user-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__user-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background-color: var(--background-primary);
    border-radius: var(--border-radius-sm);
    border: 1px solid var(--neutral-50);
    transition: all 0.2s ease;

    &:hover {
      // background-color: var(--background-tertiary);
      //border-color: var(--neutral-30);
    }
  }

  &__user-info {
    flex: 1;
    min-width: 0;
  }

  &__user-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    color: var(--primary-color);
  }

  &__right-selector {
    min-width: 120px;
  }
}

// Responsive design
@media (max-width: 768px) {
  .conversation-share {
    &__invite-input-group {
      flex-direction: column;
      align-items: stretch;
    }

    &__user-item {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;
    }

    &__user-actions {
      justify-content: flex-end;
    }

    &__right-selector {
      width: 100%;
    }
  }
}
</style>
