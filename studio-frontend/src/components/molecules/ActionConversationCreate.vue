<template>
  <div class="action-conversation-create">
    <button class="btn sm primary" @click="handleOpenModal">
      <ph-icon :name="icon" size="sm" />
      <span class="label">{{ label }}</span>
    </button>
    <Modal
      v-model="isModalOpen"
      title="Create a new conversation"
      subtitle="Create a new conversation"
      size="lg"
      action-btn-label="Create"
      :with-actions="false"
      >
      <div class="flex row gap-small">
        <Card
          class="flex-1"
          color="primary"
          type="outline"
          link
          @click="handleClickCard('upload')">
          <ph-icon name="upload" size="md" class="card-icon" />
          <span class="card-title">Téléversement de fichiers</span>
          <span class="card-subtitle">
            Un fichier audio ou vidéo, depuis votre ordinateur ou une URL…
          </span>
        </Card>
        <Card
          class="flex-1"
          color="primary"
          type="outline"
          link
          @click="handleClickCard('microphone')">
          <ph-icon name="microphone" size="md" class="card-icon" />
          <span class="card-title">Microphone</span>
          <span class="card-subtitle">
            Enregistrez vous depuis une source microphone…
          </span>
        </Card>
        <Card
          class="flex-1"
          color="primary"
          type="outline"
          link
          @click="handleClickCard('visio')">
          <ph-icon name="video-camera" size="md" class="card-icon" />
          <span class="card-title">Visio</span>
          <span class="card-subtitle">
            Connectez LinTO à une visio-conférence…
          </span>
        </Card>
        <Card
          class="flex-1"
          color="primary"
          type="outline"
          link
          @click="handleClickCard('session')">
          <ph-icon name="plugs-connected" size="md" class="card-icon" />
          <span class="card-title"
            >Session <Tag size="xs">Bêta</Tag></span
          >
          <span class="card-subtitle">
            Connectez vos propres flux audio et vidéo…
          </span>
        </Card>
      </div>
    </Modal>
    <ModalConversationUpload
      v-model="isModalOpenUpload"
      title="Téléversement de fichiers"
      subtitle="Un fichier audio ou vidéo, depuis votre ordinateur ou une URL…"
      size="lg"
      @on-confirm="handleConfirmUpload"
      @on-cancel="handleCancelUpload">
      <div class="flex row gap-small">
        <div class="flex1">
          <input type="file" />
          <button class="btn primary">Téléverser</button>
        </div>
      </div>
    </ModalConversationUpload>
    <ModalConversationMicro
      v-model="isModalOpenMicro"
      title="Microphone"
      subtitle="Connectez votre microphone…"
      size="lg"
      @on-confirm="handleConfirmMicro"
      @on-cancel="handleCancelMicro">
    </ModalConversationMicro>
  </div>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"
import Card from "@/components/molecules/Card/Card.vue"

import ModalConversationUpload from "@/components/ModalConversationUpload.vue"
import ModalConversationMicro from "@/components/ModalConversationMicro.vue"

export default {
  name: "ActionConversationCreate",
  components: {
    Modal,
    Card,
    ModalConversationUpload,
    ModalConversationMicro,
  },
  data() {
    return {
      isModalOpen: false,
      isModalOpenUpload: false,
      isModalOpenMicro: false,
    }
  },
  methods: {
    handleOpenModal() {
      this.isModalOpen = true
    },
    handleOpenModalUpload() {
      this.isModalOpenUpload = true
    },
    handleOpenModalMicro() {
      this.isModalOpenMicro = true
    },
    handleConfirmMicro() {
      console.log("handleConfirmMicro")
    },
    handleCancelMicro() {
      this.isModalOpenMicro = false
      this.isModalOpen = true
    },
    handleConfirmUpload() {
      console.log("handleConfirmUpload")
    },
    handleCancelUpload() {
      this.isModalOpenUpload = false
      this.isModalOpen = true
    },
    handleClickCard(type) {
      this.isModalOpen = false
      if (type === "upload") {
        this.handleOpenModalUpload()
      } else if (type === "microphone") {
        this.handleOpenModalMicro()
      }
    },
  },
  props: {
    label: {
      type: String,
      default() {
        return this.$t("navigation.conversation.start")
      },
    },
    icon: {
      type: String,
      default: "play",
    },
  },
}
</script>

<style lang="scss" scoped>
.card-title {
  font-weight: 600;
  color: var(--neutral-100);
  margin-bottom: 4px;
  display: block;
}
.card-subtitle {
  font-size: 12px;
  color: var(--neutral-80);
  display: block;
}
.card-icon {
  margin-bottom: 8px;
}
</style>
