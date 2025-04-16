import { orgaRoleMixin } from "@/mixins/orgaRole.js"
import { convRoleMixin } from "@/mixins/convRole.js"
import { conversationListMixin } from "@/mixins/conversationList"
import { getUserRightFromConversation } from "@/tools/getUserRightFromConversation.js"

import { bus } from "@/main.js"

import { apiDeleteMultipleConversation } from "@/api/conversation.js"

export const conversationListOrgaMixin = {
  mixins: [conversationListMixin, orgaRoleMixin, convRoleMixin],
  watch: {
    currentOrganizationScope() {
      this.fetchConversations()

      this.selectedConversations = new Map()
      this.selectedConversationsSize = 0
    },
  },
  methods: {
    conversationIsDeletable(conversation) {
      const userRight = getUserRightFromConversation(
        conversation,
        this.userInfo._id,
      )

      if (conversation.owner == this.userInfo._id) {
        return true
      }

      if (this.hasDeleteRight(userRight)) {
        return true
      }

      if (this.isAtLeastMaintainer) {
        return true
      }

      return false
    },
    async deleteConversations() {
      this.displayDeleteModal = false
      const conversationsIds = Array.from(this.selectedConversations.keys())
      try {
        this.loading = true
        const res = await apiDeleteMultipleConversation(
          this.currentOrganizationScope,
          conversationsIds,
          null,
        )
        if (res.status == "success") {
          bus.$emit("app_notif", {
            status: "success",
            message: this.$i18n.tc(
              "conversation.delete_success_message",
              conversationsIds.length,
            ),
            timeout: null,
          })
          this.currentPageNb = 0
          await this.fetchConversations()
        } else {
          bus.$emit("app_notif", {
            status: "error",
            message: this.$i18n.tc(
              "conversation.delete_error_message",
              conversationsIds.length,
            ),
            timeout: null,
          })
        }
      } catch (error) {
        console.error(error)
        bus.$emit("app_notif", {
          status: "error",
          message: this.$i18n.tc(
            "conversation.delete_error_message",
            conversationsIds.length,
          ),
          timeout: null,
        })
      } finally {
        this.loading = false
        this.selectedConversations.clear()
        this.selectedConversationsSize = 0
        this.selectedConversationsList = []
      }
    },
  },
}
