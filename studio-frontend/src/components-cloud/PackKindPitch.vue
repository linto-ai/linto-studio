<template>
  <div v-if="pitch" class="pack-kind-pitch">
    <ul class="pack-kind-pitch__features">
      <li
        v-for="feature in pitch.features"
        :key="feature.key"
        class="pack-kind-pitch__feature">
        <Avatar
          :icon="feature.icon"
          tag="span"
          size="lg"
          circle
          padded
          tone="soft" />
        <span class="pack-kind-pitch__feature-text">
          <strong>{{ $t(`${feature.key}.title`) }}</strong>
          <span>{{ $t(`${feature.key}.text`) }}</span>
        </span>
      </li>
    </ul>
    <p v-if="pitch.noteKey" class="pack-kind-pitch__note">
      <PhIcon name="info" />
      <span>{{ $t(pitch.noteKey) }}</span>
    </p>
  </div>
</template>

<script>
import { PACK_KIND_PITCHES } from "@/const/packKindPitches"

// What a kind of pack is for, before its prices: three features, and how it
// is counted when that needs saying. Colored by the --pack-accent palette of
// the parent; renders nothing for a kind without a pitch.
export default {
  name: "PackKindPitch",
  props: {
    // live, transcription…
    kind: { type: String, required: true },
  },
  computed: {
    pitch() {
      return PACK_KIND_PITCHES[this.kind] || null
    },
  },
}
</script>

<style lang="scss" scoped>
.pack-kind-pitch {
  display: flex;
  flex-direction: column;
  gap: var(--small-gap);

  &__features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: var(--medium-gap);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__feature {
    // The icon takes the kind color, on its pale wash
    --avatar-background: var(--pack-accent-soft);
    --avatar-color: var(--pack-accent);
    display: flex;
    align-items: center;
    gap: var(--small-gap);
    font-size: var(--text-xs);
  }

  &__feature-text {
    display: flex;
    flex-direction: column;
    color: var(--text-secondary);

    strong {
      font-size: var(--text-sm);
      color: var(--text-primary);
    }
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: var(--small-gap);
    margin: 0;
    font-size: var(--text-xs);
    color: var(--text-secondary);

    .icon-svg {
      flex-shrink: 0;
    }
  }
}
</style>
