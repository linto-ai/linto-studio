<template>
  <div>
    <!-- Mandatory, non-dismissable responsibility acknowledgement gate.
         Shown every time the section is opened; blocks all management until
         the admin explicitly accepts responsibility (or leaves). -->
    <Modal
      v-if="!acknowledged"
      :value="!acknowledged"
      :title="$t('speaker_diarization.gdpr_gate_title')"
      :withClose="false"
      :overlayClose="false"
      :cancelOnEscape="true"
      :withActionCancel="true"
      :textActionCancel="$t('speaker_diarization.gdpr_gate_quit')"
      iconActionCancel="sign-out"
      :textActionApply="
        $t('speaker_diarization.gdpr_gate_acknowledge', { org: orgName })
      "
      iconActionApply="shield-check"
      size="lg"
      @submit="acknowledgeResponsibility"
      @cancel="quitSection">
      <div class="speaker-diarization__gate">
        <div class="speaker-diarization__gate-icon">
          <ph-icon name="shield-warning" size="xl" />
        </div>
        <p>{{ $t("speaker_diarization.gdpr_gate_intro") }}</p>
        <p>{{ $t("speaker_diarization.gdpr_gate_biometric") }}</p>
        <p class="speaker-diarization__gate-emphasis">
          {{
            $t("speaker_diarization.gdpr_gate_responsibility", {
              org: orgName,
            })
          }}
        </p>
      </div>
    </Modal>

    <!-- Drill-down navigation -->
    <SpeakerLabelDetail
      v-if="selectedMemberId"
      :organizationId="organizationId"
      :collectionId="selectedCollectionId"
      :memberId="selectedMemberId"
      :memberName="selectedMemberName"
      :embeddings="selectedCollectionEmbeddings"
      :readOnly="true"
      @back="selectedMemberId = null" />

    <SpeakerLabelDetail
      v-else-if="selectedLabelId"
      :organizationId="organizationId"
      :collectionId="selectedCollectionId"
      :labelId="selectedLabelId"
      :embeddings="selectedCollectionEmbeddings"
      @back="selectedLabelId = null" />

    <SpeakerLabelCollectionDetail
      v-else-if="selectedCollectionId"
      :organizationId="organizationId"
      :collectionId="selectedCollectionId"
      @back="selectedCollectionId = null"
      @select-label="onSelectLabel"
      @select-member="onSelectMember" />

    <!-- Collections list (top-level view) -->
    <template v-else>
      <div class="flex row gap-medium align-center">
        <h2 class="flex1">
          {{ $t("speaker_diarization.title") }}
        </h2>
        <Button
          @click="showCreateModal = true"
          size="sm"
          variant="primary"
          icon="plus"
          :label="$t('speaker_diarization.add_collection')" />
      </div>

      <p class="speaker-diarization__description">
        {{ $t("speaker_diarization.description") }}
      </p>

      <div v-if="loading" class="speaker-diarization__loading">
        {{ $t("speaker_diarization.loading") }}
      </div>

      <div
        v-else-if="collections.length === 0"
        class="speaker-diarization__empty">
        <ph-icon name="microphone-slash" size="xl" />
        <p>{{ $t("speaker_diarization.empty") }}</p>
      </div>

      <div v-else class="speaker-diarization__list">
        <DiarizationCollectionCard
          v-for="collection in sortedCollections"
          :key="collection._id"
          :collection="collection"
          :organizationId="organizationId"
          @select="selectedCollectionId = collection._id"
          @edit="startEdit(collection)"
          @delete="confirmDelete(collection)" />
      </div>

      <!-- Create collection modal -->
      <Modal
        v-model="showCreateModal"
        isForm
        :title="$t('speaker_diarization.create_collection_title')"
        :textActionApply="$t('speaker_diarization.create')"
        :disabledActionApply="!newCollection.name"
        @submit="createCollection">
        <div
          class="speaker-diarization__warning speaker-diarization__warning--compact">
          <ph-icon name="warning" size="md" />
          <p>{{ $t("speaker_diarization.gdpr_warning") }}</p>
        </div>
        <div class="speaker-diarization__form">
          <label>{{ $t("speaker_diarization.collection_name") }}</label>
          <input
            type="text"
            v-model="newCollection.name"
            :placeholder="$t('speaker_diarization.collection_name_placeholder')"
            class="speaker-diarization__input" />

          <label>{{ $t("speaker_diarization.collection_description") }}</label>
          <input
            type="text"
            v-model="newCollection.description"
            :placeholder="
              $t('speaker_diarization.collection_description_placeholder')
            "
            class="speaker-diarization__input" />

          <div class="speaker-diarization__storage-mode">
            <span class="speaker-diarization__storage-label">
              {{ $t("speaker_diarization.voiceprint_storage_mode_title") }}
            </span>
            <FormRadio
              :field="collectionStorageModeField"
              @input="setNewCollectionStorageMode" />
            <p
              v-if="isEmbeddingsMode"
              class="speaker-diarization__storage-warning">
              <ph-icon name="warning" size="sm" />
              {{ $t("speaker_diarization.voiceprint_storage_mode_warning") }}
            </p>
          </div>
        </div>
      </Modal>

      <!-- Edit collection modal -->
      <Modal
        v-model="showEditModal"
        isForm
        :title="$t('speaker_diarization.edit_collection_title')"
        :textActionApply="$t('speaker_diarization.save')"
        :disabledActionApply="!editCollection.name"
        @submit="saveEdit">
        <div class="speaker-diarization__form">
          <label>{{ $t("speaker_diarization.collection_name") }}</label>
          <input
            type="text"
            v-model="editCollection.name"
            class="speaker-diarization__input" />

          <label>{{ $t("speaker_diarization.collection_description") }}</label>
          <input
            type="text"
            v-model="editCollection.description"
            class="speaker-diarization__input" />
        </div>
      </Modal>

      <!-- Delete confirmation modal -->
      <Modal
        v-model="showDeleteModal"
        :title="$t('speaker_diarization.delete_collection_title')"
        @submit="deleteCollection">
        <p v-if="deletingCollection">
          {{
            $t("speaker_diarization.delete_collection_confirm", {
              name: deletingCollection.name,
            })
          }}
        </p>
      </Modal>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Button from "@/components/atoms/Button.vue"
import SwitchInput from "@/components/atoms/SwitchInput.vue"
import FormRadio from "@/components/molecules/FormRadio.vue"
import Modal from "@/components/molecules/Modal.vue"
import SpeakerLabelCollectionDetail from "@/components/SpeakerLabelCollectionDetail.vue"
import SpeakerLabelDetail from "@/components/SpeakerLabelDetail.vue"
import DiarizationCollectionCard from "@/components/DiarizationCollectionCard.vue"
import { COLLECTION_TYPE, STORAGE_MODE } from "@/tools/voiceprintConstants.js"

export default {
  name: "SpeakerIdentificationSettings",
  components: {
    Button,
    SwitchInput,
    FormRadio,
    Modal,
    SpeakerLabelCollectionDetail,
    SpeakerLabelDetail,
    DiarizationCollectionCard,
  },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      acknowledged: false,
      loading: false,
      selectedCollectionId: null,
      selectedLabelId: null,
      selectedMemberId: null,
      selectedMemberName: "",
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      newCollection: {
        name: "",
        description: "",
        storageMode: STORAGE_MODE.AUDIO,
      },
      editCollection: { _id: null, name: "", description: "" },
      deletingCollection: null,
    }
  },
  computed: {
    ...mapGetters("organizations", {
      currentOrganization: "getCurrentOrganization",
      collections: "getVoiceprintCollections",
    }),
    orgName() {
      return (
        this.currentOrganization?.name ||
        this.$t("speaker_diarization.gdpr_your_org")
      )
    },
    isEmbeddingsMode() {
      return this.isEmbeddingsCollection(this.newCollection)
    },
    sortedCollections() {
      return [...this.collections].sort((a, b) => {
        if (
          a.type === COLLECTION_TYPE.ORGANIZATION &&
          b.type !== COLLECTION_TYPE.ORGANIZATION
        )
          return -1
        if (
          a.type !== COLLECTION_TYPE.ORGANIZATION &&
          b.type === COLLECTION_TYPE.ORGANIZATION
        )
          return 1
        return 0
      })
    },
    collectionStorageModeField() {
      return {
        value: this.newCollection.storageMode,
        error: null,
        options: [
          {
            name: STORAGE_MODE.AUDIO,
            label: this.$t("speaker_diarization.voiceprint_storage_mode_audio"),
            description: this.$t(
              "speaker_diarization.voiceprint_storage_mode_audio_desc",
            ),
          },
          {
            name: STORAGE_MODE.EMBEDDINGS,
            label: this.$t(
              "speaker_diarization.voiceprint_storage_mode_embeddings",
            ),
            description: this.$t(
              "speaker_diarization.voiceprint_storage_mode_embeddings_desc",
            ),
          },
        ],
      }
    },
    selectedCollectionEmbeddings() {
      const c = this.collections.find(
        (x) => x._id === this.selectedCollectionId,
      )
      return !!c && c.storageMode === STORAGE_MODE.EMBEDDINGS
    },
  },
  watch: {
    selectedCollectionId(newVal, oldVal) {
      if (newVal === null && oldVal !== null) {
        this.selectedMemberId = null
        this.selectedMemberName = ""
        this.fetchCollections()
      }
    },
  },
  mounted() {
    this.fetchCollections()
  },
  methods: {
    acknowledgeResponsibility() {
      this.acknowledged = true
    },
    quitSection() {
      // Declined responsibility: leave this section (no access granted) but
      // keep the settings modal open so other tabs stay reachable.
      this.$emit("quit")
    },
    setNewCollectionStorageMode(mode) {
      if (mode) this.newCollection.storageMode = mode
    },
    isEmbeddingsCollection(collection) {
      return collection.storageMode === STORAGE_MODE.EMBEDDINGS
    },
    async fetchCollections() {
      // Only the collection list lives here; per-collection stats are loaded
      // by each DiarizationCollectionCard so they stream in independently.
      this.loading = true
      try {
        await this.$store.dispatch("organizations/loadVoiceprintCollections")
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.fetch_error"),
          type: "error",
          timeout: 5000,
        })
      } finally {
        this.loading = false
      }
    },
    onSelectLabel(labelId) {
      this.selectedLabelId = labelId
    },
    onSelectMember({ userId, name }) {
      this.selectedMemberId = userId
      this.selectedMemberName = name || ""
    },
    async createCollection() {
      try {
        await this.$store.dispatch(
          "organizations/createVoiceprintCollection",
          this.newCollection,
        )
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.created_success"),
          type: "success",
          timeout: 5000,
        })
        this.newCollection = {
          name: "",
          description: "",
          storageMode: STORAGE_MODE.AUDIO,
        }
        this.showCreateModal = false
        this.fetchCollections()
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: err.message || this.$t("speaker_diarization.created_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    startEdit(collection) {
      this.editCollection = {
        _id: collection._id,
        name: collection.name,
        description: collection.description || "",
      }
      this.showEditModal = true
    },
    async saveEdit() {
      try {
        const res = await this.$store.dispatch(
          "organizations/updateVoiceprintCollection",
          {
            collectionId: this.editCollection._id,
            payload: {
              name: this.editCollection.name,
              description: this.editCollection.description,
            },
          },
        )
        if (res.status === "success") {
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.updated_success"),
            type: "success",
            timeout: 5000,
          })
          this.showEditModal = false
          this.fetchCollections()
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.updated_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    confirmDelete(collection) {
      this.deletingCollection = collection
      this.showDeleteModal = true
    },
    async deleteCollection() {
      if (!this.deletingCollection) return

      try {
        const res = await this.$store.dispatch(
          "organizations/deleteVoiceprintCollection",
          this.deletingCollection._id,
        )
        if (res.status === "success") {
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.deleted_success"),
            type: "success",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.deleted_error"),
          type: "error",
          timeout: 5000,
        })
      }

      this.deletingCollection = null
      this.showDeleteModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
.speaker-diarization {
  &__gate {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    font-size: 14px;
    line-height: 1.55;
    color: var(--text-primary);

    p {
      margin: 0;
    }
  }

  &__gate-icon {
    display: flex;
    justify-content: center;
    color: var(--orange-chart, #ff9800);
    margin-bottom: 0.25rem;
  }

  &__gate-emphasis {
    padding: 0.75rem 1rem;
    background: var(--orange-soft, #fff3e0);
    border-left: 3px solid var(--orange-chart, #ff9800);
    border-radius: 4px;
    font-weight: 500;
  }

  &__warning {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    margin: 0.5rem 0 1rem;
    background: var(--orange-soft, #fff3e0);
    border: 1px solid var(--orange-chart, #ff9800);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-primary);

    p {
      margin: 0;
    }

    &--compact {
      margin: 0 0 1rem;
      font-size: 12px;
    }
  }

  &__description {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0 0 1.5rem;
  }

  &__loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 3rem;
    color: var(--text-secondary);

    p {
      margin: 0;
      font-size: 14px;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    label {
      font-weight: 600;
      font-size: 14px;
    }
  }

  &__input {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--neutral-40);
    border-radius: 4px;
    font-size: 14px;
    background: var(--background-primary);
    color: var(--text-primary);

    &:focus {
      outline: none;
      border-color: var(--primary-hard);
    }
  }

  &__storage-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem;
    border: 1px solid var(--neutral-20);
    border-radius: 6px;
  }

  &__storage-label {
    font-weight: 500;
    font-size: 14px;
    display: block;
  }

  &__storage-desc {
    font-size: 12px;
    color: var(--text-secondary);
    display: block;
    margin-top: 0.15rem;
  }

  &__storage-warning {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    margin: 0.5rem 0 0;
    background: var(--orange-soft, #fff3e0);
    border: 1px solid var(--orange-chart, #ff9800);
    border-radius: 6px;
    font-size: 12px;
    color: var(--text-primary);
  }
}
</style>
