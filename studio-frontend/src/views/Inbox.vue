<template>
  <MainContent sidebar>
    <template v-slot:breadcrumb-actions>
      <div class="flex align-center gap-small">
        <button class="red-border btn" @click="clickDeleteConvButton">
          <span class="icon trash"></span>
          <span class="label">{{
            $t("explore.delete_conversation_button")
          }}</span>
        </button>
        <ConversationShareMultiple
          :currentOrganizationScope="currentOrganizationScope"
          :userInfo="userInfo"
          :selectedConversations="selectedConversations" />
      </div>
    </template>
    <ModalDeleteConversations
      v-if="displayDeleteModal"
      :conversationsCount="selectedConversations.size"
      :conversationsInError="conversationsInError"
      @on-cancel="closeDeleteModal"
      @on-confirm="deleteConversations" />

    <section class="flex col flex1 gap-small reset-overflows">
      <i18n path="inbox.subtitle" tag="h2">
        <a
          href="https://linto.app"
          style="vertical-align: text-top; text-decoration: underline"
          place="appLink"
          >linto.app</a
        >
      </i18n>
      <ConversationList
        :conversations="conversations"
        :loading="loading"
        :currentOrganizationScope="currentOrganizationScope"
        :error="error"
        :selectable="true"
        :selectedConversations="selectedConversations"
        :selectedConversationsSize="selectedConversationsSize"
        @onSelectConversation="onSelectConversation" />

      <!-- pagination -->

      <Pagination
        v-model="currentPageNb"
        :pages="totalPagesNumber"
        class="pagination--sticky"
        v-if="totalPagesNumber > 1 && !error" />
    </section>
  </MainContent>
</template>

<script>
import { bus } from "@/main.js"

import { conversationListOrgaMixin } from "@/mixins/conversationListOrga.js"

import ConversationList from "@/components/ConversationList.vue"
import MainContent from "@/components/MainContent.vue"
import Pagination from "@/components/Pagination.vue"
import ModalDeleteConversations from "@/components/ModalDeleteConversations.vue"
import ConversationShareMultiple from "../components/ConversationShareMultiple.vue"
import { apiGetConversationsWithoutTagsByOrganization } from "@/api/conversation.js"

export default {
  mixins: [conversationListOrgaMixin],
  props: {
    userInfo: { type: Object, required: true },
    currentOrganizationScope: { type: String, required: true },
    currentOrgaPersonal: { type: Boolean, required: true },
  },
  data() {
    return {
      conversations: [],
      loading: false,
      error: null,
    }
  },
  mounted() {
    this.fetchConversations()
  },
  computed: {},
  methods: {
    async fetchConversations() {
      let res
      this.loading = true
      try {
        res = await apiGetConversationsWithoutTagsByOrganization(
          this.currentOrganizationScope,
          this.currentPageNb
        )
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
      this.totalElementsNumber = res?.count || 0
      this.conversations = res?.list || []
      if (this.conversations.length == 0 && this.currentPageNb > 0) {
        this.currentPageNb = 0
      }
    },
  },
  components: {
    ConversationList,
    MainContent,
    Pagination,
    ModalDeleteConversations,
    ConversationShareMultiple,
  },
}
</script>
