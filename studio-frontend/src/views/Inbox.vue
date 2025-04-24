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
      <ConversationListHeader
        v-model="selectedOption"
        :options="options"
        :withSelector="false">
        <h2 class="flex1">{{ $t("inbox.title") }}</h2>
        <i18n path="inbox.subtitle" tag="span">
          <a
            href="https://linto.app"
            style="vertical-align: text-top; text-decoration: underline"
            place="appLink"
            >linto.app</a
          >
        </i18n>
      </ConversationListHeader>
      <!-- <i18n path="inbox.subtitle" tag="h2">
        <a
          href="https://linto.app"
          style="vertical-align: text-top; text-decoration: underline"
          place="appLink"
          >linto.app</a
        >
      </i18n> -->
      <ConversationList
        :conversations="conversations"
        :loading="loading"
        :currentOrganizationScope="currentOrganizationScope"
        :userInfo="userInfo"
        :error="error"
        :selectable="true"
        :selectedConversations="selectedConversationsList"
        @onSelectConversation="onSelectConversation" />

      <!-- pagination -->
      <div class="bottom-list-sticky">
        <Pagination
          v-model="currentPageNb"
          :pages="totalPagesNumber"
          class="pagination--sticky"
          v-if="totalPagesNumber > 1 && !error" />

        <SelectedConversationIndicator
          v-if="selectedConversationsSize > 0"
          :selectedConversationsSize="selectedConversationsSize" />
      </div>
    </section>
  </MainContent>
</template>

<script>
import { bus } from "@/main.js"

import { conversationListOrgaMixin } from "@/mixins/conversationListOrga.js"
import { debounceMixin } from "@/mixins/debounce"

import ConversationList from "@/components/ConversationList.vue"
import MainContent from "@/components/MainContent.vue"
import Pagination from "@/components/Pagination.vue"
import ModalDeleteConversations from "@/components/ModalDeleteConversations.vue"
import ConversationShareMultiple from "@/components/ConversationShareMultiple.vue"
import { apiGetConversationsWithoutTagsByOrganization } from "@/api/conversation.js"
import SelectedConversationIndicator from "@/components/SelectedConversationIndicator.vue"
import ConversationListHeader from "@/components/ConversationListHeader.vue"
import { apiGetConversationsByOrganization } from "../api/conversation"

export default {
  mixins: [conversationListOrgaMixin, debounceMixin],
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
      selectedOption: "created",
      options: {
        lang: [
          { value: "created", text: this.$i18n.t("inbox.sort.created") },
          {
            value: "last_update",
            text: this.$i18n.t("inbox.sort.last_update"),
          },
          { value: "notags", text: this.$i18n.t("inbox.sort.notags") },
        ],
      },
    }
  },
  mounted() {
    this.fetchConversations()
  },
  watch: {
    selectedOption(value) {
      this.currentPageNb = 0
      this.resetSelectedConversations()
      this.fetchConversations()
    },
  },
  computed: {},
  methods: {
    async apiFetchConversations(search, signal) {
      if (this.selectedOption == "notags") {
        return await apiGetConversationsWithoutTagsByOrganization(
          this.currentOrganizationScope,
          this.currentPageNb,
        )
      } else {
        return await apiGetConversationsByOrganization(
          this.currentOrganizationScope,
          this.currentPageNb,
          { sortField: this.selectedOption },
        )
      }
    },
    async fetchConversations() {
      let res
      this.loading = true
      try {
        res = await this.debouncedSearch(
          this.apiFetchConversations.bind(this),
          this.selectedOption,
        )
      } catch (error) {
        console.error(error)
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
    ConversationListHeader,
    SelectedConversationIndicator,
  },
}
</script>
