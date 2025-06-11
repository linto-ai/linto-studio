<template>
  <div class="action-conversation-create">
    <!-- Create Conversation Button (old fashion) -->
    <Button
      v-if="!isPageConversationCreate"
      color="primary"
      variant="solid"
      size="md"
      :icon="icon"
      @click="handleCreateConversation">
      {{ label }}
    </Button>
    <div v-else>
      <div class="conversation-create-actions button-group">
        <Button
          color="neutral"
          variant="outline"
          size="sm"
          icon="x-circle"
          @click="handleCancelConversation">
          Cancel
        </Button>
      </div>
    </div>

    <!-- Main Action Selection Modal -->
    <Modal
      v-model="isModalOpen"
      title="Créer une nouvelle conversation"
      subtitle="Choisissez le type de conversation que vous souhaitez créer"
      size="lg"
      :with-actions="false">
      <template v-slot:content>
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
            <span class="card-title">Session <Tag size="xs">Bêta</Tag></span>
            <span class="card-subtitle">
              Connectez vos propres flux audio et vidéo…
            </span>
          </Card>
        </div>
      </template>
    </Modal>

    <!-- Media Upload Modal -->
    <Modal
      v-model="isModalOpenUpload"
      title="Téléversement de fichiers"
      subtitle="Téléversez vos médias audio ou vidéo pour les transcrire"
      size="lg"
      :with-actions="false">
      <template v-slot:content>
        <MediaExplorerAppUpload
          :transcriptionServices="transcriptionServices"
          :loadingServices="loadingServices"
          :disabled="uploadInProgress"
          @upload-complete="handleUploadComplete"
          @error="handleUploadError" />

        <div
          class="modal-actions flex row justify-between align-center margin-top-medium">
          <div class="error-message" v-if="uploadError">
            <ph-icon name="warning" color="error" />
            <span>{{ uploadError }}</span>
          </div>
          <div class="flex1" v-else></div>

          <div class="flex row gap-small">
            <Button
              color="secondary"
              variant="outline"
              @click="handleCancelUpload"
              :disabled="uploadInProgress">
              Annuler
            </Button>
          </div>
        </div>
      </template>
    </Modal>

    <!-- Microphone Modal (placeholder) -->
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
import MediaExplorerAppUpload from "@/components/MediaExplorerAppUpload.vue"
import ModalConversationMicro from "@/components/ModalConversationMicro.vue"
import Button from "@/components/atoms/Button.vue"
import Tag from "@/components/atoms/Tag.vue"

export default {
  name: "ActionConversationCreate",
  components: {
    Modal,
    Card,
    MediaExplorerAppUpload,
    ModalConversationMicro,
    Button,
    Tag,
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
    transcriptionServices: {
      type: Array,
      default: () => [],
    },
    loadingServices: {
      type: Boolean,
      default: false,
    },
    currentOrganizationScope: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      isModalOpen: false,
      isModalOpenUpload: false,
      isModalOpenMicro: false,
      uploadInProgress: false,
      uploadError: "",
    }
  },
  computed: {
    isPageConversationCreate() {
      return this.$route.name === "conversations create"
    },
    getDefaultOrganizationId() {
      const organizationId =
        this.currentOrganizationScope ||
        this.$route.params.organizationId ||
        this.$store.getters["organizations/getCurrentOrganizationScope"] ||
        this.$store.getters["organizations/getDefaultOrganizationId"]

      return organizationId
    },
  },
  methods: {
    handleCreateConversation() {
      const targetRoute = {
        name: "conversations create",
        params: {
          organizationId: this.getDefaultOrganizationId,
        },
      }

      if (
        this.$route.name === "conversations create" &&
        this.$route.params.organizationId === this.getDefaultOrganizationId
      ) {
        return
      }

      this.$router.push(targetRoute)
    },

    handleOpenModal() {
      this.isModalOpen = true
    },

    handleOpenModalUpload() {
      this.isModalOpenUpload = true
      this.uploadError = ""
    },

    handleOpenModalMicro() {
      this.isModalOpenMicro = true
    },

    handleClickCard(type) {
      this.isModalOpen = false

      switch (type) {
        case "upload":
          this.handleOpenModalUpload()
          break
        case "microphone":
          this.handleOpenModalMicro()
          break
        case "visio":
          // TODO: Implement visio modal
          console.log("Visio not implemented yet")
          break
        case "session":
          // TODO: Implement session modal
          console.log("Session not implemented yet")
          break
        default:
          console.warn("Unknown card type:", type)
      }
    },

    handleUploadComplete(data) {
      console.log("Upload completed:", data)

      // TODO: Navigate to conversation or show success message
      this.$emit("upload-complete", data)

      // Close modal
      this.isModalOpenUpload = false

      // Show success message
      this.$emit(
        "success",
        `${data.files.length} fichier(s) téléversé(s) avec succès`,
      )
    },

    handleCancelConversation() {
      this.$router.push({
        name: "explore",
        params: { organizationId: this.getDefaultOrganizationId },
      })
    },

    handleUploadError(error) {
      this.uploadError = error
    },

    handleCancelUpload() {
      this.isModalOpenUpload = false
      this.isModalOpen = true
      this.uploadError = ""
    },

    handleConfirmMicro() {
      console.log("handleConfirmMicro")
      // TODO: Implement microphone recording logic
    },

    handleCancelMicro() {
      this.isModalOpenMicro = false
      this.isModalOpen = true
    },
  },
}
</script>

<style lang="scss" scoped>
.action-conversation-create {
  display: flex;
  align-items: center;
}

.conversation-create-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

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

.modal-actions {
  padding-top: 1rem;
  border-top: 1px solid var(--neutral-30);

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--error);
    font-size: 0.9rem;
  }
}

// Utility classes
.margin-top-medium {
  margin-top: 1rem;
}
.flex1 {
  flex: 1;
}
.justify-between {
  justify-content: space-between;
}
.justify-end {
  justify-content: flex-end;
}
.align-center {
  align-items: center;
}
.flex {
  display: flex;
}
.row {
  flex-direction: row;
}
.gap-small {
  gap: 0.5rem;
}
</style>
