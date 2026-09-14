<template>
  <li class="m-voices">
    <div class="m-voices__line">
      <label class="m-voices__check">
        <input type="checkbox" :checked="selected" @change="$emit('toggle')" />
        <span class="m-voices__text">
          <span class="m-voices__name">{{ label }}</span>
          <span v-if="isOrganization" class="m-muted">{{
            collection.name
          }}</span>
        </span>
      </label>
      <button
        type="button"
        class="m-voices__expand"
        :aria-expanded="expanded ? 'true' : 'false'"
        :aria-label="$t('mobile.settings.voices_list')"
        @click="toggleExpanded">
        <PhIcon :name="expanded ? 'caret-up' : 'caret-down'" size="sm" />
      </button>
    </div>
    <div v-if="expanded" class="m-voices__details">
      <p v-if="!loaded" class="m-muted">{{ $t("mobile.common.loading") }}</p>
      <p v-else-if="voices.length === 0" class="m-muted">
        {{ $t("mobile.settings.voices_none") }}
      </p>
      <ul v-else class="m-voices__names">
        <li v-for="voice in voices" :key="voice">{{ voice }}</li>
      </ul>
    </div>
  </li>
</template>

<script>
import PhIcon from "@/components/atoms/PhIcon.vue"
import { COLLECTION_TYPE } from "@/tools/voiceprintConstants.js"

// One voice collection: a checkbox to use it, and a caret that unfolds the
// enrolled voices (fetched by the parent through `load-voices`).
export default {
  name: "VoiceCollectionRow",
  components: { PhIcon },
  props: {
    collection: { type: Object, required: true },
    selected: { type: Boolean, default: false },
    voices: { type: Array, default: () => [] },
    loaded: { type: Boolean, default: false },
  },
  data() {
    return { expanded: false }
  },
  computed: {
    isOrganization() {
      return this.collection.type === COLLECTION_TYPE.ORGANIZATION
    },
    label() {
      return this.isOrganization
        ? this.$t("mobile.settings.voices_organization")
        : this.collection.name
    },
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded
      if (this.expanded && !this.loaded) this.$emit("load-voices")
    },
  },
}
</script>

<style scoped>
.m-voices {
  border-bottom: 1px solid var(--m-divider);
}

.m-voices:last-child {
  border-bottom: none;
}

.m-voices__line {
  display: flex;
  align-items: center;
  gap: var(--m-space-2);
  padding-right: var(--m-space-1);
}

.m-voices__check {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: var(--m-space-3);
  min-height: 52px;
  padding: var(--m-space-2) var(--m-space-4);
}

.m-voices__check input {
  width: 24px;
  height: 24px;
  margin: 0;
  accent-color: var(--m-primary);
  flex-shrink: 0;
}

.m-voices__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.m-voices__name {
  font-weight: 500;
}

.m-voices__expand {
  width: var(--m-tap);
  height: var(--m-tap);
  border: none;
  background: transparent;
  color: var(--m-text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.m-voices__details {
  padding: 0 var(--m-space-4) var(--m-space-3) 52px;
}

.m-voices__names {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-space-1) var(--m-space-3);
  font-size: var(--m-font-size-sm);
}
</style>
