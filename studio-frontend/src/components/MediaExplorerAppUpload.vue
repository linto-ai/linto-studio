<template>
  <div class="media-explorer-upload">
    <!-- Upload Area -->
    <div class="upload-container"
         :class="{ 'drag-over': isDragOver }"
         @dragover.prevent="handleDragOver"
         @dragleave.prevent="handleDragLeave"
         @drop.prevent="handleDrop"
         @click="triggerFileInput">
      
      <ph-icon name="cloud-arrow-up" size="xl" color="neutral-60" />
      
      <h3>{{ isDragOver ? 'Déposez vos fichiers ici' : 'Téléversez vos médias' }}</h3>
      <p>Glissez-déposez vos fichiers audio/vidéo ou utilisez les boutons ci-dessous</p>
      
      <div class="button-group">
        <Button
          color="primary"
          variant="solid"
          icon="folder-open"
          @click.stop="triggerFileInput"
          :disabled="disabled">
          Depuis votre ordinateur
        </Button>
        
        <Button
          color="primary"
          variant="solid"
          icon="link"
          @click.stop="openUrlModal"
          :disabled="disabled">
          Depuis une URL
        </Button>
      </div>

      <!-- Hidden file input -->
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="audio/*,video/*"
        style="display: none"
        @change="handleFileSelect" />
    </div>

    <!-- Selected Files List -->
    <div v-if="selectedFiles.length > 0" class="files-list">
      <h3>Fichiers sélectionnés ({{ selectedFiles.length }})</h3>
      
      <div class="files-grid">
        <div v-for="(file, index) in selectedFiles" :key="file.id" class="file-item">
          <div class="file-header">
            <ph-icon :name="getFileIcon(file)" size="md" color="primary" />
            <div class="file-info">
              <div class="file-name">{{ file.name }}</div>
              <div class="file-size">{{ formatFileSize(file.size) }}</div>
            </div>
            <Button
              variant="transparent"
              icon="x"
              icon-only
              size="sm"
              @click="removeFile(index)"
              :disabled="disabled" />
          </div>

          <div v-if="file.progress !== undefined" class="file-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: file.progress + '%' }"></div>
            </div>
            <span class="progress-text">{{ file.progress }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Transcription Service Selection -->
    <div v-if="selectedFiles.length > 0" class="service-selection">
      <h3>Service de transcription</h3>
      <div class="error-field" v-if="serviceError">{{ serviceError }}</div>
      
      <ConversationCreateServices
        :serviceList="transcriptionServices"
        :disabled="disabled"
        :loading="loadingServices"
        v-model="selectedService" />
    </div>

    <!-- Action Buttons -->
    <div v-if="selectedFiles.length > 0" class="action-buttons">
      <Button
        color="secondary"
        variant="outline"
        @click="clearAll"
        :disabled="disabled">
        Tout effacer
      </Button>
      
      <Button
        color="primary"
        variant="solid"
        icon="cloud-arrow-up"
        :loading="uploading"
        :disabled="!canUpload"
        @click="startUpload">
        Commencer la transcription
      </Button>
    </div>

    <!-- URL Modal -->
    <Modal
      v-model="isUrlModalOpen"
      title="Depuis une URL"
      subtitle="Entrez l'URL de votre fichier audio ou vidéo…"
      size="sm"
      is-form
      overlay
      :disabled-action-apply="!urlInput"
      @on-confirm="fetchFromUrl"
      @on-cancel="closeUrlModal">
      
      <template v-slot:content>
        <div>
          <p class="notice text-sm">
            <ph-icon name="info" size="sm"></ph-icon>
            <span>
              Vous pouvez utiliser l'URL d'un fichier audio ou vidéo hébergé sur un site web.
            </span>
          </p>
          <div class="input-group">
            <label for="field-url">URL du fichier</label>
            <input 
              type="url" 
              placeholder="https://example.com/media.mp4" 
              v-model="urlInput" 
              class="full-width" 
              id="field-url"
              :disabled="fetchingUrl"
              @keyup.enter="fetchFromUrl" />
          </div>
          <div v-if="urlError" class="error-field">{{ urlError }}</div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import ConversationCreateServices from '@/components/ConversationCreateServices.vue'
import Button from '@/components/atoms/Button.vue'
import Modal from '@/components/molecules/Modal.vue'

export default {
  name: 'MediaExplorerAppUpload',
  components: {
    ConversationCreateServices,
    Button,
    Modal,
  },
  props: {
    transcriptionServices: {
      type: Array,
      default: () => [],
    },
    loadingServices: {
      type: Boolean,
      default: false,
    },
    disabled: {
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
      isDragOver: false,
      selectedFiles: [],
      isUrlModalOpen: false,
      urlInput: '',
      urlError: '',
      fetchingUrl: false,
      selectedService: null,
      serviceError: '',
      fileIdCounter: 0,
    }
  },
  computed: {
    ...mapState('inbox', ['medias', 'selectedMedias', 'uploadQueue']),
    ...mapGetters('inbox', ['isUploading', 'totalUploadProgress', 'getUploadProgress']),
    
    canUpload() {
      return this.selectedFiles.length > 0 && 
             this.selectedService && 
             !this.isUploading && 
             !this.disabled
    },
    
    uploading() {
      return this.isUploading
    },
  },
  watch: {
    uploadQueue: {
      handler(newQueue) {
        this.selectedFiles.forEach(file => {
          if (newQueue.find(qf => qf.id === file.id)) {
            file.progress = this.getUploadProgress(file.id)
          }
        })
      },
      deep: true,
    },
  },
  methods: {
    ...mapMutations('inbox', ['addSelectedMedia', 'clearSelectedMedias', 'appendMedias']),
    ...mapActions('inbox', ['uploadFiles', 'clearUploadState']),
    
    handleDragOver(event) {
      event.preventDefault()
      this.isDragOver = true
    },
    
    handleDragLeave(event) {
      event.preventDefault()
      this.isDragOver = false
    },
    
    handleDrop(event) {
      event.preventDefault()
      this.isDragOver = false
      
      const files = Array.from(event.dataTransfer.files)
      this.processFiles(files)
    },
    
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    
    handleFileSelect(event) {
      const files = Array.from(event.target.files)
      this.processFiles(files)
      event.target.value = ''
    },
    
    processFiles(files) {
      const validFiles = files.filter(file => {
        return file.type.startsWith('audio/') || file.type.startsWith('video/')
      })
      
      if (validFiles.length !== files.length) {
        this.$emit('error', 'Certains fichiers ont été ignorés (format non supporté)')
      }
      
      validFiles.forEach(file => {
        this.selectedFiles.push({
          id: ++this.fileIdCounter,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          progress: undefined,
        })
      })
    },
    
    openUrlModal() {
      this.isUrlModalOpen = true
      this.urlError = ''
    },
    
    closeUrlModal() {
      this.isUrlModalOpen = false
      this.urlInput = ''
      this.urlError = ''
    },
    
    async fetchFromUrl() {
      if (!this.urlInput) return
      
      this.fetchingUrl = true
      this.urlError = ''
      
      try {
        // TODO: Implement URL fetching logic
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Add mock file for now
        this.selectedFiles.push({
          id: ++this.fileIdCounter,
          name: this.urlInput.split('/').pop() || 'media-from-url',
          size: 0,
          type: 'unknown',
          url: this.urlInput,
          progress: undefined,
        })
        
        this.closeUrlModal()
      } catch (error) {
        this.urlError = 'Impossible de récupérer le fichier depuis cette URL'
      } finally {
        this.fetchingUrl = false
      }
    },
    
    removeFile(index) {
      this.selectedFiles.splice(index, 1)
    },
    
    clearAll() {
      this.selectedFiles = []
      this.selectedService = null
      this.urlInput = ''
      this.urlError = ''
      this.serviceError = ''
      this.clearUploadState()
    },
    
    async startUpload() {
      if (!this.canUpload) return
      
      try {
        const result = await this.uploadFiles({
          files: this.selectedFiles,
          service: this.selectedService,
          organizationScope: this.currentOrganizationScope,
        })
        
        this.$emit('upload-complete', {
          files: this.selectedFiles,
          service: this.selectedService,
          medias: result.medias,
        })
        
        this.clearAll()
        
      } catch (error) {
        this.$emit('error', 'Erreur lors du téléversement')
        console.error('Upload error:', error)
      }
    },
    
    getFileIcon(file) {
      if (file.type.startsWith('audio/')) return 'waveform'
      if (file.type.startsWith('video/')) return 'video'
      return 'file'
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
  },
  
  beforeDestroy() {
    this.clearUploadState()
  },
}
</script>

<style lang="scss" scoped>
.media-explorer-upload {
  .upload-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: 2px dashed var(--neutral-60);
    border-radius: 8px;
    width: 100%;
    min-height: 200px;
    padding: 2rem;
    box-sizing: border-box;
    background-color: var(--neutral-10);
    cursor: pointer;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: all 0.2s ease;

    &:hover, &.drag-over {
      border-color: var(--primary);
      background-color: var(--primary-soft);
    }

    h3 {
      margin: 0.5rem 0;
      color: var(--neutral-100);
      font-size: 1.2rem;
    }

    p {
      margin: 0 0 1rem 0;
      color: var(--neutral-70);
      font-size: 0.9rem;
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  }

  .files-list {
    margin-top: 1.5rem;

    h3 {
      margin: 0 0 1rem 0;
      color: var(--neutral-100);
    }

    .files-grid {
      display: grid;
      gap: 0.75rem;
    }

    .file-item {
      padding: 1rem;
      border: 1px solid var(--neutral-40);
      border-radius: 4px;
      background-color: var(--neutral-10);

      .file-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .file-info {
          flex: 1;

          .file-name {
            font-weight: 500;
            color: var(--neutral-100);
            word-break: break-word;
          }

          .file-size {
            font-size: 0.8rem;
            color: var(--neutral-70);
          }
        }
      }

      .file-progress {
        margin-top: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        .progress-bar {
          flex: 1;
          height: 4px;
          background-color: var(--neutral-30);
          border-radius: 2px;
          overflow: hidden;

          .progress-fill {
            height: 100%;
            background-color: var(--primary);
            transition: width 0.2s ease;
          }
        }

        .progress-text {
          font-size: 0.8rem;
          color: var(--neutral-70);
          min-width: 3rem;
          text-align: right;
        }
      }
    }
  }

  .service-selection {
    margin-top: 1.5rem;

    h3 {
      margin: 0 0 1rem 0;
      color: var(--neutral-100);
    }
  }

  .action-buttons {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--neutral-30);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}

// Modal content styles
.notice {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--neutral-20);
  border-radius: 4px;
  color: var(--neutral-80);
}

.input-group {
  margin-bottom: 1rem;

  label {
    display: block;
    margin-bottom: 0.25rem;
    color: var(--neutral-100);
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--neutral-40);
    border-radius: 4px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }

    &:disabled {
      background-color: var(--neutral-20);
      color: var(--neutral-60);
    }
  }
}

.error-field {
  color: var(--error);
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.text-sm {
  font-size: 0.85rem;
}

.full-width {
  width: 100%;
  box-sizing: border-box;
}
</style> 