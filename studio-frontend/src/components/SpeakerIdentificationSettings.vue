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
            <template v-for="badge in [collectionBadge(collection)]">
              <span
                :key="'badge-' + collection._id"
                class="speaker-diarization__card-badge"
                :class="badge.cls">
                <ph-icon :name="badge.icon" size="xs" />
                {{ badge.label }}
              </span>
            </template>
            <span
              v-if="collection.description"
              class="speaker-diarization__card-desc">
              {{ collection.description }}
            </span>
            <div class="speaker-diarization__card-actions" @click.stop>
              <template v-if="!isOrganizationType(collection)">
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
              {{ collectionStats[collection._id]?.samples || 0 }}
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

          <div class="speaker-diarization__storage-toggle">
            <div>
              <span class="speaker-diarization__storage-label">
                {{ $t("speaker_diarization.voiceprint_storage_mode_embeddings") }}
              </span>
              <span class="speaker-diarization__storage-desc">
                {{ $t("speaker_diarization.voiceprint_storage_mode_embeddings_desc") }}
              </span>
            </div>
            <SwitchInput
              :value="isEmbeddingsMode"
              id="create-storage-mode-toggle"
              @input="onCreateStorageModeToggle" />
          </div>
          <p
            v-if="isEmbeddingsMode"
            class="speaker-diarization__storage-warning">
            <ph-icon name="warning" size="sm" />
            {{ $t("speaker_diarization.voiceprint_storage_mode_warning") }}
          </p>
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
import SwitchInput from "@/components/atoms/SwitchInput.vue"
import Modal from "@/components/molecules/Modal.vue"
import SpeakerLabelCollectionDetail from "@/components/SpeakerLabelCollectionDetail.vue"
import SpeakerLabelDetail from "@/components/SpeakerLabelDetail.vue"
import { COLLECTION_TYPE, STORAGE_MODE } from "@/tools/voiceprintConstants.js"
import {
  apiGetVoiceprintCollections,
  apiCreateVoiceprintCollection,
  apiUpdateVoiceprintCollection,
  apiDeleteVoiceprintCollection,
  apiGetOptedInMembers,
} from "@/api/voiceprintCollection.js"
import { apiGetSpeakerLabels } from "@/api/speakerLabel.js"
import { apiGetVoiceSamples } from "@/api/voiceSample.js"

export default {
  name: "SpeakerIdentificationSettings",
  components: {
    Button,
    SwitchInput,
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
      newCollection: { name: "", description: "", storageMode: STORAGE_MODE.AUDIO },
      editCollection: { _id: null, name: "", description: "" },
      deletingCollection: null,
    }
  },
  computed: {
    isEmbeddingsMode() {
      return this.isEmbeddingsCollection(this.newCollection)
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
    onCreateStorageModeToggle(enabled) {
      this.newCollection.storageMode = enabled
        ? STORAGE_MODE.EMBEDDINGS
        : STORAGE_MODE.AUDIO
    },
    isEmbeddingsCollection(collection) {
      return collection.storageMode === STORAGE_MODE.EMBEDDINGS
    },
    collectionBadge(collection) {
      if (this.isOrganizationType(collection)) {
        return { cls: "speaker-diarization__card-badge--org", icon: "users", label: this.$t("speaker_diarization.badge_auto_managed") }
      }
      if (this.isEmbeddingsCollection(collection)) {
        return { cls: "speaker-diarization__card-badge--embeddings", icon: "fingerprint", label: this.$t("speaker_diarization.badge_embeddings") }
      }
      return { cls: "speaker-diarization__card-badge--audio", icon: "waveform", label: this.$t("speaker_diarization.badge_audio") }
    },
    isOrganizationType(collection) {
      return collection.type === COLLECTION_TYPE.ORGANIZATION
    },
    async fetchCollections() {
      this.loading = true
      try {
        this.collections = await apiGetVoiceprintCollections(
          this.organizationId,
        )
        // Fetch stats (speakers + samples) for all collections in parallel
        await Promise.all(
          this.collections.map(async (col) => {
            try {
              if (col.type === COLLECTION_TYPE.ORGANIZATION) {
                const members = await apiGetOptedInMembers(
                  this.organizationId,
                  col._id,
                )
                const totalSamples = members.reduce(
                  (sum, m) => sum + (m.samplesCount || 0),
                  0,
                )
                this.$set(this.collectionStats, col._id, {
                  labels: members.length,
                  samples: totalSamples,
                })
              } else {
                const labels = await apiGetSpeakerLabels(
                  this.organizationId,
                  col._id,
                )
                let totalSamples = 0
                await Promise.all(
                  labels.map(async (label) => {
                    try {
                      const sigs = await apiGetVoiceSamples(
                        this.organizationId,
                        col._id,
                        label._id,
                      )
                      totalSamples += sigs.length
                    } catch {
                      // ignore
                    }
                  }),
                )
                this.$set(this.collectionStats, col._id, {
                  labels: labels.length,
                  samples: totalSamples,
                })
              }
            } catch {
              this.$set(this.collectionStats, col._id, {
                labels: 0,
                samples: 0,
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
        await apiCreateVoiceprintCollection(
          this.organizationId,
          this.newCollection,
        )
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.created_success"),
          type: "success",
          timeout: 5000,
        })
        this.newCollection = { name: "", description: "", storageMode: STORAGE_MODE.AUDIO }
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
        const res = await apiUpdateVoiceprintCollection(
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
        const res = await apiDeleteVoiceprintCollection(
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

  &__card-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.15rem 0.5rem;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;

    &--audio {
      background: var(--blue-soft, #e3f2fd);
      color: var(--blue-chart, #1976d2);
    }

    &--embeddings {
      background: var(--green-soft, #e8f5e9);
      color: var(--green-chart, #4caf50);
    }

    &--org {
      background: var(--neutral-10, #f5f5f5);
      color: var(--text-secondary, #666);
    }
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
