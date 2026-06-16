<template>
  <div class="diarization-collection-card" @click="$emit('select')">
    <div class="diarization-collection-card__header">
      <span class="diarization-collection-card__name">
        {{ collection.name }}
      </span>
      <span class="diarization-collection-card__badge" :class="badge.cls">
        <ph-icon :name="badge.icon" size="xs" />
        {{ badge.label }}
      </span>
      <span
        v-if="collection.description"
        class="diarization-collection-card__desc">
        {{ collection.description }}
      </span>
      <div class="diarization-collection-card__actions" @click.stop>
        <template v-if="!isOrganizationType">
          <Button
            icon="pencil-simple"
            variant="tertiary"
            iconWeight="regular"
            @click="$emit('edit')" />
          <Button
            icon="trash"
            variant="secondary"
            intent="destructive"
            iconWeight="regular"
            @click="$emit('delete')" />
        </template>
      </div>
    </div>
    <div class="diarization-collection-card__stats">
      <span>
        <ph-icon name="user" size="sm" />
        {{ stats.labels || 0 }}
        {{ $t("speaker_diarization.speakers") }}
      </span>
      <span>
        <ph-icon name="waveform" size="sm" />
        {{ stats.samples || 0 }}
        {{ $t("speaker_diarization.samples") }}
      </span>
    </div>
  </div>
</template>
<script>
import Button from "@/components/atoms/Button.vue"
import { COLLECTION_TYPE, STORAGE_MODE } from "@/tools/voiceprintConstants.js"

export default {
  name: "DiarizationCollectionCard",
  components: { Button },
  props: {
    collection: {
      type: Object,
      required: true,
    },
    // { labels, samples } — defaults gracefully while stats are loading.
    stats: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isOrganizationType() {
      return this.collection.type === COLLECTION_TYPE.ORGANIZATION
    },
    isEmbeddings() {
      return this.collection.storageMode === STORAGE_MODE.EMBEDDINGS
    },
    // Type/storage-derived chip shown next to the collection name.
    badge() {
      if (this.isOrganizationType) {
        return {
          cls: "diarization-collection-card__badge--org",
          icon: "users",
          label: this.$t("speaker_diarization.badge_auto_managed"),
        }
      }
      if (this.isEmbeddings) {
        return {
          cls: "diarization-collection-card__badge--embeddings",
          icon: "fingerprint",
          label: this.$t("speaker_diarization.badge_embeddings"),
        }
      }
      return {
        cls: "diarization-collection-card__badge--audio",
        icon: "waveform",
        label: this.$t("speaker_diarization.badge_audio"),
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.diarization-collection-card {
  border: 1px solid var(--neutral-20);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;

  &:hover {
    border-color: var(--primary-hard);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__badge {
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

  &__desc {
    font-size: 13px;
    color: var(--text-secondary);
    padding-left: 0.5rem;
    border-left: 1px solid var(--neutral-20);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__actions {
    margin-left: auto;
    display: flex;
    gap: 0.25rem;
  }

  &__stats {
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
}
</style>
