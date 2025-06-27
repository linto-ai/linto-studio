<template>
  <MainContentConversation
    :conversation="conversation"
    :breadcrumbItems="breadcrumbItems"
    :status="status"
    :dataLoaded="conversationLoaded"
    :error="error"
    organizationPage
    sidebar>
    <ActionBar>
      <div class="flex flex1 align-center gap-small">
        <GenerateSubtitleButton :canEdit="canEdit"></GenerateSubtitleButton>
        <Button
          size="sm"
          label="Delete versions"
          icon="trash"
          color="tertiary"
          variant="outline"
          v-if="canEdit && selectedVersions.length > 0"
          @click="() => (deleteModal = true)"></Button>
        <!-- <button
          class="btn tertiary outline"
          v-if="canEdit"
          @click="() => (deleteModal = true)">
          <span class="icon trash"></span
          ><span class="label">Delete versions</span>
        </button> -->
      </div>
    </ActionBar>
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
import ActionBar from "@/layouts/ActionBar.vue"

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
    canEdit() {
      return this.userRights.hasRightAccess(
        this.userRight,
        this.userRights.WRITE,
      )
    },
    conversationListRoute() {
      return { name: "inbox", hash: "#previous" }
    },
    subtitleAvailable() {
      return (
        this.conversationLoaded &&
        this.conversation.subtitleVersions.length != 0
      )
    },
    breadcrumbItems() {
      return [
        {
          label: this.conversation?.name ?? "",
          to: {
            name: "conversations overview",
            params: { conversationId: this.conversationId },
          },
        },
        {
          label: this.$t("breadcrumb.subtitles"),
        },
      ]
    },
  },
  components: {
    MainContentConversation,
    SubtitleMenu,
    GenerateSubtitleButton,
    OrganizationSidebar,
    ModalDeleteSubtitle,
    ActionBar,
  },
}
</script>
