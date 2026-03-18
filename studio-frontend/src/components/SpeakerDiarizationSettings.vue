<template>
  <div>
    <!-- Drill-down navigation -->
    <SpeakerLabelDetail
      v-if="selectedMemberId"
      :organizationId="organizationId"
      :collectionId="selectedCollectionId"
      :memberId="selectedMemberId"
      :memberName="selectedMemberName"
      :readOnly="true"
      @back="selectedMemberId = null" />

    <SpeakerLabelDetail
      v-else-if="selectedLabelId"
      :organizationId="organizationId"
      :collectionId="selectedCollectionId"
      :labelId="selectedLabelId"
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

      <div class="speaker-diarization__warning">
        <ph-icon name="warning" size="md" />
        <p>{{ $t("speaker_diarization.gdpr_warning") }}</p>
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
        <div
          v-for="collection in sortedCollections"
          :key="collection._id"
          class="speaker-diarization__card"
          @click="selectedCollectionId = collection._id">
          <div class="speaker-diarization__card-header">
            <span class="speaker-diarization__card-name">
              {{ collection.name }}
            </span>
            <span
              v-if="collection.description || collection.type === 'organization'"
              class="speaker-diarization__card-desc">
              {{ collection.description || $t("speaker_diarization.auto_managed") }}
            </span>
            <div class="speaker-diarization__card-actions" @click.stop>
              <template v-if="collection.type !== 'organization'">
                <Button
                  icon="pencil-simple"
                  variant="tertiary"
                  iconWeight="regular"
                  @click="startEdit(collection)" />
                <Button
                  icon="trash"
                  variant="secondary"
                  intent="destructive"
                  iconWeight="regular"
                  @click="confirmDelete(collection)" />
              </template>
            </div>
          </div>
          <div class="speaker-diarization__card-stats">
            <span>
              <ph-icon name="user" size="sm" />
              {{ collectionStats[collection._id]?.labels || 0 }}
              {{ $t("speaker_diarization.speakers") }}
            </span>
            <span>
              <ph-icon name="waveform" size="sm" />
              {{ collectionStats[collection._id]?.signatures || 0 }}
              {{ $t("speaker_diarization.samples") }}
            </span>
          </div>
        </div>
      </div>

      <!-- Create collection modal -->
      <Modal
        v-model="showCreateModal"
        :title="$t('speaker_diarization.create_collection_title')"
        :textActionApply="$t('speaker_diarization.create')"
        :disabledActionApply="!newCollection.name"
        @submit="createCollection">
        <div class="speaker-diarization__warning speaker-diarization__warning--compact">
          <ph-icon name="warning" size="md" />
          <p>{{ $t("speaker_diarization.gdpr_warning") }}</p>
        </div>
        <div class="speaker-diarization__form">
          <label>{{ $t("speaker_diarization.collection_name") }}</label>
          <input
            type="text"
            v-model="newCollection.name"
            :placeholder="
              $t('speaker_diarization.collection_name_placeholder')
            "
            class="speaker-diarization__input" />

          <label>{{ $t("speaker_diarization.collection_description") }}</label>
          <input
            type="text"
            v-model="newCollection.description"
            :placeholder="
              $t('speaker_diarization.collection_description_placeholder')
            "
            class="speaker-diarization__input" />

          <label>{{ $t("speaker_diarization.storage_mode") }}</label>
          <FormRadio
            :field="storageModeField"
            @input="newCollection.storageMode = $event" />
        </div>
      </Modal>

      <!-- Edit collection modal -->
      <Modal
        v-model="showEditModal"
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
import Button from "@/components/atoms/Button.vue"
import FormRadio from "@/components/molecules/FormRadio.vue"
import Modal from "@/components/molecules/Modal.vue"
import SpeakerLabelCollectionDetail from "@/components/SpeakerLabelCollectionDetail.vue"
import SpeakerLabelDetail from "@/components/SpeakerLabelDetail.vue"
import { COLLECTION_TYPE } from "@/tools/speakerDiarizationConstants.js"
import {
  apiGetSpeakerLabelCollections,
  apiCreateSpeakerLabelCollection,
  apiUpdateSpeakerLabelCollection,
  apiDeleteSpeakerLabelCollection,
  apiGetOptedInMembers,
} from "@/api/speakerLabelCollection.js"
import { apiGetSpeakerLabels } from "@/api/speakerLabel.js"
import { apiGetVoiceSignatures } from "@/api/voiceSignature.js"

export default {
  name: "SpeakerDiarizationSettings",
  components: {
    Button,
    FormRadio,
    Modal,
    SpeakerLabelCollectionDetail,
    SpeakerLabelDetail,
  },
  props: {
    organizationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      collections: [],
      collectionStats: {},
      loading: false,
      selectedCollectionId: null,
      selectedLabelId: null,
      selectedMemberId: null,
      selectedMemberName: "",
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      newCollection: { name: "", description: "", storageMode: "audio" },
      editCollection: { _id: null, name: "", description: "" },
      deletingCollection: null,
    }
  },
  computed: {
    storageModeField() {
      return {
        value: this.newCollection.storageMode,
        error: null,
        options: [
          { name: "audio", label: this.$t("speaker_diarization.storage_mode_audio"), description: this.$t("speaker_diarization.storage_mode_audio_desc") },
          { name: "embeddings", label: this.$t("speaker_diarization.storage_mode_embeddings"), description: this.$t("speaker_diarization.storage_mode_embeddings_desc") },
        ],
      }
    },
    sortedCollections() {
      return [...this.collections].sort((a, b) => {
        if (a.type === COLLECTION_TYPE.ORGANIZATION && b.type !== COLLECTION_TYPE.ORGANIZATION) return -1
        if (a.type !== COLLECTION_TYPE.ORGANIZATION && b.type === COLLECTION_TYPE.ORGANIZATION) return 1
        return 0
      })
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
    async fetchCollections() {
      this.loading = true
      try {
        this.collections = await apiGetSpeakerLabelCollections(
          this.organizationId,
        )
        // Fetch stats (speakers + signatures) for all collections in parallel
        await Promise.all(
          this.collections.map(async (col) => {
            try {
              if (col.type === COLLECTION_TYPE.ORGANIZATION) {
                const members = await apiGetOptedInMembers(
                  this.organizationId,
                  col._id,
                )
                const totalSignatures = members.reduce(
                  (sum, m) => sum + (m.signaturesCount || 0),
                  0,
                )
                this.$set(this.collectionStats, col._id, {
                  labels: members.length,
                  signatures: totalSignatures,
                })
              } else {
                const labels = await apiGetSpeakerLabels(
                  this.organizationId,
                  col._id,
                )
                let totalSignatures = 0
                await Promise.all(
                  labels.map(async (label) => {
                    try {
                      const sigs = await apiGetVoiceSignatures(
                        this.organizationId,
                        col._id,
                        label._id,
                      )
                      totalSignatures += sigs.length
                    } catch {
                      // ignore
                    }
                  }),
                )
                this.$set(this.collectionStats, col._id, {
                  labels: labels.length,
                  signatures: totalSignatures,
                })
              }
            } catch {
              this.$set(this.collectionStats, col._id, {
                labels: 0,
                signatures: 0,
              })
            }
          }),
        )
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
        await apiCreateSpeakerLabelCollection(
          this.organizationId,
          this.newCollection,
        )
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.created_success"),
          type: "success",
          timeout: 5000,
        })
        this.newCollection = { name: "", description: "", storageMode: "audio" }
        this.showCreateModal = false
        this.fetchCollections()
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message:
            err.message || this.$t("speaker_diarization.created_error"),
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
        const res = await apiUpdateSpeakerLabelCollection(
          this.organizationId,
          this.editCollection._id,
          {
            name: this.editCollection.name,
            description: this.editCollection.description,
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
        const res = await apiDeleteSpeakerLabelCollection(
          this.organizationId,
          this.deletingCollection._id,
        )
        if (res.status === "success") {
          this.collections = this.collections.filter(
            (c) => c._id !== this.deletingCollection._id,
          )
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

  &__card {
    border: 1px solid var(--neutral-20);
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:hover {
      border-color: var(--primary-hard);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }
  }

  &__card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__card-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__card-actions {
    margin-left: auto;
    display: flex;
    gap: 0.25rem;
  }

  &__card-desc {
    font-size: 13px;
    color: var(--text-secondary);
    padding-left: 0.5rem;
    border-left: 1px solid var(--neutral-20);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__card-stats {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 13px;
    color: var(--text-secondary);

    span {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }
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
}
</style>
