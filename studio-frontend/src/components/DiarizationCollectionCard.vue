<template>
  <div
    class="diarization-collection-card"
    :class="{
      'diarization-collection-card--selectable': selectable,
      'diarization-collection-card--selected': selectable && selected,
      'diarization-collection-card--compact': compact,
    }"
    @click="onCardClick">
    <div class="diarization-collection-card__header">
      <input
        v-if="selectable"
        type="checkbox"
        class="diarization-collection-card__checkbox"
        :checked="selected"
        tabindex="-1" />
      <span class="diarization-collection-card__name">
        {{ displayName }}
      </span>
      <span class="diarization-collection-card__badge" :class="badge.cls">
        <ph-icon :name="badge.icon" size="xs" />
        {{ badge.label }}
      </span>
      <span
        v-if="collection.description && !isOrganizationType"
        class="diarization-collection-card__desc">
        {{ collection.description }}
      </span>
      <div
        v-if="!selectable && !isOrganizationType"
        class="diarization-collection-card__actions"
        @click.stop>
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
      </div>
    </div>
    <div
      v-if="loadingStats"
      class="diarization-collection-card__stats diarization-collection-card__stats--loading">
      <span class="diarization-collection-card__stat-placeholder" />
      <span
        v-if="showSamples"
        class="diarization-collection-card__stat-placeholder" />
    </div>
    <div v-else class="diarization-collection-card__stats">
      <div class="diarization-collection-card__speakers">
        <template v-if="stats.labels > 0">
          <span
            v-for="(name, i) in previewNames"
            :key="i"
            class="diarization-collection-card__chip">
            {{ name }}
          </span>
          <span
            v-if="overflowCount > 0"
            class="diarization-collection-card__chip diarization-collection-card__chip--more">
            +{{ overflowCount }}
          </span>
        </template>
        <span v-else class="diarization-collection-card__muted">
          {{ $t("speaker_diarization.no_speaker") }}
        </span>
      </div>
      <span v-if="showSamples" class="diarization-collection-card__samples">
        <ph-icon name="waveform" size="sm" />
        {{ stats.samples }}
        {{ $t("speaker_diarization.samples") }}
      </span>
    </div>
  </div>
</template>
<script>
import Button from "@/components/atoms/Button.vue"
import { COLLECTION_TYPE, STORAGE_MODE } from "@/tools/voiceprintConstants.js"
import resolveDiarizationCollectionName from "@/tools/resolveDiarizationCollectionName.js"
import { apiGetOptedInMembers } from "@/api/voiceprintCollection.js"
import { apiGetSpeakerLabels } from "@/api/speakerLabel.js"

export default {
  name: "DiarizationCollectionCard",
  components: { Button },
  props: {
    collection: {
      type: Object,
      required: true,
    },
    organizationId: {
      type: String,
      required: true,
    },
    // Picker mode: render a checkbox + selected highlight and emit `toggle`
    // instead of the management `select`/`edit`/`delete` interactions.
    selectable: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    // Tighter spacing, for dense lists (e.g. the per-service picker).
    compact: {
      type: Boolean,
      default: false,
    },
    // The sample count is irrelevant in some contexts (e.g. the per-service
    // picker, where only speakers matter for selection).
    showSamples: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // { labels, samples }, or null while the count request is in flight.
      stats: null,
      loadingStats: true,
    }
  },
  mounted() {
    this.fetchStats()
  },
  computed: {
    isOrganizationType() {
      return this.collection.type === COLLECTION_TYPE.ORGANIZATION
    },
    isEmbeddings() {
      return this.collection.storageMode === STORAGE_MODE.EMBEDDINGS
    },
    // First few speaker names shown as chips, plus the remaining count.
    previewNames() {
      return (this.stats?.names || []).slice(0, 3)
    },
    overflowCount() {
      if (!this.stats) return 0
      return Math.max(0, this.stats.labels - this.previewNames.length)
    },
    displayName() {
      return resolveDiarizationCollectionName(this.collection, (key) =>
        this.$t(key),
      )
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
  methods: {
    onCardClick() {
      this.$emit(this.selectable ? "toggle" : "select")
    },
    // Speakers + samples counts, derived from whichever resource backs this
    // collection type. Organization collections are auto-populated from
    // opted-in members; custom ones from manually managed speaker labels.
    async fetchStats() {
      this.loadingStats = true
      try {
        const entries = this.isOrganizationType
          ? await apiGetOptedInMembers(this.organizationId, this.collection._id)
          : await apiGetSpeakerLabels(this.organizationId, this.collection._id)
        this.stats = {
          labels: entries.length,
          samples: entries.reduce((sum, e) => sum + (e.samplesCount || 0), 0),
          names: entries.map((e) => e.name).filter(Boolean),
        }
      } catch {
        this.stats = { labels: 0, samples: 0, names: [] }
      } finally {
        this.loadingStats = false
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

  // Picker mode: highlight the active selection.
  &--selectable:hover {
    border-color: var(--primary-color);
  }

  &--selected {
    border-color: var(--primary-color);
    background: var(--primary-soft);
  }

  // Dense variant for tight lists (per-service picker).
  &--compact {
    padding: 0.5rem;

    .diarization-collection-card__stats {
      margin-top: 0.25rem;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__checkbox {
    flex: 0 0 auto;
    // Visual indicator only — the whole card is the click target.
    pointer-events: none;
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
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.5rem;
    font-size: 13px;
    color: var(--text-secondary);
  }

  &__speakers {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.25rem;
  }

  &__chip {
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    color: var(--text-primary);
    background: var(--neutral-10);
    white-space: nowrap;

    &--more {
      color: var(--text-secondary);
    }
  }

  &__samples {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__muted {
    font-style: italic;
    color: var(--text-secondary);
  }

  &__stat-placeholder {
    width: 4.5rem;
    height: 0.9rem;
    border-radius: 4px;
    background: var(--neutral-10, #f5f5f5);
  }
}
</style>
