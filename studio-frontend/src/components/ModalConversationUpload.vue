<template>
  <Modal
    v-bind="$attrs"
    v-model="isModalOpen"
    title="Téléversement de fichiers"
    subtitle="Fichiers audio ou vidéo, depuis votre ordinateur ou une URL…"
    size="lg"
    @on-confirm="$emit('on-confirm')"
    @on-cancel="$emit('on-cancel')"
    @on-close="$emit('on-close')">
    <div class="flex row gap-small">
      <div class="upload-container">
        <input type="file" class="upload-input" />
        <div class="button-group upload-actions">
          <button class="btn primary">Depuis votre ordinateur</button>
          <button class="btn primary" @click="isModalOpenUrl = true">Depuis une URL</button>
        </div>
      </div>
    </div>
    <Modal
      v-model="isModalOpenUrl"
      title="Depuis une URL"
      subtitle="Entrez l'URL de votre fichier audio ou vidéo…"
      size="sm"
      is-form
      :disabled-action-apply="!url"
      @on-confirm="handleLoadUrl"
      @on-cancel="isModalOpenUrl = false"
      @close="url = ''">
      <div>
        <p class="notice text-sm">
          <ph-icon name="info" size="sm"></ph-icon>
          <span>
            Vous pouvez également utiliser l'URL d'un fichier audio ou vidéo hébergé sur un site web tel que YouTube, SoundCloud, etc.
          </span>
        </p>
        <div class="input-group">
          <label for="field-url">URL du fichier</label>
          <input type="text" placeholder="URL" v-model="url" class="full-width" id="field-url" />
        </div>
      </div>
    </Modal>
  </Modal>
</template>

<script>
import Modal from "@/components/molecules/Modal.vue"

export default {
  name: "ModalConversationUpload",
  components: {
    Modal,
  },
  props: {
    value: { type: Boolean, default: false },
  },
  computed: {
    isModalOpen: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
      },
    },
  },
  data() {
    return {
      isModalOpenUrl: false,
      url: "",
    }
  },
  methods: {
    handleLoadUrl() {
      console.log("handleLoadUrl")
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px dashed var(--neutral-60);
  border-radius: 8px;
  width: 100%;
  height: 100%;
  min-height: 200px;
  box-sizing: border-box;
  padding: 1rem;
  background-color: var(--color-neutral-10);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border-color: var(--color-primary-50);
  }
}
.upload-input {
  display: none;
}
</style>