<template>
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
        @click="open" />
    </template>

    <template #content>
      <ConversationShareContent
        :selectedConversations="selectedConversations"
        :currentOrganizationScope="currentOrganizationScope" />
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import Button from "@/components/atoms/Button.vue"
import ConversationShareContent from "@/components/conversationShare/ConversationShareContent.vue"

export default {
  name: "ConversationShareMultiple",
  components: { Modal, Button, ConversationShareContent },
  props: {
    selectedConversations: { type: [Array, Map], required: true },
    currentOrganizationScope: { type: String, required: true },
  },
  data() {
    return { showShareList: false }
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
</style>
