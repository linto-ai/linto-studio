<template>
  <div>
    <div class="flex row gap-medium align-center">
      <button class="collection-detail__back" @click="$emit('back')">
        <ph-icon name="arrow-left" size="md" />
        {{ $t("speaker_diarization.back_to_collections") }}
      </button>
    </div>

    <div v-if="loading" class="collection-detail__loading">
      {{ $t("speaker_diarization.loading") }}
    </div>

    <template v-else-if="collection">
      <div class="flex row gap-medium align-center" style="margin-top: 1rem">
        <h2 class="flex1">{{ collection.name }}</h2>
        <Button
          v-if="!isOrganizationCollection"
          @click="showCreateLabelModal = true"
          size="sm"
          variant="primary"
          icon="plus"
          :label="$t('speaker_diarization.add_label')" />
      </div>

      <p v-if="collection.description" class="collection-detail__description">
        {{ collection.description }}
      </p>

      <div
        v-if="isOrganizationCollection"
        class="collection-detail__org-notice">
        <ph-icon name="info" size="md" />
        <p>{{ $t("speaker_diarization.org_collection_notice") }}</p>
      </div>

      <div v-if="labels.length === 0" class="collection-detail__empty">
        <ph-icon name="user-circle" size="xl" />
        <p>{{
          isOrganizationCollection
            ? $t("speaker_diarization.org_labels_empty")
            : $t("speaker_diarization.labels_empty")
        }}</p>
      </div>

      <table v-else class="collection-detail__table">
        <thead>
          <tr>
            <th style="width: 30%">
              {{ isOrganizationCollection
                ? $t("speaker_diarization.user_name")
                : $t("speaker_diarization.label_name") }}
            </th>
            <th style="width: 12%">
              {{ $t("speaker_diarization.signatures_count") }}
            </th>
            <th v-if="!isOrganizationCollection" style="width: 12%">
              {{ $t("speaker_diarization.has_voiceprint") }}
            </th>
            <th style="width: 13%">
              {{ $t("speaker_diarization.total_duration") }}
            </th>
            <th style="width: 13%">
              {{ $t("speaker_diarization.created_at") }}
            </th>
            <th style="width: 20%">
              {{ $t("speaker_diarization.actions") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="label in labels"
            :key="label._id"
            class="collection-detail__row"
            @click="onRowClick(label)">
            <td>
              <span v-if="editingId !== label._id">{{ label.name }}</span>
              <input
                v-else
                v-model="editName"
                type="text"
                class="collection-detail__edit-input"
                @keyup.enter="saveEdit(label._id)"
                @keyup.escape="cancelEdit"
                @click.stop />
            </td>
            <td>{{ sampleCounts[label._id] || 0 }}</td>
            <td v-if="!isOrganizationCollection">
              <ph-icon
                :name="label.hasVoiceprint ? 'check-circle' : 'x-circle'"
                :class="label.hasVoiceprint ? 'collection-detail__voiceprint-yes' : 'collection-detail__voiceprint-no'"
                size="sm" />
            </td>
            <td>{{
              formatAudioDuration(sampleDurations[label._id] || 0)
            }}</td>
            <td>{{ formatDate(label.created) }}</td>
            <td>
              <div
                v-if="!isOrganizationCollection"
                class="flex gap-small"
                @click.stop>
                <template v-if="editingId !== label._id">
                  <Button
                    icon="pencil-simple"
                    variant="tertiary"
                    iconWeight="regular"
                    @click="startEdit(label)" />
                  <Button
                    icon="trash"
                    variant="secondary"
                    intent="destructive"
                    iconWeight="regular"
                    @click="confirmDelete(label)" />
                </template>
                <template v-else>
                  <Button
                    icon="check"
                    variant="tertiary"
                    iconWeight="regular"
                    @click="saveEdit(label._id)" />
                  <Button
                    icon="x"
                    variant="secondary"
                    iconWeight="regular"
                    @click="cancelEdit" />
                </template>
              </div>
              <span
                v-else
                class="collection-detail__member-managed"
                @click.stop>
                {{ $t("speaker_diarization.member_managed") }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- Create label modal -->
    <Modal
      v-model="showCreateLabelModal"
      :title="$t('speaker_diarization.create_label_title')"
      :textActionApply="$t('speaker_diarization.create')"
      :disabledActionApply="!newLabelName"
      @submit="createLabel">
      <div class="collection-detail__form">
        <label>{{ $t("speaker_diarization.label_name") }}</label>
        <input
          type="text"
          v-model="newLabelName"
          :placeholder="$t('speaker_diarization.label_name_placeholder')"
          class="collection-detail__input" />
      </div>
    </Modal>

    <!-- Delete label confirmation modal -->
    <Modal
      v-model="showDeleteModal"
      :title="$t('speaker_diarization.delete_label_title')"
      @submit="deleteLabel">
      <p v-if="deletingLabel">
        {{
          $t("speaker_diarization.delete_label_confirm", {
            name: deletingLabel.name,
          })
        }}
      </p>
    </Modal>
  </div>
</template>

<script>
import Button from "@/components/atoms/Button.vue"
import Modal from "@/components/molecules/Modal.vue"
import { formatDateOrDash } from "@/tools/formatDate.js"
import {
  apiGetVoiceprintCollection,
  apiGetOptedInMembers,
} from "@/api/voiceprintCollection.js"
import {
  apiGetSpeakerLabels,
  apiCreateSpeakerLabel,
  apiUpdateSpeakerLabel,
  apiDeleteSpeakerLabel,
} from "@/api/speakerLabel.js"
import { apiGetVoiceSamples } from "@/api/voiceSample.js"
import { COLLECTION_TYPE } from "@/tools/voiceprintConstants.js"
import { formatCompactDuration } from "@/tools/formatDuration.js"

export default {
  name: "SpeakerLabelCollectionDetail",
  components: { Button, Modal },
  props: {
    organizationId: { type: String, required: true },
    collectionId: { type: String, required: true },
  },
  data() {
    return {
      collection: null,
      labels: [],
      sampleCounts: {},
      sampleDurations: {},
      loading: false,
      showCreateLabelModal: false,
      showDeleteModal: false,
      newLabelName: "",
      editingId: null,
      editName: "",
      deletingLabel: null,
    }
  },
  computed: {
    isOrganizationCollection() {
      return this.collection?.type === COLLECTION_TYPE.ORGANIZATION
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const collection = await apiGetVoiceprintCollection(
          this.organizationId,
          this.collectionId,
        )
        this.collection = collection

        if (collection && collection.type === COLLECTION_TYPE.ORGANIZATION) {
          const members = await apiGetOptedInMembers(
            this.organizationId,
            this.collectionId,
          )
          this.labels = members.map((m) => ({
            _id: m.userId,
            name: m.name,
            created: m.created,
            userId: m.userId,
          }))
          for (const m of members) {
            this.$set(this.sampleCounts, m.userId, m.samplesCount)
            this.$set(this.sampleDurations, m.userId, m.totalDuration)
          }
        } else {
          const labels = await apiGetSpeakerLabels(
            this.organizationId,
            this.collectionId,
          )
          this.labels = labels

          await Promise.all(
            this.labels.map(async (label) => {
              try {
                const samples = await apiGetVoiceSamples(
                  this.organizationId,
                  this.collectionId,
                  label._id,
                )
                this.$set(this.sampleCounts, label._id, samples.length)
                const totalDuration = samples.reduce(
                  (sum, s) => sum + (s.audioDuration || 0),
                  0,
                )
                this.$set(this.sampleDurations, label._id, totalDuration)
              } catch {
                this.$set(this.sampleCounts, label._id, 0)
                this.$set(this.sampleDurations, label._id, 0)
              }
            }),
          )
        }
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
    formatDate: formatDateOrDash,
    formatAudioDuration: formatCompactDuration,
    onRowClick(label) {
      if (this.isOrganizationCollection) {
        this.$emit("select-member", { userId: label.userId, name: label.name })
      } else {
        this.$emit("select-label", label._id)
      }
    },
    async createLabel() {
      try {
        await apiCreateSpeakerLabel(
          this.organizationId,
          this.collectionId,
          { name: this.newLabelName },
        )
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.label_created_success"),
          type: "success",
          timeout: 5000,
        })
        this.newLabelName = ""
        this.showCreateLabelModal = false
        this.fetchData()
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message:
            err.message ||
            this.$t("speaker_diarization.label_created_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    startEdit(label) {
      this.editingId = label._id
      this.editName = label.name
    },
    cancelEdit() {
      this.editingId = null
      this.editName = ""
    },
    async saveEdit(labelId) {
      if (!this.editName.trim()) return
      try {
        const res = await apiUpdateSpeakerLabel(
          this.organizationId,
          this.collectionId,
          labelId,
          { name: this.editName.trim() },
        )
        if (res.status === "success") {
          const idx = this.labels.findIndex((l) => l._id === labelId)
          if (idx !== -1) {
            this.$set(this.labels, idx, {
              ...this.labels[idx],
              name: this.editName.trim(),
            })
          }
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.label_updated_success"),
            type: "success",
            timeout: 5000,
          })
          this.cancelEdit()
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.label_updated_error"),
          type: "error",
          timeout: 5000,
        })
      }
    },
    confirmDelete(label) {
      this.deletingLabel = label
      this.showDeleteModal = true
    },
    async deleteLabel() {
      if (!this.deletingLabel) return
      try {
        const res = await apiDeleteSpeakerLabel(
          this.organizationId,
          this.collectionId,
          this.deletingLabel._id,
        )
        if (res.status === "success") {
          this.labels = this.labels.filter(
            (l) => l._id !== this.deletingLabel._id,
          )
          this.$store.dispatch("system/addNotification", {
            message: this.$t("speaker_diarization.label_deleted_success"),
            type: "success",
            timeout: 5000,
          })
        }
      } catch (err) {
        this.$store.dispatch("system/addNotification", {
          message: this.$t("speaker_diarization.label_deleted_error"),
          type: "error",
          timeout: 5000,
        })
      }
      this.deletingLabel = null
      this.showDeleteModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
.collection-detail {
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: none;
    border: none;
    color: var(--primary-hard);
    cursor: pointer;
    font-size: 14px;
    padding: 0;

    &:hover {
      text-decoration: underline;
    }
  }

  &__loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }

  &__description {
    color: var(--text-secondary);
    font-size: 14px;
    margin: 0.25rem 0 0.5rem;
  }

  &__org-notice {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    background: var(--primary-soft, #e3f2fd);
    border: 1px solid var(--primary-hard, #1976d2);
    border-radius: 6px;
    font-size: 13px;
    color: var(--text-primary);

    p {
      margin: 0;
    }
  }

  &__member-managed {
    font-size: 12px;
    color: var(--text-secondary);
    font-style: italic;
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

  &__table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    table-layout: fixed;

    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--neutral-20);
      height: 2.75rem;
      vertical-align: middle;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    th {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      height: auto;
      padding: 0.4rem 0.75rem;
    }

    td {
      font-size: 14px;
    }

    tbody tr:hover {
      background: var(--neutral-10);
    }
  }

  &__row {
    cursor: pointer;
  }

  &__voiceprint-yes {
    color: var(--green-chart, #4caf50);
  }

  &__voiceprint-no {
    color: var(--neutral-40, #999);
  }

  &__edit-input {
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--primary-hard);
    border-radius: 4px;
    font-size: 14px;
    background: var(--background-primary);
    color: var(--text-primary);
    width: 100%;
    box-sizing: border-box;

    &:focus {
      outline: none;
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
