<template>
  <MainContentConversation
    :conversation="conversation"
    :status="status"
    :dataLoaded="conversationLoaded"
    :error="error"
    organizationPage
    sidebar>
    <template v-slot:breadcrumb-actions>
      <GenerateSubtitleButton :canEdit="canEdit"></GenerateSubtitleButton>
      <h1
        class="flex1 center-text text-cut"
        style="padding-left: 1rem; padding-right: 1rem">
        {{ conversation.name }}
      </h1>
      <button
        class="btn red-border"
        v-if="canEdit"
        @click="() => (deleteModal = true)">
        <span class="icon trash"></span
        ><span class="label">Delete versions</span>
      </button>
    </template>
    <SubtitleMenu
      :conversation="conversation"
      :status="status"
      :userInfo="userInfo"
      :userRight="userRight"
      :canEdit="canEdit"
      v-model="selectedVersions"></SubtitleMenu>
    <ModalDeleteSubtitle
      v-if="deleteModal"
      :subtitleIds="selectedVersions"
      @on-close="() => (deleteModal = false)"></ModalDeleteSubtitle>
  </MainContentConversation>
</template>
<script>
import { subtitleMixin } from "@/mixins/subtitle.js"
import MainContentConversation from "../components/MainContentConversation.vue"
import SubtitleMenu from "@/components/SubtitleMenu.vue"
import GenerateSubtitleButton from "@/components/GenerateSubtitleButton.vue"
import OrganizationSidebar from "../components/OrganizationSidebar.vue"
import ModalDeleteSubtitle from "../components/ModalDeleteSubtitle.vue"

export default {
  mixins: [subtitleMixin],
  data() {
    return {
      status: null,
      deleteModal: false,
    }
  },
  watch: {
    conversationLoaded(newVal, oldVal) {
      if (newVal) {
        this.status = this.computeStatus(this.conversation?.jobs?.transcription)
      }
    },
  },
  computed: {
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    subtitleAvailable() {
      return (
        this.conversationLoaded &&
        this.conversation.subtitleVersions.length != 0
      )
    },
  },
  components: {
    MainContentConversation,
    SubtitleMenu,
    GenerateSubtitleButton,
    OrganizationSidebar,
    ModalDeleteSubtitle,
  },
}
</script>
